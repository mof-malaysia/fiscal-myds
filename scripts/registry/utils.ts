import fs from "fs";
import path from "path";

/**
 * Utility functions for registry generation
 */

export interface ComponentFile {
  path: string;
  content: string;
  type: string;
  target?: string;
}

export interface RegistryComponent {
  $schema?: string;
  name: string;
  title?: string;
  description?: string;
  categories?: string[];
  type: string;
  dependencies: string[];
  registryDependencies: string[];
  files: ComponentFile[];
  tailwind?: {
    config?: Record<string, any>;
  };
}

/**
 * Read file content and return as string
 */
export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Module specifiers of a file's top-level `import ... from` / `export ... from`
 * statements, split into npm packages and relative paths. Anchored to the start
 * of a line so `import` examples inside JSDoc are ignored.
 */
export function extractImports(content: string): {
  npmDependencies: Set<string>;
  localImports: string[];
} {
  const npmDependencies = new Set<string>();
  const localImports: string[] = [];

  for (const match of content.matchAll(
    /^(?:import|export)\s[^;=]*?from\s+["']([^"']+)["']/gm,
  )) {
    const specifier = match[1]!;
    if (specifier.startsWith(".")) {
      localImports.push(specifier);
    } else if (specifier !== "react" && specifier !== "react-dom") {
      // "@base-ui/react/dialog" -> "@base-ui/react", "date-fns/locale" -> "date-fns"
      const [scope, name] = specifier.split("/");
      npmDependencies.add(
        specifier.startsWith("@") ? `${scope}/${name}` : scope!,
      );
    }
  }

  return { npmDependencies, localImports };
}

/**
 * The repository is the registry: items install as `mof-malaysia/ftds/<name>`.
 * See https://ui.shadcn.com/docs/registry/github
 */
export const REGISTRY_REPO = "mof-malaysia/ftds";
export const REGISTRY_HOMEPAGE = `https://github.com/${REGISTRY_REPO}`;

/**
 * Git ref written into every registryDependency. Unset on main; the release
 * workflow sets FTDS_REF=v2.1.0 so a tagged install never pulls from main
 * (shadcn does not pass a ref on to dependencies).
 */
const REGISTRY_REF = process.env.FTDS_REF;

export const REGISTRY_DIR = path.join(__dirname, "../../registry");
export const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json";
export const REGISTRY_ITEM_SCHEMA =
  "https://ui.shadcn.com/schema/registry-item.json";

export const COMPONENT_TIERS = ["core", "app", "marketing"] as const;
export type ComponentTier = (typeof COMPONENT_TIERS)[number];
export type RegistryName = ComponentTier | "icons" | "style";

export const COMPONENTS_DIR = path.join(
  __dirname,
  "../../packages/react/src/components",
);

export interface ComponentSource {
  name: string;
  tier: ComponentTier;
  filePath: string;
}

/**
 * Every component file, tier by tier. Components install flat into
 * components/ui, so a name may exist in only one tier.
 */
export function listComponents(): ComponentSource[] {
  const tierOf = new Map<string, ComponentTier>();
  return COMPONENT_TIERS.flatMap((tier) =>
    fs
      .readdirSync(path.join(COMPONENTS_DIR, tier))
      .filter((file) => file.endsWith(".tsx"))
      .sort()
      .map((file) => {
        const name = file.replace(/\.tsx$/, "");
        if (tierOf.has(name)) {
          throw new Error(
            `"${name}" exists in both ${tierOf.get(name)} and ${tier}`,
          );
        }
        tierOf.set(name, tier);
        return { name, tier, filePath: path.join(COMPONENTS_DIR, tier, file) };
      }),
  );
}

/**
 * Address of a registry item, e.g. registryItemRef("button") ->
 * "mof-malaysia/ftds/button". shadcn resolves bare names against its own
 * registry, so cross-item dependencies use the full address.
 */
export function registryItemRef(name: string): string {
  return `${REGISTRY_REPO}/${name}${REGISTRY_REF ? `#${REGISTRY_REF}` : ""}`;
}

/**
 * Item names share one namespace across every registry, so icons are
 * prefixed: the chevron-down icon is `icon-chevron-down`, apart from the
 * button component.
 */
export function iconItemName(file: string): string {
  return `icon-${file}`;
}

/**
 * Map of icon export name -> icon file name, e.g. ChevronDownIcon -> chevron-down
 */
export function getIconExportMap(iconsDir: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const file of fs.readdirSync(iconsDir)) {
    if (!file.endsWith(".tsx")) continue;
    const content = fs.readFileSync(path.join(iconsDir, file), "utf-8");
    for (const match of content.matchAll(/export const (\w+)/g)) {
      map.set(match[1]!, file.replace(/\.tsx$/, ""));
    }
  }
  return map;
}

/**
 * Split barrel imports (`import { A, B } from "../../icons"`) into one import
 * per icon file, since the icons registry has no barrel file.
 */
export function expandIconBarrelImports(
  content: string,
  iconMap: Map<string, string>,
): string {
  return content.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']((?:\.\.\/)+)icons["'];?/g,
    (_, names: string, prefix: string) =>
      names
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n) => {
          const file = iconMap.get(n.split(/\s+as\s+/)[0]!);
          if (!file) throw new Error(`Unknown icon in barrel import: ${n}`);
          return `import { ${n} } from "${prefix}icons/${file}";`;
        })
        .join("\n"),
  );
}

const TIER_PATTERN = COMPONENT_TIERS.join("|");

/**
 * Transform relative imports to the alias paths the files are installed at.
 * Every tier installs flat into components/ui, so a component never needs to
 * know which registry its dependency came from.
 * FTDS helpers live under lib/ftds/ so they don't overwrite shadcn's lib/utils.ts.
 */
export function transformImports(
  content: string,
  { keepSameFolderImports = false } = {},
): string {
  const rewrites: [RegExp, string][] = [
    // "../../utils/events" -> "@/lib/ftds/utils/events", "../../utils" -> "@/lib/ftds/utils"
    [
      /from\s+["'](?:\.\.\/)+utils(\/[^"']+)?["']/g,
      'from "@/lib/ftds/utils$1"',
    ],
    // "../../hooks", "../../hooks/use-theme" -> "@/lib/ftds/hooks..."
    [
      /from\s+["'](?:\.\.\/)+hooks(\/[^"']+)?["']/g,
      'from "@/lib/ftds/hooks$1"',
    ],
    // "../../icons/chevron-down" -> "@/components/ui/icons/chevron-down"
    [
      /from\s+["'](?:\.\.\/)+icons\/([^"']+)["']/g,
      'from "@/components/ui/icons/$1"',
    ],
    // "../components/core/toast" (from hooks/utils) -> "@/components/ui/toast"
    [
      new RegExp(
        `from\\s+["']\\.\\.\\/components\\/(?:${TIER_PATTERN})\\/([^"']+)["']`,
        "g",
      ),
      'from "@/components/ui/$1"',
    ],
    // "../core/button" (cross-tier) -> "@/components/ui/button"
    [
      new RegExp(
        `from\\s+["']\\.\\.\\/(?:${TIER_PATTERN})\\/([^"']+)["']`,
        "g",
      ),
      'from "@/components/ui/$1"',
    ],
  ];

  // Same-folder component imports: "./button" -> "@/components/ui/button".
  // Files that ship together in one folder (hooks) keep relative imports.
  if (!keepSameFolderImports) {
    rewrites.push([
      /from\s+["']\.\/([^"']+)["']/g,
      'from "@/components/ui/$1"',
    ]);
  }

  return rewrites.reduce(
    (acc, [pattern, replacement]) =>
      acc.replace(pattern, (...args) =>
        replacement.replace("$1", args[1] ?? ""),
      ),
    content,
  );
}

export interface RegistryDependency {
  registry: RegistryName;
  name: string;
}

/**
 * Map a relative import in a component file to the registry item that
 * provides it, or null if it isn't a registry item. Utils and hooks ship from
 * the core registry.
 */
export function mapToRegistryDependency(
  importPath: string,
  fromTier: ComponentTier,
): RegistryDependency | null {
  if (/^(\.\.\/)+utils$/.test(importPath))
    return { registry: "core", name: "utils" };
  // utils/events ships with the hooks item
  if (/^(\.\.\/)+utils\/events$/.test(importPath))
    return { registry: "core", name: "hooks" };
  if (/^(\.\.\/)+hooks/.test(importPath))
    return { registry: "core", name: "hooks" };
  const icon = importPath.match(/^(?:\.\.\/)+icons\/(.+)$/);
  if (icon) return { registry: "icons", name: iconItemName(icon[1]!) };
  const crossTier = importPath.match(
    new RegExp(`^\\.\\.\\/(${TIER_PATTERN})\\/(.+)$`),
  );
  if (crossTier)
    return { registry: crossTier[1] as ComponentTier, name: crossTier[2]! };
  if (importPath.startsWith("./"))
    return { registry: fromTier, name: importPath.slice(2) };
  return null;
}

/**
 * Add a title, description and categories to an item, keeping them next to its
 * name. `shadcn search`, `shadcn view` and the shadcn MCP server show them, so
 * coding agents can find the right item.
 */
export function describeItem(
  item: RegistryComponent,
  meta: { title: string; description: string; categories?: string[] },
): RegistryComponent {
  const { $schema, name, ...rest } = item;
  return {
    ...($schema ? { $schema } : {}),
    name,
    title: meta.title,
    description: meta.description,
    ...(meta.categories?.length ? { categories: meta.categories } : {}),
    ...rest,
  };
}

/**
 * Write JSON file with formatting
 */
export function writeJsonFile(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Write one registry as GitHub-source files: each file's content at
 * registry/<registry>/<path>, plus a registry.json listing the items. shadcn
 * resolves a file's path relative to the registry.json that declares it and
 * installs it by the alias folder in that path (ui, lib), so
 * registry/core/components/ui/button.tsx lands in the project's ui folder.
 */
export function writeRegistry(
  registry: RegistryName,
  items: RegistryComponent[],
): void {
  const dir = path.join(REGISTRY_DIR, registry);
  fs.rmSync(dir, { recursive: true, force: true });

  const entries = items.map(({ $schema: _schema, files, ...item }) => ({
    ...item,
    files: files.map(({ content, ...file }) => {
      const filePath = path.join(dir, file.path);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
      return file;
    }),
  }));

  writeJsonFile(path.join(dir, "registry.json"), {
    $schema: REGISTRY_SCHEMA,
    name: `ftds-${registry}`,
    homepage: REGISTRY_HOMEPAGE,
    items: entries,
  });
}
