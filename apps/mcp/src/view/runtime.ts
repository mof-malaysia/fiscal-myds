import type { ComponentType } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as jsxRuntime from "react/jsx-runtime";
import * as utils from "@/lib/ftds/utils";
import * as hooks from "@/lib/ftds/hooks";
import { compile } from "../shared/check";

/**
 * Runs a screen's code against the real FTDS components.
 *
 * Every component, block and icon is bundled, under the import paths a
 * project gets from `shadcn add` (the same ones the docs examples use).
 * Components import each other through those paths too, so a screen and the
 * blocks it uses share one copy of every component.
 */

const components = import.meta.glob<Record<string, unknown>>(
  "../../../../packages/react/src/components/{core,app,marketing}/*.tsx",
  { eager: true },
);
const icons = import.meta.glob<Record<string, unknown>>(
  "../../../../packages/react/src/icons/*.tsx",
  { eager: true },
);

const fileName = (file: string) =>
  file
    .split("/")
    .pop()!
    .replace(/\.tsx$/, "");

const MODULES: Record<string, unknown> = {
  react: React,
  "react-dom": ReactDOM,
  "react/jsx-runtime": jsxRuntime,
  "@/lib/ftds/utils": utils,
  "@/lib/ftds/hooks": hooks,
};
for (const [file, module] of Object.entries(components)) {
  // Blocks and components share folders; accept either path for both
  MODULES[`@/components/ui/${fileName(file)}`] = module;
  MODULES[`@/components/blocks/${fileName(file)}`] = module;
}
for (const [file, module] of Object.entries(icons)) {
  MODULES[`@/components/ui/icons/${fileName(file)}`] = module;
}

function requireModule(name: string): unknown {
  const module = MODULES[name];
  if (!module)
    throw new Error(`Can't import "${name}": FTDS has no such module.`);
  return module;
}

type Factory = (
  require: (name: string) => unknown,
  module: { exports: Record<string, unknown> },
  exports: Record<string, unknown>,
) => void;

let runs = 0;

/**
 * Compile a screen and return its default export.
 *
 * Chat hosts forbid `eval` and `new Function` (their CSP allows only
 * 'unsafe-inline' scripts), so the compiled code runs as an inline script
 * that hands its module factory back to this page.
 */
export function runScreen(code: string): ComponentType {
  const js = compile(code);
  const id = `__ftdsScreen${++runs}`;
  const target = window as unknown as Record<string, unknown>;
  let exported: unknown;
  let thrown: unknown;

  target[id] = (factory: Factory) => {
    const module = { exports: {} as Record<string, unknown> };
    try {
      factory(requireModule, module, module.exports);
      exported = module.exports.default;
    } catch (error) {
      thrown = error;
    }
  };
  const onError = (event: ErrorEvent) => {
    thrown = event.error ?? new Error(event.message);
  };

  window.addEventListener("error", onError);
  const script = document.createElement("script");
  script.textContent = `window.${id}(function (require, module, exports) {\n${js}\n});`;
  document.head.append(script);
  script.remove();
  window.removeEventListener("error", onError);
  delete target[id];

  if (thrown) throw thrown;
  if (typeof exported !== "function" && typeof exported !== "object") {
    throw new Error("The screen's default export isn't a React component.");
  }
  return exported as ComponentType;
}

let frameWidth = 1280;

/** The preview frame's width, which width media queries answer for. */
export function setFrameWidth(width: number): void {
  frameWidth = width;
}

/**
 * Make width media queries in JS (FTDS's useMediaQuery, e.g. AppShell's
 * mobile layout) answer for the preview frame's width, not the window's, the
 * same way the CSS breakpoints do. Screens remount when the frame width
 * changes, so answering at call time is enough.
 */
export function emulateFrameWidth(): void {
  const native = window.matchMedia.bind(window);
  const toPx = (value: string, unit: string) =>
    Number(value) * (unit === "px" ? 1 : 16);

  window.matchMedia = (query: string): MediaQueryList => {
    const conditions = [
      ...query.matchAll(
        /\(\s*(min|max)-width\s*:\s*([\d.]+)(px|rem|em)\s*\)|\(\s*width\s*(>=|<=|>|<)\s*([\d.]+)(px|rem|em)\s*\)/g,
      ),
    ];
    if (!conditions.length || /,|\bnot\b|\bor\b/.test(query))
      return native(query);

    const width = frameWidth;
    const matches = conditions.every((c) => {
      if (c[1]) {
        const px = toPx(c[2]!, c[3]!);
        return c[1] === "min" ? width >= px : width <= px;
      }
      const px = toPx(c[5]!, c[6]!);
      return {
        ">=": width >= px,
        "<=": width <= px,
        ">": width > px,
        "<": width < px,
      }[c[4] as ">=" | "<=" | ">" | "<"];
    });
    // Not a real MediaQueryList: its methods throw when called on anything else
    return {
      matches,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}

/**
 * Portal containers (dialogs, menus, toasts) are appended to <body>, and the
 * preview moves them into the screen's frame. React still thinks they are
 * children of <body> and removes or inserts relative to them there; follow
 * them to where they actually are.
 */
export function followMovedPortals(): void {
  const { removeChild, insertBefore } = Node.prototype;
  const body = () => document.body;

  Node.prototype.removeChild = function <T extends Node>(
    this: Node,
    child: T,
  ): T {
    if (this === body() && child.parentNode && child.parentNode !== this) {
      return removeChild.call(child.parentNode, child) as T;
    }
    return removeChild.call(this, child) as T;
  };
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    node: T,
    child: Node | null,
  ): T {
    if (this === body() && child && child.parentNode !== this) {
      return insertBefore.call(this, node, null) as T;
    }
    return insertBefore.call(this, node, child) as T;
  };
}
