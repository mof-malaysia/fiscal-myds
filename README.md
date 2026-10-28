# Fiscal MYDS

> Multi-registry shadcn-compatible component library for Malaysian government-style applications

## What's inside?

1. **@myds-style Registry** - Tailwind v4 styling system (6 style components)
2. **Component registries**, one per tier:
   - **@myds-core** - 40 shared primitives and government chrome, plus utils and hooks
   - **@myds-app** - 35 service and officer tools
   - **@myds-marketing** - 5 agency site components and 7 page blocks
3. **@myds-icon Registry** - 220+ icons
4. **Storybook** - Interactive component browser

**Total: 315 items across 5 registries**

## Installation

### Quick Start

MYDS is distributed as a shadcn registry: the CLI copies the source into your project. No npm package to install. Components are built on [Base UI](https://base-ui.com), so use shadcn's default Base UI setup.

```bash
# 1. Initialise shadcn (Tailwind v4, `@/` alias, Base UI). For a new project: npx shadcn@latest init -t next -n my-app
npx shadcn@latest init

# 2. Install MYDS styles -> creates styles/myds.css
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/myds-init.json

# 3. Install UI components (dependencies, icons and hooks come along).
#    --overwrite replaces the button.tsx that `shadcn init` created.
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/core/styles/default/button.json --overwrite

# 4. Install a standalone icon
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/icons/styles/default/chevron-down.json
```

Then import the styles in your global CSS:

```css
/* app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "tailwindcss";
@import "../styles/myds.css";
```

Every item lives at `https://mof-malaysia.github.io/fiscal-myds/registry/<core|app|marketing|icons|style>/styles/default/<name>.json`. See the registry catalogs (`https://mof-malaysia.github.io/fiscal-myds/registry/core/index.json`, `.../app/index.json`, `.../marketing/index.json`, `.../icons/index.json`, `.../style/index.json`) for the names.

### Style Installation Options

#### Option A: Quick Setup (Recommended)

`myds-init` writes a single `styles/myds.css` with:

- Base color variables
- Light theme semantic tokens
- Dark theme semantic tokens
- Tailwind v4 configuration
- Base CSS utilities

#### Option B: Granular Control

Install the parts individually. Each is written to `styles/myds/<name>.css`; import the ones you need instead of `styles/myds.css`:

```bash
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/colors.json https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/theme-light.json https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/theme-dark.json https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/theme-config.json https://mof-malaysia.github.io/fiscal-myds/registry/style/styles/default/base-styles.json
```

### Where files go

| Item | Installed to |
| --- | --- |
| Components (all tiers) | `components/ui/<name>.tsx` |
| Marketing blocks | `components/blocks/<name>.tsx` |
| Icons | `components/ui/icons/<name>.tsx` |
| `utils` (`clx`) | `lib/myds/utils/` (leaves shadcn's `lib/utils.ts` alone) |
| `hooks` | `lib/myds/hooks/` |
| Styles | `styles/myds.css` or `styles/myds/*.css` |

### Requirements

- **shadcn CLI with Base UI**: `npx shadcn@latest init` (the default `base` library)
- **Tailwind CSS v4**
- **React 18+**: Components are built for React 18 or 19
- **TypeScript**: Recommended for best experience

## Available Components

### Style Components (6)

- `myds-init` - Complete MYDS styling system (all-in-one)
- `colors` - Base color variables
- `theme-light` - Light mode semantic tokens
- `theme-dark` - Dark mode semantic tokens
- `theme-config` - Tailwind v4 @theme configuration
- `base-styles` - Base CSS layers and utilities

### Core components (40) — `registry/core`

Shared primitives and the government chrome every MOF site needs.

alert-dialog, avatar, backlink, breadcrumb, button, callout, card, checkbox, cookie-banner, details, dialog, field, fieldset, footer, form, input, inset-text, label, link, masthead, menu, phase-banner, pill, popover, radio, scroll-area, select, separator, skeleton, skiplink, spinner, switch, tabs, tag, textarea, theme-switch, toast, toggle, toggle-group, tooltip

Plus `utils` (clx) and `hooks`.

### App components (35) — `registry/app`

Service and officer tools: forms, data, workflows.

app-shell, autocomplete, calendar, character-count, checkbox-group, combobox, command, context-menu, data-table, date-field, date-picker, daterange-picker, drawer, empty-state, error-summary, file-upload, menubar, meter, number-field, otp-field, page-header, pagination, panel, password-input, preview-card, progress, search-bar, sheet, slider, stat, stepper, summary-list, table, task-list, toolbar

### Marketing components (5) and blocks (7) — `registry/marketing`

Agency and landing sites. Blocks are composed page sections (`registry:block`) installed to `components/blocks/`.

- Components: accordion, announce-bar, carousel, navbar, site-footer
- Blocks: cta-band, faq, feature-grid, hero, logo-cloud, stats-band, testimonial

### Icons (220)

- Government agency icons (legacy)
- UI icons (chevron, arrow, check, cross, etc.)
- Social media icons (facebook, twitter, instagram, etc.)
- Action icons (edit, delete, download, etc.)

See [REGISTRY.md](./REGISTRY.md) for full component list and details.

## Documentation & Demo

- **🎨 Live Demo**: [https://mof-malaysia.github.io/fiscal-myds](https://mof-malaysia.github.io/fiscal-myds)
- **📚 Storybook**: [https://mof-malaysia.github.io/fiscal-myds/storybook](https://mof-malaysia.github.io/fiscal-myds/storybook)
- **📦 Registry Catalog**: [https://mof-malaysia.github.io/fiscal-myds/registry](https://mof-malaysia.github.io/fiscal-myds/registry/index.json)
- **Registry Docs**: See [REGISTRY.md](./REGISTRY.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## important note

### 1. Tailwind Intellisense Workaround

MYDS incorporates a unified tailwind config file, as the base config for multiple apps/packages. If you are using Tailwind Intellisense extension on VSCode, you may lose the extension's ability to auto-suggest and CSS preview if you work within `packages/**`. This is because the extension requires `tailwind.config` to be available in the local package workspace, which is not defined in individual packages.

To solve this, add the following in your VSCode **Workspace settings** (_Not your User settings_):

```json
// .vscode/settings.json
{
  "tailwindCSS.experimental.configFile": {
    "apps/docs/tailwind.config.ts": "apps/docs/**",
    "packages/tailwindcss/tailwind.config.ts": "packages/**"
  }
}
```

This will override Intellisense's auto-config-locator to point to the defined config files and together with its glob scope.

Made with ❤️ by MY tech folks
