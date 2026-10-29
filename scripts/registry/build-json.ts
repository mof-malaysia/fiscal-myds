import fs from "fs";
import path from "path";
import {
  writeJsonFile,
  REGISTRY_ITEM_SCHEMA,
  REGISTRY_REPO,
  REGISTRY_SCHEMA,
} from "./utils";

/**
 * Turn the GitHub-source registry (registry.json + files) into the JSON
 * registry served on GitHub Pages, one <name>.json per item with its file
 * contents inlined. Projects use it through a components.json namespace:
 *
 *   "registries": { "@ftds": "https://mof-malaysia.github.io/ftds/r/v2/{name}.json" }
 *
 * Usage: tsx scripts/registry/build-json.ts <source dir> <out dir> <base url>
 *
 * The source dir holds a registry.json at its root, either this checkout or a
 * release tag extracted with `git archive`, so every published version is
 * built from its own files. Dependencies become URLs under <base url>, which
 * keeps an install inside one version.
 */

interface SourceFile {
  path: string;
  type: string;
  target?: string;
}

interface SourceItem {
  name: string;
  registryDependencies?: string[];
  files?: SourceFile[];
  [key: string]: unknown;
}

interface SourceRegistry {
  name: string;
  homepage?: string;
  include?: string[];
  items?: SourceItem[];
}

const DEPENDENCY = new RegExp(`^${REGISTRY_REPO}/([^#]+)(?:#.+)?$`);

/** Items of a registry.json and every registry.json it includes, with the folder each was declared in. */
function readItems(registryFile: string): { item: SourceItem; dir: string }[] {
  const registry: SourceRegistry = JSON.parse(
    fs.readFileSync(registryFile, "utf-8"),
  );
  const dir = path.dirname(registryFile);
  return [
    ...(registry.items ?? []).map((item) => ({ item, dir })),
    ...(registry.include ?? []).flatMap((file) =>
      readItems(path.join(dir, file)),
    ),
  ];
}

/** Write the JSON registry for the source in sourceDir to outDir; returns the item count. */
export function buildJsonRegistry(
  sourceDir: string,
  outDir: string,
  baseUrl: string,
): number {
  const base = baseUrl.replace(/\/$/, "");
  const root: SourceRegistry = JSON.parse(
    fs.readFileSync(path.join(sourceDir, "registry.json"), "utf-8"),
  );
  const items = readItems(path.join(sourceDir, "registry.json"));
  const names = new Set(items.map(({ item }) => item.name));

  const toUrl = (dep: string) => {
    const name = dep.match(DEPENDENCY)?.[1];
    if (!name) return dep;
    if (!names.has(name)) throw new Error(`Unknown dependency: ${dep}`);
    return `${base}/${name}.json`;
  };

  fs.rmSync(outDir, { recursive: true, force: true });
  const index = items.map(({ item, dir }) => {
    const entry = {
      ...item,
      registryDependencies: (item.registryDependencies ?? []).map(toUrl),
    };
    writeJsonFile(path.join(outDir, `${item.name}.json`), {
      $schema: REGISTRY_ITEM_SCHEMA,
      ...entry,
      files: (item.files ?? []).map((file) => ({
        ...file,
        content: fs.readFileSync(path.join(dir, file.path), "utf-8"),
      })),
    });
    return entry;
  });

  writeJsonFile(path.join(outDir, "registry.json"), {
    $schema: REGISTRY_SCHEMA,
    name: root.name,
    homepage: root.homepage,
    items: index,
  });
  return index.length;
}

if (require.main === module) {
  const [sourceDir, outDir, baseUrl] = process.argv.slice(2);
  if (!sourceDir || !outDir || !baseUrl) {
    console.error(
      "Usage: tsx scripts/registry/build-json.ts <source dir> <out dir> <base url>",
    );
    process.exit(1);
  }
  const count = buildJsonRegistry(sourceDir, outDir, baseUrl);
  console.log(`📦 ${count} items -> ${outDir} (${baseUrl})`);
}
