# RFC: FTDS for Astro

Status: accepted. Phases 1, 2 and 4 done on `feat/astro-foundation`.

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
| Templates      | Reference pages in `packages/astro/src/templates`, shown in Storybook, for teams to copy. No starter kit, and templates are not registry items.                                   |
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
  templates/<page>.astro              page templates assembled from the blocks (Phase 4), not shipped
packages/style/variants/<name>.ts   cva shared by both stacks; registry item variants-<name>
registry/astro-core/  registry/astro-marketing/  registry/astro-icons/
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
2. **Interactive** (done): accordion and FAQ, tabs, theme switch and theme script, cookie banner, dismissible callout, navbar (mobile and expressive), carousel, language switcher. Shared behaviour in `@/lib/ftds/scripts` (`astro-scripts`). Every component in Storybook (see below).
3. **Content**: Content Collection schemas and the MDX map, blog, news, events, team, changelog and article components. `Prose` arrived in Phase 4, and the schemas should fit the Phase 4 blocks (`news-list`, `event-details`, `people-grid`) rather than add parallel ones.
4. **Building blocks and page templates** (done; replaces the earlier Adoption phase and its starter kit): reference pages and examples for teams to copy from, the marketing-site counterpart of the citizen and officer examples in the React Storybook. See below.

React | Astro tabs in the docs and framework fields in `llms.txt` and the MCP server, once part of Adoption, are still to do.

## Phase 1 component set

- **Core**: button, link, tag, card, callout, separator, breadcrumb, masthead, phase-banner, skiplink, footer, inset-text, details.
- **Marketing**: section-heading, hero, feature-grid, cta-band, stats-band, logo-cloud, testimonial, announce-bar, site-footer.

## Phase 4: blocks and templates

More blocks (`components/blocks`), all static, no scripts:

- **Page content**: `service-highlights` (linked service cards with facts), `steps` (how to apply), `eligibility` (who can and can't apply), `contact-locations` (channels and offices), `page-intro` (the inner-page header: breadcrumb, h1, meta).
- **Updates and resources**: `news-list` (grid strip, listing rows or compact announcements), `download-list` (files with type and size in the link name), `partner-grid` (agencies with what they do), `people-grid` (leadership), `event-details` (facts, registration and programme).
- **Calls to action**: `impact-stats` (figures each with period and source), `cta-split` (with media and reasons), `cta-cards` (two or three ways to act, one recommended).
- **Pages**: `status-page` (404, 500, maintenance), plus `prose` (long-form content) and `pager` (link-based pagination for static listings) in `components/ui`.
- **Shared pieces**: `section` (`components/ui`) is the band the blocks sit in: Paper or Well, the column (`width`: wide or article, `flush` inside a tab), and the SectionHeading. Its classes, and the stretched-link card, icon badge and dotted meta row the blocks share, are in `packages/style/variants/section.ts` (`variants-section`), an Astro-only variants file. FeatureGrid and Faq gained the same `tone` prop. Prose lands here rather than in Phase 3 because the article and event templates need it.

Templates live in `packages/astro/src/templates`: `site-layout.astro` (masthead, navbar, footer) and `site.ts` (the agency, navigation and footer data) shared by the agency homepage, service landing, campaign, news listing and article, event, about and leadership, contact, publications library, 404 and maintenance pages. A team picks a template, copies it with `site-layout.astro`, `site.ts` and the blocks it imports (`npx shadcn add @ftds/astro-<block>`), and swaps in its content. They are in the Astro Storybook under Marketing › Templates, after the blocks, each a full page that passes the same axe sweep as the components. Showing them on the docs site is still open.

## Content Collections

Content items use the Zod that ships with Astro (`import { z } from "astro/zod"`), so they add no dependency. Each content item ships its schema (`lib/ftds/content/<name>.ts`) for `defineCollection({ loader: glob(...), schema })`, and the components take the entry type inferred from it.

## Storybook

`apps/storybook-astro` uses [`@storybook-astro/framework`](https://github.com/storybook-astro/storybook-astro). The React Storybook shows it in its sidebar as "FTDS for Astro" through composition (`refs`), so the React Storybook, its addons and test-runner are untouched. Both deploy to GitHub Pages: `/storybook` and `/storybook-astro`.

- Stories are pre-rendered at build time, so Controls don't change an Astro story on the published site. Each variant is its own story.
- Slot content in `args.slots` is an HTML string; it can't hold Astro components.
- Astro compiles stories in dev mode, which writes absolute local paths into the output. `scripts/strip-local-paths.mjs` removes them after every build and fails if any remain.

## Testing

- Playwright against the built Astro Storybook (`pnpm --filter @mof-malaysia/ftds-storybook-astro test`, run before every push): axe (WCAG 2.2 AA) on every story, and keyboard and behaviour tests for every scripted component.
- Still to do: Astro Container API snapshot tests, and screenshot comparison against React for components in both stacks.
