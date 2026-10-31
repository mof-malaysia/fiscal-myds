import fs from "fs";
import path from "path";

/**
 * Convert packages/react/src/svg/icons/*.svg into React components in
 * packages/react/src/icons (plus the icons barrel, index.ts) and Astro
 * components in packages/astro/src/icons. Both output directories are wiped
 * first, so edit the SVGs, not the generated files.
 */

const REACT_DIR = path.join(__dirname, "../../packages/react/src");
const SVG_DIR = path.join(REACT_DIR, "svg/icons");
const ICONS_DIR = path.join(REACT_DIR, "icons");
const ASTRO_ICONS_DIR = path.join(__dirname, "../../packages/astro/src/icons");

// Agency and file-type acronyms stay upper case in the component name
const ACRONYMS = new Set([
  "spr",
  "moh",
  "moe",
  "mcmc",
  "mers",
  "pdn",
  "bnm",
  "jpj",
  "mof",
  "dosm",
  "bomba",
  "jps",
  "jpa",
  "icu",
  "jpm",
  "jpn",
  "jakoa",
  "mampu",
  "ipr",
  "epu",
  "epf",
  "kwap",
  "lhdn",
  "pdrm",
  "ntrc",
  "socso",
  "mot",
  "met",
  "unhcr",
  "perkeso",
  "rss",
  "pdf",
]);

// Published names that predate the acronym rule; changing them would break imports
const NAME_OVERRIDES: Record<string, string> = { pdf: "Pdf" };

const toPascalCase = (name: string) =>
  NAME_OVERRIDES[name] ??
  name
    .split("-")
    .map((word) =>
      ACRONYMS.has(word)
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("")
    .replace("Legacy", "");

const camelCase = (name: string) =>
  name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());

// `style="mask-type:alpha"` becomes `style={{ maskType: "alpha" }}`
const toStyleObject = (css: string) => {
  const entries = css
    .split(";")
    .map((rule) => rule.split(":").map((part) => part.trim()))
    .filter(([prop, value]) => prop && value)
    .map(([prop, value]) => `${camelCase(prop!)}: "${value}"`);
  return `{{ ${entries.join(", ")} }}`;
};

const toReactAttrs = (svg: string) =>
  svg
    .replace(
      `xmlns="http://www.w3.org/2000/svg"`,
      `xmlns="http://www.w3.org/2000/svg" {...props}`,
    )
    // Hyphenated SVG attributes are camelCase in JSX; aria-* and data-* stay as they are
    .replace(/\s((?!aria-|data-)[a-z]+(?:-[a-z]+)+)=/g, (match, attr: string) =>
      match.replace(attr, camelCase(attr)),
    )
    .replace(
      /style="([^"]*)"/g,
      (_, css: string) => `style=${toStyleObject(css)}`,
    )
    .replaceAll(`fill="#18181B"`, `fill="currentColor"`)
    .replaceAll(`stroke="#18181B"`, `stroke="currentColor"`);

const iconTemplate = (name: string, svg: string) => `import React from "react";
import { FunctionComponent, SVGProps } from "react";

/**
* ${name} Icon
* @param className
* @returns ${name}Icon
*/
export const ${name}Icon: FunctionComponent<SVGProps<SVGSVGElement>> = (props) => {
    return ${toReactAttrs(svg)}
}`;

// Astro passes attributes through as written, so only the colour changes
const astroIconTemplate = (name: string, svg: string) => `---
import type { HTMLAttributes } from "astro/types";

/** ${name} icon. Props go to the <svg>, e.g. class="size-5". */
type Props = HTMLAttributes<"svg">;
---

${svg
  .trim()
  .replace(
    `xmlns="http://www.w3.org/2000/svg"`,
    `xmlns="http://www.w3.org/2000/svg" {...Astro.props}`,
  )
  .replaceAll(`fill="#18181B"`, `fill="currentColor"`)
  .replaceAll(`stroke="#18181B"`, `stroke="currentColor"`)}
`;

const svgFiles = fs
  .readdirSync(SVG_DIR)
  .filter((file) => path.extname(file) === ".svg");

fs.rmSync(ICONS_DIR, { recursive: true, force: true });
fs.mkdirSync(ICONS_DIR);
fs.rmSync(ASTRO_ICONS_DIR, { recursive: true, force: true });
fs.mkdirSync(ASTRO_ICONS_DIR, { recursive: true });

for (const file of svgFiles) {
  const name = path.basename(file, ".svg");
  const svg = fs.readFileSync(path.join(SVG_DIR, file), "utf-8");
  fs.writeFileSync(
    path.join(ICONS_DIR, `${name}.tsx`),
    iconTemplate(toPascalCase(name), svg),
    "utf-8",
  );
  fs.writeFileSync(
    path.join(ASTRO_ICONS_DIR, `${name}.astro`),
    astroIconTemplate(toPascalCase(name), svg),
    "utf-8",
  );
}

const barrel = svgFiles
  .map((file) => `export * from './${path.basename(file, ".svg")}';`)
  .join("\n");
fs.writeFileSync(path.join(ICONS_DIR, "index.ts"), barrel);

console.log(`✅ Converted ${svgFiles.length} icons (React and Astro)`);
