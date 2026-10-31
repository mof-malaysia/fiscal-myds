import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

/** The Astro Storybook's dev server (apps/storybook-astro `pnpm dev`). */
const ASTRO_DEV_URL = "http://localhost:6008";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  staticDirs: ["../stories/assets"],

  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-queryparams"),
    getAbsolutePath("storybook-addon-deep-controls"),
    getAbsolutePath("@storybook/addon-a11y"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  // FTDS for Astro, composed into this sidebar (apps/storybook-astro). Deployed
  // next to this Storybook, so the built ref is relative and survives any
  // base path or custom domain.
  refs: (_config: unknown, { configType }: { configType?: string }) => ({
    astro: {
      title: "FTDS for Astro",
      url: configType === "DEVELOPMENT" ? ASTRO_DEV_URL : "../storybook-astro",
    },
  }),

  // Storybook checks a ref once at startup; if the Astro Storybook isn't up
  // yet (it boots slower), the browser then fetches it with credentials,
  // which its `Access-Control-Allow-Origin: *` rejects. The ref needs no
  // credentials, so in dev they're dropped for it, whichever server starts
  // first. A built Storybook serves both from one origin.
  managerHead: (head: string, { configType }: { configType?: string }) =>
    configType === "DEVELOPMENT"
      ? `${head}
<script>
  (() => {
    const fetch = window.fetch.bind(window);
    window.fetch = (input, init) =>
      String(input instanceof Request ? input.url : input).startsWith("${ASTRO_DEV_URL}/")
        ? fetch(input, { ...init, credentials: "omit" })
        : fetch(input, init);
  })();
</script>`
      : head,
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: "automatic",
        },
      },
    },
  }),
  viteFinal: async (config) => {
    // Configure base path for GitHub Pages deployment
    // Can be overridden with BASE_PATH environment variable
    const basePath = process.env.BASE_PATH || "/";

    return {
      ...config,
      base: basePath,
    };
  },
};
export default config;

// Resolve addons to absolute paths so they load correctly in the pnpm monorepo.
function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
