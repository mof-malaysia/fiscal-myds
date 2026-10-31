"use client";

import React, {
  createContext,
  forwardRef,
  isValidElement,
  useContext,
} from "react";
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ToggleGroupContext,
  toggle_cva,
  type ToggleSize,
} from "../core/toggle";
import { combobox_field_box_class } from "./combobox";
import { clx, type WithClassName } from "../../utils";

/**
 * Toolbar groups the controls that act on one thing: formatting buttons above
 * an editor, bulk actions above a table. Arrow keys move between controls and
 * Tab leaves the toolbar in one step (Base UI Toolbar).
 *
 * Buttons are ghost, so the toolbar stays quiet. Render a `Toggle` through
 * `ToolbarButton` for a button that stays pressed, and wrap toggles in a
 * `ToggleGroup` for a segmented choice.
 *
 * @example
 * <Toolbar aria-label="Formatting">
 *   <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
 *     <ToolbarButton render={<Toggle value="left" iconOnly aria-label="Align left" />}>
 *       <AlignLeftIcon />
 *     </ToolbarButton>
 *   </ToggleGroup>
 *   <ToolbarSeparator />
 *   <ToolbarButton>Export</ToolbarButton>
 * </Toolbar>
 */

const toolbar_cva = cva(
  [
    "flex w-fit items-center gap-1",
    "data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  ],
  {
    variants: {
      variant: {
        plain: "",
        // Well track, like ToggleGroup (DESIGN.md: tone, not lines)
        well: "bg-bg-washed rounded-md p-1",
      },
    },
    defaultVariants: {
      variant: "plain",
    },
  },
);

/** Default size for the buttons and inputs inside a toolbar. */
const ToolbarContext = createContext<{ size: ToggleSize }>({ size: "small" });

interface ToolbarProps
  extends
    WithClassName<ToolbarPrimitive.Root.Props>,
    VariantProps<typeof toolbar_cva> {
  /** Size of the controls inside, relative to density. */
  size?: ToggleSize;
}

const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, variant = "plain", size = "small", ...props }, ref) => (
    <ToolbarContext.Provider value={{ size }}>
      <ToolbarPrimitive.Root
        ref={ref}
        data-toolbar={variant}
        className={clx(toolbar_cva({ variant }), className)}
        {...props}
      />
    </ToolbarContext.Provider>
  ),
);
Toolbar.displayName = "Toolbar";

/*========================================================================================================================*/

// On the Well track, hover lifts to the raised tone instead of disappearing into the Well
const toolbar_on_well =
  "in-data-[toolbar=well]:hover:bg-bg-raised in-data-[toolbar=well]:data-[pressed]:bg-bg-primary-50";

interface ToolbarButtonProps extends WithClassName<ToolbarPrimitive.Button.Props> {
  size?: ToggleSize;
  iconOnly?: boolean;
}

/**
 * A ghost button. Pass `render={<Toggle />}` for a pressed state, or
 * `render={<MenuTrigger />}` to open a menu. Icon-only buttons need an `aria-label`.
 */
const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, size, iconOnly: iconOnlyProp, ...props }, ref) => {
    const toolbar = useContext(ToolbarContext);
    // `render={<Toggle iconOnly />}` is icon-only too: without this the toolbar's
    // label-button box wins the class merge and the toggle loses its square width
    const iconOnly =
      iconOnlyProp ??
      (isValidElement<{ iconOnly?: boolean }>(props.render) &&
        props.render.props.iconOnly === true);
    // Inside a ToggleGroup the rendered Toggle styles itself as a segment
    const inGroup = useContext(ToggleGroupContext) !== null;

    return (
      <ToolbarPrimitive.Button
        ref={ref}
        className={
          inGroup
            ? className
            : clx(
                toggle_cva({
                  appearance: "standalone",
                  size: size ?? toolbar.size,
                  iconOnly,
                }),
                toolbar_on_well,
                className,
              )
        }
        {...props}
      />
    );
  },
);
ToolbarButton.displayName = "ToolbarButton";

/** A link that sits among the toolbar's buttons, styled the same. */
const ToolbarLink = forwardRef<
  HTMLAnchorElement,
  WithClassName<ToolbarPrimitive.Link.Props> & { size?: ToggleSize }
>(({ className, size, ...props }, ref) => {
  const toolbar = useContext(ToolbarContext);
  return (
    <ToolbarPrimitive.Link
      ref={ref}
      className={clx(
        toggle_cva({ appearance: "standalone", size: size ?? toolbar.size }),
        toolbar_on_well,
        "no-underline",
        className,
      )}
      {...props}
    />
  );
});
ToolbarLink.displayName = "ToolbarLink";

/** Groups related controls; `disabled` disables all of them. */
const ToolbarGroup = forwardRef<
  HTMLDivElement,
  WithClassName<ToolbarPrimitive.Group.Props>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Group
    ref={ref}
    className={clx(
      "flex items-center gap-1 data-[orientation=vertical]:flex-col",
      className,
    )}
    {...props}
  />
));
ToolbarGroup.displayName = "ToolbarGroup";

/** A short rule between groups. Prefer spacing; use this when groups would otherwise run together. */
const ToolbarSeparator = forwardRef<
  HTMLDivElement,
  WithClassName<ToolbarPrimitive.Separator.Props>
>(({ className, ...props }, ref) => (
  <ToolbarPrimitive.Separator
    ref={ref}
    className={clx(
      "bg-otl-gray-200 shrink-0",
      "data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-5 data-[orientation=vertical]:w-px",
      "data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
      className,
    )}
    {...props}
  />
));
ToolbarSeparator.displayName = "ToolbarSeparator";

const toolbar_input_size = {
  small: "h-[var(--ctl-h-sm)] text-field-sm",
  medium: "h-[var(--ctl-h-md)] text-field-md",
  large: "h-[var(--ctl-h-lg)] text-field-lg",
} as const;

/** A text input inside the toolbar (e.g. a quick filter). Give it an `aria-label`. */
const ToolbarInput = forwardRef<
  HTMLInputElement,
  WithClassName<ToolbarPrimitive.Input.Props> & { size?: ToggleSize }
>(({ className, size, ...props }, ref) => {
  const toolbar = useContext(ToolbarContext);
  return (
    <ToolbarPrimitive.Input
      ref={ref}
      className={clx(
        combobox_field_box_class,
        "placeholder:text-txt-black-500 box-border min-w-0 px-3",
        toolbar_input_size[size ?? toolbar.size],
        className,
      )}
      {...props}
    />
  );
});
ToolbarInput.displayName = "ToolbarInput";

export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarInput,
  toolbar_cva,
};
export type { ToolbarProps, ToolbarButtonProps };
