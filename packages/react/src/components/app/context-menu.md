---
title: Context Menu
description: A menu that opens at the pointer on right-click, or long-press on touch, inside an area such as a row in a case list. A shortcut only: its actions must be reachable another way.
category: Overlays
---

## When to use

- Use `ContextMenu` as a shortcut to actions on the thing under the pointer: open, copy reference, assign.
- Every action in it must also be reachable another way, usually a row's overflow `Menu`, because right-click is invisible and hard to reach by keyboard.
- Use `Menu` for actions behind a visible button, and `Menubar` for a row of File and Edit menus.

## Usage

`ContextMenuContent` takes the same item parts as `Menu`. They are exported again under `ContextMenu` names (`ContextMenuItem`, `ContextMenuSeparator`, `ContextMenuSubmenu`, ...); the `Menu` names from `@/components/ui/menu` work too.

```tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSubmenu,
  ContextMenuSubmenuTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MenuContent } from "@/components/ui/menu";

export function CaseRowMenu({
  reference,
  onOpen,
  onAssign,
  onWithdraw,
}: {
  reference: string;
  onOpen: () => void;
  onAssign: (officer: string) => void;
  onWithdraw: () => void;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="bg-bg-washed text-content text-txt-black-900 rounded-md px-3 py-2">
        {reference}: Lifestyle relief, RM 2,500.00
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={onOpen}>
          Open <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => void navigator.clipboard.writeText(reference)}
        >
          Copy reference
        </ContextMenuItem>
        <ContextMenuSubmenu>
          <ContextMenuSubmenuTrigger>Assign to</ContextMenuSubmenuTrigger>
          <MenuContent side="right" align="start" sideOffset={0}>
            <ContextMenuItem onClick={() => onAssign("Nur Aisyah")}>
              Nur Aisyah
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAssign("Tan Wei Ming")}>
              Tan Wei Ming
            </ContextMenuItem>
          </MenuContent>
        </ContextMenuSubmenu>
        <ContextMenuSeparator />
        <ContextMenuItem variant="danger" onClick={onWithdraw}>
          Withdraw application
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

## Notes

- `ContextMenuTrigger` renders a `<div>` and turns off text selection inside it; use `render` to make a table row or list item the trigger.
- The menu opens at the pointer. Positioning props on `ContextMenuContent` (`side`, `align`, `sideOffset`) go to the positioner.
- A submenu's popup is a `MenuContent` from `@/components/ui/menu` inside `ContextMenuSubmenu`.
- Item variants: `variant="danger"` for destructive actions. Checkbox and radio items (`ContextMenuCheckboxItem`, `ContextMenuRadioGroup` with `ContextMenuRadioItem`) hold a setting.
- `ContextMenuShortcut` is a decorative hint; the shortcut must work on its own.
- Arrow keys move through the items, Enter runs one and Esc closes the menu (Base UI ContextMenu).
