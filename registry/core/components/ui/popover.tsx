"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import {
  clx,
  splitPositionerProps,
  type PositionerProps,
  type WithClassName,
} from "@/lib/ftds/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Floating layer surface with its enter/exit motion: Sheet with the Float shadow
 * (DESIGN.md: Elevation). Shared with PreviewCard and Select.
 */
const floating_popup_class = clx(
  "bg-bg-dialog border-otl-gray-200 shadow-context-menu origin-[var(--transform-origin)] rounded-md border outline-none",
  "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  "motion-reduce:animate-none",
);

interface PopoverContentProps
  extends
    WithClassName<PopoverPrimitive.Popup.Props>,
    PositionerProps<PopoverPrimitive.Positioner.Props> {
  /** A parent element to render the portal into. */
  container?: PopoverPrimitive.Portal.Props["container"];
}

/**
 * Renders `Portal` → `Positioner` → `Popup`. Positioning props (`side`, `align`, `sideOffset`, `alignOffset`, ...)
 * are forwarded to the Positioner.
 */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, container, ...props }, ref) => {
    const [positionerProps, popupProps] = splitPositionerProps(props, {
      align: "center",
      sideOffset: 4,
    });
    return (
      <PopoverPrimitive.Portal container={container}>
        <PopoverPrimitive.Positioner className="z-popup" {...positionerProps}>
          <PopoverPrimitive.Popup
            ref={ref}
            className={clx(
              floating_popup_class,
              "text-txt-black-900 w-72 p-4",
              className,
            )}
            {...popupProps}
          />
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, floating_popup_class };
export type { PopoverContentProps };
