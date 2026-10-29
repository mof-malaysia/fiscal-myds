import { transform } from "sucrase";

/**
 * Checks a screen before it renders. The model never sees the preview, so
 * everything it can get wrong in code comes back to it as text:
 *
 * - errors stop the render: the code doesn't compile, imports something FTDS
 *   doesn't have, or has no default export;
 * - warnings render anyway: the screen breaks a design rule from DESIGN.md.
 *
 * The checks run in the Worker; the preview only uses `compile`.
 */

export interface Problem {
  severity: "error" | "warning";
  message: string;
  line?: number;
  rule?: string;
}

/** Import specifier → the names it exports, e.g. `@/components/ui/button` → `Button`, `ButtonIcon`. */
export type ModuleExports = Record<string, string[]>;

/** Modules a screen may import besides FTDS. Any name is allowed from these. */
const EXTERNAL = new Set(["react"]);

export function checkScreen(code: string, modules: ModuleExports): Problem[] {
  const problems: Problem[] = [];
  checkImports(code, modules, problems);

  if (!/^\s*export\s+default\b/m.test(code)) {
    problems.push({
      severity: "error",
      message:
        "The screen needs a default export: `export default function Screen() { … }`.",
    });
  }

  try {
    compile(code);
  } catch (error) {
    problems.push({
      severity: "error",
      message: `Doesn't compile: ${(error as Error).message}`,
      line: lineFromSucrase(error as Error),
    });
  }

  problems.push(...checkRules(code));
  return problems;
}

/** The FTDS modules a screen imports, in order, without checking anything else. */
export function screenImports(code: string, modules: ModuleExports): string[] {
  return checkImports(code, modules, []);
}

/** TSX → CommonJS with the automatic JSX runtime (`require("react/jsx-runtime")`). */
export function compile(code: string): string {
  return transform(code, {
    transforms: ["typescript", "jsx", "imports"],
    jsxRuntime: "automatic",
    production: true,
    filePath: "screen.tsx",
  }).code;
}

function lineFromSucrase(error: Error): number | undefined {
  const match = error.message.match(/\((\d+):\d+\)/);
  return match ? Number(match[1]) : undefined;
}

const lineAt = (code: string, index: number) =>
  code.slice(0, index).split("\n").length;

function checkImports(
  code: string,
  modules: ModuleExports,
  problems: Problem[],
): string[] {
  const used: string[] = [];
  const statement =
    /^\s*import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']/gm;

  for (const match of code.matchAll(statement)) {
    const [, typeOnly, clause, source] = match;
    const line = lineAt(code, match.index!);
    if (EXTERNAL.has(source!)) continue;

    const exported = modules[source!];
    if (!exported) {
      problems.push({
        severity: "error",
        line,
        message: `Can't import "${source}". ${suggestModule(source!, modules)}`,
      });
      continue;
    }
    used.push(source!);
    if (typeOnly) continue;

    const { defaultName, named } = parseClause(clause!);
    if (defaultName) {
      problems.push({
        severity: "error",
        line,
        message: `"${source}" has no default export. Use a named import: import { ${exported[0]} } from "${source}".`,
      });
    }
    for (const name of named) {
      if (!exported.includes(name)) {
        problems.push({
          severity: "error",
          line,
          message: `"${source}" doesn't export ${name}. It exports: ${exported.join(", ")}.`,
        });
      }
    }
  }

  for (const match of code.matchAll(/^\s*import\s+["']([^"']+)["']/gm)) {
    problems.push({
      severity: "error",
      line: lineAt(code, match.index!),
      message: `Remove import "${match[1]}": FTDS styles are already loaded and screens can't import files.`,
    });
  }
  return [...new Set(used)];
}

function parseClause(clause: string): {
  defaultName?: string;
  named: string[];
} {
  if (/^\*\s+as\s+/.test(clause.trim())) return { named: [] };
  const braces = clause.match(/\{([\s\S]*)\}/);
  const named = braces
    ? braces[1]!
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part && !part.startsWith("type "))
        .map((part) => part.split(/\s+as\s+/)[0]!.trim())
    : [];
  const head = clause
    .replace(/\{[\s\S]*\}/, "")
    .replace(/,/g, "")
    .trim();
  return {
    defaultName: head && !head.startsWith("*") ? head : undefined,
    named,
  };
}

function suggestModule(source: string, modules: ModuleExports): string {
  const close = closest(source, Object.keys(modules));
  if (close.length)
    return `Did you mean ${close.map((c) => `"${c}"`).join(" or ")}?`;
  return "Only react and FTDS modules (@/components/ui/*, @/components/ui/icons/*, @/components/blocks/*, @/lib/ftds/*) are available; call list_components to see them.";
}

/** Up to three candidates whose last path segment is a near-miss of `name`'s. */
export function closest(name: string, candidates: string[]): string[] {
  const last = (value: string) => value.split("/").pop() ?? value;
  const target = last(name);
  const limit = Math.max(1, Math.floor(target.length / 4));
  return candidates
    .map((candidate) => ({
      candidate,
      distance: editDistance(target, last(candidate)),
    }))
    .filter(({ distance }) => distance <= limit)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j]! + 1,
        current[j - 1]! + 1,
        previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length]!;
}

/** Tailwind's own colour names. FTDS screens use tokens (bg-bg-*, text-txt-*, border-otl-*) instead. */
const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|primary|danger|success|warning";
const COLOUR_UTILITY =
  "bg|text|border|border-[trblxy]|ring|outline|fill|stroke|divide|from|via|to|decoration|accent|caret|placeholder";

/** Design rules from DESIGN.md that can be checked in code. Each pattern runs per line. */
const RULES: { rule: string; pattern: RegExp; message: string }[] = [
  {
    rule: "tokens",
    pattern: new RegExp(
      `(?<![\\w-])(?:[\\w-]+:)*(?:${COLOUR_UTILITY})-(?:${PALETTE})-\\d{2,3}(?![\\w-])`,
    ),
    message:
      "Raw palette colour. Use FTDS tokens, which switch with dark mode: bg-bg-*, text-txt-*, border-otl-* (e.g. bg-bg-primary-600, text-txt-black-700, bg-bg-washed).",
  },
  {
    rule: "tokens",
    pattern: new RegExp(
      `(?<![\\w-])(?:${COLOUR_UTILITY})-\\[(?:#|rgb|hsl|oklch|color)`,
    ),
    message: "Arbitrary colour value. Use an FTDS token instead.",
  },
  {
    rule: "tokens",
    pattern:
      /(?:color|background|backgroundColor|borderColor)\s*:\s*["'`](?:#|rgb|hsl)/,
    message: "Inline colour style. Use an FTDS token class instead.",
  },
  {
    rule: "no-gradients",
    pattern: /(?<![\w-])bg-(?:gradient|linear|radial|conic)-/,
    message:
      "Gradient. FTDS uses flat tone (Paper, Sheet, Well), never gradients.",
  },
  {
    rule: "weights",
    pattern:
      /(?<![\w-])font-(?:thin|extralight|light|bold|extrabold|black)(?![\w-])/,
    message:
      "Font weight outside 400, 500 and 600. Use font-normal, font-medium or font-semibold.",
  },
  {
    rule: "no-side-stripes",
    pattern: /(?<![\w-])border-[ls]-(?:[2-9]|\[)/,
    message:
      "Coloured side stripe. Use a wash background and an icon (e.g. Callout) instead.",
  },
  {
    rule: "flat",
    pattern: /(?<![\w-])shadow(?:-(?:sm|md|lg|xl|2xl))?(?![\w-])/,
    message:
      "Shadow on a static element. Only floating layers (menus, dialogs, popovers) have shadows; separate with tone and spacing.",
  },
  {
    rule: "use-components",
    pattern: /<(button|input|select|textarea|table)[\s>/]/,
    message:
      "Hand-built control. Use the FTDS component (Button, Input, Select, Textarea, Table or DataTable) so it gets the right states, density and accessibility.",
  },
];

export function checkRules(code: string): Problem[] {
  const problems: Problem[] = [];
  code.split("\n").forEach((text, index) => {
    if (/^\s*import\s/.test(text)) return;
    for (const { rule, pattern, message } of RULES) {
      const match = text.match(pattern);
      if (match) {
        problems.push({
          severity: "warning",
          rule,
          line: index + 1,
          message: `${message} Found: ${match[0].trim()}`,
        });
      }
    }
  });
  return problems;
}

/** Problems as the text the model reads. */
export function formatProblems(problems: Problem[]): string {
  return problems
    .map(
      (p) =>
        `- ${p.severity === "error" ? "Error" : "Warning"}${p.line ? ` (line ${p.line})` : ""}: ${p.message}`,
    )
    .join("\n");
}
