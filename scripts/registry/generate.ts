import path from "path";
import {
  getComponentFiles,
  readFileContent,
  extractImports,
  transformImports,
  getComponentName,
  writeJsonFile,
  getComponentType,
  getRegistryPath,
  mapToRegistryDependency,
  type RegistryComponent,
} from "./utils";

/**
 * Main registry generator
 * Processes all components and generates registry JSON files
 */

const COMPONENTS_DIR = path.join(
  __dirname,
  "../../packages/react/src/components"
);
const UTILS_DIR = path.join(__dirname, "../../packages/react/src/utils");
const HOOKS_DIR = path.join(__dirname, "../../packages/react/src/hooks");
const ICONS_DIR = path.join(__dirname, "../../packages/react/src/icons");
const REGISTRY_OUTPUT = path.join(__dirname, "../../registry/styles/default");

// Components to exclude from registry
const EXCLUDED_COMPONENTS = new Set([
  "index",
  // Add any other files you want to exclude
]);

// Known npm dependencies that should always be included
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

function generateComponentRegistry(
  filePath: string,
  componentName: string
): RegistryComponent | null {
  if (EXCLUDED_COMPONENTS.has(componentName)) {
    return null;
  }

  console.log(`Processing: ${componentName}`);

  const content = readFileContent(filePath);
  const transformedContent = transformImports(content);
  const { npmDependencies, localDependencies } = extractImports(content);

  // Filter and enhance npm dependencies
  const finalNpmDeps = Array.from(npmDependencies).filter(
    (dep) =>
      !dep.includes("@mof-malaysia") && // Exclude our own packages from dependencies
      dep !== "class-variance-authority" || // CVA is included separately if needed
      KNOWN_NPM_DEPENDENCIES[componentName]?.includes(dep)
  );

  // Add known dependencies for this component
  if (KNOWN_NPM_DEPENDENCIES[componentName]) {
    KNOWN_NPM_DEPENDENCIES[componentName].forEach((dep) => {
      if (!finalNpmDeps.includes(dep)) {
        finalNpmDeps.push(dep);
      }
    });
  }

  // Add CVA if the component uses cva or VariantProps
  if (
    content.includes("cva(") ||
    content.includes("VariantProps") ||
    content.includes("from \"class-variance-authority\"")
  ) {
    if (!finalNpmDeps.includes("class-variance-authority")) {
      finalNpmDeps.push("class-variance-authority");
    }
  }

  // Map local dependencies to registry dependencies
  const registryDeps = Array.from(localDependencies)
    .map(mapToRegistryDependency)
    .filter((dep) => dep !== componentName); // Don't depend on self

  const componentType = getComponentType(componentName);
  const registryPath = getRegistryPath(componentName, componentType);

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

  // Add Tailwind config if component uses custom colors or styles
  if (
    content.includes("bg-") ||
    content.includes("txt-") ||
    content.includes("otl-")
  ) {
    registryComponent.tailwind = {
      config: {
        theme: {
          extend: {
            colors: {
              // Reference to style package CSS variables
            },
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
  const transformedContent = content; // Utils don't need path transformation

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
  console.log("🚀 Starting registry generation...\n");

  const components: RegistryComponent[] = [];

  // Generate utils registry
  console.log("Generating utils...");
  const utilsRegistry = generateUtilsRegistry();
  components.push(utilsRegistry);
  writeJsonFile(
    path.join(REGISTRY_OUTPUT, "utils.json"),
    utilsRegistry
  );

  // Generate hooks registry
  console.log("Generating hooks...");
  const hooksRegistry = generateHooksRegistry();
  components.push(hooksRegistry);
  writeJsonFile(
    path.join(REGISTRY_OUTPUT, "hooks.json"),
    hooksRegistry
  );

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

  console.log(`\n✅ Generated ${components.length} component registry files`);
  console.log(`📁 Output: ${REGISTRY_OUTPUT}`);

  // Generate summary
  console.log("\n📊 Summary:");
  console.log(`   - UI Components: ${components.filter((c) => c.type === "components:ui").length}`);
  console.log(`   - Layout Components: ${components.filter((c) => c.type === "components:layout").length}`);
  console.log(`   - Utilities: ${components.filter((c) => c.type === "components:lib").length}`);

  return components;
}

main().catch((error) => {
  console.error("❌ Error generating registry:", error);
  process.exit(1);
});
