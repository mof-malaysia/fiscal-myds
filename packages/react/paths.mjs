import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "src");
const TIERS = ["core", "app", "marketing"];

/**
 * A Vite plugin that resolves the import paths a project gets from
 * `shadcn add` (`@/components/ui/button`, `@/components/ui/icons/copy`,
 * `@/components/blocks/hero`, `@/lib/ftds/utils`) to this package's source.
 * Docs examples and playground screens import FTDS the way a project does.
 */
export function ftdsPaths() {
  return {
    name: "ftds-paths",
    enforce: "pre",
    resolveId(id) {
      if (id === "@/lib/ftds/utils") return path.join(SRC, "utils/index.ts");
      if (id === "@/lib/ftds/hooks") return path.join(SRC, "hooks/index.ts");
      const icon = id.match(/^@\/components\/ui\/icons\/(.+)$/);
      if (icon) return path.join(SRC, "icons", `${icon[1]}.tsx`);
      const item = id.match(/^@\/components\/(?:ui|blocks)\/(.+)$/);
      if (!item) return null;
      for (const tier of TIERS) {
        const file = path.join(SRC, "components", tier, `${item[1]}.tsx`);
        if (fs.existsSync(file)) return file;
      }
      return null;
    },
  };
}
