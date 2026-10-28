# MYDS Component Registry

This document describes the MYDS shadcn-compatible component registry structure and how to use it.

## Overview

MYDS now supports a **shadcn-compatible registry** system that allows users to copy component source code directly into their projects instead of installing them as npm packages. This gives users full ownership and control over the components.

## Registry Structure

```
/registry/
├── index.json                    # Root index of the five registries
├── core/                         # Shared primitives, government chrome, utils, hooks
│   ├── index.json
│   └── styles/default/*.json
├── app/                          # Service and officer tools
│   ├── index.json
│   └── styles/default/*.json
├── marketing/                    # Agency and landing sites (components + registry:block)
│   ├── index.json
│   └── styles/default/*.json
├── icons/
│   ├── index.json
│   └── styles/default/*.json     # One item per icon
└── style/
    ├── index.json
    └── styles/default/*.json     # myds-init + colors, theme-light, theme-dark, theme-config, base-styles
```

Items are fetched by full URL: `https://mof-malaysia.github.io/fiscal-myds/registry/<core|app|marketing|icons|style>/styles/default/<name>.json`.

## Tiers

A component goes in the lowest tier that every consumer of it belongs to. App and Marketing items may depend on Core; App and Marketing never depend on each other (the generator fails the build if they do). Every tier installs flat into `components/ui/`, so names are unique across tiers. Marketing blocks install into `components/blocks/`.

- **Core (40)**: alert-dialog, avatar, backlink, breadcrumb, button, callout, card, checkbox, cookie-banner, details, dialog, field, fieldset, footer, form, input, inset-text, label, link, masthead, menu, phase-banner, pill, popover, radio, scroll-area, select, separator, skeleton, skiplink, spinner, switch, tabs, tag, textarea, theme-switch, toast, toggle, toggle-group, tooltip. Plus `utils` and `hooks`.
- **App (35)**: app-shell, autocomplete, calendar, character-count, checkbox-group, combobox, command, context-menu, data-table, date-field, date-picker, daterange-picker, drawer, empty-state, error-summary, file-upload, menubar, meter, number-field, otp-field, page-header, pagination, panel, password-input, preview-card, progress, search-bar, sheet, slider, stat, stepper, summary-list, table, task-list, toolbar.
- **Marketing (12)**: accordion, announce-bar, carousel, cta-band, faq, feature-grid, hero, logo-cloud, navbar, site-footer, stats-band, testimonial.

## Migrating from 1.x

The flat `registry/ui` registry is gone. Re-add components from their tier's URL. Renamed or replaced:

| 1.x | 2.0 |
| --- | --- |
| `ui/toggle` (Toggle + ToggleThumb) | `core/switch` (Switch, on Base UI Switch). `core/toggle` is now a pressed button. |
| `ui/dropdown` (Dropdown*) | `core/menu` (Menu*, with checkbox/radio items, groups, submenus) |
| `ui/input-otp` (InputOTP, InputOTPSlot; `input-otp` package) | `app/otp-field` (OTPField, OTPFieldSlot, OTPFieldSeparator; Base UI) |
| `ui/footer` (multi-column: Footer, SiteInfo, SiteLinkGroup, ...) | `marketing/site-footer` (SiteFooter, SiteFooterInfo, SiteFooterLinkGroup, ...) |
| — | `core/footer` is the plain mandatory government footer |
| `ui/accordion`, `ui/announce-bar`, `ui/navbar` | `marketing/...` |
| `ui/calendar`, `data-table`, `date-*`, `pagination`, `search-bar`, `sheet`, `summary-list`, `table` | `app/...` |
| everything else | `core/...` |

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
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/myds.css";
```

#### 4. Add components to your project

Pass the item's full URL. The shadcn CLI has no `--registry` flag, and bare names resolve to shadcn's own registry.

```bash
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/core/styles/default/button.json --overwrite

# For local testing: serve the repo root and point at it
python3 -m http.server 8765
npx shadcn@latest add http://localhost:8765/registry/core/styles/default/button.json
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
- `cmdk` - Command palette
- `date-fns` - Date formatting

#### Registry Dependencies
Other MYDS items, referenced by full URL:
- `utils` - Utility functions (clx)
- `hooks` - Custom React hooks
- Icons and other components (e.g., button, menu), possibly from the core registry

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

`pnpm registry:build` runs `scripts/registry/build-multi.ts`, which runs the generators and then writes the `index.json` catalogs:

- `generate-components.ts` reads `packages/react/src/components/{core,app,marketing}`, `hooks` and `utils`, and writes one registry per tier (`utils` and `hooks` ship from core):
  - Rewrites relative imports to the paths files are installed at:
    - `"../../utils"` → `"@/lib/myds/utils"`, `"../../hooks"` → `"@/lib/myds/hooks"`
    - `"../../icons/chevron-down"` → `"@/components/ui/icons/chevron-down"` (barrel `"../../icons"` imports are split per icon)
    - `"./button"` and `"../core/button"` → `"@/components/ui/button"`
  - Turns those imports into `registryDependencies` as full item URLs in the right tier.
  - Pins npm `dependencies` to the ranges in `packages/react/package.json`.
  - Emits the blocks listed in `MARKETING_BLOCKS` as `registry:block`.
  - Fails if an app item depends on marketing or vice versa.
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
    "https://mof-malaysia.github.io/fiscal-myds/registry/core/styles/default/utils.json"
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

- `registry:ui` - Components and icons
- `registry:block` - Marketing page sections (installed to `components/blocks/`)
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
npx shadcn@latest add http://localhost:8765/registry/core/styles/default/button.json --overwrite
```

### 4. Import styles in `app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
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
2. Verify it is imported after `@import "tailwindcss";` and `@import "tw-animate-css";` in your global CSS

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
