import { Config } from "tailwindcss";
import { preset } from "@mof-malaysia/myds-style";

const config: Config = {
  content: [
    "./stories/**/*.{ts,tsx,js,jsx}",
    "../../packages/react/src/**/*.{ts,tsx}",
  ],
  presets: [preset],
};

export default config;
