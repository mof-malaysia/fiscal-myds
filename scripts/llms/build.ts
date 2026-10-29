import fs from "fs";
import path from "path";
import { readExports, type ExportInfo, type PropInfo } from "./api";
import {
  CATEGORIES,
  DEFAULT_SITE_URL,
  INTRO_FILE,
  ROOT_DIR,
  readGuides,
  readItems,
  readRegistry,
  readDoc,
  rel,
  currentTag,
  siteUrl,
  tsxExamples,
  type Item,
} from "./content";
import { REGISTRY_REPO } from "../registry/utils";

/**
 * Build the documentation coding agents read (https://llmstxt.org):
 *
 *   llms.txt                 index: what FTDS is, the rules, a link per page
 *   llms-full.txt            every page below in one file
 *   components/<name>.md     one per component, block, utils and hooks
 *   guides/<slug>.md         setup, conventions, styling, forms, layouts
 *   icons.md                 every icon item and its export
 *
 * Each component page joins the hand-written doc next to its source (what it
 * is for, examples, notes) with what the code says: exports, the props the
 * component declares with their exact types, dependencies and install paths.
 *
 * Usage: tsx scripts/llms/build.ts [--out deploy] [--site <url>] [--version v2.1.0] [--allow-missing]
 */

const args = process.argv.slice(2);
const arg = (name: string) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? undefined : args[index + 1];
};

const OUT_DIR = path.resolve(ROOT_DIR, arg("out") ?? "deploy");
const SITE_URL = siteUrl(arg("site"));
const VERSION = arg("version") ?? currentTag() ?? "main";
const ALLOW_MISSING = args.includes("--allow-missing");

const isRelease = /^v\d+\.\d+\.\d+/.test(VERSION);
const pageUrl = (page: string) => `${SITE_URL}/${page}`;
const rawUrl = (file: string) =>
  `https://raw.githubusercontent.com/${REGISTRY_REPO}/${VERSION}/${file}`;

function write(file: string, content: string) {
  const target = path.join(OUT_DIR, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  // Hand-written docs link to the default site; point them at the one being built
  const text = content.replaceAll(`${DEFAULT_SITE_URL}/`, `${SITE_URL}/`);
  fs.writeFileSync(target, text.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
}

// ---------------------------------------------------------------------------
// Component pages

const code = (text: string) => `\`${text}\``;
const shorten = (text: string, max = 120) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;
const firstSentence = (text: string) => {
  const sentence = text.match(/^.*?[.!?](\s|$)/)?.[0]?.trim() ?? text;
  return sentence.replace(/[.!?]$/, "");
};
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

function installLines(name: string): string[] {
  const github = `${REGISTRY_REPO}/${name}${isRelease ? `#${VERSION}` : ""}`;
  return [
    `- **Install:** ${code(`npx shadcn@latest add @ftds/${name}`)}, or from GitHub ${code(`npx shadcn@latest add ${github}`)}`,
  ];
}

function depName(dep: string) {
  return dep.replace(`${REGISTRY_REPO}/`, "").replace(/#.*$/, "");
}

function propsTable(props: PropInfo[]): string {
  if (!props.length) return "";
  const rows = props.map(
    (p) =>
      `| ${code(p.name)}${p.required ? " (required)" : ""} | ${code(cell(p.type))} | ${p.defaultValue ? code(cell(p.defaultValue)) : ""} | ${cell(p.description)} |`,
  );
  return [
    "| Prop | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function apiSection(exports: ExportInfo[]): string {
  const parts: string[] = ["## API"];
  for (const e of exports.filter((e) => e.kind === "component")) {
    if (e.kind !== "component") continue;
    parts.push(`### ${code(e.name)}`);
    if (e.description) parts.push(e.description);
    parts.push(propsTable(e.props) || "No props of its own.");
    if (e.baseUiProps.length) {
      parts.push(
        `Base UI props it passes through:\n\n${e.baseUiProps
          .map(
            (p) =>
              `- ${code(p.name)}${p.required ? " (required)" : ""}: ${code(shorten(p.type))}${p.description ? `. ${firstSentence(p.description)}` : ""}`,
          )
          .join("\n")}`,
      );
    }
    if (e.domPropCount > 0) {
      parts.push(
        "Also accepts the standard props of the element it renders (`className`, `id`, event handlers, `aria-*` and so on).",
      );
    }
  }
  const functions = exports.filter((e) => e.kind === "function");
  if (functions.length) {
    parts.push("### Functions and hooks");
    for (const f of functions) {
      if (f.kind !== "function") continue;
      parts.push(
        `- ${code(`${f.name}${f.signature}`)}${f.description ? `: ${f.description}` : ""}`,
      );
    }
  }
  const values = exports.filter((e) => e.kind === "value");
  if (values.length) {
    parts.push(
      `### Other exports\n\n${values.map((v) => code(v.name)).join(", ")}${values.some((v) => /_(cva|class)$/.test(v.name)) ? "\n\nNames ending in `_cva` or `_class` build the component's class names, for styling your own element to match." : ""}`,
    );
  }
  const types = exports.filter((e) => e.kind === "type");
  if (types.length) {
    parts.push(`### Types\n\n${types.map((t) => code(t.name)).join(", ")}`);
  }
  return parts.join("\n\n");
}

function componentPage(item: Item, exports: ExportInfo[]): string {
  const { entry, doc } = item;
  const valueNames = exports
    .filter((e) => e.kind !== "type")
    .map((e) => e.name);
  const registryDeps = entry.registryDependencies.map(depName);
  const npmDeps = entry.dependencies;

  const facts = [
    ...installLines(entry.name),
    `- **Import:** ${code(`import { ${valueNames.join(", ")} } from "${item.importPath}";`)}`,
    `- **Installs to:** ${code(item.installPath)} (${entry.registry} tier, ${code(entry.type)})`,
  ];
  if (registryDeps.length || npmDeps.length) {
    const brings = [
      registryDeps.length
        ? `FTDS items ${registryDeps.map(code).join(", ")}`
        : "",
      npmDeps.length ? `npm ${npmDeps.map(code).join(", ")}` : "",
    ].filter(Boolean);
    facts.push(`- **Also installs:** ${brings.join("; ")}`);
  }

  return [
    `# ${doc!.title}`,
    `> ${doc!.description}`,
    facts.join("\n"),
    doc!.body,
    apiSection(exports),
  ].join("\n\n");
}

// ---------------------------------------------------------------------------
// Icons

function iconsPage(): string {
  const icons = readRegistry().filter((entry) => entry.registry === "icons");
  const rows = icons.map((entry) => {
    const file = path.join(ROOT_DIR, "registry/icons", entry.files[0]!.path);
    const names = [
      ...fs.readFileSync(file, "utf-8").matchAll(/export const (\w+)/g),
    ].map((m) => m[1]!);
    const importPath = `@/${entry.files[0]!.path.replace(/\.tsx$/, "")}`;
    return `| ${code(entry.name)} | ${names.map(code).join(", ")} | ${code(importPath)} |`;
  });
  return [
    "# Icons",
    `> All ${icons.length} FTDS icons. Each is its own registry item, named \`icon-<name>\`, and installs one React component to \`components/ui/icons/<name>.tsx\`.`,
    [
      "Install with `npx shadcn@latest add @ftds/icon-<name>`. Components that use an icon bring it in automatically.",
      "",
      "```tsx",
      'import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";',
      "",
      "export function Example() {",
      '  return <ChevronDownIcon className="size-5" aria-hidden />;',
      "}",
      "```",
      "",
      "Icons render an `<svg>` and accept SVG props. Size them with `size-*` classes; they take the text colour (`currentColor`). Decorative icons need `aria-hidden`; an icon that is the only content of a button needs an `aria-label` on the button.",
    ].join("\n"),
    ["| Item | Export | Import |", "| --- | --- | --- |", ...rows].join("\n"),
  ].join("\n\n");
}

// ---------------------------------------------------------------------------

function main() {
  const items = readItems();
  const missing = items.filter((item) => !item.doc);
  if (missing.length && !ALLOW_MISSING) {
    console.error(
      `❌ ${missing.length} items have no doc:\n${missing.map((m) => `   ${rel(m.docFile)}`).join("\n")}`,
    );
    process.exit(1);
  }
  const problems: string[] = [];
  for (const item of items) {
    if (!item.doc) continue;
    const isBlock = item.entry.type === "registry:block";
    if (!isBlock && !item.doc.category)
      problems.push(`${rel(item.docFile)}: needs a category`);
    if (item.doc.description.length > 200) {
      problems.push(`${rel(item.docFile)}: description over 200 characters`);
    }
    if (!tsxExamples(item.doc.body).length) {
      problems.push(
        `${rel(item.docFile)}: needs at least one \`\`\`tsx example`,
      );
    }
  }
  // Every `PascalCase` name in the docs must be a real export, so docs can't
  // send agents after components or parts that don't exist.
  const exportsByItem = new Map(
    items.map((item) => [item, readExports(item.sourceFile)]),
  );
  const exportNames = new Set(
    [...exportsByItem.values()].flat().map((e) => e.name),
  );
  // React and DOM types, JS globals and key names docs mention legitimately
  const notExports = new Set(
    [
      "ReactNode ReactElement FormData FormEvent MouseEvent KeyboardEvent HTMLElement",
      "Date Record Partial Promise Intl JSON Math URL Error",
      "Enter Escape Esc Tab Space Shift Home End Backspace Delete PageUp PageDown",
      "ArrowUp ArrowDown ArrowLeft ArrowRight",
    ]
      .join(" ")
      .split(" "),
  );
  const checkNames = (file: string, text: string) => {
    for (const match of text.matchAll(/`([A-Z][A-Za-z0-9]+)`/g)) {
      const name = match[1]!;
      if (
        !exportNames.has(name) &&
        !notExports.has(name) &&
        !/^[A-Z0-9]+$/.test(name)
      ) {
        problems.push(`${rel(file)}: \`${name}\` is not an FTDS export`);
      }
    }
  };
  for (const item of items)
    if (item.doc) checkNames(item.docFile, item.doc.body);
  for (const guide of readGuides()) checkNames(guide.file, guide.body);
  checkNames(INTRO_FILE, readDoc(INTRO_FILE).body);

  if (problems.length) {
    console.error(
      `❌ Doc problems:\n${problems.map((p) => `   ${p}`).join("\n")}`,
    );
    process.exit(1);
  }

  const documented = items.filter((item) => item.doc);
  const guides = readGuides();
  const intro = readDoc(INTRO_FILE);

  for (const dir of ["components", "guides"]) {
    fs.rmSync(path.join(OUT_DIR, dir), { recursive: true, force: true });
  }

  const pages: string[] = [];
  for (const guide of guides) {
    const page = [
      `# ${guide.title}`,
      `> ${guide.description}`,
      guide.body,
    ].join("\n\n");
    write(`guides/${guide.slug}.md`, page);
    pages.push(page);
  }
  for (const item of documented) {
    const page = componentPage(item, exportsByItem.get(item)!);
    write(`components/${item.entry.name}.md`, page);
    pages.push(page);
  }
  const icons = iconsPage();
  write("icons.md", icons);
  pages.push(icons);

  // llms.txt
  const link = (title: string, page: string, description: string) =>
    `- [${title}](${pageUrl(page)}): ${description}`;
  const iconCount = readRegistry().filter((e) => e.registry === "icons").length;
  const summary = `> FiscalTech Design System (FTDS) is the Ministry of Finance Malaysia's design system for government services: ${documented.length} React components, blocks and helpers, ${iconCount} icons and Tailwind CSS v4 styles, distributed as a shadcn registry and built on Base UI. This file documents ${isRelease ? `release ${VERSION}` : `the unreleased ${VERSION} branch`}.`;

  const sections: string[] = [];
  sections.push(
    `## Guides\n\n${guides.map((g) => link(g.title, `guides/${g.slug}.md`, g.description)).join("\n")}`,
  );
  for (const category of CATEGORIES) {
    const inCategory = documented.filter(
      (item) =>
        item.entry.type !== "registry:block" && item.doc!.category === category,
    );
    if (!inCategory.length) continue;
    sections.push(
      `## ${category}\n\n${inCategory
        .map((item) =>
          link(
            item.doc!.title,
            `components/${item.entry.name}.md`,
            item.doc!.description,
          ),
        )
        .join("\n")}`,
    );
  }
  for (const [registry, heading] of [
    ["app", "Blocks: service screens"],
    ["marketing", "Blocks: marketing pages"],
  ] as const) {
    const blocks = documented.filter(
      (item) =>
        item.entry.type === "registry:block" &&
        item.entry.registry === registry,
    );
    if (!blocks.length) continue;
    sections.push(
      `## ${heading}\n\n${blocks
        .map((item) =>
          link(
            item.doc!.title,
            `components/${item.entry.name}.md`,
            item.doc!.description,
          ),
        )
        .join("\n")}`,
    );
  }
  sections.push(
    `## Icons\n\n${link("Icon catalogue", "icons.md", `All ${iconCount} icons with their item names, exports and import paths.`)}`,
  );
  sections.push(
    [
      "## Optional",
      "",
      `- [Everything in one file](${pageUrl("llms-full.txt")}): every guide, component page and the icon catalogue, for loading into context at once.`,
      `- [Design principles](${rawUrl("DESIGN.md")}): the full design system rationale: palette, type scale, elevation and per-component rules.`,
      `- [Product context](${rawUrl("PRODUCT.md")}): who FTDS serves and the tone it aims for.`,
      `- [Registry catalog](${pageUrl(`r/${isRelease ? VERSION : "latest"}/registry.json`)}): machine-readable list of every registry item.`,
      `- [Storybook](${pageUrl("storybook/")}): interactive examples of every component (HTML).`,
    ].join("\n"),
  );

  const llms = ["# FTDS", summary, intro.body, ...sections].join("\n\n");
  write("llms.txt", llms);
  write(
    "llms-full.txt",
    ["# FTDS: complete documentation", summary, intro.body, ...pages].join(
      "\n\n---\n\n",
    ),
  );

  const size = (file: string) =>
    `${Math.round(fs.statSync(path.join(OUT_DIR, file)).size / 1024)} KB`;
  console.log(
    `📄 llms.txt (${size("llms.txt")}), llms-full.txt (${size("llms-full.txt")}), ${documented.length} component pages, ${guides.length} guides, icons.md -> ${path.relative(ROOT_DIR, OUT_DIR) || "."} (${VERSION})`,
  );
  if (missing.length)
    console.warn(`⚠️  ${missing.length} items have no doc yet`);
}

main();
