# Fiscal MYDS

> Multi-registry shadcn-compatible component library for Malaysian government-style applications

## What's inside?

1. **@myds-style Registry** - Tailwind v4 styling system (6 style components)
2. **@myds-ui Registry** - 42 shadcn-compatible React components, hooks, utilities
3. **@myds-icon Registry** - 220+ icons
4. **Storybook** - Interactive component browser

**Total: 268 components across 3 registries**

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
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/ui/styles/default/button.json --overwrite

# 4. Install a standalone icon
npx shadcn@latest add https://mof-malaysia.github.io/fiscal-myds/registry/icons/styles/default/chevron-down.json
```

Then import the styles in your global CSS:

```css
/* app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap");
@import "tailwindcss";
@import "../styles/myds.css";
```

Every item lives at `https://mof-malaysia.github.io/fiscal-myds/registry/<ui|icons|style>/styles/default/<name>.json`. See the registry catalogs (`https://mof-malaysia.github.io/fiscal-myds/registry/ui/index.json`, `.../icons/index.json`, `.../style/index.json`) for the names.

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
| UI components | `components/ui/<name>.tsx` |
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

### UI Components (42)

- **UI Primitives**: button, input, checkbox, radio, select, etc.
- **Complex Components**: data-table, date-picker, dropdown, etc.
- **Layout Components**: navbar, footer, masthead, announce-bar
- **Utilities**: utils (clx), hooks

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
