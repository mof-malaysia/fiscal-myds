import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@mof-malaysia/myds-react/context-menu";
import {
  MenuCheckboxItem,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from "@mof-malaysia/myds-react/menu";

/**
 * ### Overview
 * Opens a menu at the pointer on right-click (long-press on touch). A shortcut only:
 * every action must also be reachable another way. Built on Base UI ContextMenu,
 * which shares Menu's item parts, so the core/menu items work inside it.
 *
 * ### Usage
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger>…</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <MenuItem>Open</MenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 * ```
 */
const meta: Meta<typeof ContextMenu> = {
  title: "App/ContextMenu",
  component: ContextMenu,
  parameters: { layout: "centered" },
};

export default meta;

const Area = () => (
  <ContextMenu>
    <ContextMenuTrigger className="bg-bg-washed text-txt-black-700 text-content grid h-48 w-80 place-content-center rounded-lg text-center">
      Right-click case LHDN-2024-0192
    </ContextMenuTrigger>
    <ContextMenuContent>
      <MenuItem>
        Open <MenuShortcut>↵</MenuShortcut>
      </MenuItem>
      <MenuItem>Copy reference</MenuItem>
      <MenuSubmenu>
        <MenuSubmenuTrigger>Assign to</MenuSubmenuTrigger>
        <MenuContent side="right" align="start" sideOffset={0}>
          <MenuItem>Nur Aisyah</MenuItem>
          <MenuItem>Tan Wei Ming</MenuItem>
        </MenuContent>
      </MenuSubmenu>
      <MenuCheckboxItem defaultChecked>Flag for review</MenuCheckboxItem>
      <MenuSeparator />
      <MenuItem variant="danger">Delete</MenuItem>
    </ContextMenuContent>
  </ContextMenu>
);

export const Default = createRender(Area);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Area />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Area />
    </div>
  ),
  "dark",
);
