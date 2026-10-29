---
title: Styling with FTDS tokens
description: The colour, type, spacing, radius and shadow tokens to use when laying out pages or building something FTDS doesn't have, and the design rules behind them.
order: 3
---

FTDS components are already styled. You need tokens for page layout and for the rare custom component. Every colour token switches automatically in dark mode and follows the density, so never use raw Tailwind palette colours (`bg-blue-600`, `text-gray-500`, `border-gray-200`).

## Surfaces

| Design name    | Use                                                                                 | Class                 |
| -------------- | ----------------------------------------------------------------------------------- | --------------------- |
| Paper          | The page canvas                                                                     | `bg-bg-gray-50`       |
| Sheet          | Raised content: the main panel, cards, inputs                                       | `bg-bg-white`         |
| Well           | Grouped or recessed areas: filter bars, sidebars, summary blocks, secondary buttons | `bg-bg-washed`        |
| Floating layer | Popovers, menus, dialogs (components set it)                                        | `bg-bg-dialog`        |
| Hairline       | The only decorative line: table row dividers, the rule under a top bar              | `border-otl-gray-200` |
| Control edge   | Stroke of inputs, checkboxes, radios (components set it)                            | `border-otl-control`  |

Group things with spacing and tone (Paper, Sheet, Well) before reaching for a line. Cards are never nested and never bordered.

## Text

| Design name   | Use                                                           | Class                                                     |
| ------------- | ------------------------------------------------------------- | --------------------------------------------------------- |
| Ink           | Headings and body text                                        | `text-txt-black-900`                                      |
| Ink Secondary | Supporting text, hints, table headers                         | `text-txt-black-700`                                      |
| Ink Tertiary  | Placeholders and metadata only, never text the user must read | `text-txt-black-500`                                      |
| Primary       | Links and the selected item                                   | `text-txt-primary`                                        |
| Status        | Error, success and warning text                               | `text-txt-danger`, `text-txt-success`, `text-txt-warning` |

## Colour

- **FTDS Blue** is `bg-bg-primary-600` (hover `bg-bg-primary-700`) with `text-txt-white`; its wash is `bg-bg-primary-50`. It marks the primary action, the current selection and focus, and covers at most 10% of a screen. One filled blue thing per screen.
- **Status colours are washes**: `bg-bg-danger-50` with `text-txt-danger`, `bg-bg-success-50` with `text-txt-success`, `bg-bg-warning-50` with `text-txt-warning`. The only saturated fills are the primary and danger buttons. Prefer `Tag`, `Callout` and `Pill` over hand-made status styles.
- Scales run 50 to 950 for `bg-bg-primary-*`, `bg-bg-danger-*`, `bg-bg-success-*` and `bg-bg-warning-*`; `-disabled` variants exist for each family.

## Type

Inter is the only typeface, at weights 400, 500 and 600 only (`font-normal`, `font-medium`, `font-semibold`). Use the hierarchy utilities:

| Utility              | Size                           | Use                                                                      |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `text-display`       | 32px                           | Page title on a service landing screen; at most one per page             |
| `text-headline`      | 24px                           | Section titles, high-stakes dialog titles                                |
| `text-title`         | 18px                           | Card, panel and form section headings                                    |
| `text-content`       | 16px comfortable, 14px compact | Reading text inside layouts and panels                                   |
| `text-label-compact` | 13px                           | Table headers and captions in compact density; the smallest size allowed |

Add the weight yourself (`text-title font-semibold`). Set every amount in tabular figures (`tabular-nums`) and right-align amounts in columns. Citizen-facing text is never smaller than 16px; cap prose at about 70 characters (`max-w-prose`).

## Spacing and density

Spacing that follows the density: `p-surface` (24px comfortable, 16px compact) for panel padding, and `gap-stack-lg`, `gap-stack-md`, `gap-stack-sm` (24/16/12px comfortable, 16/12/8px compact) between groups. Ordinary Tailwind spacing (`gap-4`, `p-6`) is fine where the density shouldn't change it.

Control sizing utilities (`control-sm`, `control-md`, `control-lg`, `control-square-*`, `text-label-*`, `text-field-*`) give a custom control the same height and type as FTDS controls in either density.

## Shape and depth

- Radius: `rounded-md` (8px) for controls, `rounded-lg` (12px) for cards and dialogs, `rounded-full` for tags and pills.
- Flat by default: no shadow on buttons, inputs, cards or rows. Only floating layers get `shadow-context-menu` (menus, popovers, toasts) or `shadow-dialog` (dialogs and sheets); FTDS components already apply them.
- Focus: add `focus-ring` (or `focus-ring-inset` inside scroll containers) to any custom focusable element. Never remove a focus style.
- Motion: state changes only, 150 to 200ms, `ease-standard`; respect `prefers-reduced-motion` (`motion-reduce:transition-none`).

## A custom section, done right

```tsx
import { Tag } from "@/components/ui/tag";

export function PaymentDue({
  amount,
  dueDate,
}: {
  amount: string;
  dueDate: string;
}) {
  return (
    <section className="gap-stack-sm bg-bg-white p-surface flex flex-col rounded-lg">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-title text-txt-black-900 font-semibold">
          Tax payable
        </h2>
        <Tag variant="warning">Due {dueDate}</Tag>
      </div>
      <p className="text-content text-txt-black-700">
        Pay before the due date to avoid a late payment penalty.
      </p>
      <p className="text-headline text-txt-black-900 font-semibold tabular-nums">
        RM {amount}
      </p>
    </section>
  );
}
```

## Anti-patterns

Don't make FTDS look like a generic Tailwind starter (grey 1px outlines on every card, button and row; boxes inside boxes), an old government portal (crests and banners everywhere, gradients, tiny text), flashy fintech (neon, dark gradients, glassmorphism) or stiff corporate banking (navy and gold, heavy serifs). The [design principles](https://raw.githubusercontent.com/mof-malaysia/ftds/main/DESIGN.md) explain every rule in detail.
