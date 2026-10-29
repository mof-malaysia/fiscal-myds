import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { writeJsonFile, COMPONENT_TIERS, type RegistryName } from "./utils";

/**
 * Build the multi-registry system:
 *   core, app, marketing  components (one registry per tier)
 *   icons                 icon library
 *   style                 Tailwind v4 styling system
 * then an index.json per registry and a root index.
 */

const REGISTRY_DIR = path.join(__dirname, "../../registry");

const REGISTRIES: Record<RegistryName, { name: string; description: string }> = {
  core: {
    name: "@myds-core",
    description: "Shared primitives, government site chrome, utilities and hooks",
  },
  app: {
    name: "@myds-app",
    description: "Service and officer tools: forms, data, workflows",
  },
  marketing: {
    name: "@myds-marketing",
    description: "Agency and landing site components and blocks",
  },
  icons: { name: "@myds-icon", description: "Icon library" },
  style: { name: "@myds-style", description: "Tailwind v4 styling system" },
};

const version: string =
  JSON.parse(fs.readFileSync(path.join(__dirname, "../../package.json"), "utf-8"))
    .version || "2.0.0";

function buildIndex(registry: RegistryName): number {
  const dir = path.join(REGISTRY_DIR, registry, "styles/default");
  const components = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
      return {
        name: content.name,
        type: content.type,
        dependencies: content.dependencies || [],
        registryDependencies: content.registryDependencies || [],
        files: [`styles/default/${file}`],
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  writeJsonFile(path.join(REGISTRY_DIR, registry, "index.json"), {
    ...REGISTRIES[registry],
    version,
    components,
  });
  console.log(`📦 ${REGISTRIES[registry].name}: ${components.length} items`);
  return components.length;
}

function main() {
  console.log("🏗️  Building Multi-Registry System\n");

  // The flat `ui` registry was split into core/app/marketing in 2.0.
  fs.rmSync(path.join(REGISTRY_DIR, "ui"), { recursive: true, force: true });

  console.log("Generating component registries (core, app, marketing)...");
  execSync("tsx scripts/registry/generate-components.ts", { stdio: "inherit" });
  console.log("Generating icons registry...");
  execSync("tsx scripts/registry/generate-icons.ts", { stdio: "inherit" });
  console.log("Generating style registry...");
  execSync("tsx scripts/registry/generate-style.ts", { stdio: "inherit" });
  console.log("");

  const registries = Object.fromEntries(
    (Object.keys(REGISTRIES) as RegistryName[]).map((registry) => [
      registry,
      {
        ...REGISTRIES[registry],
        url: `/registry/${registry}`,
        components: buildIndex(registry),
      },
    ])
  );

  writeJsonFile(path.join(REGISTRY_DIR, "index.json"), {
    name: "@mof-malaysia/myds",
    version,
    description: "Malaysia Design System - Multi-registry component library",
    tiers: COMPONENT_TIERS,
    registries,
    totalComponents: Object.values(registries).reduce(
      (sum, r) => sum + r.components,
      0
    ),
  });

  console.log("\n✨ Registry build complete");
}

main();
