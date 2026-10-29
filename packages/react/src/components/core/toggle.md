---
title: Toggle
description: A button that stays pressed until pressed again, such as Bold in an editor toolbar or a "Show archived" filter. Inside a ToggleGroup it becomes a segment.
category: Actions
---

## When to use

- Use `Toggle` for a pressed or unpressed state on a button: text formatting, showing or hiding something in the current view, starring a record.
- Use `ToggleGroup` for a set of toggles where one (or several) is pressed, such as Day, Week, Month.
- Use `Switch` for an on or off setting, and `Checkbox` for a choice sent with a form. Use `Button` for an action that doesn't stay pressed.

## Usage

Uncontrolled with `defaultPressed`, or controlled with `pressed` and `onPressedChange`. An icon-only toggle needs `iconOnly` and an `aria-label`:

```tsx
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { BoldIcon } from "@/components/ui/icons/bold";
import { ItalicIcon } from "@/components/ui/icons/italic";

export function CaseToolbar({
  onShowArchived,
}: {
  onShowArchived: (show: boolean) => void;
}) {
  const [showArchived, setShowArchived] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <Toggle iconOnly aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle iconOnly aria-label="Italic">
        <ItalicIcon />
      </Toggle>
      <Toggle
        pressed={showArchived}
        onPressedChange={(pressed) => {
          setShowArchived(pressed);
          onShowArchived(pressed);
        }}
      >
        Show archived
      </Toggle>
    </div>
  );
}
```

## Notes

- A standalone toggle is a ghost button at rest and takes the Blue Wash when pressed. It reports its state to screen readers with `aria-pressed`.
- Keep the label the same in both states ("Show archived", not "Show" then "Hide"); the pressed look carries the state.
- `size` is `small` (default), `medium` or `large` and follows the density. Icons are sized for you.
- Inside a `ToggleGroup` the toggle takes the group's size and segment style, and its `value` identifies it in the group's value.
