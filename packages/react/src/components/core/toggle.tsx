"use client";

import React, { createContext, forwardRef, useContext } from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { clx } from "../../utils";

/**
 * Toggle is a button that stays pressed, such as Bold in a toolbar or a
 * "Show archived" filter. For an on/off setting, use Switch.
 * Inside a ToggleGroup it becomes one segment of a segmented control.
 *
 * Icon-only toggles need an `aria-label`.
 *
 * @example
 * <Toggle aria-label="Bold"><BoldIcon /></Toggle>
 */

const toggle_cva = cva(
  [
    "inline-flex select-none items-center justify-center gap-1.5 rounded-md",
    "font-body font-medium outline-none transition-colors duration-150 cursor-pointer",
    "focus-ring",
    "data-[disabled]:cursor-not-allowed data-[disabled]:text-txt-black-disabled",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      appearance: {
        // Standalone: ghost at rest, Blue Wash when pressed (DESIGN.md: current selection)
        standalone: [
          "bg-transparent text-txt-black-700 hover:bg-bg-washed hover:text-txt-black-900",
          "data-[pressed]:bg-bg-primary-50 data-[pressed]:text-txt-primary",
        ],
        // Segment of a ToggleGroup: the pressed segment lifts off the Well track
        segment: [
          "rounded-sm bg-transparent text-txt-black-700 hover:text-txt-black-900",
          "data-[pressed]:bg-bg-raised data-[pressed]:text-txt-black-900",
        ],
      },
      size: {
        small: "control-sm text-label-sm",
        medium: "control-md text-label-md",
        large: "control-lg text-label-lg",
      },
      iconOnly: {
        true: "px-0",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "small", className: "control-square-sm" },
      { iconOnly: true, size: "medium", className: "control-square-md" },
      { iconOnly: true, size: "large", className: "control-square-lg" },
      // Segments sit inside the group's 4px padding, so they are 8px shorter
      {
        appearance: "segment",
        size: "small",
        className: "h-[calc(var(--ctl-h-sm)-8px)]",
      },
      {
        appearance: "segment",
        size: "medium",
        className: "h-[calc(var(--ctl-h-md)-8px)]",
      },
      {
        appearance: "segment",
        size: "large",
        className: "h-[calc(var(--ctl-h-lg)-8px)]",
      },
    ],
    defaultVariants: {
      appearance: "standalone",
      size: "small",
      iconOnly: false,
    },
  },
);

type ToggleSize = NonNullable<VariantProps<typeof toggle_cva>["size"]>;

/** The ToggleGroup's size; set so its toggles render as segments of one size. */
const ToggleGroupContext = createContext<ToggleSize | null>(null);

interface ToggleProps<Value extends string = string> extends Omit<
  TogglePrimitive.Props<Value>,
  "className"
> {
  className?: string;
  size?: ToggleSize;
  iconOnly?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, size, iconOnly = false, ...props }, ref) => {
    const groupSize = useContext(ToggleGroupContext);

    return (
      <TogglePrimitive
        ref={ref}
        className={clx(
          toggle_cva({
            appearance: groupSize ? "segment" : "standalone",
            size: size ?? groupSize ?? "small",
            iconOnly,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle, ToggleGroupContext, toggle_cva };
export type { ToggleProps, ToggleSize };
