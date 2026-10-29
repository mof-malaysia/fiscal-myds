import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

/**
 * Resolves MYDS colour tokens (`--bg-primary-600`) to hex for the light and
 * dark themes, read from the style package at build time so the docs can't
 * drift from the CSS.
 */
const require = createRequire(import.meta.url);
const read = (name: string) =>
  readFileSync(require.resolve(`@mof-malaysia/ftds-style/${name}`), "utf8");

function declarations(css: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const [, name, value] of css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

let cache:
  | {
      primitives: Map<string, string>;
      light: Map<string, string>;
      dark: Map<string, string>;
    }
  | undefined;

function load() {
  cache ??= {
    primitives: declarations(read("color.css")),
    light: declarations(read("light.css")),
    dark: declarations(read("dark.css")),
  };
  return cache;
}

function toHex(rgb: string): string | undefined {
  const parts = rgb.split(/\s+/).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return undefined;
  return `#${parts
    .slice(0, 3)
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

/** `var(--_primary-600) / 0.4` → `{ hex, alpha }` */
function resolve(value: string | undefined, primitives: Map<string, string>) {
  const match = value?.match(/var\((--_[\w-]+)\)(?:\s*\/\s*([\d.]+))?/);
  if (!match) return undefined;
  const hex = toHex(primitives.get(match[1]) ?? "");
  if (!hex) return undefined;
  return { hex, alpha: match[2] ? Number(match[2]) : 1 };
}

export interface ResolvedColor {
  hex: string;
  alpha: number;
}

export function resolveColor(token: string): {
  light?: ResolvedColor;
  dark?: ResolvedColor;
} {
  const { primitives, light, dark } = load();
  return {
    light: resolve(light.get(token), primitives),
    dark: resolve(dark.get(token) ?? light.get(token), primitives),
  };
}
