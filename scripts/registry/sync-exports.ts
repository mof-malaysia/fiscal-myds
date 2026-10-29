import fs from "fs";
import path from "path";
import { listComponents } from "./utils";

/**
 * Regenerate packages/react/package.json "exports" from the component tiers.
 * Entry points stay flat (`@mof-malaysia/ftds-react/button`) whatever the tier.
 */

const PKG_DIR = path.join(__dirname, "../../packages/react");
const pkgPath = path.join(PKG_DIR, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const entry = (file: string) => ({ type: file, import: file, require: file });

const components = listComponents();
pkg.exports = {
  "./utils": entry("./src/utils/index.ts"),
  "./icon": entry("./src/icons/index.ts"),
  "./hooks": entry("./src/hooks/index.ts"),
  ...Object.fromEntries(
    components.map(({ name, filePath }) => [
      `./${name}`,
      entry(`./${path.relative(PKG_DIR, filePath)}`),
    ]),
  ),
};

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`Wrote ${components.length} component exports`);
