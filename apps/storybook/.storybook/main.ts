import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  staticDirs: ["../stories/assets"],

  addons: [
    // "storybook-tailwind-dark-mode",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-queryparams",
    "storybook-addon-deep-controls",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
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
