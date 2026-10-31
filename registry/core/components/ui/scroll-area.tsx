"use client";

import React, { ComponentRef, forwardRef } from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { clx, type WithClassName } from "@/lib/ftds/utils";

/**
 * ScrollArea gives a fixed-size region a native scroll with a thin, quiet scrollbar
 * that appears only while the pointer is over it or the content is scrolling.
 * Keyboard, wheel and touch scrolling stay native; the viewport is focusable so
 * keyboard users can scroll it.
 *
 * Use `ScrollArea` for the common case (viewport plus both scrollbars). Compose the
 * parts (`ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollBar`, `ScrollAreaCorner`)
 * when you need control over which scrollbars render.
 *
 * Give the root a height (or max-height) so it has something to scroll.
 *
 * @example
 * <ScrollArea className="h-72 w-full">
 *   <ul>{items.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
 * </ScrollArea>
 */

const ScrollAreaRoot = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  WithClassName<ScrollAreaPrimitive.Root.Props>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={clx("relative overflow-hidden", className)}
    {...props}
  />
));
ScrollAreaRoot.displayName = "ScrollAreaRoot";

const ScrollAreaViewport = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Viewport>,
  WithClassName<ScrollAreaPrimitive.Viewport.Props>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Viewport
    ref={ref}
    className={clx(
      "size-full rounded-[inherit] outline-none",
      "focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fr-primary",
      className,
    )}
    {...props}
  />
));
ScrollAreaViewport.displayName = "ScrollAreaViewport";

const ScrollAreaThumb = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Thumb>,
  WithClassName<ScrollAreaPrimitive.Thumb.Props>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Thumb
    ref={ref}
    className={clx(
      "bg-bg-black-300 hover:bg-bg-black-400 rounded-full",
      "data-[orientation=vertical]:w-full data-[orientation=horizontal]:h-full",
      className,
    )}
    {...props}
  />
));
ScrollAreaThumb.displayName = "ScrollAreaThumb";

/**
 * One scrollbar with its thumb. Hidden until hover or scroll; fades over 150ms
 * (instant with reduced motion).
 */
const ScrollBar = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Scrollbar>,
  WithClassName<ScrollAreaPrimitive.Scrollbar.Props>
>(({ className, orientation = "vertical", children, ...props }, ref) => (
  <ScrollAreaPrimitive.Scrollbar
    ref={ref}
    orientation={orientation}
    className={clx(
      "flex touch-none select-none p-0.5",
      "opacity-0 transition-opacity duration-150 ease-standard",
      "data-[hovering]:opacity-100 data-[scrolling]:opacity-100 data-[scrolling]:duration-0",
      "motion-reduce:transition-none",
      orientation === "vertical" ? "w-2.5" : "h-2.5 flex-col",
      className,
    )}
    {...props}
  >
    {children ?? <ScrollAreaThumb />}
  </ScrollAreaPrimitive.Scrollbar>
));
ScrollBar.displayName = "ScrollBar";

const ScrollAreaCorner = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Corner>,
  WithClassName<ScrollAreaPrimitive.Corner.Props>
>(({ className, ...props }, ref) => (
  <ScrollAreaPrimitive.Corner
    ref={ref}
    className={clx("bg-transparent", className)}
    {...props}
  />
));
ScrollAreaCorner.displayName = "ScrollAreaCorner";

interface ScrollAreaProps extends WithClassName<ScrollAreaPrimitive.Root.Props> {
  /** Extra classes for the scrolling viewport (e.g. padding). */
  viewportClassName?: string;
  /** Which scrollbars to render. Defaults to both; each only shows when content overflows. */
  scrollbars?: "vertical" | "horizontal" | "both";
}

/** Viewport plus scrollbars in one: the usual way to make a region scroll. */
const ScrollArea = forwardRef<
  ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ children, viewportClassName, scrollbars = "both", ...props }, ref) => (
  <ScrollAreaRoot ref={ref} {...props}>
    <ScrollAreaViewport className={viewportClassName}>
      {children}
    </ScrollAreaViewport>
    {scrollbars !== "horizontal" && <ScrollBar orientation="vertical" />}
    {scrollbars !== "vertical" && <ScrollBar orientation="horizontal" />}
    {scrollbars === "both" && <ScrollAreaCorner />}
  </ScrollAreaRoot>
));
ScrollArea.displayName = "ScrollArea";

export {
  ScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollBar,
  ScrollAreaThumb,
  ScrollAreaCorner,
};
export type { ScrollAreaProps };
