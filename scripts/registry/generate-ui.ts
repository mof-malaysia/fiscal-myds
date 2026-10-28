import path from "path";
import {
  getComponentFiles,
  readFileContent,
  extractImports,
  transformImports,
  getComponentName,
  writeJsonFile,
  mapToRegistryDependency,
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
const REGISTRY_OUTPUT = path.join(__dirname, "../../registry/ui/styles/default");

const EXCLUDED_COMPONENTS = new Set(["index"]);

const KNOWN_NPM_DEPENDENCIES: Record<string, string[]> = {
  button: ["class-variance-authority", "@radix-ui/react-slot"],
  accordion: ["@radix-ui/react-accordion"],
  "alert-dialog": ["@radix-ui/react-alert-dialog"],
  checkbox: ["@radix-ui/react-checkbox"],
  dialog: ["@radix-ui/react-dialog"],
  dropdown: ["@radix-ui/react-dropdown-menu"],
  popover: ["@radix-ui/react-popover"],
  radio: ["@radix-ui/react-radio-group"],
  select: ["@radix-ui/react-select"],
  sheet: ["@radix-ui/react-dialog"],
  tabs: ["@radix-ui/react-tabs"],
  toast: ["@radix-ui/react-toast"],
  toggle: ["@radix-ui/react-toggle"],
  tooltip: ["@radix-ui/react-tooltip"],
  "date-picker": ["react-day-picker"],
  "daterange-picker": ["react-day-picker"],
  calendar: ["react-day-picker"],
  "data-table": ["@tanstack/react-table"],
};

function transformImportsForMultiRegistry(content: string): string {
  let transformed = transformImports(content);

  // Transform icon imports to use icons registry
  // from "@/components/ui/icons/chevron-down"
  // to "icons:chevron-down" (cross-registry reference)
  // But for now, keep as-is since icons will be in same structure

  return transformed;
}

function generateComponentRegistry(
  filePath: string,
  componentName: string
): RegistryComponent | null {
  if (EXCLUDED_COMPONENTS.has(componentName)) {
    return null;
  }

  console.log(`Processing: ${componentName}`);

  const content = readFileContent(filePath);
  const transformedContent = transformImportsForMultiRegistry(content);
  const { npmDependencies, localDependencies } = extractImports(content);

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

  // Map local dependencies, filtering out icon references for now
  const registryDeps = Array.from(localDependencies)
    .map(mapToRegistryDependency)
    .filter((dep) => dep !== componentName)
    .filter((dep) => !dep.includes("icon") && !dep.includes("chevron") && !dep.includes("check") && !dep.includes("cross"));

  const componentType = componentName === "utils" || componentName === "hooks"
    ? "components:lib"
    : ["navbar", "footer", "masthead", "announce-bar"].includes(componentName)
    ? "components:layout"
    : "components:ui";

  const registryPath = componentType === "components:lib"
    ? `lib/${componentName}.ts`
    : `components/ui/${componentName}.tsx`;

  const registryComponent: RegistryComponent = {
    name: componentName,
    type: componentType,
    dependencies: finalNpmDeps.sort(),
    registryDependencies: registryDeps.sort(),
    files: [
      {
        path: registryPath,
        content: transformedContent,
        type: componentType,
      },
    ],
  };

  if (
    content.includes("bg-") ||
    content.includes("txt-") ||
    content.includes("otl-")
  ) {
    registryComponent.tailwind = {
      config: {
        theme: {
          extend: {
            colors: {},
          },
        },
      },
    };
  }

  return registryComponent;
}

function generateUtilsRegistry(): RegistryComponent {
  const utilsPath = path.join(UTILS_DIR, "index.ts");
  const content = readFileContent(utilsPath);
  const transformedContent = content;

  return {
    name: "utils",
    type: "components:lib",
    dependencies: ["clsx", "tailwind-merge"],
    registryDependencies: [],
    files: [
      {
        path: "lib/utils.ts",
        content: transformedContent,
        type: "components:lib",
      },
    ],
  };
}

function generateHooksRegistry(): RegistryComponent {
  const hooksPath = path.join(HOOKS_DIR, "index.ts");
  const content = readFileContent(hooksPath);
  const transformedContent = content;

  return {
    name: "hooks",
    type: "components:lib",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "lib/hooks.ts",
        content: transformedContent,
        type: "components:lib",
      },
    ],
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
  console.log(`   - UI Components: ${components.filter((c) => c.type === "components:ui").length}`);
  console.log(`   - Layout Components: ${components.filter((c) => c.type === "components:layout").length}`);
  console.log(`   - Utilities: ${components.filter((c) => c.type === "components:lib").length}`);

  return components;
}

main().catch((error) => {
  console.error("❌ Error generating UI registry:", error);
  process.exit(1);
});
