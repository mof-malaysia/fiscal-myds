# FTDS

> FiscalTech Design System: the Ministry of Finance's multi-registry, shadcn-compatible component library for Malaysian government services

FTDS began as a fork of [MYDS](https://github.com/govtechmy/myds), the Malaysia Government Design System. It keeps the MYDS palette and much of its component foundation, and is maintained independently by MOF. See [Origins](#origins).

## What's inside?

The repository is the registry: the shadcn CLI installs straight from GitHub, or from the JSON copy on GitHub Pages.

- **Components**, in three tiers: **core** (shared primitives and government chrome, plus utils and hooks), **app** (service and officer tools) and **marketing** (agency site components and page blocks)
- **Icons**, 220, named `icon-<name>` (`icon-chevron-down`)
- **FTDS for Astro**: native Astro components for static agency, landing and marketing sites, named `astro-<name>` (`astro-hero`). A focused subset of core plus marketing, with no app components. See [FTDS for Astro](#ftds-for-astro)
- **Styles**: the Tailwind v4 tokens and themes, all in one with `ftds-init`
- **Storybook**: an interactive component browser

Every item name is unique across the tiers, so you install `button` or `icon-search` without knowing which tier it lives in.

## Installation

FTDS is distributed as a shadcn registry: the CLI copies the source into your project. No npm package to install. Components are built on [Base UI](https://base-ui.com), so use shadcn's default Base UI setup.

The whole repository has one version. Each release is a git tag (`v0.1.0`) and a matching folder on GitHub Pages; see [Releases](https://github.com/mof-malaysia/ftds/releases).

### Option A: the `@ftds` namespace (recommended)

Add the namespace to `components.json` once. `v0` follows the latest 0.x release, which can include breaking changes while FTDS is below 1.0, so pin an exact version (`v0.1.0`) for anything that ships; `latest` follows every release.

```json
{
  "registries": {
    "@ftds": "https://mof-malaysia.github.io/ftds/r/v0/{name}.json"
  }
}
```

```bash
# 1. Initialise shadcn (Tailwind v4, `@/` alias, Base UI). For a new project: npx shadcn@latest init -t next -n my-app
npx shadcn@latest init

# 2. Install FTDS styles -> creates styles/ftds.css
npx shadcn@latest add @ftds/ftds-init

# 3. Install UI components (dependencies, icons and hooks come along).
#    --overwrite replaces the button.tsx that `shadcn init` created.
npx shadcn@latest add @ftds/button --overwrite

# 4. Install a standalone icon
npx shadcn@latest add @ftds/icon-chevron-down
```

Everything in one install comes from the same version: dependencies point inside the folder you chose.

### Option B: straight from GitHub

No configuration. Always pin a release tag; without one you get unreleased work from `main`.

```bash
npx shadcn@latest add mof-malaysia/ftds/ftds-init#v0.1.0
npx shadcn@latest add mof-malaysia/ftds/button#v0.1.0 --overwrite
```

Each tag pins its dependencies to the same tag, so `button#v0.1.0` brings `utils#v0.1.0`. The CLI reads every file through the GitHub API, which allows 60 unauthenticated requests an hour per IP address; a team behind one office address runs out quickly. Sign in with `gh auth login` (or set `GH_TOKEN`), or use Option A.

### For coding agents

FTDS publishes documentation for coding agents (Claude Code, Cursor, Copilot and others), following [llms.txt](https://llmstxt.org):

- [`llms.txt`](https://mof-malaysia.github.io/ftds/llms.txt): the rules for writing FTDS code and a link to a page for every guide, component and block.
- [`llms-full.txt`](https://mof-malaysia.github.io/ftds/llms-full.txt): everything in one file.

Each component page combines a hand-written guide (when to use it, examples that are typechecked against the source, pitfalls) with its exports and props, generated from the code. Tell your agent to read `llms.txt` before building UI, or add it to the project's `AGENTS.md` or `CLAUDE.md`.

The registry items also carry titles and descriptions, so the [shadcn MCP server](https://ui.shadcn.com/docs/mcp) can search and install FTDS for an agent once the `@ftds` namespace is in `components.json`:

```bash
npx shadcn@latest mcp init --client claude   # or cursor, vscode, codex, opencode
```

### Import the styles

```css
/* app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/ftds.css";
```

`ftds-init` installs `tw-animate-css` for the component animations; import it before `ftds.css`.

Browse the item names in [`registry.json`](./registry.json) and the files it includes, or in a release's catalog (`https://mof-malaysia.github.io/ftds/r/v0/registry.json`).

### Style installation options

`ftds-init` writes a single `styles/ftds.css` with the base colours, the light and dark theme tokens, the Tailwind v4 configuration and the base CSS utilities.

For finer control, install the parts individually. Each is written to `styles/ftds/<name>.css`; import the ones you need instead of `styles/ftds.css`:

```bash
npx shadcn@latest add @ftds/colors @ftds/theme-light @ftds/theme-dark @ftds/theme-config @ftds/base-styles
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

Installed as `icon-<name>`, for example `icon-chevron-down`.

- Government agency icons (legacy)
- UI icons (chevron, arrow, check, cross, etc.)
- Social media icons (facebook, twitter, instagram, etc.)
- Action icons (edit, delete, download, etc.)

See [REGISTRY.md](./REGISTRY.md) for full component list and details.

## FTDS for Astro

A second distribution for sites whose job is to inform or persuade: agency pages, landing pages, campaign and marketing sites built with [Astro](https://astro.build). Components are native `.astro` files that ship no JavaScript by default.

**It does not replace the React components.** React stays the primary library and keeps its full marketing tier; use it for anything that is also a service, or when a site already runs on React. Astro is the more focused choice for a static marketing site. See [docs/rfc/astro.md](./docs/rfc/astro.md) for the decisions.

- **Scope**: a selective subset of core (the pieces marketing pages need) and the marketing tier. App components are never part of it.
- **Not a mirror**: Astro can have marketing and content components React doesn't.
- **Same look**: components in both stacks share their classes from `packages/style/variants` (installed as `components/ui/<name>.variants.ts`), and both use the same `ftds-init` styles.
- **Built-in labels** in Bahasa Melayu (default) and English, from `astro-i18n`.
- **Requirements**: Astro 7+ and Tailwind v4.

```bash
npx shadcn@latest add @ftds/ftds-init
npx shadcn@latest add @ftds/astro-hero @ftds/astro-masthead
```

| Item                   | Installed to                       |
| ---------------------- | ---------------------------------- |
| Astro components       | `components/ui/<name>.astro`       |
| Astro marketing blocks | `components/blocks/<name>.astro`   |
| Astro icons            | `components/ui/icons/<name>.astro` |
| Shared variants        | `components/ui/<name>.variants.ts` |
| i18n labels            | `lib/ftds/i18n/`                   |

Import with the extension, so `button.astro` and a React `button.tsx` can live side by side:

```astro
---
import Hero from "@/components/blocks/hero.astro";
---

<Hero
  title="Bayar bil kerajaan di satu tempat"
  primaryAction={{ label: "Mula membayar", href: "/bayar" }}
/>
```

## Documentation & Demo

- **🎨 Live Demo**: [https://mof-malaysia.github.io/ftds](https://mof-malaysia.github.io/ftds)
- **📚 Storybook**: [https://mof-malaysia.github.io/ftds/storybook](https://mof-malaysia.github.io/ftds/storybook)
- **📦 Registry Catalog**: [`registry.json`](./registry.json), or a release's JSON catalog at `https://mof-malaysia.github.io/ftds/r/<version>/registry.json`
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
  astro/            FTDS for Astro source: src/components/{core,marketing}, icons, i18n
  style/            Tailwind v4 tokens and themes (source for @ftds-style), plus variants/: cva classes shared by React and Astro
  _typescript/      Shared tsconfig presets
registry.json       Registry root the shadcn CLI reads from GitHub
registry/           Generated registry files by tier (committed; the pre-push hook checks they are current)
scripts/
  registry/         Registry generators (pnpm registry:build) and the Pages JSON converter
  icons/            SVG to React icon converter (pnpm icons:generate)
  deploy/           GitHub Pages bundle (pnpm deploy:prepare)
.github/workflows/  Release and Pages
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
| `pnpm format`                  | oxfmt over `.ts`, `.tsx` and `.md` files                        |
| `pnpm icons:generate`          | Rebuild the React and Astro icons from `src/svg/icons/*.svg`    |
| `pnpm components:sync-exports` | Regenerate `packages/react/package.json` exports from the tiers |
| `pnpm registry:build`          | Regenerate `registry.json` and everything under `registry/`     |
| `pnpm registry:validate`       | Check the registry with `shadcn registry validate`              |
| `pnpm llms:check`              | Typecheck every example in the component docs and guides        |
| `pnpm llms:build`              | Build `llms.txt` and the agent docs into `deploy/`              |

Every commit runs oxfmt on staged files plus `pnpm lint` and `pnpm typecheck`; every push also checks the registry and agent docs and builds Storybook, the docs and the playground. Commit the output of `pnpm registry:build` with any component, doc, icon or style change: the push fails if `registry/` is out of date. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the workflow and [DEPLOYMENT.md](./DEPLOYMENT.md) for releasing.

## Origins

FTDS is built on MYDS, the Malaysia Government Design System, originally developed by Unit Nukleus GovTech and released under the MIT licence. Its original copyright notice is kept in [LICENSE](./LICENSE). FTDS is maintained by the Ministry of Finance and is not an official MYDS release.

## Licence

MIT. See [LICENSE](./LICENSE).
