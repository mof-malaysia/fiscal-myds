import * as React from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { clx } from "../../utils";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  HTMLDivElement,
  Omit<SheetPrimitive.Backdrop.Props, "className"> & { className?: string }
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Backdrop
    className={clx(
      "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0 data-[open]:fade-in-0 bg-bg-washed fixed inset-0 z-50",
      // Match the panel (300ms close, 500ms open) so the overlay never finishes first
      "data-[closed]:duration-300 data-[open]:duration-500",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const sheetVariants = cva(
  "fixed z-50 gap-4 p-6 shadow-context-menu transition ease-in-out data-[open]:animate-in data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:duration-300 data-[open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[closed]:slide-out-to-top data-[open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[closed]:slide-out-to-bottom data-[open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[closed]:slide-out-to-left data-[open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[closed]:slide-out-to-right data-[open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends Omit<SheetPrimitive.Popup.Props, "className">,
    VariantProps<typeof sheetVariants> {
  className?: string;
  /** Render a `SheetOverlay` behind the sheet. */
  overlay?: boolean;
}

/**
 * Base UI requires the popup to be inside a portal, so `SheetContent` renders its own `SheetPortal`.
 */
const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", overlay = true, className, children, ...props }, ref) => (
    <SheetPortal>
      {overlay && <SheetOverlay />}
      <SheetPrimitive.Popup
        ref={ref}
        className={clx(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPortal>
  ),
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clx(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clx(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  Omit<SheetPrimitive.Title.Props, "className"> & { className?: string }
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={clx("text-lg font-semibold", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  Omit<SheetPrimitive.Description.Props, "className"> & { className?: string }
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={clx("text-txt-black-700 text-sm", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
