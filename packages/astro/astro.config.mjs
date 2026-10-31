import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { ftdsAstroPaths } from "./paths.mjs";

/**
 * The package's own Astro project, only for `astro check` and the preview
 * page at src/pages/index.astro. Components ship through the registry.
 */
export default defineConfig({
  i18n: { locales: ["ms", "en"], defaultLocale: "ms" },
  vite: { plugins: [ftdsAstroPaths(), tailwindcss()] },
});
