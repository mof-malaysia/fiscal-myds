import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import { Menubar, MenubarTrigger } from "@mof-malaysia/myds-react/menubar";
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
} from "@mof-malaysia/myds-react/menu";

/**
 * ### Overview
 * A row of menus for desktop-style officer tools. Once a menu is open, moving to the
 * next trigger opens that one (Base UI Menubar). Each menu is a core `Menu`, with the
 * same item parts.
 *
 * ### Usage
 * ```tsx
 * <Menubar>
 *   <Menu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenuContent>
 *       <MenuItem>New case</MenuItem>
 *     </MenuContent>
 *   </Menu>
 * </Menubar>
 * ```
 */
const meta: Meta<typeof Menubar> = {
  title: "App/Menubar",
  component: Menubar,
  parameters: { layout: "centered" },
};

export default meta;

const Bar = () => {
  const [sort, setSort] = React.useState("due");
  return (
    <Menubar aria-label="Case tools">
      <Menu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenuContent>
          <MenuItem>
            New case <MenuShortcut>⌘N</MenuShortcut>
          </MenuItem>
          <MenuItem>
            Open… <MenuShortcut>⌘O</MenuShortcut>
          </MenuItem>
          <MenuSubmenu>
            <MenuSubmenuTrigger>Export as</MenuSubmenuTrigger>
            <MenuContent side="right" align="start" sideOffset={0}>
              <MenuItem>PDF</MenuItem>
              <MenuItem>Excel</MenuItem>
            </MenuContent>
          </MenuSubmenu>
          <MenuSeparator />
          <MenuItem>
            Print <MenuShortcut>⌘P</MenuShortcut>
          </MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenuContent>
          <MenuItem>
            Undo <MenuShortcut>⌘Z</MenuShortcut>
          </MenuItem>
          <MenuItem disabled>Redo</MenuItem>
          <MenuSeparator />
          <MenuItem variant="danger">Delete case</MenuItem>
        </MenuContent>
      </Menu>
      <Menu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenuContent>
          <MenuGroup>
            <MenuGroupLabel>Columns</MenuGroupLabel>
            <MenuCheckboxItem defaultChecked>Amount</MenuCheckboxItem>
            <MenuCheckboxItem defaultChecked>Due date</MenuCheckboxItem>
            <MenuCheckboxItem>Officer</MenuCheckboxItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuGroup>
            <MenuGroupLabel>Sort by</MenuGroupLabel>
            <MenuRadioGroup value={sort} onValueChange={setSort}>
              <MenuRadioItem value="due">Due date</MenuRadioItem>
              <MenuRadioItem value="amount">Amount</MenuRadioItem>
            </MenuRadioGroup>
          </MenuGroup>
        </MenuContent>
      </Menu>
      <Menu disabled>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenuContent>
          <MenuItem>Guide</MenuItem>
        </MenuContent>
      </Menu>
    </Menubar>
  );
};

export const Default = createRender(Bar);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Bar />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Bar />
    </div>
  ),
  "dark",
);
