import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import {
  writeJsonFile,
  REGISTRY_DIR,
  REGISTRY_HOMEPAGE,
  REGISTRY_SCHEMA,
  type RegistryName,
} from "./utils";

/**
 * Build the registry the shadcn CLI reads straight from GitHub
 * (https://ui.shadcn.com/docs/registry/github):
 *   registry/<name>/registry.json + files   core, app, marketing, icons, style,
 *                                           astro-core, astro-marketing, astro-icons
 *   registry.json                           root, includes all of the above
 * Items install as `mof-malaysia/ftds/<item>`, so names are unique across all
 * of them (Astro items are prefixed `astro-`). scripts/registry/build-json.ts turns the same files into the JSON
 * registry served on GitHub Pages.
 */

const ROOT_DIR = path.join(__dirname, "../..");
const REGISTRIES: RegistryName[] = [
  "core",
  "app",
  "marketing",
  "icons",
  "style",
  "astro-core",
  "astro-marketing",
  "astro-icons",
];

/** Every item name across the registries; throws on a duplicate. */
function assertUniqueNames(): number {
  const seen = new Map<string, RegistryName>();
  for (const registry of REGISTRIES) {
    const { items } = JSON.parse(
      fs.readFileSync(
        path.join(REGISTRY_DIR, registry, "registry.json"),
        "utf-8",
      ),
    );
    for (const { name } of items as { name: string }[]) {
      if (seen.has(name)) {
        throw new Error(
          `"${name}" is in both ${seen.get(name)} and ${registry}`,
        );
      }
      seen.set(name, registry);
    }
    console.log(`📦 ${registry}: ${items.length} items`);
  }
  return seen.size;
}

function main() {
  console.log("🏗️  Building registry\n");

  // Leftovers of the earlier JSON layout (registry/<name>/styles/default/*.json, registry/index.json)
  for (const stale of ["ui", "index.json"]) {
    fs.rmSync(path.join(REGISTRY_DIR, stale), { recursive: true, force: true });
  }

  console.log("Generating component registries (core, app, marketing)...");
  execSync("tsx scripts/registry/generate-components.ts", { stdio: "inherit" });
  console.log("Generating icons registry...");
  execSync("tsx scripts/registry/generate-icons.ts", { stdio: "inherit" });
  console.log("Generating style registry...");
  execSync("tsx scripts/registry/generate-style.ts", { stdio: "inherit" });
  console.log("Generating Astro registries (astro-core, astro-marketing, astro-icons)...");
  execSync("tsx scripts/registry/generate-astro.ts", { stdio: "inherit" });
  console.log("");

  const total = assertUniqueNames();

  writeJsonFile(path.join(ROOT_DIR, "registry.json"), {
    $schema: REGISTRY_SCHEMA,
    name: "ftds",
    homepage: REGISTRY_HOMEPAGE,
    include: REGISTRIES.map((registry) => `registry/${registry}/registry.json`),
  });

  console.log(`\n✨ Registry build complete: ${total} items`);
}

main();
