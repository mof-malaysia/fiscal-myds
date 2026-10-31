import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const REACT_SRC = path.join(ROOT, "../react/src");
const TIERS = ["core", "marketing"];

/** First existing file of `dirs/<file>`, or null. */
const find = (dirs, file) =>
  dirs.map((dir) => path.join(dir, file)).find((p) => fs.existsSync(p)) ??
  null;

/**
 * A Vite plugin that resolves the import paths an Astro project gets from
 * `shadcn add` (`@/components/ui/button.astro`, `@/components/blocks/hero.astro`,
 * `@/components/ui/icons/chevron-right.astro`, `@/lib/ftds/utils`,
 * `@/lib/ftds/i18n`) to the source in this repo. Utils are shared with
 * packages/react; variants come from `@mof-malaysia/ftds-style/variants/*`.
 */
export function ftdsAstroPaths() {
  return {
    name: "ftds-astro-paths",
    enforce: "pre",
    resolveId(id) {
      if (!id.startsWith("@/")) return null;
      if (id === "@/lib/ftds/utils")
        return path.join(REACT_SRC, "utils/index.ts");
      if (id === "@/lib/ftds/i18n") return path.join(SRC, "i18n/index.ts");
      const icon = id.match(/^@\/components\/ui\/icons\/(.+\.astro)$/);
      if (icon) return find([path.join(SRC, "icons")], icon[1]);
      const item = id.match(/^@\/components\/(?:ui|blocks)\/(.+\.astro)$/);
      if (item)
        return find(
          TIERS.map((tier) => path.join(SRC, "components", tier)),
          item[1],
        );
      return null;
    },
  };
}
