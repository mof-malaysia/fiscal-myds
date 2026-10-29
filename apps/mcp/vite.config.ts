import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * Builds the preview page (src/view) into one self-contained file,
 * dist/view.html: chat hosts load MCP App views without external scripts.
 */

const appDir = path.dirname(fileURLToPath(import.meta.url));
const reactSrc = path.join(appDir, "../../packages/react/src");
const tiers = ["core", "app", "marketing"];

/**
 * Screens and components import FTDS the way a project that ran `shadcn add`
 * does (`@/components/ui/button`, `@/components/blocks/hero`,
 * `@/lib/ftds/utils`). Resolve those paths to the package source, like the
 * docs site does.
 */
function ftdsPaths(): Plugin {
  return {
    name: "ftds-paths",
    enforce: "pre",
    resolveId(id) {
      if (id === "@/lib/ftds/utils")
        return path.join(reactSrc, "utils/index.ts");
      if (id === "@/lib/ftds/hooks")
        return path.join(reactSrc, "hooks/index.ts");
      const icon = id.match(/^@\/components\/ui\/icons\/(.+)$/);
      if (icon) return path.join(reactSrc, "icons", `${icon[1]}.tsx`);
      const item = id.match(/^@\/components\/(?:ui|blocks)\/(.+)$/);
      if (!item) return null;
      for (const tier of tiers) {
        const file = path.join(reactSrc, "components", tier, `${item[1]}.tsx`);
        if (fs.existsSync(file)) return file;
      }
      return null;
    },
  };
}

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
