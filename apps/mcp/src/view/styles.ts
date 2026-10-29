import { compile } from "tailwindcss";
import tailwindCss from "tailwindcss/index.css?raw";
import animateCss from "../../node_modules/tw-animate-css/dist/tw-animate.css?raw";
import colorCss from "@mof-malaysia/ftds-style/color.css?raw";
import lightCss from "@mof-malaysia/ftds-style/light.css?raw";
import darkCss from "@mof-malaysia/ftds-style/dark.css?raw";
import themeCss from "@mof-malaysia/ftds-style/theme.css?raw";

/**
 * Tailwind, compiled in the page. Screens are written on the fly, so their
 * classes can't be known at build time: like Tailwind's browser build, this
 * watches every class attribute in the document and builds CSS for new ones.
 *
 * The input is the docs site's stylesheet (FTDS colours, both themes,
 * Tailwind, tw-animate-css, the FTDS theme), with one change: breakpoints are
 * container queries on the preview frame, so `md:` responds to the frame's
 * width (mobile, tablet, desktop) rather than the chat's.
 */

const SHEETS: Record<string, string> = {
  "ftds/color.css": colorCss,
  "ftds/light.css": lightCss,
  "ftds/dark.css": darkCss,
  "ftds/theme.css": themeCss,
  tailwindcss: tailwindCss,
  "tw-animate-css": animateCss,
};

/** Name of the container the preview frame establishes. */
export const FRAME_CONTAINER = "ftds-frame";

const BREAKPOINTS = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
};

const INPUT = `
@import "ftds/color.css";
@import "ftds/light.css";
@import "ftds/dark.css";
@import "tailwindcss";
@import "tw-animate-css";
@import "ftds/theme.css";

@custom-variant dark (&:where(.dark, .dark *));
${Object.entries(BREAKPOINTS)
  .map(
    ([name, width]) =>
      `@custom-variant ${name} (@container ${FRAME_CONTAINER} (width >= ${width}));\n` +
      `@custom-variant max-${name} (@container ${FRAME_CONTAINER} (width < ${width}));`,
  )
  .join("\n")}

@theme inline {
  --font-body: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  html {
    background: rgb(var(--bg-gray-50));
    color: rgb(var(--txt-black-900));
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
}
`;

export async function startStyles(origin: string | undefined): Promise<void> {
  if (origin) {
    // Served by the Worker; chat hosts allow it through the resource's CSP
    addStyle(`@font-face {
  font-family: "Inter Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(${origin}/fonts/inter-latin-wght-normal.woff2) format("woff2-variations");
}`);
  }

  const compiler = await compile(INPUT, {
    base: "/",
    loadStylesheet: async (id, base) => {
      const content = SHEETS[id];
      if (content === undefined) throw new Error(`Unknown stylesheet ${id}`);
      return { path: id, base, content };
    },
  });

  const style = addStyle("");
  const seen = new Set<string>();

  const collect = (element: Element, fresh: string[]) => {
    const value = element.getAttribute("class");
    if (!value) return;
    for (const name of value.split(/\s+/)) {
      if (name && !seen.has(name)) {
        seen.add(name);
        fresh.push(name);
      }
    }
  };

  const build = (fresh: string[]) => {
    if (fresh.length) style.textContent = compiler.build(fresh);
  };
  const scan = (root: Element, fresh: string[]) => {
    collect(root, fresh);
    root.querySelectorAll("[class]").forEach((el) => collect(el, fresh));
  };

  const initial: string[] = [];
  scan(document.documentElement, initial);
  build(initial);
  // Callbacks run as microtasks, before the browser paints the new nodes
  new MutationObserver((records) => {
    const fresh: string[] = [];
    for (const record of records) {
      // A class change only adds that element's classes; new nodes bring subtrees
      if (record.type === "attributes")
        collect(record.target as Element, fresh);
      record.addedNodes.forEach((node) => {
        if (node instanceof Element) scan(node, fresh);
      });
    }
    build(fresh);
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"],
  });
}

function addStyle(css: string): HTMLStyleElement {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
  return style;
}
