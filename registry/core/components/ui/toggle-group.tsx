"use client";

import React, { forwardRef } from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { ToggleGroupContext, type ToggleSize } from "@/components/ui/toggle";
import { clx } from "@/lib/ftds/utils";

/**
 * ToggleGroup is a segmented control: a short set of Toggles where one (or, with
 * `multiple`, several) can be pressed, such as switching a list between
 * "Day", "Week" and "Month". Arrow keys move between segments.
 *
 * @example
 * <ToggleGroup defaultValue={["week"]} aria-label="Period">
 *   <Toggle value="day">Day</Toggle>
 *   <Toggle value="week">Week</Toggle>
 *   <Toggle value="month">Month</Toggle>
 * </ToggleGroup>
 */

interface ToggleGroupProps<Value extends string = string>
  extends Omit<ToggleGroupPrimitive.Props<Value>, "className"> {
  className?: string;
  size?: ToggleSize;
}

const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, size = "small", ...props }, ref) => (
    <ToggleGroupContext.Provider value={size}>
      <ToggleGroupPrimitive
        ref={ref}
        className={clx(
          // Well track, no outline (DESIGN.md: tone, not lines)
          "bg-bg-washed inline-flex w-fit gap-1 rounded-md p-1",
          "data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      />
    </ToggleGroupContext.Provider>
  ),
);
ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup };
export type { ToggleGroupProps };
