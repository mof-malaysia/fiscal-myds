# MYDS Component Registry

This document describes the MYDS shadcn-compatible component registry structure and how to use it.

## Overview

MYDS now supports a **shadcn-compatible registry** system that allows users to copy component source code directly into their projects instead of installing them as npm packages. This gives users full ownership and control over the components.

## Registry Structure

```
/registry/
├── index.json              # Master component list with metadata
├── schema.json             # JSON schema for validation
└── styles/
    └── default/            # Component definitions
        ├── utils.json      # Utility functions
        ├── hooks.json      # Custom React hooks
        ├── button.json     # Button component
        ├── accordion.json  # Accordion component
        └── ...             # All other components (42 total)
```

## Available Components

### Statistics
- **Total Components**: 42
- **UI Components**: 36
- **Layout Components**: 4
- **Utilities**: 2

### Component List

**UI Components:**
- accordion, alert-dialog, breadcrumb, button, calendar, callout, checkbox
- cookie-banner, data-table, date-field, date-picker, daterange-picker
- dialog, dropdown, input-otp, input, label, link, pagination, pill
- popover, radio, search-bar, select, sheet, skiplink, spinner
- summary-list, table, tabs, tag, textarea, theme-switch, toast
- toggle, tooltip

**Layout Components:**
- announce-bar, footer, masthead, navbar

**Utilities:**
- utils (clx utility function)
- hooks (custom React hooks)

## How to Use

### For Users (Installing Components)

#### 1. Initialize shadcn in your project

```bash
npx shadcn@latest init
```

#### 2. Configure your `components.json`

Add the MYDS registry URL to your configuration:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registry": "https://your-registry-url/registry"
}
```

For local testing, use:
```json
{
  "registry": "file:///absolute/path/to/myds/registry"
}
```

#### 3. Install the MYDS style package

The components rely on MYDS CSS variables and styles:

```bash
npm install @mof-malaysia/myds-style
# or
pnpm add @mof-malaysia/myds-style
```

#### 4. Import MYDS styles in your global CSS

```css
@import "@mof-malaysia/myds-style/color.css";
@import "@mof-malaysia/myds-style/light.css";
@import "@mof-malaysia/myds-style/dark.css";
```

#### 5. Add components to your project

```bash
# Using shadcn CLI with MYDS registry
npx shadcn@latest add button --registry=https://your-registry-url/registry

# For local testing
npx shadcn@latest add button --registry=file:///$(pwd)/registry
```

This will:
- Copy the component source code to your project
- Install npm dependencies (@radix-ui packages, etc.)
- Install registry dependencies (utils, hooks, etc.)

#### 6. Use the component

```tsx
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <Button variant="primary-fill" size="medium">
      Click me
    </Button>
  )
}
```

### Component Dependencies

Components have two types of dependencies:

#### npm Dependencies
External packages that will be installed via npm/pnpm/yarn:
- `@radix-ui/*` - Primitive components
- `class-variance-authority` - Variant management
- `clsx` - Classname utility
- `tailwind-merge` - Tailwind class merging
- `react-day-picker` - Date picker
- `@tanstack/react-table` - Data table

#### Registry Dependencies
Other MYDS components from the registry:
- `utils` - Utility functions (clx)
- `hooks` - Custom React hooks
- Other UI components (e.g., button, dropdown, etc.)

The shadcn CLI automatically installs all dependencies when you add a component.

## For Maintainers (Building the Registry)

### Prerequisites

- Node.js 18+
- pnpm 9+
- tsx (installed as dev dependency)

### Build Commands

```bash
# Generate registry JSON files for all components
pnpm registry:generate

# Build complete registry (generate + index.json)
pnpm registry:build

# Clean registry files
pnpm registry:clean
```

### Build Process

The registry build process consists of two main steps:

#### 1. Generate Component JSON Files

The generator (`scripts/registry/generate.ts`) processes each component:
- Reads source files from `packages/react/src/components/`
- Extracts npm dependencies from import statements
- Identifies registry dependencies (utils, hooks, other components)
- Transforms relative imports to alias-based imports:
  - `"../utils"` → `"@/lib/utils"`
  - `"../icons/chevron-down"` → `"@/components/ui/icons/chevron-down"`
- Generates JSON file for each component in `registry/styles/default/`

#### 2. Build Index

The build script (`scripts/registry/build.ts`):
- Runs the generator
- Collects all component JSON files
- Creates master `index.json` with component metadata
- Generates `schema.json` for validation

### Registry File Format

Each component JSON file follows this structure:

```json
{
  "name": "button",
  "type": "components:ui",
  "dependencies": [
    "@radix-ui/react-slot",
    "class-variance-authority"
  ],
  "registryDependencies": [
    "utils"
  ],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "content": "...source code...",
      "type": "components:ui"
    }
  ],
  "tailwind": {
    "config": {
      "theme": {
        "extend": {}
      }
    }
  }
}
```

### Component Types

- `components:ui` - UI components (buttons, inputs, etc.)
- `components:layout` - Layout components (navbar, footer, etc.)
- `components:lib` - Utilities and hooks

## Testing Locally

### 1. Build the registry

```bash
pnpm registry:build
```

### 2. Create a test project

```bash
mkdir test-myds-registry
cd test-myds-registry
npm create next-app@latest .
```

### 3. Configure for local registry

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registry": "file:///absolute/path/to/myds/registry"
}
```

### 4. Install MYDS styles

```bash
pnpm add @mof-malaysia/myds-style
```

### 5. Import styles in `app/globals.css`

```css
@import "@mof-malaysia/myds-style/color.css";
@import "@mof-malaysia/myds-style/light.css";
@import "@mof-malaysia/myds-style/dark.css";

@import "tailwindcss";
```

### 6. Add a component

```bash
npx shadcn@latest add button
```

### 7. Test the component

Create a test page and verify:
- Component files are copied correctly
- Dependencies are installed
- Imports resolve properly
- TypeScript compiles
- Styles apply correctly
- Component renders and functions as expected

## Dependency Graph

Some components depend on other components from the registry:

```
button → utils
accordion → utils, icons
navbar → button, dropdown, theme-switch, utils
dropdown → button, popover, utils
alert-dialog → dialog, icons, utils
data-table → utils, icons (pagination, sorting, etc.)
```

The shadcn CLI automatically resolves and installs these dependencies.

## Key Differences from npm Package

| Aspect | npm Package | Registry |
|--------|-------------|----------|
| **Installation** | `npm install @mof-malaysia/myds-react` | `npx shadcn add button` |
| **Location** | `node_modules/` | `components/ui/` in your project |
| **Ownership** | External dependency | Full ownership in your codebase |
| **Customization** | Fork or wrapper required | Direct modification |
| **Updates** | `npm update` (overwrites) | Re-add and review diff |
| **Bundle Size** | Entire package | Only components you use |
| **Type Safety** | Package types | TypeScript in your project |

## Troubleshooting

### Component not found

If you get "component not found" errors:
1. Verify registry URL is correct in `components.json`
2. Check that `index.json` exists in the registry
3. Ensure the component name matches exactly

### Import errors

If imports don't resolve:
1. Check that aliases are configured in `components.json`
2. Verify `tsconfig.json` has correct path mappings:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

### Missing styles

If components don't look correct:
1. Ensure `@mof-malaysia/myds-style` is installed
2. Verify CSS imports in your global CSS file
3. Check that Tailwind is configured properly

### Dependency issues

If npm dependencies aren't installing:
1. Check your package manager (npm/pnpm/yarn)
2. Clear cache and reinstall: `rm -rf node_modules && pnpm install`
3. Verify internet connection for package registry

## Future Enhancements

- [ ] Add versioning support for registry
- [ ] Create visual component browser
- [ ] Add migration scripts from npm to registry
- [ ] Support multiple style variants
- [ ] Add automated testing for registry
- [ ] Create CI/CD pipeline for automatic deployment
- [ ] Add component usage analytics

## Support

For issues or questions:
- File an issue on GitHub
- Check the documentation at your docs site
- Join the community discussions

---

**Registry Version**: 2.0.0
**Last Updated**: 2025-11-19
