"use client";

import React, {
  ComponentProps,
  ComponentRef,
  forwardRef,
  ReactElement,
} from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, VariantProps } from "class-variance-authority";
import { CheckIcon } from "@/components/ui/icons/check";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import {
  clx,
  splitPositionerProps,
  type PositionerProps,
  type WithClassName,
} from "@/lib/ftds/utils";

/**
 * Menu lists actions behind a trigger: row actions in a table, an account menu,
 * "More" overflow. Items run an action; for choosing a value, use Select.
 *
 * The item parts (`MenuItem`, `MenuCheckboxItem`, `MenuSeparator`, ...) also work
 * inside ContextMenu and Menubar.
 *
 * @example
 * <Menu>
 *   <MenuTrigger render={<Button variant="default-ghost" iconOnly aria-label="More" />}>
 *     <EllipsisIcon />
 *   </MenuTrigger>
 *   <MenuContent>
 *     <MenuItem>Duplicate</MenuItem>
 *     <MenuSeparator />
 *     <MenuItem variant="danger">Delete</MenuItem>
 *   </MenuContent>
 * </Menu>
 */

const Menu = MenuPrimitive.Root;

const MenuTrigger = MenuPrimitive.Trigger;

const MenuGroup = MenuPrimitive.Group;

const MenuRadioGroup = MenuPrimitive.RadioGroup;

/** Wraps a nested menu: `<MenuSubmenu><MenuSubmenuTrigger /><MenuContent /></MenuSubmenu>`. */
const MenuSubmenu = MenuPrimitive.SubmenuRoot;

/*========================================================================================================================*/

/** Floating layer: Sheet with the Float shadow (DESIGN.md: Elevation). */
const menu_popup_cva = cva([
  "bg-bg-dialog border-otl-gray-200 shadow-context-menu min-w-[12rem] rounded-md border p-1 outline-none",
  "max-h-[var(--available-height)] overflow-y-auto origin-[var(--transform-origin)]",
  "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
  "motion-reduce:animate-none",
]);

interface MenuContentProps
  extends WithClassName<MenuPrimitive.Popup.Props>,
    PositionerProps<MenuPrimitive.Positioner.Props> {
  /** Element to portal the popup into. Defaults to `document.body`. */
  container?: MenuPrimitive.Portal.Props["container"];
}

/** Renders `Portal` → `Positioner` → `Popup`; positioning props go to the Positioner. */
const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ className, container, ...props }, ref) => {
    const [positionerProps, popupProps] = splitPositionerProps(props, {
      align: "start",
      sideOffset: 4,
    });
    return (
      <MenuPrimitive.Portal container={container}>
        <MenuPrimitive.Positioner
          className="z-popup outline-none"
          {...positionerProps}
        >
          <MenuPrimitive.Popup
            ref={ref}
            className={menu_popup_cva({ className })}
            {...popupProps}
          />
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    );
  },
);
MenuContent.displayName = "MenuContent";

/*========================================================================================================================*/

/** Item box and type without state styles; shared with CommandItem (cmdk's data attributes differ). */
const menu_item_layout_class = clx(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2.5 py-2 outline-none",
  "font-body text-label-md font-medium transition-colors duration-150",
  "[&>svg]:size-4 [&>svg]:shrink-0",
);

const menu_item_cva = cva(
  [
    menu_item_layout_class,
    "data-[disabled]:cursor-not-allowed data-[disabled]:text-txt-black-disabled",
  ],
  {
    variants: {
      variant: {
        default:
          "text-txt-black-700 data-[highlighted]:bg-bg-washed data-[highlighted]:text-txt-black-900",
        danger: "text-txt-danger data-[highlighted]:bg-bg-danger-50",
      },
      inset: {
        // Leaves room for the check/radio indicator column
        true: "pl-8",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
    },
  },
);

interface MenuItemProps
  extends WithClassName<MenuPrimitive.Item.Props>,
    VariantProps<typeof menu_item_cva> {}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, variant, inset, ...props }, ref) => (
    <MenuPrimitive.Item
      ref={ref}
      className={menu_item_cva({ variant, inset, className })}
      {...props}
    />
  ),
);
MenuItem.displayName = "MenuItem";

/** A menu item that navigates. Renders an `<a>`. */
const MenuLinkItem = forwardRef<
  HTMLAnchorElement,
  WithClassName<MenuPrimitive.LinkItem.Props> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenuPrimitive.LinkItem
    ref={ref}
    className={menu_item_cva({ inset, className })}
    {...props}
  />
));
MenuLinkItem.displayName = "MenuLinkItem";

/*========================================================================================================================*/

/** Check/radio indicator column, shared with Combobox items. */
const menu_indicator_class =
  "absolute left-2.5 flex size-4 items-center justify-center text-txt-primary";

const MenuCheckboxItem = forwardRef<
  ComponentRef<typeof MenuPrimitive.CheckboxItem>,
  WithClassName<MenuPrimitive.CheckboxItem.Props>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.CheckboxItem
    ref={ref}
    className={menu_item_cva({ inset: true, className })}
    {...props}
  >
    <MenuPrimitive.CheckboxItemIndicator className={menu_indicator_class}>
      <CheckIcon className="size-4" />
    </MenuPrimitive.CheckboxItemIndicator>
    {children}
  </MenuPrimitive.CheckboxItem>
));
MenuCheckboxItem.displayName = "MenuCheckboxItem";

const MenuRadioItem = forwardRef<
  ComponentRef<typeof MenuPrimitive.RadioItem>,
  WithClassName<MenuPrimitive.RadioItem.Props>
>(({ className, children, ...props }, ref) => (
  <MenuPrimitive.RadioItem
    ref={ref}
    className={menu_item_cva({ inset: true, className })}
    {...props}
  >
    <MenuPrimitive.RadioItemIndicator className={menu_indicator_class}>
      <span className="size-2 rounded-full bg-current" />
    </MenuPrimitive.RadioItemIndicator>
    {children}
  </MenuPrimitive.RadioItem>
));
MenuRadioItem.displayName = "MenuRadioItem";

/*========================================================================================================================*/

const MenuSubmenuTrigger = forwardRef<
  ComponentRef<typeof MenuPrimitive.SubmenuTrigger>,
  WithClassName<MenuPrimitive.SubmenuTrigger.Props> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
  <MenuPrimitive.SubmenuTrigger
    ref={ref}
    className={menu_item_cva({
      inset,
      className: clx("data-[popup-open]:bg-bg-washed", className),
    })}
    {...props}
  >
    {children}
    <ChevronRightIcon
      className="text-txt-black-700 ml-auto size-4"
      aria-hidden
    />
  </MenuPrimitive.SubmenuTrigger>
));
MenuSubmenuTrigger.displayName = "MenuSubmenuTrigger";

/*========================================================================================================================*/

const menu_group_label_class =
  "font-body text-txt-black-700 px-2.5 pt-2 pb-1 text-label-compact font-medium";

const MenuGroupLabel = forwardRef<
  ComponentRef<typeof MenuPrimitive.GroupLabel>,
  WithClassName<MenuPrimitive.GroupLabel.Props>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.GroupLabel
    ref={ref}
    className={clx(menu_group_label_class, className)}
    {...props}
  />
));
MenuGroupLabel.displayName = "MenuGroupLabel";

const menu_separator_class = "bg-otl-gray-200 -mx-1 my-1 h-px";

/** Hairline between groups of items. */
const MenuSeparator = forwardRef<
  HTMLDivElement,
  WithClassName<MenuPrimitive.Separator.Props>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    className={clx(menu_separator_class, className)}
    {...props}
  />
));
MenuSeparator.displayName = "MenuSeparator";

/** Keyboard shortcut hint at the end of an item. Decorative: the shortcut must work on its own. */
const MenuShortcut = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    className={clx(
      "text-txt-black-500 text-label-compact ml-auto pl-4 font-normal tracking-wide",
      className,
    )}
    {...props}
  />
);
MenuShortcut.displayName = "MenuShortcut";

/*========================================================================================================================*/

const menu_item_icon_class =
  "block stroke-inherit text-inherit stroke-[1.5px] size-4 shrink-0";

interface MenuItemIconProps extends ComponentProps<"div"> {
  children: ReactElement;
}

/** Applies icon sizing to its single child element. */
const MenuItemIcon = forwardRef<HTMLDivElement, MenuItemIconProps>(
  ({ children, className, ...props }, ref) =>
    useRender({
      render: children,
      ref,
      props: mergeProps<"div">(
        { className: clx(menu_item_icon_class, className) },
        props,
      ),
    }),
);
MenuItemIcon.displayName = "MenuItemIcon";

export {
  Menu,
  MenuTrigger,
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
  menu_popup_cva,
  menu_item_cva,
  menu_item_layout_class,
  menu_indicator_class,
  menu_group_label_class,
  menu_separator_class,
};
export type { MenuContentProps, MenuItemProps };
