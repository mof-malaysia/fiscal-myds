import path from "path";
import {
  readFileContent,
  registryItemRef,
  writeRegistry,
  REGISTRY_DIR,
  type RegistryComponent,
} from "./utils";

/**
 * Generate style registry components
 * Converts CSS files from packages/style into shadcn registry format
 */

const STYLE_SOURCE_DIR = path.join(__dirname, "../../packages/style/styles");
const REGISTRY_OUTPUT_DIR = path.join(REGISTRY_DIR, "style");

function log(message: string) {
  console.log(`🎨 ${message}`);
}

/**
 * Generate colors component - base color variables
 */
function generateColorsComponent(): RegistryComponent {
  log("Generating colors component...");

  const content = readFileContent(
    path.join(STYLE_SOURCE_DIR, "theme/color.css"),
  );

  return {
    name: "colors",
    type: "components:style",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "app/globals.css",
        content: `/* FTDS Base Colors */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate theme-light component - light mode semantic tokens
 */
function generateThemeLightComponent(): RegistryComponent {
  log("Generating theme-light component...");

  const content = readFileContent(
    path.join(STYLE_SOURCE_DIR, "theme/light.css"),
  );

  return {
    name: "theme-light",
    type: "components:style",
    dependencies: [],
    registryDependencies: ["colors"],
    files: [
      {
        path: "app/globals.css",
        content: `/* FTDS Light Theme */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate theme-dark component - dark mode semantic tokens
 */
function generateThemeDarkComponent(): RegistryComponent {
  log("Generating theme-dark component...");

  const content = readFileContent(
    path.join(STYLE_SOURCE_DIR, "theme/dark.css"),
  );

  return {
    name: "theme-dark",
    type: "components:style",
    dependencies: [],
    registryDependencies: ["colors"],
    files: [
      {
        path: "app/globals.css",
        content: `/* FTDS Dark Theme */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate theme-config component - Tailwind v4 @theme configuration
 */
function generateThemeConfigComponent(): RegistryComponent {
  log("Generating theme-config component...");

  const content = readFileContent(
    path.join(STYLE_SOURCE_DIR, "tailwind.config.css"),
  );

  return {
    name: "theme-config",
    type: "components:style",
    dependencies: [],
    registryDependencies: ["colors", "theme-light", "theme-dark"],
    files: [
      {
        path: "app/globals.css",
        content: `/* FTDS Theme Configuration */\n${content}`,
        type: "components:style",
      },
    ],
  };
}

/**
 * Return the block starting at `header` up to its matching closing brace.
 */
function extractCssBlock(css: string, header: string): string {
  const start = css.indexOf(header);
  if (start === -1)
    throw new Error(`"${header}" not found in input.tailwind.css`);

  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error(`Unclosed "${header}" block in input.tailwind.css`);
}

/**
 * Generate base-styles component - base CSS layers and utilities
 */
function generateBaseStylesComponent(): RegistryComponent {
  log("Generating base-styles component...");

  const fullContent = readFileContent(
    path.join(STYLE_SOURCE_DIR, "input.tailwind.css"),
  );

  // Extract only the @layer base and @layer utilities blocks.
  // The Google Fonts @import is left out: an @import url() must come before
  // all other rules, so projects add it at the top of their global CSS.
  const layerBase = extractCssBlock(fullContent, "@layer base");
  const layerUtilities = extractCssBlock(fullContent, "@layer utilities");

  const content = `/* FTDS Base Styles */
${layerBase}

${layerUtilities}`;

  return {
    name: "base-styles",
    type: "components:style",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "app/globals.css",
        content,
        type: "components:style",
      },
    ],
  };
}

/**
 * Generate ftds-init component - convenience component that installs everything
 */
function generateFTDSInitComponent(
  colors: RegistryComponent,
  themeLight: RegistryComponent,
  themeDark: RegistryComponent,
  themeConfig: RegistryComponent,
  baseStyles: RegistryComponent,
): RegistryComponent {
  log("Generating ftds-init component...");

  // Combine all content in the correct order
  // Imported from the project's global CSS, after @import "tailwindcss"
  const combinedContent = [
    colors,
    themeLight,
    themeDark,
    themeConfig,
    baseStyles,
  ]
    .map((component) => component.files[0]!.content)
    .join("\n\n");

  return {
    name: "ftds-init",
    type: "components:style",
    // Components use tw-animate-css classes (animate-in, fade-in-0, ...)
    dependencies: ["tw-animate-css@^1.4.0"],
    // Self-contained: combinedContent already includes every style item
    registryDependencies: [],
    files: [
      {
        path: "styles/ftds.css",
        content: combinedContent,
        type: "components:style",
      },
    ],
  };
}

/**
 * Convert a style item to a shadcn `registry:file` item. Each item writes its
 * own CSS file at the project root (`~/`), so installing several never
 * overwrites another; ftds-init writes the combined styles/ftds.css.
 */
function toRegistryFileItem(component: RegistryComponent) {
  const filePath =
    component.name === "ftds-init"
      ? "styles/ftds.css"
      : `styles/ftds/${component.name}.css`;

  component.type = "registry:file";
  component.registryDependencies =
    component.registryDependencies.map(registryItemRef);
  component.files = component.files.map((file) => ({
    ...file,
    path: filePath,
    type: "registry:file",
    target: `~/${filePath}`,
  }));
}

/**
 * Main function to generate all style components
 */
async function main() {
  console.log("🎨 Generating Style Registry Components\n");
  console.log("=".repeat(60) + "\n");

  // Generate individual components
  const colors = generateColorsComponent();
  const themeLight = generateThemeLightComponent();
  const themeDark = generateThemeDarkComponent();
  const themeConfig = generateThemeConfigComponent();
  const baseStyles = generateBaseStylesComponent();
  const ftdsInit = generateFTDSInitComponent(
    colors,
    themeLight,
    themeDark,
    themeConfig,
    baseStyles,
  );

  // Write all components to registry
  const components = [
    colors,
    themeLight,
    themeDark,
    themeConfig,
    baseStyles,
    ftdsInit,
  ];

  for (const component of components) {
    toRegistryFileItem(component);
    log(`✓ Generated ${component.name}`);
  }
  writeRegistry("style", components);
  log(`Output: ${REGISTRY_OUTPUT_DIR}`);

  console.log("\n" + "=".repeat(60));
  console.log(`✨ Style Registry Generation Complete!`);
  console.log(`Generated ${components.length} style components`);
  console.log("=".repeat(60) + "\n");
}

main().catch((error) => {
  console.error("❌ Generation failed:", error);
  process.exit(1);
});
