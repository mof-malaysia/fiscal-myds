import fs from "fs";
import path from "path";

/**
 * Utility functions for registry generation
 */

export interface ComponentFile {
  path: string;
  content: string;
  type: string;
  target?: string;
}

export interface RegistryComponent {
  $schema?: string;
  name: string;
  type: string;
  dependencies: string[];
  registryDependencies: string[];
  files: ComponentFile[];
  tailwind?: {
    config?: Record<string, any>;
  };
}

/**
 * Read file content and return as string
 */
export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

/**
 * Get all TypeScript/TSX files in a directory
 */
export function getComponentFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
      ) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

/**
 * Extract import statements from source code
 */
export function extractImports(content: string): {
  npmDependencies: Set<string>;
  localDependencies: Set<string>;
} {
  const npmDependencies = new Set<string>();
  const localDependencies = new Set<string>();

  // Match import statements
  const importRegex =
    /import\s+(?:(?:\*\s+as\s+\w+)|(?:\{[^}]+\})|(?:\w+))\s+from\s+["']([^"']+)["']/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];

    // Skip React and type imports
    if (importPath === "react" || importPath === "react-dom") {
      continue;
    }

    // Check if it's a local import (starts with . or /)
    if (importPath.startsWith(".") || importPath.startsWith("/")) {
      // Extract component name from path
      const parts = importPath.split("/");
      const fileName = parts[parts.length - 1];
      // Remove file extension if present
      const componentName = fileName.replace(/\.(tsx?|jsx?)$/, "");
      localDependencies.add(componentName);
    } else {
      // It's an npm package
      // Handle scoped packages (@base-ui/react/dialog -> @base-ui/react)
      if (importPath.startsWith("@")) {
        const parts = importPath.split("/");
        const packageName = `${parts[0]}/${parts[1]}`;
        npmDependencies.add(packageName);
      } else {
        // Regular package
        const packageName = importPath.split("/")[0];
        npmDependencies.add(packageName);
      }
    }
  }

  return { npmDependencies, localDependencies };
}

/**
 * Base URL the registries are served from. Override with MYDS_REGISTRY_URL
 * (e.g. http://localhost:8080/registry) to test against a local build.
 */
export const REGISTRY_BASE_URL = (
  process.env.MYDS_REGISTRY_URL ||
  "https://mof-malaysia.github.io/fiscal-myds/registry"
).replace(/\/$/, "");

export const REGISTRY_ITEM_SCHEMA =
  "https://ui.shadcn.com/schema/registry-item.json";

/**
 * Full URL of a registry item, e.g. registryItemUrl("ui", "button").
 * shadcn resolves bare names against its own registry, so cross-item
 * dependencies must be full URLs.
 */
export function registryItemUrl(
  registry: "ui" | "icons" | "style",
  name: string
): string {
  return `${REGISTRY_BASE_URL}/${registry}/styles/default/${name}.json`;
}

/**
 * Map of icon export name -> icon file name, e.g. ChevronDownIcon -> chevron-down
 */
export function getIconExportMap(iconsDir: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const file of fs.readdirSync(iconsDir)) {
    if (!file.endsWith(".tsx")) continue;
    const content = fs.readFileSync(path.join(iconsDir, file), "utf-8");
    for (const match of content.matchAll(/export const (\w+)/g)) {
      map.set(match[1], file.replace(/\.tsx$/, ""));
    }
  }
  return map;
}

/**
 * Split barrel imports (`import { A, B } from "../icons"`) into one import
 * per icon file, since the icons registry has no barrel file.
 */
export function expandIconBarrelImports(
  content: string,
  iconMap: Map<string, string>
): string {
  return content.replace(
    /import\s*\{([^}]+)\}\s*from\s*["']\.\.\/icons["'];?/g,
    (_, names: string) =>
      names
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean)
        .map((n) => {
          const file = iconMap.get(n.split(/\s+as\s+/)[0]);
          if (!file) throw new Error(`Unknown icon in barrel import: ${n}`);
          return `import { ${n} } from "../icons/${file}";`;
        })
        .join("\n")
  );
}

/**
 * Transform relative imports to the alias paths the files are installed at.
 * MYDS helpers live under lib/myds/ so they don't overwrite shadcn's lib/utils.ts.
 */
export function transformImports(
  content: string,
  { keepSameFolderImports = false } = {}
): string {
  const rewrites: [RegExp, string][] = [
    // "../utils/events" -> "@/lib/myds/utils/events", "../utils" -> "@/lib/myds/utils"
    [/from\s+["']\.\.\/utils(\/[^"']+)?["']/g, 'from "@/lib/myds/utils$1"'],
    // "../hooks", "../hooks/use-theme" -> "@/lib/myds/hooks..."
    [/from\s+["']\.\.\/hooks(\/[^"']+)?["']/g, 'from "@/lib/myds/hooks$1"'],
    // "../icons/chevron-down" -> "@/components/ui/icons/chevron-down"
    [/from\s+["']\.\.\/icons\/([^"']+)["']/g, 'from "@/components/ui/icons/$1"'],
    // "../components/toast" (from hooks/utils) -> "@/components/ui/toast"
    [/from\s+["']\.\.\/components\/([^"']+)["']/g, 'from "@/components/ui/$1"'],
  ];

  // Same-folder component imports: "./button" -> "@/components/ui/button".
  // Files that ship together in one folder (hooks) keep relative imports.
  if (!keepSameFolderImports) {
    rewrites.push([/from\s+["']\.\/([^"']+)["']/g, 'from "@/components/ui/$1"']);
  }

  return rewrites.reduce(
    (acc, [pattern, replacement]) =>
      acc.replace(pattern, (...args) =>
        replacement.replace("$1", args[1] ?? "")
      ),
    content
  );
}

/**
 * Map a relative import in a component file to the registry item URL that
 * provides it, or null if it isn't a registry item.
 */
export function mapToRegistryDependency(importPath: string): string | null {
  if (importPath === "../utils") return registryItemUrl("ui", "utils");
  if (importPath.startsWith("../hooks")) return registryItemUrl("ui", "hooks");
  if (importPath.startsWith("../icons/"))
    return registryItemUrl("icons", importPath.slice("../icons/".length));
  if (importPath.startsWith("./"))
    return registryItemUrl("ui", importPath.slice(2));
  return null;
}

/**
 * Get component name from file path
 */
export function getComponentName(filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  return fileName;
}

/**
 * Write JSON file with formatting
 */
export function writeJsonFile(filePath: string, data: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Determine component type based on file location or name
 */
export function getComponentType(componentName: string): string {
  const layoutComponents = ["navbar", "footer", "masthead", "announce-bar"];
  const utilityComponents = ["utils", "hooks"];

  if (utilityComponents.includes(componentName)) {
    return "components:lib";
  }

  if (layoutComponents.includes(componentName)) {
    return "components:layout";
  }

  return "components:ui";
}

/**
 * Get registry file path for component
 */
export function getRegistryPath(componentName: string, type: string): string {
  if (type === "components:lib") {
    return `lib/${componentName}.ts`;
  }

  if (componentName.startsWith("icon")) {
    return `components/ui/icons/${componentName}.tsx`;
  }

  return `components/ui/${componentName}.tsx`;
}
