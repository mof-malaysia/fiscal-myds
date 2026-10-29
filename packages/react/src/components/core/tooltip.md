---
title: Tooltip
description: A short text label that appears when a control is hovered or focused. Use it to name icon-only buttons or show a keyboard shortcut, never for information people need.
category: Overlays
---

## When to use

- Use `Tooltip` to show the name of an icon-only button, or its keyboard shortcut, to sighted mouse and keyboard users.
- Use `Popover` for help text with links or controls, `PreviewCard` for a preview of a link's destination, and `FieldDescription` for hints about a form field.
- Don't put anything people must read in a tooltip: touch screens can't hover, so many users never see it.

## Usage

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import { PrinterIcon } from "@/components/ui/icons/printer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PrintReceipt({ onPrint }: { onPrint: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="default-ghost"
            iconOnly
            aria-label="Print receipt"
            onClick={onPrint}
          />
        }
      >
        <ButtonIcon>
          <PrinterIcon />
        </ButtonIcon>
      </TooltipTrigger>
      <TooltipContent>Print receipt</TooltipContent>
    </Tooltip>
  );
}
```

With a keyboard shortcut shown as key caps (`Kbd` with `inverse`, for the dark tooltip surface), placed below the trigger:

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons/search";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SearchCasesButton({ onOpen }: { onOpen: () => void }) {
  return (
    <Tooltip delayDuration={400}>
      <TooltipTrigger
        render={
          <Button
            variant="default-ghost"
            iconOnly
            aria-label="Search cases"
            onClick={onOpen}
          />
        }
      >
        <ButtonIcon>
          <SearchIcon />
        </ButtonIcon>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <span className="flex items-center gap-2">
          Search cases <Kbd combo="mod+k" inverse />
        </span>
      </TooltipContent>
    </Tooltip>
  );
}
```

## Notes

- The tooltip doesn't replace an accessible name: an icon-only button still needs `aria-label`. Keep the tooltip text the same as the label.
- Render the trigger with `render={<Button />}` (or another focusable element) so keyboard users can reach it.
- `delayDuration` is the hover delay in milliseconds (default 200). Each `Tooltip` sets its own delay.
- `TooltipContent` portals to `document.body`, adds the arrow, and forwards `side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding` and the other positioning props.
- `Kbd` only shows a shortcut; bind the key yourself (for example with `useShortcut` from the shortcuts item).
- Keep the text to a few words. The tooltip is at most 250px wide and can't hold links or buttons; anything interactive belongs in a `Popover`.
