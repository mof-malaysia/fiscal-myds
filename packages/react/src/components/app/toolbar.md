---
title: Toolbar
description: Groups the controls that act on one thing, such as formatting above an editor or bulk actions above a table. Arrow keys move between controls; Tab leaves in one step.
category: Actions
---

## When to use

- Use `Toolbar` for a row of related controls on one object: formatting buttons, bulk actions on selected rows, a quick filter with export.
- Use `ToggleGroup` alone for one segmented choice, and `Menubar` for File and Edit menus.
- Page-level actions belong in `PageHeaderActions` as normal `Button`s, not a toolbar.

## Usage

`ToolbarButton` is a ghost button. Render a `Toggle` through it for a button that stays pressed, wrap toggles in a `ToggleGroup` for a segmented choice, and render a `MenuTrigger` through it to open a menu.

```tsx
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarLink,
  ToolbarSeparator,
} from "@/components/ui/toolbar";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { AlignCenterIcon } from "@/components/ui/icons/align-center";
import { AlignLeftIcon } from "@/components/ui/icons/align-left";
import { BoldIcon } from "@/components/ui/icons/bold";
import { ItalicIcon } from "@/components/ui/icons/italic";
import { PrinterIcon } from "@/components/ui/icons/printer";

export function LetterFormatting({ onPrint }: { onPrint: () => void }) {
  return (
    <Toolbar aria-label="Letter formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton render={<Toggle iconOnly aria-label="Bold" />}>
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton render={<Toggle iconOnly aria-label="Italic" />}>
          <ItalicIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
        <ToolbarButton
          render={<Toggle value="left" iconOnly aria-label="Align left" />}
        >
          <AlignLeftIcon />
        </ToolbarButton>
        <ToolbarButton
          render={<Toggle value="center" iconOnly aria-label="Align centre" />}
        >
          <AlignCenterIcon />
        </ToolbarButton>
      </ToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton onClick={onPrint}>
        <PrinterIcon aria-hidden className="size-4" />
        Print
      </ToolbarButton>
      <ToolbarLink href="/help/letters">Help</ToolbarLink>
    </Toolbar>
  );
}
```

Bulk actions above a case list, with a quick filter and a menu:

```tsx
import {
  Toolbar,
  ToolbarButton,
  ToolbarInput,
  ToolbarSeparator,
} from "@/components/ui/toolbar";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { DownloadIcon } from "@/components/ui/icons/download";

export function CaseBulkActions({
  selected,
  onFilter,
  onAssign,
}: {
  selected: number;
  onFilter: (text: string) => void;
  onAssign: (unit: string) => void;
}) {
  return (
    <Toolbar aria-label="Case actions" variant="well">
      <ToolbarInput
        aria-label="Filter cases"
        placeholder="Filter by reference"
        className="w-56"
        onChange={(event) => onFilter(event.currentTarget.value)}
      />
      <ToolbarSeparator />
      <Menu>
        <ToolbarButton render={<MenuTrigger />} disabled={selected === 0}>
          Assign {selected} cases
        </ToolbarButton>
        <MenuContent>
          <MenuItem onClick={() => onAssign("relief")}>
            Relief Assessment Unit
          </MenuItem>
          <MenuItem onClick={() => onAssign("audit")}>Audit Unit</MenuItem>
        </MenuContent>
      </Menu>
      <ToolbarButton>
        <DownloadIcon aria-hidden className="size-4" />
        Export
      </ToolbarButton>
    </Toolbar>
  );
}
```

## Notes

- Give the `Toolbar` an `aria-label`, and every icon-only button an `aria-label` (on the `Toggle` when you render one).
- Arrow keys move focus between the controls and Tab leaves the toolbar in one step (Base UI Toolbar). `orientation="vertical"` stacks it.
- `variant="well"` sets the toolbar on a Well track; `plain` (default) has no background.
- `size` (`small` by default) sizes every control inside relative to the density; set it on the `Toolbar`, not on each control.
- `ToolbarGroup` with `disabled` disables every control in it.
- Prefer spacing between groups. Use `ToolbarSeparator` only when groups would run together.
- Size icons inside `ToolbarButton` yourself (`className="size-4"`) and mark them `aria-hidden` when there is a text label.
