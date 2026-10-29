---
title: Menu
description: A list of actions that opens from a button: row actions in a table, an account menu, a "More" overflow. Items run an action or go to a page; they don't choose a value.
category: Overlays
---

## When to use

- Use `Menu` for a set of actions behind one trigger, such as a table row's overflow (Edit, Duplicate, Delete) or the account menu in a top bar.
- Use `Select` or `Combobox` to choose a value in a form, `ToggleGroup` for a few always-visible options, and `Popover` for free-form content.
- Use `ContextMenu` for the same items on right-click, `Menubar` for an application menu bar, and `CommandDialog` for a searchable ⌘K palette. They all reuse the item parts on this page.

## Usage

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "@/components/ui/icons/ellipsis-vertical";
import { EditIcon } from "@/components/ui/icons/edit";
import { DuplicateIcon } from "@/components/ui/icons/duplicate";
import { TrashIcon } from "@/components/ui/icons/trash";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuLinkItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";

export function ApplicationRowActions({
  reference,
  onDuplicate,
  onDelete,
}: {
  reference: string;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="default-ghost"
            iconOnly
            aria-label={`Actions for ${reference}`}
          />
        }
      >
        <ButtonIcon>
          <EllipsisVerticalIcon />
        </ButtonIcon>
      </MenuTrigger>
      <MenuContent align="end">
        <MenuLinkItem href={`/applications/${reference}/edit`}>
          <MenuItemIcon>
            <EditIcon />
          </MenuItemIcon>
          Edit
        </MenuLinkItem>
        <MenuItem onClick={onDuplicate}>
          <MenuItemIcon>
            <DuplicateIcon />
          </MenuItemIcon>
          Duplicate
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="danger" onClick={onDelete}>
          <MenuItemIcon>
            <TrashIcon />
          </MenuItemIcon>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
```

Grouped items, checkbox and radio items, a shortcut hint and a submenu. Checkbox items use `checked` with `onCheckedChange`; a radio group uses `value` with `onValueChange`:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuTrigger,
} from "@/components/ui/menu";

export function CaseViewMenu({ onExport }: { onExport: () => void }) {
  const [showClosed, setShowClosed] = useState(false);
  const [sort, setSort] = useState("newest");

  return (
    <Menu>
      <MenuTrigger render={<Button variant="default-outline" />}>
        View
      </MenuTrigger>
      <MenuContent>
        <MenuCheckboxItem checked={showClosed} onCheckedChange={setShowClosed}>
          Show closed cases
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="newest">Newest first</MenuRadioItem>
            <MenuRadioItem value="oldest">Oldest first</MenuRadioItem>
            <MenuRadioItem value="amount">Highest amount</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
        <MenuSeparator />
        <MenuSubmenu>
          <MenuSubmenuTrigger>Export</MenuSubmenuTrigger>
          <MenuContent>
            <MenuItem onClick={onExport}>
              CSV file
              <MenuShortcut>⌘E</MenuShortcut>
            </MenuItem>
            <MenuItem disabled>PDF report</MenuItem>
          </MenuContent>
        </MenuSubmenu>
      </MenuContent>
    </Menu>
  );
}
```

## Notes

- Items run their action with `onClick`, and the menu closes. `MenuLinkItem` renders an `<a>` for items that go to another page; pass `render` to use your router's link.
- `variant="danger"` colours a destructive item red. The item should open an `AlertDialog` to confirm, not delete straight away: control the dialog's `open` from the item's `onClick`.
- An icon-only trigger needs `iconOnly` and an `aria-label` that names the row ("Actions for APP-2026-0042"), so screen reader users can tell the menus apart.
- `MenuContent` portals to `document.body` and forwards `side`, `align`, `sideOffset` and the other positioning props. Defaults: `align="start"`, `sideOffset={4}`. Use `align="end"` for a trigger at the right edge of a row.
- `MenuGroupLabel` must sit inside a `MenuGroup`. Use `inset` on `MenuItem`, `MenuLinkItem` or `MenuSubmenuTrigger` to line plain items up with checkbox and radio items.
- `MenuShortcut` is only a hint; the shortcut must work on its own.
- In a data table, use one overflow menu per row instead of a column of buttons.
