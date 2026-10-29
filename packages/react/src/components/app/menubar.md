---
title: Menubar
description: A row of menus (File, Edit, View) at the top of a desktop-style officer tool. Once one is open, moving to the next trigger opens that menu instead.
category: Navigation
---

## When to use

- Use `Menubar` for a document-like officer tool with many commands that group naturally into File, Edit and View menus, such as a report or letter editor.
- Use a single `Menu` behind a button for a few actions, and `Toolbar` for a row of buttons that act straight away.
- For site or app navigation, use `Navbar`, `Sidebar` or `DeskShell`'s rail, not a menubar.

## Usage

Each menu is a `MenubarMenu` (the same as `Menu`) with a `MenubarTrigger` and a `MenubarContent`. Every `Menu` item part is exported again under a `Menubar` name.

```tsx
import { useState } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function ReportMenubar({
  onNew,
  onPrint,
  onExport,
}: {
  onNew: () => void;
  onPrint: () => void;
  onExport: () => void;
}) {
  const [sort, setSort] = useState("due");
  return (
    <Menubar aria-label="Report tools">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={onNew}>
            New report <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={onPrint}>
            Print <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
          <MenubarItem onClick={onExport}>Export as PDF</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value={sort} onValueChange={setSort}>
            <MenubarRadioItem value="due">Sort by due date</MenubarRadioItem>
            <MenubarRadioItem value="amount">Sort by amount</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
```

## Notes

- Give the `Menubar` an `aria-label` that names the tool.
- Arrow keys move between triggers and through items; Esc closes the open menu (Base UI Menubar). `orientation="vertical"` stacks the triggers.
- Triggers are ghost buttons that keep the Well fill while their menu is open. They follow the density; don't resize them.
- `MenubarShortcut` is a decorative hint. Bind the shortcut yourself, for example with `useCommands` from the shortcut layer.
- Nested menus use `MenubarSubmenu` with a `MenubarSubmenuTrigger` and a `MenubarContent` inside.
