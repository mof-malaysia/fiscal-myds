import fs from "fs";
import path from "path";
import {
  readFileContent,
  extractImports,
  transformImports,
  writeRegistry,
  describeItem,
  mapToRegistryDependency,
  expandIconBarrelImports,
  getIconExportMap,
  listComponents,
  registryItemRef,
  variantsItemName,
  withVersions as pinVersions,
  REGISTRY_ITEM_SCHEMA,
  type ComponentSource,
  type ComponentTier,
  type RegistryComponent,
  type RegistryDependency,
  COMPONENT_TIERS,
} from "./utils";
import { readDoc } from "../llms/content";

/**
 * Generate the component registries, one per tier:
 *   core      shared primitives, gov chrome, utils and hooks
 *   app       service and officer tools (components and blocks)
 *   marketing agency and landing sites (components and blocks)
 *
 * Source lives in packages/react/src/components/<tier>/. Every item installs
 * flat into components/ui (blocks into components/blocks), so names must be
 * unique across tiers.
 */

const SRC_DIR = path.join(__dirname, "../../packages/react/src");
const UTILS_DIR = path.join(SRC_DIR, "utils");
const HOOKS_DIR = path.join(SRC_DIR, "hooks");
const ICONS_DIR = path.join(SRC_DIR, "icons");

/** An app or marketing file that starts with this comment is a composed page section (`registry:block`). */
const BLOCK_MARKER = /^(?:"use client";\s*)?\/\/ registry:block\b/;

const iconMap = getIconExportMap(ICONS_DIR);

const PACKAGE_DEPENDENCIES: Record<string, string> = JSON.parse(
  readFileContent(path.join(__dirname, "../../packages/react/package.json")),
).dependencies;

/**
 * Pin npm dependencies to the ranges FTDS is built against, so a project
 * doesn't pull in a new major (e.g. @tanstack/react-table v9).
 */
function withVersions(deps: Iterable<string>): string[] {
  return pinVersions(deps, PACKAGE_DEPENDENCIES);
}

/** App and marketing may depend on core; app and marketing never depend on each other. */
function assertTierBoundary(
  name: string,
  tier: ComponentTier,
  deps: RegistryDependency[],
) {
  for (const dep of deps) {
    const depTier = COMPONENT_TIERS.find((t) => t === dep.registry);
    if (depTier && depTier !== tier && depTier !== "core") {
      throw new Error(`${tier}/${name} depends on ${depTier}: ${dep.name}`);
    }
  }
}

function generateComponentItem({
  name,
  tier,
  filePath,
}: ComponentSource): RegistryComponent {
  const content = expandIconBarrelImports(readFileContent(filePath), iconMap);
  const { npmDependencies, localImports, variants } = extractImports(content);

  const deps = localImports
    .map((importPath) => mapToRegistryDependency(importPath, tier))
    .filter(
      (dep): dep is RegistryDependency => dep !== null && dep.name !== name,
    );
  assertTierBoundary(name, tier, deps);
  const registryDeps = new Set(
    [...deps.map((dep) => dep.name), ...variants.map(variantsItemName)].map(
      registryItemRef,
    ),
  );

  const isBlock = tier !== "core" && BLOCK_MARKER.test(content);
  const target = isBlock
    ? `components/blocks/${name}.tsx`
    : `components/ui/${name}.tsx`;

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name,
    type: isBlock ? "registry:block" : "registry:ui",
    dependencies: withVersions(npmDependencies),
    registryDependencies: Array.from(registryDeps).sort(),
    files: [
      {
        path: target,
        content: transformImports(content),
        type: isBlock ? "registry:component" : "registry:ui",
        ...(isBlock ? { target } : {}),
      },
    ],
  };
}

function generateUtilsItem(): RegistryComponent {
  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: "utils",
    type: "registry:lib",
    dependencies: withVersions(["tailwind-merge"]),
    registryDependencies: [],
    files: [
      {
        path: "lib/ftds/utils/index.ts",
        content: readFileContent(path.join(UTILS_DIR, "index.ts")),
        type: "registry:lib",
      },
    ],
  };
}

/**
 * All hooks ship as one item (they are imported via the "../../hooks" barrel).
 * It also carries utils/events.ts, the toast event bus used by useToast.
 */
function generateHooksItem(): RegistryComponent {
  const files = fs
    .readdirSync(HOOKS_DIR)
    .filter((file) => /\.tsx?$/.test(file))
    .sort()
    .map((file) => ({
      path: `lib/ftds/hooks/${file}`,
      content: transformImports(readFileContent(path.join(HOOKS_DIR, file)), {
        keepSameFolderImports: true,
      }),
      type: "registry:lib",
    }));

  files.push({
    path: "lib/ftds/utils/events.ts",
    content: transformImports(
      readFileContent(path.join(UTILS_DIR, "events.ts")),
    ),
    type: "registry:lib",
  });

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: "hooks",
    type: "registry:lib",
    dependencies: withVersions(["mitt"]),
    // use-toast imports the ToastEvent type from the toast component
    registryDependencies: [registryItemRef("toast")],
    files,
  };
}

/**
 * Title, description and category from the item's doc (<name>.md next to its
 * source), which also feeds llms.txt. Items without a doc yet stay undescribed.
 */
function withDoc(item: RegistryComponent, docFile: string): RegistryComponent {
  if (!fs.existsSync(docFile)) return item;
  const doc = readDoc(docFile);
  return describeItem(item, {
    title: doc.title,
    description: doc.description,
    categories: [
      item.type === "registry:block"
        ? "blocks"
        : (doc.category ?? "").toLowerCase().replace(/ /g, "-"),
    ].filter(Boolean),
  });
}

function main() {
  // Build every item first so a tier violation fails before anything is written.
  const items: Record<ComponentTier, RegistryComponent[]> = {
    core: [
      withDoc(generateUtilsItem(), path.join(UTILS_DIR, "utils.md")),
      withDoc(generateHooksItem(), path.join(HOOKS_DIR, "hooks.md")),
    ],
    app: [],
    marketing: [],
  };
  for (const source of listComponents()) {
    items[source.tier].push(
      withDoc(
        generateComponentItem(source),
        source.filePath.replace(/\.tsx$/, ".md"),
      ),
    );
  }

  for (const tier of COMPONENT_TIERS) {
    writeRegistry(tier, items[tier]);
    console.log(`   - ${tier}: ${items[tier].length} items`);
  }
}

main();
