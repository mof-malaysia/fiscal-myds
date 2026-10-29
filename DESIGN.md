---
name: Fiscal MYDS
description: The Ministry of Finance's design system for calm, capable, humane government services.
colors:
  steady-blue: "#1D5AB0"
  steady-blue-deep: "#104A97"
  steady-blue-wash: "#E7F1FF"
  focus-blue: "#4D86D9"
  paper: "#F9FAFC"
  sheet: "#FCFDFF"
  well: "#F1F4F7"
  hover-mist: "#EAEDF2"
  hairline: "#DEE2E6"
  control-edge: "#878D95"
  ink: "#161B22"
  ink-secondary: "#484E55"
  ink-tertiary: "#646971"
  on-steady-blue: "#FAFCFE"
  danger: "#B02A2D"
  danger-wash: "#FEEDEC"
  success: "#296A3B"
  success-wash: "#E7F7E9"
  warning: "#7D4F1B"
  warning-wash: "#FEF2D9"
  dark-steady-blue: "#6EA0E8"
  dark-steady-blue-bright: "#85B3F7"
  dark-steady-blue-wash: "#18273C"
  dark-paper: "#0D1014"
  dark-sheet: "#14171C"
  dark-well: "#090B0F"
  dark-hover-mist: "#1D2126"
  dark-hairline: "#272C31"
  dark-control-edge: "#6F757D"
  dark-ink: "#ECEFF2"
  dark-ink-secondary: "#B3B8BE"
  dark-ink-tertiary: "#9399A0"
  dark-on-steady-blue: "#0D1014"
  dark-danger: "#F07F77"
  dark-danger-wash: "#3B1C1A"
  dark-success: "#6FC082"
  dark-success-wash: "#15291A"
  dark-warning: "#E3B667"
  dark-warning-wash: "#32230E"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-compact:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  label-compact:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.38
  amount:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    fontFeature: "'tnum' 1, 'cv11' 1"
rounded:
  control: "8px"
  container: "12px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.steady-blue}"
    textColor: "{colors.on-steady-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.steady-blue-deep}"
    textColor: "{colors.on-steady-blue}"
  button-primary-compact:
    backgroundColor: "{colors.steady-blue}"
    textColor: "{colors.on-steady-blue}"
    typography: "{typography.label-compact}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "32px"
  button-secondary:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.hover-mist}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-steady-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  input-compact:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body-compact}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "32px"
  badge-info:
    backgroundColor: "{colors.steady-blue-wash}"
    textColor: "{colors.steady-blue}"
    typography: "{typography.label-compact}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  badge-success:
    backgroundColor: "{colors.success-wash}"
    textColor: "{colors.success}"
    typography: "{typography.label-compact}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  badge-warning:
    backgroundColor: "{colors.warning-wash}"
    textColor: "{colors.warning}"
    typography: "{typography.label-compact}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  badge-danger:
    backgroundColor: "{colors.danger-wash}"
    textColor: "{colors.danger}"
    typography: "{typography.label-compact}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  dialog:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
    padding: "24px"
  table-header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label-compact}"
    height: "40px"
  table-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-compact}"
    height: "48px"
  table-row-hover:
    backgroundColor: "{colors.well}"
---

<!-- TARGET: this file defines the direction Fiscal MYDS is moving to, derived from PRODUCT.md. The tokens in packages/style do not match it yet; migrate them to these values. Once they do, delete this comment. -->

# Design System: Fiscal MYDS

## 1. Overview

**Creative North Star: "The Steady Hand"**

Fiscal MYDS guides people through tasks that make them nervous: paying, declaring, applying, being told they owe something. The interface is the steady hand on the shoulder. It is firm and unhurried, it never fusses, and it never makes the user wonder whether something worked. Everything on screen is either helping with the task or getting out of the way.

The system is quiet by construction. Surfaces are soft, tinted neutrals that sit almost still; structure comes from spacing and gentle tonal steps rather than lines; one calm blue marks the way forward. Colour, weight and motion are spent only where they carry meaning: the primary action, the current selection, an amount, a deadline, an error. The craft reference is Linear's restraint, applied at sizes and contrast that an older citizen can read without effort.

It rejects, by name, the four anti-references in PRODUCT.md: the **generic Tailwind starter** (stock zinc and `blue-600`, every element outlined in grey), the **old government portal** (crests and banners everywhere, gradients, tiny text), **flashy fintech** (neon, dark gradients, glassmorphism) and **stiff corporate banking** (navy and gold, heavy serifs, formal distance).

**Key Characteristics:**
- Tinted neutral surfaces with almost no borders; spacing and tone do the grouping.
- One calm, deep blue used sparingly for action, selection and focus.
- A single typeface (Inter) with a real hierarchy and tabular figures for money.
- Two densities from the same tokens: comfortable for citizens, compact for officers.
- Flat at rest; shadows only for things that genuinely float.
- Light and dark themes designed as equals, both verified for contrast.

**Density.** Every component ships in two densities, switched by `data-density="comfortable" | "compact"` on any element (comfortable is the default on `:root`); component `size` props stay relative to it. *Comfortable* (citizen-facing, the default): 16px body text, 44px control height, 16–24px gaps. *Compact* (officer tools): 14px body text, 32px control height, 8–12px gaps. Density changes size and spacing only; colour, radius and behaviour stay identical.

**Motion.** State changes only: hover, press, open, close, expand. 150–200ms with an ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`). No entrance choreography, no bounce, and everything respects `prefers-reduced-motion`.

## 2. Colors: The Still Water Palette

A restrained palette of cool, faintly blue-tinted neutrals with one deep, calm blue; semantic colours appear as soft washes, never as loud fills.

### Primary
- **Steady Blue** (#1D5AB0): the primary action button, links, the selected tab or nav item, checked checkboxes and radios. A deeper, quieter evolution of national MYDS blue (`blue-600`), so the family resemblance stays while the glare goes. 6.4:1 on Paper.
- **Steady Blue Deep** (#104A97): hover and pressed state of primary buttons and links.
- **Steady Blue Wash** (#E7F1FF): selected rows, the active item in a menu, info badges and callouts. Steady Blue text on it reads at 5.9:1.
- **Focus Blue** (#4D86D9): the focus ring only. 3.5:1 against Paper, so keyboard focus is always visible.

### Neutral
- **Paper** (#F9FAFC): the page canvas. Never pure white.
- **Sheet** (#FCFDFF): raised content that needs to separate from Paper: dialogs, popovers, input fields, the main content panel in a layout.
- **Well** (#F1F4F7): recessed or grouped areas (secondary buttons, filter bars, the sidebar, code and summary blocks) and the row hover in tables.
- **Hover Mist** (#EAEDF2): hover state on Well-coloured controls.
- **Hairline** (#DEE2E6): the only decorative line colour. Used for table row dividers and the single rule under a top bar. Nowhere else by default.
- **Control Edge** (#878D95): the stroke on inputs, selects, checkboxes and radios, the only places a border is required to identify a control. 3.3:1 against Sheet (WCAG 1.4.11).
- **Ink** (#161B22): primary text and headings. 16.6:1 on Paper.
- **Ink Secondary** (#484E55): supporting text, hints, table headers, inactive tabs, breadcrumb parents. 8.1:1 on Paper: secondary text is still comfortably readable for older eyes.
- **Ink Tertiary** (#646971): placeholders and disabled-adjacent meta text only. 5.4:1 on Sheet. Never for anything the user must read to complete a task.

### Semantic
- **Danger** (#B02A2D) on **Danger Wash** (#FEEDEC): errors, destructive actions, overdue amounts.
- **Success** (#296A3B) on **Success Wash** (#E7F7E9): completed payments, approved status.
- **Warning** (#7D4F1B) on **Warning Wash** (#FEF2D9): upcoming deadlines, incomplete information.

Every semantic pair reads at 5.7:1 or better. Status is always carried by text or an icon as well as colour.

### Dark theme
Dark mode is a first-class theme for officers in long sessions, not an inversion. It uses the `dark-` tokens: Dark Paper (#0D1014) canvas, Dark Sheet (#14171C) for raised content, Dark Ink (#ECEFF2) text, Dark Ink Secondary (#B3B8BE) at 9.6:1, and Dark Steady Blue (#6EA0E8) as the accent with Dark Paper text on primary buttons. The same rules apply: tone, not lines.

### Named Rules
**The One Blue Rule.** Steady Blue covers no more than 10% of any screen. It marks the next step, the current selection and focus; nothing decorative is ever blue. If two things on a screen are filled blue, one of them is wrong.

**The Dark-Enough Rule.** Text the user needs to read is Ink or Ink Secondary, never lighter. Light-grey hint text is forbidden.

**The Wash, Not Fill Rule.** Status colours appear as a wash with coloured text, never as a saturated block. The only saturated fills in the system are the primary and danger buttons.

## 3. Typography

**Display Font:** Inter (with `ui-sans-serif, system-ui, sans-serif`)
**Body Font:** Inter (with `ui-sans-serif, system-ui, sans-serif`)
**Label/Mono Font:** Inter, with tabular figures (`tnum`) for amounts

**Character:** One family, tuned rather than paired. Inter is neutral enough to disappear into a task and precise enough to make numbers trustworthy. Poppins is retired: its wide, round geometry fought Inter wherever they met.

### Hierarchy
- **Display** (600, 2rem / 32px, 1.25, -0.02em): page titles on service landing screens; one per page at most.
- **Headline** (600, 1.5rem / 24px, 1.33, -0.015em): section titles, dialog titles on high-stakes confirmations.
- **Title** (600, 1.125rem / 18px, 1.45, -0.01em): card and panel headings, form section headings, standard dialog titles.
- **Body** (400, 1rem / 16px, 1.5): all reading text in the comfortable density. Prose capped at 70ch.
- **Body Compact** (400, 0.875rem / 14px, 1.43): body text in the compact density (officer tables and forms).
- **Label** (500, 0.875rem / 14px, 1.43): buttons, form labels, nav items, tabs.
- **Label Compact** (500, 0.8125rem / 13px, 1.38): table headers, badges, captions in the compact density. The smallest size in the system.
- **Amount** (500, 1rem, tabular figures): every currency value and figure that may be compared in a column.

The scale steps at roughly 1.2–1.33, so each level is visibly distinct. Hierarchy comes from size and weight together; never from colour alone.

### Named Rules
**The Floor Rule.** Nothing is smaller than 13px, and 13px is only for labels in the compact density. Citizen-facing text starts at 16px.

**The Tabular Money Rule.** Every amount uses tabular figures and right-aligns in columns, so ringgit and sen line up and can be compared at a glance.

**The Three Weights Rule.** Only 400, 500 and 600. No bold 700, no light 300.

## 4. Elevation

Flat by default, with depth expressed through tone: Paper is the floor, Sheet sits on it, Well recesses into it. Shadows exist only for layers that genuinely float above the page and must be dismissed: menus, popovers, select lists, toasts and dialogs. Buttons, inputs, cards and table rows never cast a shadow.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 1px 2px rgba(22, 27, 34, 0.06), 0 8px 24px rgba(22, 27, 34, 0.08)`): menus, popovers, select lists, tooltips, toasts.
- **Lift** (`box-shadow: 0 2px 4px rgba(22, 27, 34, 0.06), 0 24px 48px rgba(22, 27, 34, 0.14)`): dialogs and sheets, over a scrim of Ink at 40%.

In the dark theme, floating layers use Dark Sheet plus a 1px Dark Hairline edge instead of a heavier shadow, since shadows disappear on dark canvases.

### Named Rules
**The Floats-Only Rule.** If it doesn't float above the page and close, it doesn't get a shadow. `shadow-button` is retired.

## 5. Components

### Buttons
Calm and decisive: a clear primary, quiet everything else.
- **Shape:** gently rounded corners (8px).
- **Primary:** Steady Blue fill, On Steady Blue text, Label type, no border, no shadow. Comfortable 44px tall with 20px horizontal padding; compact 32px with 12px.
- **Hover / Focus:** hover deepens to Steady Blue Deep over 150ms. Focus shows a 2px Focus Blue ring offset 2px from the button. Pressed scales nothing; it simply holds the deep colour.
- **Secondary:** Well fill with Ink text and no border; hover moves to Hover Mist. This replaces every outlined button.
- **Ghost:** transparent with Ink Secondary text; hover shows a Well fill. For tertiary actions, toolbars and icon buttons (icon buttons are never boxed).
- **Danger:** Danger fill with On Steady Blue text, used only for the final confirmation of a destructive action.

### Badges and Tags
- **Style:** a wash background with matching coloured text, pill-shaped (9999px), Label Compact type, no border.
- **State:** removable tags add a ghost ✕ inside the pill; the pill itself stays borderless.

### Cards / Containers
- **Corner Style:** softly rounded (12px).
- **Background:** Sheet on a Paper page, or Well for grouped secondary content.
- **Shadow Strategy:** none (see Elevation).
- **Border:** none. A container that needs an edge is a sign the background tones are too close; adjust the tone instead.
- **Internal Padding:** 24px comfortable, 16px compact. Cards are never nested.

### Inputs / Fields
- **Style:** Sheet background, 1px Control Edge stroke, 8px radius; 44px tall comfortable, 32px compact. Labels sit above in Label type and Ink; hints sit below in Ink Secondary.
- **Focus:** the stroke turns Steady Blue and a 2px Focus Blue ring appears outside it.
- **Error:** stroke and message turn Danger; the message always says what to do, not just what's wrong.
- **Disabled:** Well background, Ink Tertiary text, stroke removed.
- **Checkbox and radio:** 1.5px Control Edge stroke; checked fills Steady Blue with an On Steady Blue mark.

### Navigation
- **Top bar:** Paper background with a single Hairline rule beneath. Items in Label type and Ink Secondary; hover moves to Ink; the current item is Ink with a 2px Steady Blue underline.
- **Tabs:** one style across the system: the same underline treatment as the top bar. The three tab variants collapse into this one.
- **Mobile:** the menu opens as a full-width Sheet panel with comfortable-density rows (44px), no dividers between items.

### Data Table (signature component)
The officer's home screen, built to be looked at all day.
- **No outer border or box.** Header row is Paper with Label Compact text in Ink Secondary.
- **Rows:** 48px tall in comfortable density and 40px in compact (52px in comfortable when a row holds actions), content text, separated by a single Hairline divider. Hover fills the row with Well; selection fills it with Steady Blue Wash.
- **Amounts:** Amount type, right-aligned.
- **Status:** wash badges, never outlined.
- **Row actions:** ghost buttons or a single overflow menu, never a column of outlined "Edit" buttons.

### Dialogs
- **Style:** Sheet, 12px radius, 24px padding, Lift shadow over the scrim. No dividers between header, body and footer; spacing separates them.
- **Close:** a ghost icon button, unboxed.
- **High-stakes confirmations:** the title states the consequence in plain language ("This will permanently delete 3 records"), the primary button repeats the verb ("Delete records"), and the safe option is the secondary button.

## 6. Do's and Don'ts

### Do:
- **Do** separate groups with spacing (16–24px comfortable, 8–12px compact) and tone (Paper, Sheet, Well) before reaching for any line.
- **Do** keep Steady Blue (#1D5AB0) to the primary action, current selection and links: no more than 10% of a screen.
- **Do** use Ink (#161B22) or Ink Secondary (#484E55) for any text a user must read; Ink Secondary still measures 8.1:1.
- **Do** ship every component in both densities: comfortable (16px text, 44px controls) for citizens and compact (14px text, 32px controls) for officers.
- **Do** set every amount in tabular figures and right-align it in columns.
- **Do** show status with a wash badge plus text or an icon; colour is never the only signal.
- **Do** design dark mode with the `dark-` tokens and check it as carefully as light.
- **Do** confirm high-stakes moments (payment, submission, deletion) with plain language and a visible result.

### Don't:
- **Don't** look like a **generic Tailwind starter**: no stock zinc greys, no `blue-600`, and no 1px grey outline on every button, tag, card and row.
- **Don't** look like an **old government portal**: no crests and banners on every screen, no gradients, no tiny text, no 2010-era layouts.
- **Don't** look like **flashy fintech**: no neon accents, no dark gradient heroes, no glassmorphism.
- **Don't** look like **stiff corporate banking**: no navy and gold, no heavy serif headings, no formal distance.
- **Don't** outline buttons, badges, cards or icon buttons. Borders are only for inputs, checkboxes, radios and the Hairline row divider.
- **Don't** use light-grey hint text, or any text lighter than Ink Secondary for content the user needs.
- **Don't** put a shadow on anything that doesn't float. Buttons, inputs, cards and rows are flat.
- **Don't** use Poppins or any second typeface, and don't use weights other than 400, 500 and 600.
- **Don't** go below 13px, and don't use 13px outside compact-density labels.
- **Don't** use a coloured side-stripe (`border-left` wider than 1px) on callouts, alerts or list items; use a wash background and an icon.
- **Don't** nest cards, and don't wrap content in a container that has no job.
- **Audit test:** squint at the screen. If you can still see a grid of grey rectangles, there are too many lines.
