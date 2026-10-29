import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { ftdsPaths } from "../../packages/react/paths.mjs";

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
    // Examples import FTDS the way a project that ran `shadcn add` does, so
    // the Code tab shows code people can paste
    plugins: [ftdsPaths(), tailwindcss()],
  },
});
