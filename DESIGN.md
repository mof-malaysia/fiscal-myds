---
name: Fiscal MYDS
description: The Ministry of Finance's design system for calm, capable, humane government services.
colors:
  myds-blue: "#2563EB"
  myds-blue-deep: "#1D4ED8"
  myds-blue-wash: "#EFF6FF"
  focus-blue: "#3A75F6"
  paper: "#FAFAFA"
  sheet: "#FFFFFF"
  well: "#F4F4F5"
  hover-mist: "#F4F4F5"
  hairline: "#E4E4E7"
  control-edge: "#898990"
  ink: "#18181B"
  ink-secondary: "#3F3F46"
  ink-tertiary: "#6B6B74"
  on-myds-blue: "#FFFFFF"
  danger: "#B91C1C"
  danger-fill: "#DC2626"
  danger-wash: "#FEF2F2"
  success: "#15803D"
  success-wash: "#F0FDF4"
  warning: "#A16207"
  warning-wash: "#FEFCE8"
  dark-myds-blue: "#6394FF"
  dark-myds-blue-wash: "#1D2B4D"
  dark-paper: "#131316"
  dark-sheet: "#1C1C20"
  dark-well: "#25252A"
  dark-hover-mist: "#2E2E34"
  dark-hairline: "#2E2E34"
  dark-control-edge: "#71717C"
  dark-ink: "#EDEDF0"
  dark-ink-secondary: "#B4B4BD"
  dark-ink-tertiary: "#9A9AA5"
  dark-on-myds-blue: "#131316"
  dark-danger: "#F87171"
  dark-danger-wash: "#450A0A"
  dark-success: "#22C55E"
  dark-success-wash: "#052E16"
  dark-warning: "#EAB308"
  dark-warning-wash: "#422006"
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
    backgroundColor: "{colors.myds-blue}"
    textColor: "{colors.on-myds-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.myds-blue-deep}"
    textColor: "{colors.on-myds-blue}"
  button-primary-compact:
    backgroundColor: "{colors.myds-blue}"
    textColor: "{colors.on-myds-blue}"
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
    backgroundColor: "{colors.danger-fill}"
    textColor: "{colors.on-myds-blue}"
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
    backgroundColor: "{colors.myds-blue-wash}"
    textColor: "{colors.myds-blue}"
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

# Design System: Fiscal MYDS

## 1. Overview

**Creative North Star: "The Steady Hand"**

Fiscal MYDS guides people through tasks that make them nervous: paying, declaring, applying, being told they owe something. The interface is the steady hand on the shoulder. It is firm and unhurried, it never fusses, and it never makes the user wonder whether something worked. Everything on screen is either helping with the task or getting out of the way.

The system is quiet by construction. Surfaces are white and soft neutral greys; structure comes from spacing and gentle tonal steps rather than lines; one clear MYDS blue marks the way forward. Colour, weight and motion are spent only where they carry meaning: the primary action, the current selection, an amount, a deadline, an error. The craft reference is Linear's restraint, applied at sizes and contrast that an older citizen can read without effort.

It rejects, by name, the four anti-references in PRODUCT.md: the **generic Tailwind starter** (every element outlined in grey, boxes inside boxes), the **old government portal** (crests and banners everywhere, gradients, tiny text), **flashy fintech** (neon, dark gradients, glassmorphism) and **stiff corporate banking** (navy and gold, heavy serifs, formal distance).

**Key Characteristics:**

- Neutral surfaces with almost no borders; spacing and tone do the grouping.
- The national MYDS blue, used sparingly for action, selection and focus.
- A single typeface (Inter) with a real hierarchy and tabular figures for money.
- Two densities from the same tokens: comfortable for citizens, compact for officers.
- Flat at rest; shadows only for things that genuinely float.
- Light and dark themes designed as equals, both verified for contrast.

**Density.** Every component ships in two densities, switched by `data-density="comfortable" | "compact"` on any element (comfortable is the default on `:root`); component `size` props stay relative to it. _Comfortable_ (citizen-facing, the default): 16px body text, 44px control height, 16–24px gaps. _Compact_ (officer tools): 14px body text, 32px control height, 8–12px gaps. Density changes size and spacing only; colour, radius and behaviour stay identical.

**Motion.** State changes only: hover, press, open, close, expand. 150–200ms with an ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)`). No entrance choreography, no bounce, and everything respects `prefers-reduced-motion`.

## 2. Colors: The MYDS Palette

The national MYDS palette: a clear, confident blue on neutral zinc greys and white surfaces, with semantic colours as soft washes. The calm comes from how sparingly colour is used, not from muting it.

### Primary

- **MYDS Blue** (#2563EB): the primary action button, links, the selected tab or nav item, checked checkboxes and radios. The national MYDS blue, kept so Fiscal MYDS stays recognisably part of the family. White text on it reads at 5.2:1; as text on Paper, 5.0:1.
- **MYDS Blue Deep** (#1D4ED8): hover and pressed state of primary buttons and links.
- **MYDS Blue Wash** (#EFF6FF): selected rows, the active item in a menu, info badges and callouts. MYDS Blue text on it reads at 4.8:1.
- **Focus Blue** (#3A75F6): the focus ring only, drawn solid (never translucent) so it measures 4.0:1 against Paper.

### Neutral

- **Paper** (#FAFAFA): the page canvas.
- **Sheet** (#FFFFFF): raised content that needs to separate from Paper: dialogs, popovers, input fields, the main content panel in a layout.
- **Well** (#F4F4F5): recessed or grouped areas (secondary buttons, filter bars, the sidebar, summary blocks) and the row hover in tables.
- **Hairline** (#E4E4E7): the only decorative line colour. Used for table row dividers and the single rule under a top bar. Nowhere else by default.
- **Control Edge** (#898990, gray-500 at 80%): the stroke on inputs, selects, checkboxes, radios and switch tracks, the only places a border is required to identify a control. 3.5:1 against Sheet (WCAG 1.4.11).
- **Ink** (#18181B): primary text and headings. 17:1 on Paper.
- **Ink Secondary** (#3F3F46): supporting text, hints, table headers, inactive tabs, breadcrumb parents. 10:1 on Paper.
- **Ink Tertiary** (#6B6B74): placeholders and meta text. 5.3:1 on Sheet. Never for anything the user must read to complete a task.

### Semantic

- **Danger** (#B91C1C text) on **Danger Wash** (#FEF2F2), with **Danger Fill** (#DC2626) for destructive buttons: errors, destructive actions, overdue amounts.
- **Success** (#15803D) on **Success Wash** (#F0FDF4): completed payments, approved status.
- **Warning** (#A16207) on **Warning Wash** (#FEFCE8): upcoming deadlines, incomplete information.

Every semantic pair reads at 4.75:1 or better. Status is always carried by text or an icon as well as colour.

### Dark theme

Dark mode is a first-class theme for officers in long sessions, not an inversion. Its neutrals are Graphite, a ramp of its own rather than the light greys reversed, and it uses the `dark-` tokens:

- **Surfaces step in tone, about 1.1:1 apart**, so tone still separates areas the way it does in light: Dark Paper (#131316) canvas, Dark Sheet (#1C1C20) for raised content, Dark Well (#25252A) for grouped areas and secondary buttons, Dark Hover Mist (#2E2E34) for hover and the Hairline. Floating layers are Dark Sheet with a Hairline edge (see Elevation), so Well-toned controls inside them still read. Surfaces closer than 1.05:1 read as one flat slab; avoid them.
- **Text stops short of pure white.** Dark Ink (#EDEDF0) reads at 14.5:1 on Sheet; pure white on near-black (17:1 and up) glares over a long session. Dark Ink Secondary (#B4B4BD) is 8.3:1 and Dark Ink Tertiary (#9A9AA5) 6.1:1, and at least 4.5:1 on every dark surface including hover and the selection wash, so the three levels stay clearly apart and all stay readable.
- **Accent:** Dark MYDS Blue (#6394FF), 5.8:1 on Sheet, with Dark Paper text on primary buttons (6.4:1). Selection uses Dark MYDS Blue Wash (#1D2B4D), calmer than a saturated navy; blue text on it reads at 4.8:1.
- **Control Edge** (#71717C) keeps 3.5:1 on Sheet.

The same rules apply: tone, not lines.

### Named Rules

**The One Blue Rule.** MYDS Blue covers no more than 10% of any screen. It marks the next step, the current selection and focus; nothing decorative is ever blue. If two things on a screen are filled blue, one of them is wrong.

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
- **Primary:** MYDS Blue fill, On MYDS Blue text, Label type, no border, no shadow. Comfortable 44px tall with 20px horizontal padding; compact 32px with 12px.
- **Hover / Focus:** hover deepens to MYDS Blue Deep over 150ms. Focus shows a 2px Focus Blue ring offset 2px from the button. Pressed scales nothing; it simply holds the deep colour.
- **Secondary:** Well fill with Ink text and no border; hover moves to Hover Mist. This replaces every outlined button.
- **Ghost:** transparent with Ink Secondary text; hover shows a Well fill. For tertiary actions, toolbars and icon buttons (icon buttons are never boxed).
- **Danger:** Danger Fill (#DC2626) with white text, used only for the final confirmation of a destructive action.

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
- **Focus:** the stroke turns MYDS Blue and a 2px Focus Blue ring appears outside it.
- **Error:** stroke and message turn Danger; the message always says what to do, not just what's wrong.
- **Disabled:** Well background, Ink Tertiary text, stroke removed.
- **Checkbox and radio:** 1.5px Control Edge stroke; checked fills MYDS Blue with an On MYDS Blue mark.

### Navigation

- **Top bar:** Paper background with a single Hairline rule beneath. Items in Label type and Ink Secondary; hover moves to Ink; the current item is Ink with a 2px MYDS Blue underline.
- **Tabs:** one style across the system: the same underline treatment as the top bar. The three tab variants collapse into this one.
- **Mobile:** the menu opens as a full-width Sheet panel with comfortable-density rows (44px), no dividers between items.
- **Desk layout** (`DeskShell`, officer workstations): always compact. A 48px icon rail on the Well with a Hairline on its right; the current section takes the Blue Wash and a 2px MYDS Blue bar on the rail's edge. A 40px top bar (breadcrumbs, underlined section tabs, ⌘K search) and a 28px status bar on the Well in Label Compact. Every destination has a shortcut shown in its tooltip as key caps (`Kbd`); ⌘K opens the command palette and `?` lists every shortcut. On narrow screens the rail opens as a left drawer with labelled rows.

### Data Table (signature component)

The officer's home screen, built to be looked at all day.

- **No outer border or box.** Header row is Paper with Label Compact text in Ink Secondary.
- **Rows:** 48px tall in comfortable density and 40px in compact (52px in comfortable when a row holds actions), content text, separated by a single Hairline divider. Hover fills the row with Well; selection fills it with MYDS Blue Wash.
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
- **Do** keep MYDS Blue (#2563EB) to the primary action, current selection and links: no more than 10% of a screen.
- **Do** use Ink (#18181B) or Ink Secondary (#3F3F46) for any text a user must read; Ink Secondary measures 10:1.
- **Do** ship every component in both densities: comfortable (16px text, 44px controls) for citizens and compact (14px text, 32px controls) for officers.
- **Do** set every amount in tabular figures and right-align it in columns.
- **Do** show status with a wash badge plus text or an icon; colour is never the only signal.
- **Do** design dark mode with the `dark-` tokens and check it as carefully as light.
- **Do** confirm high-stakes moments (payment, submission, deletion) with plain language and a visible result.

### Don't:

- **Don't** look like a **generic Tailwind starter**: no 1px grey outline on every button, tag, card and row, and no boxes inside boxes.
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
