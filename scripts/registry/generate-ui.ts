import fs from "fs";
import path from "path";
import {
  getComponentFiles,
  readFileContent,
  extractImports,
  transformImports,
  getComponentName,
  writeJsonFile,
  mapToRegistryDependency,
  expandIconBarrelImports,
  getIconExportMap,
  registryItemUrl,
  REGISTRY_ITEM_SCHEMA,
  type RegistryComponent,
} from "./utils";

/**
 * Generate UI Registry (@myds-ui)
 * Includes: components, hooks, utilities
 */

const COMPONENTS_DIR = path.join(
  __dirname,
  "../../packages/react/src/components"
);
const UTILS_DIR = path.join(__dirname, "../../packages/react/src/utils");
const HOOKS_DIR = path.join(__dirname, "../../packages/react/src/hooks");
const ICONS_DIR = path.join(__dirname, "../../packages/react/src/icons");
const REGISTRY_OUTPUT = path.join(__dirname, "../../registry/ui/styles/default");

const EXCLUDED_COMPONENTS = new Set(["index"]);

const KNOWN_NPM_DEPENDENCIES: Record<string, string[]> = {
  button: ["class-variance-authority"],
  "date-picker": ["react-day-picker"],
  "daterange-picker": ["react-day-picker"],
  calendar: ["react-day-picker"],
  "data-table": ["@tanstack/react-table"],
};

const iconMap = getIconExportMap(ICONS_DIR);

const PACKAGE_DEPENDENCIES: Record<string, string> = JSON.parse(
  readFileContent(path.join(__dirname, "../../packages/react/package.json"))
).dependencies;

/**
 * Pin npm dependencies to the ranges MYDS is built against, so a project
 * doesn't pull in a new major (e.g. @tanstack/react-table v9).
 */
function withVersions(deps: string[]): string[] {
  return deps.map((dep) =>
    PACKAGE_DEPENDENCIES[dep] ? `${dep}@${PACKAGE_DEPENDENCIES[dep]}` : dep
  );
}

/** Relative import paths in a source file, e.g. "../utils", "./button" */
function getLocalImports(content: string): string[] {
  return Array.from(
    content.matchAll(/from\s+["'](\.{1,2}\/[^"']+)["']/g),
    (m) => m[1]
  );
}

function generateComponentRegistry(
  filePath: string,
  componentName: string
): RegistryComponent | null {
  if (EXCLUDED_COMPONENTS.has(componentName)) {
    return null;
  }

  console.log(`Processing: ${componentName}`);

  const content = expandIconBarrelImports(readFileContent(filePath), iconMap);
  const transformedContent = transformImports(content);
  const { npmDependencies } = extractImports(content);

  const finalNpmDeps = Array.from(npmDependencies).filter(
    (dep) =>
      !dep.includes("@mof-malaysia") &&
      (dep !== "class-variance-authority" ||
        KNOWN_NPM_DEPENDENCIES[componentName]?.includes(dep))
  );

  if (KNOWN_NPM_DEPENDENCIES[componentName]) {
    KNOWN_NPM_DEPENDENCIES[componentName].forEach((dep) => {
      if (!finalNpmDeps.includes(dep)) {
        finalNpmDeps.push(dep);
      }
    });
  }

  if (
    content.includes("cva(") ||
    content.includes("VariantProps") ||
    content.includes('from "class-variance-authority"')
  ) {
    if (!finalNpmDeps.includes("class-variance-authority")) {
      finalNpmDeps.push("class-variance-authority");
    }
  }

  const registryDeps = Array.from(
    new Set(
      getLocalImports(content)
        .map(mapToRegistryDependency)
        .filter((dep): dep is string => dep !== null)
        .filter((dep) => dep !== registryItemUrl("ui", componentName))
    )
  );

  const registryComponent: RegistryComponent = {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: componentName,
    type: "registry:ui",
    dependencies: withVersions(finalNpmDeps.sort()),
    registryDependencies: registryDeps.sort(),
    files: [
      {
        path: `components/ui/${componentName}.tsx`,
        content: transformedContent,
        type: "registry:ui",
      },
    ],
  };

  return registryComponent;
}

function generateUtilsRegistry(): RegistryComponent {
  const content = readFileContent(path.join(UTILS_DIR, "index.ts"));

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: "utils",
    type: "registry:lib",
    dependencies: withVersions(["tailwind-merge"]),
    registryDependencies: [],
    files: [
      {
        path: "lib/myds/utils/index.ts",
        content,
        type: "registry:lib",
      },
    ],
  };
}

/**
 * All hooks ship as one item (they are imported via the "../hooks" barrel).
 * It also carries utils/events.ts, the toast event bus used by useToast.
 */
function generateHooksRegistry(): RegistryComponent {
  const hookFiles = fs
    .readdirSync(HOOKS_DIR)
    .filter((file) => /\.tsx?$/.test(file))
    .sort();

  const files = hookFiles.map((file) => ({
    path: `lib/myds/hooks/${file}`,
    content: transformImports(readFileContent(path.join(HOOKS_DIR, file)), {
      keepSameFolderImports: true,
    }),
    type: "registry:lib",
  }));

  files.push({
    path: "lib/myds/utils/events.ts",
    content: transformImports(
      readFileContent(path.join(UTILS_DIR, "events.ts"))
    ),
    type: "registry:lib",
  });

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: "hooks",
    type: "registry:lib",
    dependencies: withVersions(["mitt"]),
    // use-toast imports the ToastEvent type from the toast component
    registryDependencies: [registryItemUrl("ui", "toast")],
    files,
  };
}

async function main() {
  console.log("🚀 Generating UI Registry (@myds-ui)...\n");

  const components: RegistryComponent[] = [];

  // Generate utils
  console.log("Generating utils...");
  const utilsRegistry = generateUtilsRegistry();
  components.push(utilsRegistry);
  writeJsonFile(path.join(REGISTRY_OUTPUT, "utils.json"), utilsRegistry);

  // Generate hooks
  console.log("Generating hooks...");
  const hooksRegistry = generateHooksRegistry();
  components.push(hooksRegistry);
  writeJsonFile(path.join(REGISTRY_OUTPUT, "hooks.json"), hooksRegistry);

  // Get all component files
  const componentFiles = getComponentFiles(COMPONENTS_DIR);

  // Process each component
  for (const filePath of componentFiles) {
    const componentName = getComponentName(filePath);
    const registry = generateComponentRegistry(filePath, componentName);

    if (registry) {
      components.push(registry);
      const outputPath = path.join(REGISTRY_OUTPUT, `${componentName}.json`);
      writeJsonFile(outputPath, registry);
    }
  }

  console.log(`\n✅ Generated ${components.length} UI components`);
  console.log(`📁 Output: ${REGISTRY_OUTPUT}`);

  console.log("\n📊 Summary:");
  console.log(`   - UI Components: ${components.filter((c) => c.type === "registry:ui").length}`);
  console.log(`   - Utilities: ${components.filter((c) => c.type === "registry:lib").length}`);

  return components;
}

main().catch((error) => {
  console.error("❌ Error generating UI registry:", error);
  process.exit(1);
});
