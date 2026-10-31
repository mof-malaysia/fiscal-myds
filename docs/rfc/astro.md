# RFC: FTDS for Astro

Status: accepted, Phase 1 in progress on `feat/astro-foundation`.

## Summary

FTDS gains a second distribution: Astro components for static agency, landing and marketing sites. It contains a selective subset of core and the marketing tier, and it will grow marketing and content components of its own. It never contains app components.

This is not a replacement. React stays the primary library, keeps its full marketing tier and is still the right choice for any site that is also a service. The Astro set is a more focused stack for sites whose job is to inform or persuade, where shipping no JavaScript by default matters more than sharing code with an app.

## Decisions

| Topic          | Decision                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scope          | Selective core subset + marketing. No app components, enforced by the generator.                                                                                                  |
| Parity         | Not a goal. Astro may have components React does not. Bringing one back to React is decided case by case.                                                                         |
| Interactivity  | Native first: `<details>`, `<dialog>`, the Popover API, scroll-snap. Small vanilla scripts where the platform has no answer.                                                      |
| Escape hatch   | Heavy widgets (site search, combobox) are documented as React islands through `@astrojs/react`. No wrappers ship.                                                                 |
| Distribution   | The same shadcn registry. Items are prefixed `astro-` (`@ftds/astro-hero`), the way icons use `icon-`.                                                                            |
| Shared styling | Components in both stacks import cva variants from `packages/style/variants` (`@mof-malaysia/ftds-style/variants/<name>`). Astro-only components keep their variants in the file. |
| Tokens         | `ftds-init` / `@mof-malaysia/ftds-style`, unchanged.                                                                                                                              |
| i18n           | Built-in labels come from a BM/EN dictionary; BM is the default. A `lang` prop overrides `Astro.currentLocale`.                                                                   |
| Content        | Content components ship with Zod schemas (Astro's built-in `astro/zod`) for Content Collections, and an MDX component map for articles.                                           |
| Starter        | `templates/astro-starter`, usable with `npm create astro -- --template`.                                                                                                          |
| Versions       | Astro 7+, Tailwind v4.                                                                                                                                                            |

## Layout

```
packages/astro/src/
  components/core/<name>.astro        selective subset of core
  components/marketing/<name>.astro   ports and Astro-only marketing components
  components/content/<name>.astro     blog, news, events, team, changelog, article (Phase 3)
  icons/<name>.astro                  generated from packages/react/src/svg/icons
  scripts/<name>.ts                   native-first behaviour modules (Phase 2)
  i18n/                               BM/EN labels
packages/style/variants/<name>.ts   cva shared by both stacks; registry item variants-<name>
registry/astro-core/  registry/astro-marketing/  registry/astro-icons/
templates/astro-starter/              (Phase 4)
```

Astro source imports FTDS the way an installed project does (`@/components/ui/button.astro`, `@/lib/ftds/utils`). `packages/astro/paths.mjs` and the package `tsconfig.json` resolve those paths inside the repo. Shared variants are the exception: both stacks import them from `@mof-malaysia/ftds-style/variants/<name>`, and the generators rewrite that to `@/components/ui/<name>.variants` on the way into the registry.

## Where files go

| Item                   | Installed to                       |
| ---------------------- | ---------------------------------- |
| Astro components       | `components/ui/<name>.astro`       |
| Astro marketing blocks | `components/blocks/<name>.astro`   |
| Astro icons            | `components/ui/icons/<name>.astro` |
| Shared variants        | `components/ui/<name>.variants.ts` |
| i18n labels            | `lib/ftds/i18n/`                   |
| Behaviour scripts      | `lib/ftds/scripts/`                |

Astro imports always carry the `.astro` extension, so `button.astro` and `button.tsx` can sit in the same folder. A site can use the Astro components for its pages and a React component as an island where it needs one.

## Component rules

- Props match the React component where both exist, with Astro conventions: `class` instead of `className`, slots instead of `ReactNode` props, `href` instead of a `render` prop.
- A component renders correctly with JavaScript disabled. Scripts add behaviour, never content.
- Scripts find elements by `data-ftds-*` attributes, not classes, and set themselves up again on `astro:page-load` so view transitions work.
- Every scripted component gets an axe check and a keyboard test. Base UI did this work for the React components; here it is ours.

## Phases

1. **Foundation**: `packages/astro`, the `astro-*` registries, shared variants, Astro icons, the i18n dictionary, and the static core and marketing components. Positioning in the README, `PRODUCT.md` and the docs.
2. **Interactive**: accordion and FAQ, tabs, theme switch, cookie banner, navbar (mobile and expressive), carousel, language switcher.
3. **Content**: Content Collection schemas, `Prose` and the MDX map, blog, news, events, team, changelog and article components.
4. **Adoption**: the starter site, React | Astro tabs in the docs, framework fields in `llms.txt` and the MCP server.

## Phase 1 component set

- **Core**: button, link, tag, card, callout, separator, breadcrumb, masthead, phase-banner, skiplink, footer, inset-text, details.
- **Marketing**: section-heading, hero, feature-grid, cta-band, stats-band, logo-cloud, testimonial, announce-bar, site-footer.

## Content Collections

Content items use the Zod that ships with Astro (`import { z } from "astro/zod"`), so they add no dependency. Each content item ships its schema (`lib/ftds/content/<name>.ts`) for `defineCollection({ loader: glob(...), schema })`, and the components take the entry type inferred from it.

## Testing

- Astro Container API snapshot tests for every component.
- Playwright screenshot comparison against React for components in both stacks.
- axe and keyboard-flow tests for scripted components (Phase 2 onwards).
