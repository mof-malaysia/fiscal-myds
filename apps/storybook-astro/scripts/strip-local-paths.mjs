import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Remove this machine's paths from the static build before it is published.
 * Astro compiles stories in dev mode, which annotates every element with
 * data-astro-source-file/-loc (absolute paths), and the framework keys
 * components by absolute moduleId. Annotations are dropped; the repo root is
 * replaced with "/ftds" everywhere, so moduleIds stay consistent between the
 * story bundles and astro-prerendered-stories.json.
 */
const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const REPO_ROOT = path.resolve(DIST, "../../..");

const ANNOTATION = /\s?data-astro-source-(?:file|loc)=(?:\\"[^"\\]*\\"|"[^"]*")/g;

let changed = 0;
for (const file of fs.readdirSync(DIST, { recursive: true, withFileTypes: true })) {
  if (!file.isFile() || !/\.(?:js|json|html|css|map)$/.test(file.name)) continue;
  const filePath = path.join(file.parentPath, file.name);
  const before = fs.readFileSync(filePath, "utf-8");
  const after = before.replace(ANNOTATION, "").replaceAll(REPO_ROOT, "/ftds");
  if (after !== before) {
    fs.writeFileSync(filePath, after);
    changed++;
  }
}

const leaks = fs
  .readdirSync(DIST, { recursive: true, withFileTypes: true })
  .filter((file) => file.isFile())
  .filter((file) =>
    fs.readFileSync(path.join(file.parentPath, file.name), "utf-8").includes(REPO_ROOT),
  );
if (leaks.length) {
  throw new Error(`Local paths left in: ${leaks.map((f) => f.name).join(", ")}`);
}
console.log(`Stripped local paths from ${changed} files`);
