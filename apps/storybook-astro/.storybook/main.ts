import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { ftdsAstroPaths } from "../../../packages/astro/paths.mjs";

/**
 * Storybook for the FTDS Astro components (@storybook-astro/framework). The
 * React Storybook (apps/storybook) shows it in its sidebar through
 * composition, so this one is deployed next to it at /storybook-astro.
 *
 * Stories are pre-rendered at build time, so Controls don't change an Astro
 * story on the published site: give each variant its own story.
 */
const config = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  framework: {
    name: "@storybook-astro/framework",
    options: {},
  },
  viteFinal: async (config: Record<string, any>) => ({
    ...config,
    base: process.env.BASE_PATH || "/",
    plugins: [...(config.plugins ?? []), ftdsAstroPaths(), tailwindcss()],
  }),
};
export default config;

// Resolve addons to absolute paths so they load correctly in the pnpm monorepo.
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
