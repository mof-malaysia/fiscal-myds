# Component Roadmap: Fiscal MYDS 2.0

Status: implemented on `feat/myds-2-tiered-components` (d449458). Breaking release (2.0).

## Decisions

- **Three tiers.** Core (shared primitives and mandatory gov chrome), App (service and officer tools), Marketing (agency and landing sites).
- **Separate registries per tier.** `registry/core`, `registry/app`, `registry/marketing`. `style` and `icons` stay as they are. `registry/ui` is removed.
- **Clean break.** Rename and replace freely; no deprecated aliases. Consumers re-add from the new URLs.
- **Base UI first.** If Base UI 1.9 has a primitive, the component wraps it. Hand-rolled behaviour is only allowed where Base UI has no equivalent.

## Tier rules

A component goes in the **lowest tier that every consumer of it belongs to**:

- **Core**: used on both service screens and agency sites, or legally required on every MOF site.
- **App**: only makes sense inside a task or workflow (forms with state, data, multi-step flows, officer tooling).
- **Marketing**: exists to inform or persuade on a public site. Large composed sections ship as `registry:block`, not `registry:ui` (so do the app tier's composed screens).

App and Marketing items may depend on Core. App and Marketing never depend on each other. Cross-registry `registryDependencies` use full URLs.

## Tier assignment

`new` = does not exist yet · `rebuild` = exists, reimplemented · `rename` = new name

### Core

| Component                                                                                                                                                                 | Status                                                             | Base UI primitive |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------- |
| button, link, label, input, textarea, checkbox, radio, select, tooltip, popover, dialog, alert-dialog, spinner, tag, pill, callout, tabs, breadcrumb, toast, theme-switch | existing                                                           | (as today)        |
| switch                                                                                                                                                                    | rebuild + rename (was `toggle`)                                    | `switch`          |
| toggle (pressed button)                                                                                                                                                   | new                                                                | `toggle`          |
| toggle-group                                                                                                                                                              | new                                                                | `toggle-group`    |
| menu                                                                                                                                                                      | rename (was `dropdown`)                                            | `menu`            |
| field                                                                                                                                                                     | new (label + hint + error + description, the base for every input) | `field`           |
| fieldset                                                                                                                                                                  | new                                                                | `fieldset`        |
| form                                                                                                                                                                      | new                                                                | `form`            |
| details (single disclosure)                                                                                                                                               | new, documented                                                    | `collapsible`     |
| separator                                                                                                                                                                 | new                                                                | `separator`       |
| scroll-area                                                                                                                                                               | new                                                                | `scroll-area`     |
| avatar                                                                                                                                                                    | new                                                                | `avatar`          |
| skeleton                                                                                                                                                                  | new                                                                | none              |
| card                                                                                                                                                                      | new                                                                | none              |
| backlink                                                                                                                                                                  | new, documented                                                    | none              |
| inset-text                                                                                                                                                                | new, documented                                                    | none              |
| kbd (shortcut key caps)                                                                                                                                                   | new                                                                | none              |
| **Gov chrome:** masthead, skiplink, cookie-banner, footer                                                                                                                 | existing                                                           |                   |
| phase-banner                                                                                                                                                              | new, documented                                                    | none              |

### App

| Component                                                                                               | Status                                                               | Base UI primitive                 |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------- |
| data-table, table, summary-list, pagination, calendar, date-field, date-picker, daterange-picker, sheet | existing                                                             | (as today)                        |
| otp-field                                                                                               | rebuild + rename (was `input-otp`, drops the `input-otp` dependency) | `otp-field`                       |
| file-upload                                                                                             | new, documented                                                      | none (Field + dropzone)           |
| password-input                                                                                          | new, documented                                                      | `input`                           |
| character-count                                                                                         | new, documented                                                      | `field`                           |
| panel (confirmation: "payment received")                                                                | new, documented                                                      | none                              |
| task-list                                                                                               | new, documented                                                      | none                              |
| error-summary                                                                                           | new                                                                  | none (links to Field errors)      |
| combobox                                                                                                | new                                                                  | `combobox`                        |
| autocomplete                                                                                            | new                                                                  | `autocomplete`                    |
| number-field + currency (MYR) variant                                                                   | new                                                                  | `number-field`                    |
| checkbox-group                                                                                          | new                                                                  | `checkbox-group`                  |
| slider                                                                                                  | new                                                                  | `slider`                          |
| progress                                                                                                | new                                                                  | `progress`                        |
| meter                                                                                                   | new                                                                  | `meter`                           |
| stepper (multi-step form progress)                                                                      | new                                                                  | none                              |
| app-shell / sidebar                                                                                     | new                                                                  | `navigation-menu` / `collapsible` |
| desk-shell (compact rail, status bar)                                                                   | new                                                                  | none                              |
| shortcuts (registry, ⌘K palette, ? cheat sheet)                                                         | new, on `command`                                                    | none                              |
| split-pane                                                                                              | new                                                                  | none                              |
| page-header                                                                                             | new                                                                  | none                              |
| stat (KPI tile)                                                                                         | new                                                                  | none                              |
| empty-state                                                                                             | new                                                                  | none                              |
| menubar                                                                                                 | new                                                                  | `menubar`                         |
| toolbar                                                                                                 | new                                                                  | `toolbar`                         |
| context-menu                                                                                            | new                                                                  | `context-menu`                    |
| command (palette)                                                                                       | new, on existing `cmdk` dep                                          | none                              |
| drawer                                                                                                  | new                                                                  | `drawer`                          |
| preview-card                                                                                            | new                                                                  | `preview-card`                    |

### App blocks

Composed screens ship as `registry:block` (they install to `components/blocks`), like the marketing blocks. Full-page compositions live in Storybook under `Examples/App`.

| Block                                                                                | Screens                                                                                                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| auth-layout, sign-in-form, sign-up-form, password-reset, otp-verify, session-timeout | Access: sign in (MyDigital ID, email and password, officer SSO), sign up, forgot/reset password, one-time code, session timeout |
| form-step, check-answers, confirmation-panel, payment-summary, application-list      | Citizen tasks: multi-step application, check your answers, submitted, pay and receipt, citizen dashboard                        |
| work-queue, activity-timeline, decision-panel                                        | Officer work on DeskShell: case queue, case detail, officer dashboard                                                           |
| settings-layout, notification-list, error-page                                       | Account and system states: profile, security, preferences, notifications, 404/500/403/maintenance                               |

### Marketing

| Component                                       | Status                                  | Type                   |
| ----------------------------------------------- | --------------------------------------- | ---------------------- |
| accordion                                       | existing, moved                         | ui (`accordion`)       |
| announce-bar                                    | existing, moved                         | ui                     |
| navbar (mega navigation)                        | existing, moved                         | ui (`navigation-menu`) |
| carousel                                        | promote from docs-only into the package | ui                     |
| section-heading (shared heading for the blocks) | new                                     | ui                     |
| hero                                            | new                                     | block                  |
| feature-grid                                    | new                                     | block                  |
| faq (built on accordion)                        | new                                     | block                  |
| stats-band                                      | new                                     | block                  |
| cta-band                                        | new                                     | block                  |
| logo-cloud                                      | new                                     | block                  |
| testimonial                                     | new                                     | block                  |

## Phases

Each phase lands as its own PR (or a small series) so review stays tractable.

### Phase 0: Restructure (breaking, no new components)

1. Move source to `packages/react/src/components/{core,app,marketing}/`. Update `package.json` exports.
2. Split `scripts/registry/generate-ui.ts` into a tier-aware generator that emits `registry/{core,app,marketing}/index.json` and items. Cross-tier deps become full URLs. Delete `registry/ui`.
3. Update `build-multi.ts`, `registry/index.json`, `scripts/deploy/prepare-gh-pages.ts` and the GitHub Pages workflow.
4. Storybook: retitle stories `Core/Button`, `App/Data Table`, `Marketing/Accordion`.
5. Update `REGISTRY.md` and `README.md` with the new registry URLs and a 1.x → 2.0 migration list.
6. Bump to 2.0.

### Phase 1: Core rebuilds and the Field foundation

Field comes first because file-upload, character-count, error-summary, combobox and number-field all build on it.

- `field`, `fieldset`, `form`; refactor `input`, `textarea`, `select`, `checkbox`, `radio` to compose with Field for labels, hints and errors.
- `toggle` → `switch` on Base UI Switch; a new `toggle` (pressed button) and `toggle-group`.
- `dropdown` → `menu`.
- `input-otp` → `otp-field` on Base UI.

### Phase 2: Documented-but-missing

file-upload, password-input, character-count, details, panel, phase-banner, task-list, backlink, inset-text. The design docs already specify these, so build to the docs and fix the docs wherever the build shows they're wrong.

### Phase 3: Form foundations

error-summary, combobox, autocomplete, number-field (with MYR currency), checkbox-group, slider, stepper.

### Phase 4: App shell and data

app-shell/sidebar, desk-shell, shortcuts, split-pane, page-header, card, stat, progress, meter, skeleton, empty-state, avatar, separator, scroll-area, menubar, toolbar, context-menu, command, drawer, preview-card.

### Phase 5: Marketing

Move accordion, announce-bar and navbar; promote carousel; build the hero, feature-grid, faq, stats-band, cta-band, logo-cloud and testimonial blocks. Rebuild the `landing-page` template from these blocks.

## Definition of done (every component)

- Wraps the Base UI primitive where one exists; no custom focus, keyboard or ARIA logic that Base UI already provides.
- Follows `DESIGN.md`: tokens only, separates with surface rather than outlines, works in both comfortable and compact density, dark mode.
- Storybook story with all variants and states, with no violations in the Storybook a11y panel. (Automated axe checks in the test runner are planned but not in place yet.)
- Registry item in the correct tier with correct `dependencies` and `registryDependencies`.
- BM strings fit without truncating key information.

## Resolved questions

- **Docs (EN and BM, Design and Develop).** Out of scope for 2.0: components and Storybook only. The docs site (`apps/docs`) is not updated and is being deprecated; it is excluded from linting.
- **Transitory Assistance (CSS) docs section.** Out of scope with the rest of the docs.
- **`react-chart`.** Left out.
- **Footer.** Split: `footer` (Core) is the plain mandatory government footer; `site-footer` (Marketing) is the multi-column agency footer.
