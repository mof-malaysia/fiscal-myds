import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { readItems } from "../../../scripts/llms/content";
import { readExports } from "../../../scripts/llms/api";
import type { Catalogue } from "../src/shared/catalogue";

/**
 * Build the catalogue the MCP tools serve, from the same llms.txt build coding
 * agents read on the docs site (scripts/llms), so the two never disagree:
 *
 *   intro       llms.txt up to the guides: what FTDS is and the rules
 *   sections    the component index, by category
 *   pages       components/<name>.md for every component, block and helper
 *   guides      guides/<slug>.md
 *   icons       every icon and its export
 *   modules     import path → export names, read with the TypeScript checker,
 *               for checking a screen's imports
 *
 * Writes src/generated/catalogue.json, which the Worker bundles.
 *
 * Usage: tsx scripts/catalogue.cts   (FTDS_SITE_URL and FTDS_VERSION are optional)
 */

const APP_DIR = path.dirname(__dirname);
const ROOT_DIR = path.join(APP_DIR, "../..");
const LLMS_DIR = path.join(APP_DIR, ".catalogue");
const OUT_FILE = path.join(APP_DIR, "src/generated/catalogue.json");
const SITE_URL = (
  process.env.FTDS_SITE_URL || "https://mof-malaysia.github.io/ftds"
).replace(/\/$/, "");

function git(...args: string[]): string | undefined {
  try {
    return execFileSync("git", args, {
      cwd: ROOT_DIR,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return undefined;
  }
}

const version =
  process.env.FTDS_VERSION ||
  git("describe", "--tags", "--exact-match", "HEAD") ||
  "main";

execFileSync(
  "pnpm",
  [
    "exec",
    "tsx",
    "scripts/llms/build.ts",
    "--out",
    LLMS_DIR,
    "--site",
    SITE_URL,
    "--version",
    version,
  ],
  { cwd: ROOT_DIR, stdio: "inherit" },
);

const read = (file: string) =>
  fs.readFileSync(path.join(LLMS_DIR, file), "utf-8");

const index = read("llms.txt");
const intro = index.slice(0, index.indexOf("\n## ")).trim();

const sections: Catalogue["sections"] = [];
for (const line of index.split("\n")) {
  const heading = line.match(/^## (.+)$/);
  if (heading) {
    sections.push({ category: heading[1]!, items: [] });
    continue;
  }
  const item = line.match(
    /^- \[(.+?)\]\(.+?\/components\/([\w-]+)\.md\): (.*)$/,
  );
  if (item && sections.length) {
    sections.at(-1)!.items.push({
      name: item[2]!,
      title: item[1]!,
      description: item[3]!,
    });
  }
}

const pages: Catalogue["pages"] = {};
for (const file of fs.readdirSync(path.join(LLMS_DIR, "components"))) {
  pages[file.replace(/\.md$/, "")] = read(`components/${file}`);
}

const guides: Catalogue["guides"] = fs
  .readdirSync(path.join(LLMS_DIR, "guides"))
  .map((file) => {
    const body = read(`guides/${file}`);
    return {
      slug: file.replace(/\.md$/, ""),
      title: body.match(/^# (.+)$/m)?.[1] ?? file,
      body,
    };
  });

const icons: Catalogue["icons"] = [
  ...read("icons.md").matchAll(
    /^\| `icon-([\w-]+)` \| `(\w+)` \| `([^`]+)` \|$/gm,
  ),
].map(([, name, exported, importPath]) => ({
  name: name!,
  export: exported!,
  import: importPath!,
}));

const modules: Catalogue["modules"] = {};
for (const item of readItems()) {
  modules[item.importPath] = readExports(item.sourceFile).map((e) => e.name);
}
for (const icon of icons) modules[icon.import] = [icon.export];

const catalogue: Catalogue = {
  version,
  docsUrl: SITE_URL,
  intro,
  sections: sections.filter((s) => s.items.length),
  pages,
  guides,
  icons,
  modules,
};

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(catalogue));
console.log(
  `📦 catalogue ${version}: ${Object.keys(pages).length} pages, ${guides.length} guides, ${icons.length} icons, ${Object.keys(modules).length} modules -> ${path.relative(ROOT_DIR, OUT_FILE)}`,
);
