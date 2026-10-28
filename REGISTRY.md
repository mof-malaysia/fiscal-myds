# MYDS Component Registry

This document describes the MYDS shadcn-compatible component registry structure and how to use it.

## Overview

MYDS now supports a **shadcn-compatible registry** system that allows users to copy component source code directly into their projects instead of installing them as npm packages. This gives users full ownership and control over the components.

## Registry Structure

```
/registry/
├── index.json                    # Root index of the three registries
├── ui/
│   ├── index.json                # UI catalog
│   └── styles/default/*.json     # 40 components + utils + hooks
├── icons/
│   ├── index.json
│   └── styles/default/*.json     # One item per icon
└── style/
    ├── index.json
    └── styles/default/*.json     # myds-init + colors, theme-light, theme-dark, theme-config, base-styles
```

Items are fetched by full URL: `https://mof-malaysia.github.io/fiscal-myds/registry/<ui|icons|style>/styles/default/<name>.json`.

## Available Components

### Statistics
- **Total Components**: 42
- **UI Components**: 40
- **Utilities**: 2

### Component List

**UI Components:**
- announce-bar, footer, masthead, navbar
- accordion, alert-dialog, breadcrumb, button, calendar, callout, checkbox
- cookie-banner, data-table, date-field, date-picker, daterange-picker
- dialog, dropdown, input-otp, input, label, link, pagination, pill
- popover, radio, search-bar, select, sheet, skiplink, spinner
- summary-list, table, tabs, tag, textarea, theme-switch, toast
- toggle, tooltip

**Utilities:**
- utils (clx utility function)
- hooks (custom React hooks)

## How to Use

### For Users (Installing Components)

#### 1. Initialize shadcn in your project

```bash
npx shadcn@latest init
```

Keep the default Base UI component library: MYDS components are built on Base UI.

#### 2. Install the MYDS styles

```bash
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/myds-init.json
```

#### 3. Import MYDS styles in your global CSS

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap");
@import "tailwindcss";
@import "../styles/myds.css";
```

#### 4. Add components to your project

Pass the item's full URL. The shadcn CLI has no `--registry` flag, and bare names resolve to shadcn's own registry.

```bash
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/ui/styles/default/button.json --overwrite

# For local testing: serve the repo root and point at it
python3 -m http.server 8765
npx shadcn@latest add http://localhost:8765/registry/ui/styles/default/button.json
```

This will:
- Copy the component source code to your project
- Install npm dependencies (`@base-ui/react`, etc.), pinned to the ranges MYDS is built against
- Install registry dependencies (utils, hooks, icons, other components) via their full URLs

#### 5. Use the component

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
- `@base-ui/react` - Primitive components
- `class-variance-authority` - Variant management
- `tailwind-merge` - Tailwind class merging
- `react-day-picker` - Date picker
- `@tanstack/react-table` - Data table (v8)

#### Registry Dependencies
Other MYDS items, referenced by full URL:
- `utils` - Utility functions (clx)
- `hooks` - Custom React hooks
- Icons and other UI components (e.g., button, dropdown, etc.)

The shadcn CLI automatically installs all dependencies when you add a component.

## For Maintainers (Building the Registry)

### Prerequisites

- Node.js 18+
- pnpm 9+
- tsx (installed as dev dependency)

### Build Commands

```bash
# Build the complete registry (all generators + index.json catalogs)
pnpm registry:build

# Clean registry files
pnpm registry:clean
```

### Build Process

`pnpm registry:build` runs `scripts/registry/build-multi.ts`, which runs the three generators and then writes the `index.json` catalogs:

- `generate-ui.ts` reads `packages/react/src/components`, `hooks` and `utils`:
  - Rewrites relative imports to the paths files are installed at:
    - `"../utils"` → `"@/lib/myds/utils"`, `"../hooks"` → `"@/lib/myds/hooks"`
    - `"../icons/chevron-down"` → `"@/components/ui/icons/chevron-down"` (barrel `"../icons"` imports are split per icon)
    - `"./button"` → `"@/components/ui/button"`
  - Turns those imports into `registryDependencies` as full item URLs.
  - Pins npm `dependencies` to the ranges in `packages/react/package.json`.
- `generate-icons.ts` writes one item per file in `packages/react/src/icons`.
- `generate-style.ts` reads `packages/style/styles` and writes `myds-init` (combined `styles/myds.css`) plus the granular style items (`styles/myds/<name>.css`).

Registry dependency URLs use `https://mof-malaysia.github.io/fiscal-myds/registry` by default. Set `MYDS_REGISTRY_URL` to build against another host (e.g. a local server for testing). Always rebuild with the default before committing the `registry/` output.

### Registry File Format

Items follow shadcn's [registry-item schema](https://ui.shadcn.com/schema/registry-item.json):

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "dependencies": ["@base-ui/react@^1.9.0", "class-variance-authority@^0.7.1"],
  "registryDependencies": [
    "https://mof-malaysia.github.io/fiscal-myds/registry/ui/styles/default/utils.json"
  ],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "content": "...source code...",
      "type": "registry:ui"
    }
  ]
}
```

### Item Types

- `registry:ui` - UI components and icons
- `registry:lib` - `utils` and `hooks` (installed under `lib/myds/`)
- `registry:file` - Styles, with an explicit `target` (`~/styles/...`)

## Testing Locally

### 1. Build the registry against a local server

```bash
MYDS_REGISTRY_URL=http://localhost:8765/registry pnpm registry:build
python3 -m http.server 8765   # from the repo root
```

### 2. Create a test project

```bash
npx shadcn@latest init -t next -n test-myds-registry
cd test-myds-registry
```

### 3. Install MYDS styles and components

```bash
npx shadcn@latest add http://localhost:8765/registry/style/styles/default/myds-init.json
npx shadcn@latest add http://localhost:8765/registry/ui/styles/default/button.json --overwrite
```

### 4. Import styles in `app/globals.css`

```css
@import "tailwindcss";
@import "../styles/myds.css";
```

### 5. Test the component

Create a test page and verify:
- Component files are copied correctly
- Dependencies are installed
- Imports resolve properly (`npx tsc --noEmit`)
- Styles apply correctly (`npx next build`)
- Component renders and functions as expected

### 6. Rebuild for production

```bash
pnpm registry:build
```

## Dependency Graph

Some components depend on other components from the registry:

```
button → utils
accordion → utils, icons
navbar → button, link, icons, utils
toast → hooks, icons, utils
hooks → toast
alert-dialog → dialog, icons, utils
data-table → table, button, checkbox, icons, utils
```

The shadcn CLI automatically resolves and installs these dependencies.


## Troubleshooting

### Component not found

If you get "was not found" errors:
1. Check the full item URL opens in a browser
2. Ensure the component name matches a file in `registry/<ui|icons|style>/styles/default/`

### Import errors

If imports don't resolve:
1. Check that aliases are configured in `components.json` (`npx shadcn@latest init` sets them up)
2. Verify `tsconfig.json` maps `@/*` to your source root

### Type errors mentioning `render` or `asChild`

MYDS is built on Base UI. Make sure `components.json` uses a Base UI style (e.g. `base-nova`), i.e. `npx shadcn@latest init` with the default `base` library, not `--base radix`.

### Missing styles

If components don't look correct:
1. Ensure `styles/myds.css` exists (`myds-init` was added)
2. Verify it is imported right after `@import "tailwindcss";` in your global CSS

### Dependency issues

If npm dependencies aren't installing:
1. Check your package manager (npm/pnpm/yarn)
2. Clear cache and reinstall: `rm -rf node_modules && pnpm install`
3. Verify internet connection for package registry

## Future Enhancements

- [ ] Add versioning support for registry
- [ ] Create visual component browser
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
