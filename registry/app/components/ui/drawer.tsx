"use client";

import React, {
  ComponentProps,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cva } from "class-variance-authority";
import { CrossIcon } from "@/components/ui/icons/cross";
import { Button } from "@/components/ui/button";
import { clx, type WithClassName } from "@/lib/ftds/utils";

/**
 * Drawer is a panel that slides in from an edge of the screen and can be
 * swiped away: a bottom sheet of filters on a phone, or a side panel with a
 * case's details beside a list. Focus is trapped while it is open and Esc,
 * the close button, the scrim and a swipe all dismiss it (Base UI Drawer).
 *
 * `side` sets the edge and the swipe direction together (bottom by default).
 *
 * @example
 * <Drawer side="right">
 *   <DrawerTrigger render={<Button variant="default-outline" />}>Filters</DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Filters</DrawerTitle>
 *       <DrawerDescription>Narrow the list of applications.</DrawerDescription>
 *     </DrawerHeader>
 *     <DrawerBody>…</DrawerBody>
 *     <DrawerFooter>
 *       <DrawerClose render={<Button variant="default-outline" />}>Cancel</DrawerClose>
 *       <Button>Apply</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 */

type DrawerSide = "bottom" | "top" | "left" | "right";

const swipe_direction = {
  bottom: "down",
  top: "up",
  left: "left",
  right: "right",
} as const;

const DrawerSideContext = createContext<DrawerSide>("bottom");

interface DrawerProps<
  Payload = unknown,
> extends DrawerPrimitive.Root.Props<Payload> {
  /** The edge the drawer slides in from. Also sets `swipeDirection`. */
  side?: DrawerSide;
}

function Drawer<Payload = unknown>({
  side = "bottom",
  swipeDirection,
  ...props
}: DrawerProps<Payload>) {
  return (
    <DrawerSideContext.Provider value={side}>
      <DrawerPrimitive.Root
        swipeDirection={swipeDirection ?? swipe_direction[side]}
        {...props}
      />
    </DrawerSideContext.Provider>
  );
}
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

/*========================================================================================================================*/

const drawer_viewport_cva = cva("fixed inset-0 z-modal flex", {
  variants: {
    side: {
      bottom: "items-end justify-center",
      top: "items-start justify-center",
      left: "items-stretch justify-start",
      right: "items-stretch justify-end",
    },
  },
});

const drawer_popup_cva = cva(
  [
    "bg-bg-white text-txt-black-900 shadow-dialog font-body relative box-border flex flex-col overflow-hidden outline-none",
    "transition-transform duration-200 ease-standard motion-reduce:transition-none",
    "data-[swiping]:select-none data-[swiping]:duration-0",
    // A fast swipe closes faster
    "data-[ending-style]:duration-[calc(var(--drawer-swipe-strength,1)*200ms)]",
  ],
  {
    variants: {
      side: {
        bottom: [
          "w-full max-h-[85dvh] rounded-t-lg",
          "[transform:translateY(calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)))]",
          "data-[starting-style]:[transform:translateY(100%)] data-[ending-style]:[transform:translateY(100%)]",
        ],
        top: [
          "w-full max-h-[85dvh] rounded-b-lg",
          "[transform:translateY(var(--drawer-swipe-movement-y,0px))]",
          "data-[starting-style]:[transform:translateY(-100%)] data-[ending-style]:[transform:translateY(-100%)]",
        ],
        left: [
          "h-full w-[min(24rem,calc(100vw-3rem))] rounded-r-lg",
          "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
          "data-[starting-style]:[transform:translateX(-100%)] data-[ending-style]:[transform:translateX(-100%)]",
        ],
        right: [
          "h-full w-[min(24rem,calc(100vw-3rem))] rounded-l-lg",
          "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
          "data-[starting-style]:[transform:translateX(100%)] data-[ending-style]:[transform:translateX(100%)]",
        ],
      },
    },
  },
);

interface DrawerContentProps extends WithClassName<DrawerPrimitive.Popup.Props> {
  /** Element to portal the drawer into. Defaults to `document.body`. */
  container?: DrawerPrimitive.Portal.Props["container"];
  /** Keep the drawer's contents mounted (and hidden) while it is closed. */
  keepMounted?: DrawerPrimitive.Portal.Props["keepMounted"];
  /** Show the grab handle. Defaults to `true` for bottom drawers only. */
  handle?: boolean;
  /** Hide the ghost close button in the top corner. */
  hideClose?: boolean;
  /** Accessible label of the close button. */
  closeLabel?: string;
}

/**
 * Renders `Portal` → scrim (Ink at 40%) → `Viewport` → `Popup` (Sheet with the Lift shadow).
 * The scrim fades as the drawer is swiped.
 */
const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  (
    {
      className,
      container,
      keepMounted,
      handle,
      hideClose = false,
      closeLabel = "Close",
      children,
      ...props
    },
    ref,
  ) => {
    const side = useContext(DrawerSideContext);
    const showHandle = handle ?? side === "bottom";

    return (
      <DrawerPrimitive.Portal container={container} keepMounted={keepMounted}>
        <DrawerPrimitive.Backdrop
          className={clx(
            "bg-scrim z-overlay fixed inset-0 min-h-dvh",
            "opacity-[calc(0.4*(1-var(--drawer-swipe-progress,0)))]",
            "ease-standard transition-opacity duration-200 motion-reduce:transition-none",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "data-[ending-style]:duration-[calc(var(--drawer-swipe-strength,1)*200ms)] data-[swiping]:duration-0",
          )}
        />
        <DrawerPrimitive.Viewport className={drawer_viewport_cva({ side })}>
          <DrawerPrimitive.Popup
            ref={ref}
            className={clx(drawer_popup_cva({ side }), className)}
            {...props}
          >
            {showHandle && (
              <div
                aria-hidden
                className="bg-bg-black-300 mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full"
              />
            )}
            <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col">
              {children}
            </DrawerPrimitive.Content>
            {!hideClose && (
              <DrawerPrimitive.Close
                className={clx(
                  "absolute right-4 grid place-content-center",
                  showHandle ? "top-5" : "top-4",
                )}
                render={
                  <Button variant="default-ghost" size="small" iconOnly />
                }
              >
                <CrossIcon className="size-5 stroke-current" aria-hidden />
                <span className="sr-only">{closeLabel}</span>
              </DrawerPrimitive.Close>
            )}
          </DrawerPrimitive.Popup>
        </DrawerPrimitive.Viewport>
      </DrawerPrimitive.Portal>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

/*========================================================================================================================*/

const DrawerHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        // Right padding leaves room for the close button
        "px-surface pt-surface flex shrink-0 flex-col gap-1 pr-14 pb-2",
        className,
      )}
      {...props}
    />
  ),
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerTitle = forwardRef<
  HTMLHeadingElement,
  WithClassName<DrawerPrimitive.Title.Props>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={clx("text-txt-black-900 text-title font-semibold", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  WithClassName<DrawerPrimitive.Description.Props>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={clx("text-txt-black-700 text-content", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

/** The scrollable middle of the drawer. */
const DrawerBody = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "text-content text-txt-black-900 px-surface min-h-0 flex-1 overflow-y-auto overscroll-contain py-4",
        "in-data-[density=compact]:py-3",
        className,
      )}
      {...props}
    />
  ),
);
DrawerBody.displayName = "DrawerBody";

/** Actions. Stacked full-width on narrow screens, in a row from `sm`. No divider: spacing separates it. */
const DrawerFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "gap-stack-sm px-surface flex shrink-0 flex-col-reverse pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]",
        "sm:flex-row sm:justify-end [&>*]:w-full [&>*]:justify-center sm:[&>*]:w-auto",
        "in-data-[density=compact]:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]",
        className,
      )}
      {...props}
    />
  ),
);
DrawerFooter.displayName = "DrawerFooter";

/** Closes the drawer. Use `render={<Button />}` to style it. */
const DrawerClose = DrawerPrimitive.Close;

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
};
export type { DrawerProps, DrawerContentProps, DrawerSide };
