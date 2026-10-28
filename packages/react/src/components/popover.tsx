"use client";

import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";

import { clx } from "../utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

type PopoverPositionerProps = Pick<
  PopoverPrimitive.Positioner.Props,
  | "side"
  | "align"
  | "sideOffset"
  | "alignOffset"
  | "anchor"
  | "collisionAvoidance"
  | "collisionPadding"
  | "sticky"
  | "positionMethod"
  | "arrowPadding"
>;

interface PopoverContentProps
  extends Omit<PopoverPrimitive.Popup.Props, "className">,
    PopoverPositionerProps {
  className?: string;
  /** A parent element to render the portal into. */
  container?: PopoverPrimitive.Portal.Props["container"];
}

/**
 * Renders `Portal` → `Positioner` → `Popup`. Positioning props (`side`, `align`, `sideOffset`, `alignOffset`, ...)
 * are forwarded to the Positioner.
 */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      container,
      side,
      align = "center",
      sideOffset = 4,
      alignOffset,
      anchor,
      collisionAvoidance,
      collisionPadding,
      sticky,
      positionMethod,
      arrowPadding,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Positioner
        className="z-50"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionAvoidance={collisionAvoidance}
        collisionPadding={collisionPadding}
        sticky={sticky}
        positionMethod={positionMethod}
        arrowPadding={arrowPadding}
      >
        <PopoverPrimitive.Popup
          ref={ref}
          className={clx(
            "border-otl-gray-200 bg-bg-dialog text-txt-black-900 shadow-context-menu data-[open]:animate-in data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-[var(--transform-origin)] rounded-md border p-4 outline-none",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
