import fs from "fs";
import path from "path";
import {
  describeItem,
  readFileContent,
  registryItemRef,
  rewriteVariantsImports,
  variantImports,
  variantsFile,
  writeRegistry,
  VARIANTS_PACKAGE,
  REGISTRY_ITEM_SCHEMA,
  type RegistryComponent,
  type RegistryName,
} from "./utils";

/**
 * Generate the Astro registries (docs/rfc/astro.md):
 *   astro-core       the core components ported to Astro, plus i18n labels
 *   astro-marketing  marketing components and blocks
 *   astro-icons      one item per icon
 *
 * Source lives in packages/astro/src and imports FTDS the way an installed
 * project does. Item names carry an `astro-` prefix, since every registry
 * shares one namespace (`button` is the React one). Shared classes
 * (`@mof-malaysia/ftds-style/variants/<name>`) come from packages/style and
 * ship inside the item as components/ui/<name>.variants.ts, as
 * generate-components.ts does for React.
 */

const ROOT_DIR = path.join(__dirname, "../..");
const ASTRO_SRC = path.join(ROOT_DIR, "packages/astro/src");

const TIERS = ["core", "marketing"] as const;
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
/** A file that is one part of a larger component: `// part of card`. */
const PART_MARKER = /^---\s*\n\/\/ part of ([a-z0-9-]+)/;

export const astroItemName = (name: string) => `astro-${name}`;

interface Source {
  name: string;
  tier: AstroTier;
  files: string[];
}

/** Every component, its part files grouped with it; names are unique across tiers. */
function listSources(): Source[] {
  const sources = new Map<string, Source>();
  const parts: { owner: string; file: string }[] = [];
  for (const tier of TIERS) {
    const dir = path.join(ASTRO_SRC, "components", tier);
    for (const file of fs.readdirSync(dir).sort()) {
      if (!file.endsWith(".astro")) continue;
      const filePath = path.join(dir, file);
      const part = readFileContent(filePath).match(PART_MARKER);
      if (part) {
        parts.push({ owner: part[1]!, file: filePath });
        continue;
      }
      const name = file.replace(/\.astro$/, "");
      if (sources.has(name)) {
        throw new Error(`"${name}" exists in both ${sources.get(name)!.tier} and ${tier}`);
      }
      sources.set(name, { name, tier, files: [filePath] });
    }
  }
  for (const { owner, file } of parts) {
    const source = sources.get(owner);
    if (!source) throw new Error(`${file} is part of unknown component "${owner}"`);
    source.files.push(file);
  }
  return [...sources.values()];
}

/** Module specifiers of the imports in an .astro frontmatter or a .ts file. */
function importsOf(content: string): string[] {
  const code = content.startsWith("---")
    ? content.slice(3, content.indexOf("\n---", 3))
    : content;
  return [...code.matchAll(/^import\s[^;]*?from\s+["']([^"']+)["']/gm)].map(
    (match) => match[1]!,
  );
}


function generateItem(source: Source, tierOf: Map<string, AstroTier>): RegistryComponent {
  const own = new Set(source.files.map((file) => path.basename(file, ".astro")));
  const isBlock = BLOCK_MARKER.test(readFileContent(source.files[0]!));
  const npm = new Set<string>();
  const registryDeps = new Set<string>();
  const variantFiles = new Map<string, RegistryComponent["files"][number]>();

  const scan = (content: string, from: string) => {
    for (const specifier of importsOf(content)) {
      let match: RegExpMatchArray | null;
      if (specifier === "@/lib/ftds/utils") {
        registryDeps.add(registryItemRef("utils"));
      } else if (specifier === "@/lib/ftds/i18n") {
        registryDeps.add(registryItemRef(astroItemName("i18n")));
      } else if ((match = specifier.match(/^@\/components\/ui\/icons\/(.+)\.astro$/))) {
        registryDeps.add(registryItemRef(astroItemName(`icon-${match[1]}`)));
      } else if (specifier.startsWith(`${VARIANTS_PACKAGE}/variants/`)) {
        // Bundled below, from variantImports
      } else if ((match = specifier.match(/^@\/components\/(?:ui|blocks)\/(.+)\.astro$/))) {
        const dep = match[1]!;
        if (own.has(dep)) continue;
        const depTier = tierOf.get(dep);
        if (!depTier) throw new Error(`${from} imports unknown Astro component ${dep}`);
        // Marketing may depend on core; core never on marketing
        if (source.tier === "core" && depTier !== "core") {
          throw new Error(`core/${source.name} depends on ${depTier}/${dep}`);
        }
        registryDeps.add(registryItemRef(astroItemName(dep)));
      } else if (specifier.startsWith("@/") || specifier.startsWith(".")) {
        // React components and app-tier items never reach the Astro registries
        throw new Error(`${from} imports ${specifier}, which the Astro registries don't ship`);
      } else if (!specifier.startsWith("astro")) {
        const [scope, name] = specifier.split("/");
        npm.add(specifier.startsWith("@") ? `${scope}/${name}` : scope!);
      }
    }
  };

  const files = source.files.map((file) => {
    const raw = readFileContent(file);
    scan(raw, file);
    for (const name of variantImports(raw)) {
      const variants = variantsFile(name);
      variantFiles.set(name, variants);
      scan(variants.content, variants.path);
    }
    const content = rewriteVariantsImports(raw);
    const target = `components/${isBlock ? "blocks" : "ui"}/${path.basename(file)}`;
    return {
      path: target,
      content,
      type: isBlock ? "registry:component" : "registry:ui",
      ...(isBlock ? { target } : {}),
    };
  });

  return {
    $schema: REGISTRY_ITEM_SCHEMA,
    name: astroItemName(source.name),
    type: isBlock ? "registry:block" : "registry:ui",
    dependencies: [...npm]
      .sort()
      .map((dep) => (PACKAGE_DEPENDENCIES[dep] ? `${dep}@${PACKAGE_DEPENDENCIES[dep]}` : dep)),
    registryDependencies: [...registryDeps].sort(),
    files: [...files, ...variantFiles.values()],
  };
}

/** Title and description from the component's JSDoc: its first sentence. */
function describe(item: RegistryComponent, source: Source): RegistryComponent {
  const content = readFileContent(source.files[0]!);
  const doc = content.match(/\/\*\*([\s\S]*?)\*\//)?.[1] ?? "";
  const paragraph = doc
    .split(/\n\s*\*\s*\n/)[0]!
    .replace(/^\s*\*\s?/gm, "")
    .replace(/\s+/g, " ")
    .trim();
  const sentence = paragraph.match(/^.*?\.(?=\s|$)/)?.[0] ?? paragraph;
  const title = source.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return describeItem(item, {
    title: `${title} (Astro)`,
    description: sentence || `The FTDS ${title} as a native Astro component.`,
    categories: ["astro", item.type === "registry:block" ? "blocks" : source.tier],
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
          name: astroItemName(`icon-${name}`),
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
          title: `${name.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase())} icon (Astro)`,
          description: `The ${name} icon as an Astro component, installed to components/ui/icons/${file}.`,
          categories: ["astro", "icons"],
        },
      );
    });
}

function main() {
  const sources = listSources();
  const tierOf = new Map(sources.map((source) => [source.name, source.tier]));

  // Build every item first so a boundary violation fails before anything is written
  const items: Record<AstroTier, RegistryComponent[]> = {
    core: [generateI18nItem()],
    marketing: [],
  };
  for (const source of sources) {
    items[source.tier].push(describe(generateItem(source, tierOf), source));
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
