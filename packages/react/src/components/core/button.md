---
title: Button
description: Triggers an action or submits a form. One primary (blue) button per screen; tonal secondary, ghost and danger variants for everything else.
category: Actions
---

## When to use

- Use `Button` for actions: submit, save, continue, open a dialog. To go to another page, render it as a link with `render={<a href="..." />}` (or your router's link) so it navigates like a link.
- Use `Link` for navigation inside text, and `ToggleGroup` or `Toggle` for a pressed/unpressed state.

## Variants

The variant names come from MYDS; what they look like in FTDS:

| `variant`                | Looks like                         | Use for                                                     |
| ------------------------ | ---------------------------------- | ----------------------------------------------------------- |
| `primary-fill` (default) | FTDS Blue fill, white text         | The one primary action on the screen: Continue, Submit, Pay |
| `default-outline`        | Tonal grey (Well) fill, no outline | Secondary actions: Cancel, Back, Save as draft              |
| `default-ghost`          | Transparent, grey text             | Tertiary actions, toolbars, icon buttons                    |
| `primary-outline`        | Blue wash fill, blue text          | A secondary action that must stand out (rare)               |
| `primary-ghost`          | Transparent, blue text             | Low-emphasis actions styled like a link                     |
| `danger-fill`            | Red fill, white text               | Only the final confirmation of a destructive action         |
| `danger-outline`         | Red wash fill, red text            | Starting a destructive flow (Delete…, Withdraw…)            |
| `danger-ghost`           | Transparent, red text              | Destructive row actions in tables and menus                 |

`size` is `small` (default, 44px comfortable / 32px compact), `medium` or `large`; heights follow the density, so don't set heights yourself.

## Usage

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowForwardIcon } from "@/components/ui/icons/arrow-forward";

export function FormActions({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="submit">
        Continue
        <ButtonIcon>
          <ArrowForwardIcon />
        </ButtonIcon>
      </Button>
      <Button type="button" variant="default-outline" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}
```

A button that navigates, and an icon-only button (it needs `iconOnly` and an `aria-label`):

```tsx
import { Button, ButtonIcon, ButtonCounter } from "@/components/ui/button";
import { FilterIcon } from "@/components/ui/icons/filter";

export function Toolbar({ filters }: { filters: number }) {
  return (
    <div className="flex items-center gap-2">
      <Button render={<a href="/applications/new" />}>New application</Button>
      <Button variant="default-ghost" iconOnly aria-label="Filter applications">
        <ButtonIcon>
          <FilterIcon />
        </ButtonIcon>
      </Button>
      <Button variant="default-outline">
        Notifications
        <ButtonCounter>{filters}</ButtonCounter>
      </Button>
    </div>
  );
}
```

## Notes

- Set `type="submit"` or `type="button"` explicitly inside forms; a bare button in a form submits it.
- Wrap icons in `ButtonIcon` so they size and colour with the button; put it before or after the text.
- `ButtonCounter` shows a small count (unread items, applied filters) in the button's colours.
- Disabled buttons can't be focused and don't explain themselves; prefer leaving the button enabled and showing an error when it is pressed too early.
- High-stakes confirmations repeat the verb: the title says "Delete 3 records?", the button says "Delete records".
