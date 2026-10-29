import fs from "fs";
import path from "path";
import {
  describeItem,
  iconItemName,
  readFileContent,
  writeRegistry,
  REGISTRY_DIR,
  type RegistryComponent,
} from "./utils";

/**
 * Generate Icons Registry (@ftds-icon)
 * Creates individual registry entries for each icon
 */

const ICONS_DIR = path.join(__dirname, "../../packages/react/src/icons");
const REGISTRY_OUTPUT = path.join(REGISTRY_DIR, "icons");

async function main() {
  console.log("🎨 Generating Icons Registry (@ftds-icon)...\n");

  const components: RegistryComponent[] = [];

  // Read all icon files from src/icons/
  const iconFiles = fs
    .readdirSync(ICONS_DIR)
    .filter(
      (file) =>
        file.endsWith(".tsx") && file !== "index.ts" && file !== "index.tsx",
    );

  console.log(`Found ${iconFiles.length} icon files\n`);

  // Generate registry entry for each icon
  for (const file of iconFiles) {
    const iconName = file.replace(".tsx", "");
    const iconPath = path.join(ICONS_DIR, file);
    const content = readFileContent(iconPath);

    // Transform imports if needed
    const transformedContent = content;

    const exportName = content.match(/export const (\w+)/)?.[1] ?? iconName;
    const registryComponent: RegistryComponent = describeItem(
      {
      name: iconItemName(iconName),
      type: "registry:ui",
      dependencies: [],
      registryDependencies: [],
      files: [
        {
          path: `components/ui/icons/${iconName}.tsx`,
          content: transformedContent,
          type: "registry:ui",
        },
      ],
      },
      {
        title: `${iconName.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())} icon`,
        description: `The ${exportName} icon component, installed to components/ui/icons/${iconName}.tsx.`,
        categories: ["icons"],
      },
    );

    components.push(registryComponent);
    console.log(`✓ Generated: ${registryComponent.name}`);
  }

  writeRegistry("icons", components);

  console.log(`\n✅ Generated ${components.length} icon components`);
  console.log(`📁 Output: ${REGISTRY_OUTPUT}`);

  return components;
}

main().catch((error) => {
  console.error("❌ Error generating icons registry:", error);
  process.exit(1);
});
