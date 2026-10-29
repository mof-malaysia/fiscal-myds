# FTDS

> FiscalTech Design System: the Ministry of Finance's multi-registry, shadcn-compatible component library for Malaysian government services

FTDS began as a fork of [MYDS](https://github.com/govtechmy/myds), the Malaysia Government Design System. It keeps the MYDS palette and much of its component foundation, and is maintained independently by MOF. See [Origins](#origins).

## What's inside?

1. **@ftds-style Registry** - Tailwind v4 styling system (6 style components)
2. **Component registries**, one per tier:
   - **@ftds-core** - 40 shared primitives and government chrome, plus utils and hooks
   - **@ftds-app** - 34 service and officer tools
   - **@ftds-marketing** - 7 agency site components and 7 page blocks
3. **@ftds-icon Registry** - 220+ icons
4. **Storybook** - Interactive component browser

**Total: 316 items across 5 registries**

## Installation

### Quick Start

FTDS is distributed as a shadcn registry: the CLI copies the source into your project. No npm package to install. Components are built on [Base UI](https://base-ui.com), so use shadcn's default Base UI setup.

```bash
# 1. Initialise shadcn (Tailwind v4, `@/` alias, Base UI). For a new project: npx shadcn@latest init -t next -n my-app
npx shadcn@latest init

# 2. Install FTDS styles -> creates styles/ftds.css
npx shadcn@latest add https://mof-malaysia.github.io/ftds/registry/style/styles/default/ftds-init.json

# 3. Install UI components (dependencies, icons and hooks come along).
#    --overwrite replaces the button.tsx that `shadcn init` created.
npx shadcn@latest add https://mof-malaysia.github.io/ftds/registry/core/styles/default/button.json --overwrite

# 4. Install a standalone icon
npx shadcn@latest add https://mof-malaysia.github.io/ftds/registry/icons/styles/default/chevron-down.json
```

Then import the styles in your global CSS:

```css
/* app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/ftds.css";
```

`ftds-init` installs `tw-animate-css` for the component animations; import it before `ftds.css`.

Every item lives at `https://mof-malaysia.github.io/ftds/registry/<core|app|marketing|icons|style>/styles/default/<name>.json`. See the registry catalogs (`https://mof-malaysia.github.io/ftds/registry/core/index.json`, `.../app/index.json`, `.../marketing/index.json`, `.../icons/index.json`, `.../style/index.json`) for the names.

### Style Installation Options

#### Option A: Quick Setup (Recommended)

`ftds-init` writes a single `styles/ftds.css` with:

- Base color variables
- Light theme semantic tokens
- Dark theme semantic tokens
- Tailwind v4 configuration
- Base CSS utilities

#### Option B: Granular Control

Install the parts individually. Each is written to `styles/ftds/<name>.css`; import the ones you need instead of `styles/ftds.css`:

```bash
npx shadcn@latest add https://mof-malaysia.github.io/ftds/registry/style/styles/default/colors.json https://mof-malaysia.github.io/ftds/registry/style/styles/default/theme-light.json https://mof-malaysia.github.io/ftds/registry/style/styles/default/theme-dark.json https://mof-malaysia.github.io/ftds/registry/style/styles/default/theme-config.json https://mof-malaysia.github.io/ftds/registry/style/styles/default/base-styles.json
```

### Where files go

| Item                   | Installed to                                             |
| ---------------------- | -------------------------------------------------------- |
| Components (all tiers) | `components/ui/<name>.tsx`                               |
| Marketing blocks       | `components/blocks/<name>.tsx`                           |
| Icons                  | `components/ui/icons/<name>.tsx`                         |
| `utils` (`clx`)        | `lib/ftds/utils/` (leaves shadcn's `lib/utils.ts` alone) |
| `hooks`                | `lib/ftds/hooks/`                                        |
| Styles                 | `styles/ftds.css` or `styles/ftds/*.css`                 |

### Requirements

- **shadcn CLI with Base UI**: `npx shadcn@latest init` (the default `base` library)
- **Tailwind CSS v4**
- **React 18+**: Components are built for React 18 or 19
- **TypeScript**: Recommended for best experience

## Available Components

### Style Components (6)

- `ftds-init` - Complete FTDS styling system (all-in-one)
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

app-shell, autocomplete, calendar, character-count, checkbox-group, combobox, command, context-menu, data-table, date-field, date-picker, daterange-picker, drawer, empty-state, error-summary, file-upload, menubar, meter, number-field, otp-field, page-header, pagination, panel, password-input, preview-card, progress, sheet, slider, stat, stepper, summary-list, table, task-list, toolbar

### Marketing components (7) and blocks (7) — `registry/marketing`

Agency and landing sites. Blocks are composed page sections (`registry:block`) installed to `components/blocks/`.

- Components: accordion, announce-bar, carousel, navbar, section-heading, site-footer, site-search
- Blocks: cta-band, faq, feature-grid, hero, logo-cloud, stats-band, testimonial

### Icons (220)

- Government agency icons (legacy)
- UI icons (chevron, arrow, check, cross, etc.)
- Social media icons (facebook, twitter, instagram, etc.)
- Action icons (edit, delete, download, etc.)

See [REGISTRY.md](./REGISTRY.md) for full component list and details.

## Documentation & Demo

- **🎨 Live Demo**: [https://mof-malaysia.github.io/ftds](https://mof-malaysia.github.io/ftds)
- **📚 Storybook**: [https://mof-malaysia.github.io/ftds/storybook](https://mof-malaysia.github.io/ftds/storybook)
- **📦 Registry Catalog**: [https://mof-malaysia.github.io/ftds/registry](https://mof-malaysia.github.io/ftds/registry/index.json)
- **Registry Docs**: See [REGISTRY.md](./REGISTRY.md)
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Design and product**: [DESIGN.md](./DESIGN.md), [PRODUCT.md](./PRODUCT.md), [COMPONENT-ROADMAP.md](./COMPONENT-ROADMAP.md)

## Development

### Repository layout

```
apps/
  storybook/        Component browser, deployed to GitHub Pages
  docs/             Legacy docs site (being deprecated; not linted)
packages/
  react/            Component source, by tier: src/components/{core,app,marketing}
  style/            Tailwind v4 tokens and themes (source for @ftds-style)
  _typescript/      Shared tsconfig presets
registry/           Generated registry JSON (committed, served by GitHub Pages)
scripts/
  registry/         Registry generators (pnpm registry:build)
  icons/            SVG to React icon converter (pnpm icons:generate)
  deploy/           GitHub Pages bundle (pnpm deploy:prepare)
```

### Setup

Requires Node.js 18+ and pnpm 9 (pinned via `packageManager`).

```bash
pnpm install                                   # also installs the lefthook git hooks
pnpm --filter @mof-malaysia/ftds-storybook dev # Storybook at http://localhost:6006
```

### Common commands

| Command                        | What it does                                                    |
| ------------------------------ | --------------------------------------------------------------- |
| `pnpm lint`                    | oxlint across the workspace; fails on any warning               |
| `pnpm typecheck`               | `tsc --noEmit` in every package, via Turborepo                  |
| `pnpm format`                  | Prettier over `.ts`, `.tsx` and `.md` files                     |
| `pnpm icons:generate`          | Rebuild `packages/react/src/icons` from `src/svg/icons/*.svg`   |
| `pnpm components:sync-exports` | Regenerate `packages/react/package.json` exports from the tiers |
| `pnpm registry:build`          | Regenerate everything under `registry/`                         |

Every commit runs Prettier on staged files plus `pnpm lint` and `pnpm typecheck`. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow.

## Origins

FTDS is built on MYDS, the Malaysia Government Design System, originally developed by Unit Nukleus GovTech and released under the MIT licence. Its original copyright notice is kept in [LICENSE](./LICENSE). FTDS is maintained by the Ministry of Finance and is not an official MYDS release.

## Licence

MIT. See [LICENSE](./LICENSE).
