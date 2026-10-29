import { test } from "node:test";
import assert from "node:assert/strict";
import { checkRules, checkScreen, compile, screenImports } from "./check";
import { decodeScreen, encodeScreen, type Screen } from "./screen";

const modules = {
  "@/components/ui/button": ["Button", "ButtonIcon", "ButtonProps"],
  "@/components/ui/icons/check": ["CheckIcon"],
};

const errors = (code: string) =>
  checkScreen(code, modules).filter((p) => p.severity === "error");

test("a valid screen passes and compiles to CommonJS", () => {
  const code = `import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
export default function Screen() {
  const [n, setN] = useState<number>(0);
  return <Button onClick={() => setN(n + 1)}>{n}</Button>;
}`;
  assert.deepEqual(checkScreen(code, modules), []);
  assert.deepEqual(screenImports(code, modules), ["@/components/ui/button"]);
  const js = compile(code);
  assert.match(js, /require\(["']@\/components\/ui\/button["']\)/);
  assert.match(js, /require\("react\/jsx-runtime"\)/);
});

test("unknown modules and names are errors with a hint", () => {
  const [unknown] = errors(
    `import { Button } from "@/components/ui/buton";\nexport default () => null;`,
  );
  assert.match(unknown!.message, /Did you mean "@\/components\/ui\/button"/);
  assert.equal(unknown!.line, 1);

  const [name] = errors(
    `import { Buton } from "@/components/ui/button";\nexport default () => null;`,
  );
  assert.match(name!.message, /doesn't export Buton. It exports: Button/);
});

test("default imports, other packages and CSS imports are errors", () => {
  assert.equal(
    errors(
      `import Button from "@/components/ui/button";\nexport default () => null;`,
    ).length,
    1,
  );
  assert.equal(
    errors(`import { Check } from "lucide-react";\nexport default () => null;`)
      .length,
    1,
  );
  assert.equal(
    errors(`import "./styles.css";\nexport default () => null;`).length,
    1,
  );
});

test("a screen needs a default export and must compile", () => {
  assert.match(
    errors(`export function Screen() { return null; }`)[0]!.message,
    /default export/,
  );
  const [syntax] = errors(
    `export default function Screen() {\n  return <div>;\n}`,
  );
  assert.match(syntax!.message, /Doesn't compile/);
  assert.equal(syntax!.line, 2);
});

test("design rules warn on raw colours, weights, shadows and hand-built controls", () => {
  const rules = (line: string) => checkRules(line).map((p) => p.rule);
  assert.deepEqual(rules(`<div className="bg-blue-600 hover:text-gray-500">`), [
    "tokens",
  ]);
  assert.deepEqual(rules(`<div className="bg-[#2563eb]">`), ["tokens"]);
  assert.deepEqual(rules(`<p className="font-bold">`), ["weights"]);
  assert.deepEqual(rules(`<div className="rounded shadow-lg">`), ["flat"]);
  assert.deepEqual(rules(`<button onClick={go}>`), ["use-components"]);
  assert.deepEqual(rules(`<div className="border-l-4">`), ["no-side-stripes"]);
  // FTDS tokens are fine
  assert.deepEqual(
    rules(
      `<div className="bg-bg-primary-600 text-txt-black-700 border-otl-gray-200 font-semibold">`,
    ),
    [],
  );
});

test("a screen survives the share link round trip", () => {
  const screen: Screen = {
    v: "v2.1.0",
    title: "Permohonan geran",
    code: "export default () => <p>RM 1,250.00 — ✓</p>;",
    theme: "dark",
    viewport: "mobile",
  };
  const fragment = encodeScreen(screen);
  assert.match(fragment, /^[\w+\-$]+$/);
  assert.deepEqual(decodeScreen(`#${fragment}`), screen);
  assert.equal(decodeScreen("#not-a-screen"), undefined);
});
