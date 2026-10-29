"use client";

import React, { forwardRef } from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import {
  menu_popup_cva,
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
import {
  clx,
  splitPositionerProps,
  type PositionerProps,
  type WithClassName,
} from "../../utils";

/**
 * ContextMenu opens a menu at the pointer on right-click (or long-press on
 * touch) inside an area, such as a row in a case list. It is a shortcut: every
 * action in it must also be reachable another way, such as a row's overflow menu.
 *
 * Base UI ContextMenu shares Menu's item parts, so `MenuItem`, `MenuCheckboxItem`,
 * `MenuSeparator` and the rest from core/menu work inside `ContextMenuContent`.
 *
 * @example
 * <ContextMenu>
 *   <ContextMenuTrigger>Right-click this case</ContextMenuTrigger>
 *   <ContextMenuContent>
 *     <MenuItem>Open</MenuItem>
 *     <MenuSeparator />
 *     <MenuItem variant="danger">Delete</MenuItem>
 *   </ContextMenuContent>
 * </ContextMenu>
 */

const ContextMenu = ContextMenuPrimitive.Root;

type ContextMenuTriggerProps =
  WithClassName<ContextMenuPrimitive.Trigger.Props>;

/** The area that responds to right-click. Renders a `<div>`; use `render` for another element. */
const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Trigger
      ref={ref}
      className={clx("select-none", className)}
      {...props}
    />
  ),
);
ContextMenuTrigger.displayName = "ContextMenuTrigger";

interface ContextMenuContentProps
  extends WithClassName<ContextMenuPrimitive.Popup.Props>,
    PositionerProps<ContextMenuPrimitive.Positioner.Props> {
  /** Element to portal the popup into. Defaults to `document.body`. */
  container?: ContextMenuPrimitive.Portal.Props["container"];
}

/** Renders `Portal` → `Positioner` → `Popup`, styled like MenuContent. */
const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, container, ...props }, ref) => {
    // No defaults: Base UI places a root context menu at the pointer
    const [positionerProps, popupProps] = splitPositionerProps(props);
    return (
      <ContextMenuPrimitive.Portal container={container}>
        <ContextMenuPrimitive.Positioner
          className="z-popup outline-none"
          {...positionerProps}
        >
          <ContextMenuPrimitive.Popup
            ref={ref}
            className={menu_popup_cva({ className })}
            {...popupProps}
          />
        </ContextMenuPrimitive.Positioner>
      </ContextMenuPrimitive.Portal>
    );
  },
);
ContextMenuContent.displayName = "ContextMenuContent";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  // Same parts as core/menu, re-exported under ContextMenu names for convenience
  MenuItem as ContextMenuItem,
  MenuLinkItem as ContextMenuLinkItem,
  MenuItemIcon as ContextMenuItemIcon,
  MenuCheckboxItem as ContextMenuCheckboxItem,
  MenuRadioGroup as ContextMenuRadioGroup,
  MenuRadioItem as ContextMenuRadioItem,
  MenuGroup as ContextMenuGroup,
  MenuGroupLabel as ContextMenuGroupLabel,
  MenuSeparator as ContextMenuSeparator,
  MenuShortcut as ContextMenuShortcut,
  MenuSubmenu as ContextMenuSubmenu,
  MenuSubmenuTrigger as ContextMenuSubmenuTrigger,
};
export type { ContextMenuTriggerProps, ContextMenuContentProps };
