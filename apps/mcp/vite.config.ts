import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ftdsPaths } from "../../packages/react/paths.mjs";

/**
 * Builds the preview page (src/view) into one self-contained file,
 * dist/view.html: chat hosts load MCP App views without external scripts.
 */

const appDir = path.dirname(fileURLToPath(import.meta.url));
/** The Worker serves the Inter font to the preview from public/fonts. */
function copyFont(): Plugin {
  return {
    name: "copy-font",
    buildStart() {
      const file = "inter-latin-wght-normal.woff2";
      const from = path.join(
        appDir,
        "node_modules/@fontsource-variable/inter/files",
        file,
      );
      fs.mkdirSync(path.join(appDir, "public/fonts"), { recursive: true });
      fs.copyFileSync(from, path.join(appDir, "public/fonts", file));
    },
  };
}

export default defineConfig({
  root: path.join(appDir, "src/view"),
  publicDir: false,
  plugins: [ftdsPaths(), react(), viteSingleFile(), copyFont()],
  build: {
    outDir: path.join(appDir, "dist"),
    emptyOutDir: false,
    rollupOptions: { input: path.join(appDir, "src/view/view.html") },
  },
});
