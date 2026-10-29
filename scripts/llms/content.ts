import fs from "fs";
import path from "path";
import { REGISTRY_DIR, type RegistryName } from "../registry/utils";

/**
 * Everything the llms.txt build reads: registry items (names, types, install
 * paths, dependencies) from registry/, and the hand-written docs:
 *
 *   packages/react/src/components/<tier>/<name>.md   one per component and block
 *   packages/react/src/{utils,hooks}/<name>.md        the utils and hooks items
 *   docs/guides/<slug>.md                             guides
 *   docs/llms-intro.md                                the rules at the top of llms.txt
 */

export const ROOT_DIR = path.join(__dirname, "../..");
const REACT_SRC = path.join(ROOT_DIR, "packages/react/src");
export const GUIDES_DIR = path.join(ROOT_DIR, "docs/guides");
export const INTRO_FILE = path.join(ROOT_DIR, "docs/llms-intro.md");

/** Index sections, in order. Blocks and icons are grouped automatically. */
export const CATEGORIES = [
  "Actions",
  "Forms and inputs",
  "Data display",
  "Feedback and status",
  "Overlays",
  "Navigation",
  "Layout",
  "Government chrome",
  "Marketing",
  "Utilities",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface RegistryFile {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryEntry {
  name: string;
  type: string;
  registry: RegistryName;
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

export interface Doc {
  file: string;
  title: string;
  description: string;
  category?: Category;
  order?: number;
  body: string;
}

export interface Item {
  entry: RegistryEntry;
  /** The TypeScript source the item is generated from (first file for hooks). */
  sourceFile: string;
  /** Install path in a project, e.g. components/ui/button.tsx. */
  installPath: string;
  /** Import specifier after install, e.g. @/components/ui/button. */
  importPath: string;
  doc?: Doc;
  docFile: string;
}

const REGISTRIES: RegistryName[] = [
  "core",
  "app",
  "marketing",
  "icons",
  "style",
];

export function readRegistry(): RegistryEntry[] {
  return REGISTRIES.flatMap((registry) => {
    const { items } = JSON.parse(
      fs.readFileSync(
        path.join(REGISTRY_DIR, registry, "registry.json"),
        "utf-8",
      ),
    ) as { items: Omit<RegistryEntry, "registry">[] };
    return items.map((item) => ({ ...item, registry }));
  });
}

/** Minimal frontmatter: `key: value` lines between `---` fences. */
export function readDoc(file: string): Doc {
  const text = fs.readFileSync(file, "utf-8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${rel(file)}: missing --- frontmatter ---`);
  const fields: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const field = line.match(/^(\w+):\s*(.*)$/);
    if (!field) throw new Error(`${rel(file)}: bad frontmatter line "${line}"`);
    fields[field[1]!] = field[2]!.replace(/^"(.*)"$/, "$1");
  }
  if (!fields.title || !fields.description) {
    throw new Error(`${rel(file)}: frontmatter needs title and description`);
  }
  const category = fields.category as Category | undefined;
  if (category && !CATEGORIES.includes(category)) {
    throw new Error(
      `${rel(file)}: unknown category "${category}" (one of ${CATEGORIES.join(", ")})`,
    );
  }
  return {
    file,
    title: fields.title,
    description: fields.description,
    category,
    order: fields.order ? Number(fields.order) : undefined,
    body: match[2]!.trim(),
  };
}

export const rel = (file: string) => path.relative(ROOT_DIR, file);

function sourceFor(entry: RegistryEntry): string {
  if (entry.name === "utils") return path.join(REACT_SRC, "utils/index.ts");
  if (entry.name === "hooks") return path.join(REACT_SRC, "hooks/index.ts");
  return path.join(
    REACT_SRC,
    "components",
    entry.registry,
    `${entry.name}.tsx`,
  );
}

function docFileFor(entry: RegistryEntry): string {
  if (entry.name === "utils") return path.join(REACT_SRC, "utils/utils.md");
  if (entry.name === "hooks") return path.join(REACT_SRC, "hooks/hooks.md");
  return path.join(REACT_SRC, "components", entry.registry, `${entry.name}.md`);
}

/** Components, blocks, utils and hooks: everything that has a hand-written doc. */
export function readItems(entries = readRegistry()): Item[] {
  return entries
    .filter((entry) => ["core", "app", "marketing"].includes(entry.registry))
    .map((entry) => {
      const file = entry.files[0]!;
      const installPath = (file.target ?? file.path).replace(/^~\//, "");
      const docFile = docFileFor(entry);
      return {
        entry,
        sourceFile: sourceFor(entry),
        installPath,
        importPath:
          entry.name === "utils" || entry.name === "hooks"
            ? `@/lib/ftds/${entry.name}`
            : `@/${installPath.replace(/\.tsx?$/, "")}`,
        doc: fs.existsSync(docFile) ? readDoc(docFile) : undefined,
        docFile,
      };
    });
}

export function readGuides(): (Doc & { slug: string })[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      ...readDoc(path.join(GUIDES_DIR, file)),
      slug: file.replace(/\.md$/, ""),
    }))
    .sort(
      (a, b) =>
        (a.order ?? 99) - (b.order ?? 99) || a.slug.localeCompare(b.slug),
    );
}

/** Fenced ```tsx blocks of a doc body: the examples the checker typechecks. */
export function tsxExamples(body: string): string[] {
  return [...body.matchAll(/^```tsx\n([\s\S]*?)^```$/gm)].map((m) => m[1]!);
}
