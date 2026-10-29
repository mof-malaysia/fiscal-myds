import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const reactSrc = fileURLToPath(
  new URL("../../packages/react/src/", import.meta.url),
);
const tiers = ["core", "app", "marketing"];

/**
 * Examples import components the way a project that ran `shadcn add` does
 * (`@/components/ui/button`, `@/components/ui/icons/copy`), so the Code tab
 * shows code people can paste. This resolves those paths to the package source.
 */
function registryPaths() {
  return {
    name: "ftds-registry-paths",
    enforce: "pre",
    resolveId(id) {
      const match = id.match(/^@\/components\/ui\/(.+)$/);
      if (!match) return null;
      const name = match[1];
      if (name.startsWith("icons/")) {
        return `${reactSrc}icons/${name.slice("icons/".length)}.tsx`;
      }
      for (const tier of tiers) {
        const file = `${reactSrc}components/${tier}/${name}.tsx`;
        if (existsSync(file)) return file;
      }
      return null;
    },
  };
}

/**
 * Where the site is served. The Pages workflow sets FTDS_SITE_URL (by default
 * https://mof-malaysia.github.io/ftds), which gives `base: "/ftds"`; without it
 * the site builds for the root, as `astro dev` expects.
 */
const siteUrl = new URL(process.env.FTDS_SITE_URL || "http://localhost:4321");

export default defineConfig({
  site: siteUrl.origin,
  base: siteUrl.pathname,
  trailingSlash: "ignore",
  integrations: [react(), mdx()],
  markdown: {
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark-dimmed" },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [registryPaths(), tailwindcss()],
  },
});
