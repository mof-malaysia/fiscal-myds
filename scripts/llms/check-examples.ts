import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import {
  readGuides,
  readItems,
  rel,
  tsxExamples,
  ROOT_DIR,
  type Item,
} from "./content";

/**
 * Typecheck every ```tsx example in the component docs and guides against the
 * real source, with the import paths a project has after `shadcn add`
 * (@/components/ui/button, @/lib/ftds/utils, ...). Examples must be complete
 * modules: imports plus at least one exported component.
 *
 * Usage: tsx scripts/llms/check-examples.ts [--only button,field,guide-forms]
 */

const args = process.argv.slice(2);
const only = args.includes("--only")
  ? new Set(
      args[args.indexOf("--only") + 1]?.split(",").map((name) => name.trim()),
    )
  : undefined;
// One folder per run, so several checks can run at once
const CHECK_DIR = path.join(
  ROOT_DIR,
  "packages/react/.llms-check",
  String(process.pid),
);
const TSC = path.join(ROOT_DIR, "node_modules/.bin/tsc");

function pathsFor(items: Item[]): Record<string, string[]> {
  const fromCheckDir = (file: string) => path.relative(CHECK_DIR, file);
  const src = path.join(ROOT_DIR, "packages/react/src");
  const paths: Record<string, string[]> = {
    "@/components/ui/icons/*": [fromCheckDir(path.join(src, "icons/*"))],
    "@/lib/ftds/utils": [fromCheckDir(path.join(src, "utils/index.ts"))],
    "@/lib/ftds/utils/*": [fromCheckDir(path.join(src, "utils/*"))],
    "@/lib/ftds/hooks": [fromCheckDir(path.join(src, "hooks/index.ts"))],
    "@/lib/ftds/hooks/*": [fromCheckDir(path.join(src, "hooks/*"))],
  };
  for (const item of items) {
    if (item.importPath.startsWith("@/lib/")) continue;
    paths[item.importPath] = [fromCheckDir(item.sourceFile)];
  }
  return paths;
}

function main() {
  const items = readItems();
  const sources = [
    ...items.flatMap((item) =>
      item.doc ? [{ name: item.entry.name, doc: item.doc }] : [],
    ),
    ...readGuides().map((guide) => ({
      name: `guide-${guide.slug}`,
      doc: guide,
    })),
  ].filter(({ name }) => !only || only.has(name));

  fs.rmSync(CHECK_DIR, { recursive: true, force: true });
  fs.mkdirSync(path.join(CHECK_DIR, "examples"), { recursive: true });

  const origin = new Map<string, string>();
  let count = 0;
  for (const { name, doc } of sources) {
    tsxExamples(doc.body).forEach((code, index) => {
      const file = `examples/${name}--${index + 1}.tsx`;
      fs.writeFileSync(path.join(CHECK_DIR, file), code);
      origin.set(file, `${rel(doc.file)} (example ${index + 1})`);
      count++;
    });
  }

  fs.writeFileSync(
    path.join(CHECK_DIR, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          moduleResolution: "Bundler",
          moduleDetection: "force",
          jsx: "react-jsx",
          strict: true,
          noUncheckedIndexedAccess: true,
          isolatedModules: true,
          skipLibCheck: true,
          noEmit: true,
          paths: pathsFor(items),
        },
        include: ["examples"],
      },
      null,
      2,
    ),
  );

  try {
    execFileSync(TSC, ["-p", CHECK_DIR, "--pretty", "false"], {
      cwd: CHECK_DIR,
      encoding: "utf-8",
      stdio: "pipe",
    });
  } catch (error) {
    const output = String((error as { stdout?: string }).stdout ?? error);
    const errors = output
      .split("\n")
      .filter((line) => line.startsWith("examples/"))
      .map((line) => {
        // examples/button--1.tsx(3,10): error TS2305: ...
        const file = line.slice(0, line.indexOf("("));
        const location = line.slice(line.indexOf("("), line.indexOf(")") + 1);
        const message = line.slice(line.indexOf(":") + 1).trim();
        return `${origin.get(file) ?? file} ${location}: ${message}`;
      });
    console.error(errors.length ? errors.join("\n") : output);
    console.error(
      `\n❌ ${errors.length || "Some"} type errors in ${count} doc examples`,
    );
    process.exitCode = 1;
    return;
  } finally {
    fs.rmSync(CHECK_DIR, { recursive: true, force: true });
  }
  console.log(`✅ ${count} doc examples typecheck`);
}

main();
