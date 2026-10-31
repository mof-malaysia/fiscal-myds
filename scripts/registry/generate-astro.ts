import fs from "fs";
import path from "path";
import {
  describeItem,
  extractImports,
  iconItemName,
  iconTitle,
  listComponents,
  readFileContent,
  registryItemRef,
  rewriteVariantsImports,
  titleFromName,
  variantsItemName,
  withVersions,
  writeRegistry,
  REGISTRY_ITEM_SCHEMA,
  type ComponentSource,
  type ComponentTier,
  type RegistryComponent,
  type RegistryName,
} from "./utils";
import { readDoc } from "../llms/content";

/**
 * Generate the Astro registries (docs/rfc/astro.md):
 *   astro-core       the core components ported to Astro, plus i18n labels
 *   astro-marketing  marketing components and blocks
 *   astro-icons      one item per icon
 *
 * Source lives in packages/astro/src and imports FTDS the way an installed
 * project does. Item names carry an `astro-` prefix, since every registry
 * shares one namespace (`button` is the React one). Shared classes
 * (`@mof-malaysia/ftds-style/variants/<name>`) are `variants-<name>` items in
 * the style registry, as they are for React.
 */

const ROOT_DIR = path.join(__dirname, "../..");
const ASTRO_SRC = path.join(ROOT_DIR, "packages/astro/src");
const REACT_COMPONENTS = path.join(ROOT_DIR, "packages/react/src/components");

const TIERS = ["core", "marketing"] as const satisfies ComponentTier[];
type AstroTier = (typeof TIERS)[number];
const REGISTRY_OF: Record<AstroTier, RegistryName> = {
  core: "astro-core",
  marketing: "astro-marketing",
};

const PACKAGE_DEPENDENCIES: Record<string, string> = JSON.parse(
  readFileContent(path.join(ROOT_DIR, "packages/astro/package.json")),
).dependencies;

/** The first line of a block's frontmatter, as in the React source. */
const BLOCK_MARKER = /^---\s*\n\/\/ registry:block\b/;

const astroItemName = (name: string) => `astro-${name}`;

/** The registry item an `@/` import in Astro source comes from. */
function aliasDependency(
  specifier: string,
  source: ComponentSource,
  tierOf: Map<string, ComponentTier>,
): string {
  if (specifier === "@/lib/ftds/utils") return "utils";
  if (specifier === "@/lib/ftds/i18n") return astroItemName("i18n");
  if (specifier === "@/lib/ftds/scripts") return astroItemName("scripts");
  const icon = specifier.match(/^@\/components\/ui\/icons\/(.+)\.astro$/);
  if (icon) return astroItemName(iconItemName(icon[1]!));
  const dep = specifier.match(
    /^@\/components\/(?:ui|blocks)\/(.+)\.astro$/,
  )?.[1];
  const depTier = dep && tierOf.get(dep);
  if (!depTier) {
    // React components and app-tier items never reach the Astro registries
    throw new Error(
      `${source.filePath} imports ${specifier}, which the Astro registries don't ship`,
    );
  }
  // Marketing may depend on core; core never on marketing
  if (source.tier === "core" && depTier !== "core") {
    throw new Error(`core/${source.name} depends on ${depTier}/${dep}`);
  }
  return astroItemName(dep);
}

function generateItem(
  source: ComponentSource,
  tierOf: Map<string, ComponentTier>,
): RegistryComponent {
  const content = readFileContent(source.filePath);
  // Imports live in the frontmatter and in <script> blocks (behaviour)
  const code = [
    content.slice(3, content.indexOf("\n---", 3)),
    ...[...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(
      (match) => match[1]!.replace(/^\s+/gm, ""),
    ),
  ].join("\n");
  const { npmDependencies, aliasImports, variants } = extractImports(code);
  npmDependencies.delete("astro");

  const isBlock = BLOCK_MARKER.test(content);
  const target = `components/${isBlock ? "blocks" : "ui"}/${source.name}.astro`;
  const registryDependencies = [
    ...aliasImports.map((specifier) =>
      aliasDependency(specifier, source, tierOf),
    ),
    ...variants.map(variantsItemName),
  ];

  return describe(
    {
      $schema: REGISTRY_ITEM_SCHEMA,
      name: astroItemName(source.name),
      type: isBlock ? "registry:block" : "registry:ui",
      dependencies: withVersions(npmDependencies, PACKAGE_DEPENDENCIES),
      registryDependencies: [
        ...new Set(registryDependencies.map(registryItemRef)),
      ].sort(),
      files: [
        {
          path: target,
          content: rewriteVariantsImports(content),
          type: isBlock ? "registry:component" : "registry:ui",
          ...(isBlock ? { target } : {}),
        },
      ],
    },
    source,
    content,
  );
}

/**
 * Title and description from the React doc (<name>.md, the one llms.txt
 * uses) when the component exists in both stacks, otherwise the first
 * sentence of the Astro component's JSDoc.
 */
function describe(
  item: RegistryComponent,
  source: ComponentSource,
  content: string,
): RegistryComponent {
  const docFile = path.join(REACT_COMPONENTS, source.tier, `${source.name}.md`);
  const doc = fs.existsSync(docFile) ? readDoc(docFile) : null;
  const jsdoc = (content.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? "")
    .split(/\n\s*\*\s*\n/)[0]!
    .replace(/^\s*\*\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  return describeItem(item, {
    title: `${doc?.title ?? titleFromName(source.name)} (Astro)`,
    description:
      doc?.description ?? jsdoc.match(/^.*?\.(?=\s|$)/)?.[0] ?? jsdoc,
    categories: [
      "astro",
      item.type === "registry:block" ? "blocks" : source.tier,
    ],
  });
}

function generateI18nItem(): RegistryComponent {
  return describeItem(
    {
      $schema: REGISTRY_ITEM_SCHEMA,
      name: astroItemName("i18n"),
      type: "registry:lib",
      dependencies: [],
      registryDependencies: [],
      files: [
        {
          path: "lib/ftds/i18n/index.ts",
          content: readFileContent(path.join(ASTRO_SRC, "i18n/index.ts")),
          type: "registry:lib",
        },
      ],
    },
    {
      title: "Astro i18n labels",
      description:
        "Bahasa Melayu and English labels built into the FTDS Astro components, with resolveLang and label. Imported from @/lib/ftds/i18n.",
      categories: ["astro", "utilities"],
    },
  );
}

function generateScriptsItem(): RegistryComponent {
  return describeItem(
    {
      $schema: REGISTRY_ITEM_SCHEMA,
      name: astroItemName("scripts"),
      type: "registry:lib",
      dependencies: [],
      registryDependencies: [],
      files: [
        {
          path: "lib/ftds/scripts/index.ts",
          content: readFileContent(path.join(ASTRO_SRC, "scripts/index.ts")),
          type: "registry:lib",
        },
      ],
    },
    {
      title: "Astro behaviour scripts",
      description:
        "Helpers the interactive FTDS Astro components share in their <script>: onEach (set up once, again after view transitions) and moveFocus (arrow-key focus). Imported from @/lib/ftds/scripts.",
      categories: ["astro", "utilities"],
    },
  );
}

function generateIconItems(): RegistryComponent[] {
  const dir = path.join(ASTRO_SRC, "icons");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".astro"))
    .sort()
    .map((file) => {
      const name = file.replace(/\.astro$/, "");
      return describeItem(
        {
          $schema: REGISTRY_ITEM_SCHEMA,
          name: astroItemName(iconItemName(name)),
          type: "registry:ui",
          dependencies: [],
          registryDependencies: [],
          files: [
            {
              path: `components/ui/icons/${file}`,
              content: readFileContent(path.join(dir, file)),
              type: "registry:ui",
            },
          ],
        },
        {
          title: `${iconTitle(name)} (Astro)`,
          description: `The ${name} icon as an Astro component, installed to components/ui/icons/${file}.`,
          categories: ["astro", "icons"],
        },
      );
    });
}

function main() {
  const sources = listComponents({
    dir: path.join(ASTRO_SRC, "components"),
    tiers: TIERS,
    ext: ".astro",
  });
  const tierOf = new Map(sources.map((source) => [source.name, source.tier]));

  // Build every item first so a boundary violation fails before anything is written
  const items: Record<AstroTier, RegistryComponent[]> = {
    core: [generateI18nItem(), generateScriptsItem()],
    marketing: [],
  };
  for (const source of sources) {
    items[source.tier as AstroTier].push(generateItem(source, tierOf));
  }
  const icons = generateIconItems();

  for (const tier of TIERS) {
    writeRegistry(REGISTRY_OF[tier], items[tier]);
    console.log(`   - ${REGISTRY_OF[tier]}: ${items[tier].length} items`);
  }
  writeRegistry("astro-icons", icons);
  console.log(`   - astro-icons: ${icons.length} items`);
}

main();
