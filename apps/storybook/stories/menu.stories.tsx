import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
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
} from "@mof-malaysia/myds-react/menu";
import { Button } from "@mof-malaysia/myds-react/button";

/**
 * ### Overview
 * Menu lists actions behind a trigger. Built on Base UI Menu: arrow keys, typeahead
 * and submenus come for free. Item parts also work inside ContextMenu and Menubar.
 *
 * ### Usage
 * ```tsx
 * <Menu>
 *   <MenuTrigger render={<Button variant="default-outline" />}>Actions</MenuTrigger>
 *   <MenuContent>
 *     <MenuItem>Duplicate</MenuItem>
 *     <MenuSeparator />
 *     <MenuItem variant="danger">Delete</MenuItem>
 *   </MenuContent>
 * </Menu>
 * ```
 */
const meta: Meta<typeof Menu> = {
  title: "Core/Menu",
  component: Menu,
  parameters: { layout: "centered" },
};

export default meta;

const Basic = () => (
  <Menu>
    <MenuTrigger render={<Button variant="default-outline" size="medium" />}>
      Actions
    </MenuTrigger>
    <MenuContent>
      <MenuItem>
        Edit <MenuShortcut>⌘E</MenuShortcut>
      </MenuItem>
      <MenuItem>Duplicate</MenuItem>
      <MenuSubmenu>
        <MenuSubmenuTrigger>Move to</MenuSubmenuTrigger>
        <MenuContent side="right" align="start" sideOffset={0}>
          <MenuItem>Pending review</MenuItem>
          <MenuItem>Approved</MenuItem>
        </MenuContent>
      </MenuSubmenu>
      <MenuSeparator />
      <MenuItem variant="danger">Delete</MenuItem>
    </MenuContent>
  </Menu>
);
export const Default = createRender(Basic);

const Selection = () => {
  const [sort, setSort] = React.useState("newest");
  return (
    <Menu>
      <MenuTrigger render={<Button variant="default-outline" size="medium" />}>
        View
      </MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Columns</MenuGroupLabel>
          <MenuCheckboxItem defaultChecked>Amount</MenuCheckboxItem>
          <MenuCheckboxItem>Due date</MenuCheckboxItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Sort by</MenuGroupLabel>
          <MenuRadioGroup value={sort} onValueChange={setSort}>
            <MenuRadioItem value="newest">Newest first</MenuRadioItem>
            <MenuRadioItem value="oldest">Oldest first</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
};
export const CheckboxAndRadioItems = createRender(Selection);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Basic />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
