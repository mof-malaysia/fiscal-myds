"use client";

import React, { ComponentRef, forwardRef } from "react";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { clx } from "@/lib/ftds/utils";

/**
 * Separator draws a single Hairline between two groups of content, horizontal or
 * vertical, and is announced to screen readers as a separator.
 *
 * Lines must earn their place (DESIGN.md: separate with space and tone, not lines).
 * Reach for spacing or a tonal surface (Paper, Sheet, Well) first. A Separator is
 * right for the single rule under a top bar, between toolbar groups, or between
 * menu sections; it is wrong between cards, inside cards, or between every list item.
 *
 * Pass `decorative` when the line only repeats a split that is already obvious, so
 * screen readers skip it.
 *
 * @example
 * <div className="flex h-5 items-center gap-3">
 *   <span>Draft</span>
 *   <Separator orientation="vertical" />
 *   <span>Updated 3 May 2026</span>
 * </div>
 */

interface SeparatorProps extends Omit<SeparatorPrimitive.Props, "className"> {
  className?: string;
  /** Hide the line from assistive technology when it is purely visual. */
  decorative?: boolean;
}

const Separator = forwardRef<
  ComponentRef<typeof SeparatorPrimitive>,
  SeparatorProps
>(
  (
    { className, orientation = "horizontal", decorative = false, ...props },
    ref,
  ) => {
    return (
      <SeparatorPrimitive
        ref={ref}
        orientation={orientation}
        aria-hidden={decorative || undefined}
        className={clx(
          "bg-otl-gray-200 shrink-0",
          orientation === "vertical" ? "w-px self-stretch" : "h-px w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";

export { Separator };
export type { SeparatorProps };
