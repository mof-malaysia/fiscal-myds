"use client";

import React, { forwardRef } from "react";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLinkItem,
  MenuItemIcon,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuShortcut,
  MenuSubmenu,
  MenuSubmenuTrigger,
} from "../core/menu";
import { toggle_cva } from "../core/toggle";
import { clx, type WithClassName } from "../../utils";

/**
 * Menubar is the row of menus at the top of a desktop-style officer tool
 * (File, Edit, View). Once one menu is open, hovering or arrowing to the next
 * trigger opens that one instead (Base UI Menubar).
 *
 * Each menu is a `Menu` from core/menu; the item parts are the same.
 *
 * @example
 * <Menubar>
 *   <Menu>
 *     <MenubarTrigger>File</MenubarTrigger>
 *     <MenuContent>
 *       <MenuItem>New case <MenuShortcut>⌘N</MenuShortcut></MenuItem>
 *       <MenuSeparator />
 *       <MenuItem>Print</MenuItem>
 *     </MenuContent>
 *   </Menu>
 * </Menubar>
 */

type MenubarProps = WithClassName<MenubarPrimitive.Props>;

const Menubar = forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive
      ref={ref}
      className={clx(
        "flex w-fit items-center gap-1",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
        className,
      )}
      {...props}
    />
  ),
);
Menubar.displayName = "Menubar";

type MenubarTriggerProps = WithClassName<MenuPrimitive.Trigger.Props>;

/** A ghost toolbar button; holds the Well fill while its menu is open. */
const MenubarTrigger = forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  ({ className, ...props }, ref) => (
    <MenuPrimitive.Trigger
      ref={ref}
      className={clx(
        toggle_cva({ appearance: "standalone", size: "small" }),
        // Narrower than a standalone button: menubar labels sit close together
        "px-3 in-data-[density=compact]:px-2.5",
        "data-[popup-open]:bg-bg-washed data-[popup-open]:text-txt-black-900",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  ),
);
MenubarTrigger.displayName = "MenubarTrigger";

export {
  Menubar,
  MenubarTrigger,
  // Re-exported so a menubar can be built from one import
  Menu as MenubarMenu,
  MenuContent as MenubarContent,
  MenuItem as MenubarItem,
  MenuLinkItem as MenubarLinkItem,
  MenuItemIcon as MenubarItemIcon,
  MenuCheckboxItem as MenubarCheckboxItem,
  MenuRadioGroup as MenubarRadioGroup,
  MenuRadioItem as MenubarRadioItem,
  MenuGroup as MenubarGroup,
  MenuGroupLabel as MenubarGroupLabel,
  MenuSeparator as MenubarSeparator,
  MenuShortcut as MenubarShortcut,
  MenuSubmenu as MenubarSubmenu,
  MenuSubmenuTrigger as MenubarSubmenuTrigger,
};
export type { MenubarProps, MenubarTriggerProps };
