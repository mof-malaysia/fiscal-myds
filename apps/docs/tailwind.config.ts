import { createPreset, Preset } from "fumadocs-ui/tailwind-plugin";
import { Config } from "tailwindcss";
import { preset, preset_fumadocs } from "@mof-malaysia/myds-style";

const config: Config = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "./node_modules/fumadocs-ui/dist/**/*.js",
    // This is a workaround; In final build, @mof-malaysia/myds-style output full css for users to import
    // Issue: Styles are not being applied if below line is not added
    "../../packages/react/src/**/*.{ts,tsx}",
  ],
  presets: [
    createPreset({
      preset: preset_fumadocs,
      // layoutWidth: "1318px",
    }),
    preset,
  ],
  theme: {
    extend: {
      colors: {
        "txt-accent": "rgb(var(--txt-accent))",
      },
    },
  },
};

export default config;
