import fs from "fs";
import path from "path";
import { writeJsonFile, type RegistryComponent } from "./utils";

/**
 * Build script that generates the master index.json
 * and orchestrates the registry build process
 */

const REGISTRY_DIR = path.join(__dirname, "../../registry");
const STYLES_DIR = path.join(REGISTRY_DIR, "styles/default");

interface RegistryIndex {
  name: string;
  version: string;
  components: Array<{
    name: string;
    type: string;
    dependencies: string[];
    registryDependencies: string[];
    files: string[];
  }>;
}

async function buildIndex(): Promise<void> {
  console.log("📝 Building registry index...\n");

  // Read all JSON files from styles/default directory
  const files = fs
    .readdirSync(STYLES_DIR)
    .filter((file) => file.endsWith(".json"));

  const components: RegistryIndex["components"] = [];

  for (const file of files) {
    const filePath = path.join(STYLES_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const component: RegistryComponent = JSON.parse(content);

    components.push({
      name: component.name,
      type: component.type,
      dependencies: component.dependencies,
      registryDependencies: component.registryDependencies,
      files: [`styles/default/${file}`],
    });
  }

  // Sort components alphabetically
  components.sort((a, b) => a.name.localeCompare(b.name));

  // Read version from package.json
  const packageJsonPath = path.join(__dirname, "../../package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  const index: RegistryIndex = {
    name: "@mof-malaysia/myds",
    version: packageJson.version || "2.0.0",
    components,
  };

  // Write index.json
  const indexPath = path.join(REGISTRY_DIR, "index.json");
  writeJsonFile(indexPath, index);

  console.log(`✅ Created index.json with ${components.length} components`);
  console.log(`📁 Location: ${indexPath}\n`);

  // Create schema.json (optional but recommended)
  await createSchema();
}

async function createSchema(): Promise<void> {
  const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["name", "type", "files"],
    properties: {
      name: {
        type: "string",
        description: "The name of the component",
      },
      type: {
        type: "string",
        enum: ["components:ui", "components:layout", "components:lib"],
        description: "The type of component",
      },
      dependencies: {
        type: "array",
        items: {
          type: "string",
        },
        description: "npm package dependencies",
      },
      registryDependencies: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Other components from the registry",
      },
      files: {
        type: "array",
        items: {
          type: "object",
          required: ["path", "content", "type"],
          properties: {
            path: {
              type: "string",
            },
            content: {
              type: "string",
            },
            type: {
              type: "string",
            },
          },
        },
        description: "Component files",
      },
      tailwind: {
        type: "object",
        properties: {
          config: {
            type: "object",
          },
        },
        description: "Tailwind configuration",
      },
    },
  };

  const schemaPath = path.join(REGISTRY_DIR, "schema.json");
  writeJsonFile(schemaPath, schema);
  console.log("✅ Created schema.json");
}

async function main() {
  console.log("🏗️  Building MYDS Registry\n");
  console.log("=" .repeat(50) + "\n");

  try {
    // First, run the generator (we'll import and run it)
    console.log("Step 1: Generating component registry files...");
    await import("./generate");

    // Wait a bit for the generator to finish
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Then build the index
    console.log("\nStep 2: Building index.json...");
    await buildIndex();

    console.log("\n" + "=".repeat(50));
    console.log("✨ Registry build complete!\n");
    console.log("Next steps:");
    console.log("  1. Review generated files in /registry");
    console.log("  2. Test with: npx shadcn@latest add button --registry=file:///$(pwd)/registry");
    console.log("  3. Check index.json for accuracy");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

main();
