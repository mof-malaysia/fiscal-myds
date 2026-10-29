import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useRender } from "@base-ui/react/use-render";
import {
  ForwardRefExoticComponent,
  ComponentProps,
  forwardRef,
  FunctionComponent,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  Ref,
  RefAttributes,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
} from "react";
import { CrossIcon } from "@/components/ui/icons/cross";
import { clx } from "@/lib/ftds/utils";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";

/*========================================================================================================================*/

interface DialogBodyContextProps {
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Holds the dismiss settings of the mounted `DialogBody`, so the root can honour them
 * when Base UI requests to close the dialog on an outside press.
 */
const DialogRootContext = createContext<{
  current: DialogBodyContextProps;
} | null>(null);

interface DialogProps extends DialogPrimitive.Root.Props {}

const Dialog: FunctionComponent<DialogProps> = ({ onOpenChange, ...props }) => {
  const bodyRef = useRef<DialogBodyContextProps>({ dismissible: true });

  return (
    <DialogRootContext.Provider value={bodyRef}>
      <DialogPrimitive.Root
        onOpenChange={(open, eventDetails) => {
          if (
            !open &&
            (eventDetails.reason === "outside-press" ||
              eventDetails.reason === "focus-out")
          ) {
            const { dismissible = true, onDismiss } = bodyRef.current;
            if (!dismissible) {
              eventDetails.cancel();
              return;
            }
            onDismiss?.();
          }
          onOpenChange?.(open, eventDetails);
        }}
        {...props}
      />
    </DialogRootContext.Provider>
  );
};

/*========================================================================================================================*/

/**
 * Renders the trigger with Base UI's `render` prop, e.g. `<DialogTrigger render={<Button />}>Open</DialogTrigger>`.
 * For backward compatibility, when `render` is omitted and the only child is an element, that child is used as the
 * rendered element.
 */
const DialogTrigger: ForwardRefExoticComponent<
  DialogPrimitive.Trigger.Props & RefAttributes<HTMLButtonElement>
> = forwardRef(({ render, children, ...props }, ref) => {
  const childAsRender = !render && isValidElement(children);
  return (
    <DialogPrimitive.Trigger
      ref={ref}
      render={childAsRender ? (children as ReactElement) : render}
      {...props}
    >
      {childAsRender ? undefined : children}
    </DialogPrimitive.Trigger>
  );
});

/*========================================================================================================================*/

const DialogClose: ForwardRefExoticComponent<
  DialogPrimitive.Close.Props & RefAttributes<HTMLButtonElement>
> = forwardRef(({ render, children, onClick, ...props }, ref) => {
  const { onDismiss } = useContext(DialogBodyContext);
  const childAsRender = !render && isValidElement(children);

  return (
    <DialogPrimitive.Close
      ref={ref}
      render={childAsRender ? (children as ReactElement) : render}
      onClick={(e) => {
        onClick?.(e);
        onDismiss?.();
      }}
      {...props}
    >
      {childAsRender ? undefined : children}
    </DialogPrimitive.Close>
  );
});

/*========================================================================================================================*/

interface DialogBodyProps
  extends Omit<DialogPrimitive.Popup.Props, "className">,
    DialogBodyContextProps {
  className?: string;
  hideClose?: boolean;
}

const DialogBodyContext = createContext<DialogBodyContextProps>({
  dismissible: true,
  onDismiss: () => {},
});

const DialogBody: ForwardRefExoticComponent<
  DialogBodyProps & RefAttributes<HTMLDivElement>
> = forwardRef(
  (
    {
      className,
      children,
      hideClose = false,
      dismissible = true,
      onDismiss,
      ...props
    },
    ref,
  ) => {
    const rootRef = useContext(DialogRootContext);

    useEffect(() => {
      if (!rootRef) return;
      rootRef.current = { dismissible, onDismiss };
      return () => {
        rootRef.current = { dismissible: true };
      };
    }, [rootRef, dismissible, onDismiss]);

    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className={clx(
            "fixed inset-0 z-[900]",
            "h-full w-full",
            "bg-gray-700/60",
            "data-[open]:animate-in data-[open]:fade-in-0",
            "data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0",
            // Same duration as the popup, so neither finishes early and snaps back
            "duration-200",
          )}
        />
        <DialogPrimitive.Popup
          ref={ref}
          className={clx(
            "fixed top-[50%] left-[50%] z-[1000] box-border translate-x-[-50%] translate-y-[-50%]",
            "w-full max-w-[calc(100dvw-36px)] min-w-[300px] sm:max-w-lg",
            "flex flex-col items-start",
            "rounded-lg",
            "shadow-dialog",
            "bg-bg-white",
            // Fade and scale from the centre only. Tailwind v4 centres with the `translate`
            // property, so v3-style slide-in-from-left-1/2 offsets would add, not cancel.
            "data-[open]:animate-in data-[open]:fade-in-0 data-[open]:zoom-in-95",
            "data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0 data-[closed]:zoom-out-95",
            "duration-200",
            className,
          )}
          {...props}
        >
          <DialogBodyContext.Provider value={{ dismissible, onDismiss }}>
            {children}
            {!hideClose && (
              <DialogClose
                className={clx(
                  "absolute top-4 right-4",
                  "grid place-content-center",
                  "text-txt-black-900",
                  "disabled:pointer-events-none",
                )}
                render={
                  <Button variant="default-ghost" size={"small"} iconOnly />
                }
              >
                <CrossIcon className="size-5 stroke-current" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
          </DialogBodyContext.Provider>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    );
  },
);

/*========================================================================================================================*/

interface DialogHeaderProps extends ComponentProps<"div"> {
  border?: boolean;
}

const dialog_header_cva = cva("flex w-full flex-col text-left px-6 pt-6", {
  variants: {
    border: {
      true: "border-otl-gray-200 border-b pb-4.5 mb-6",
      false: "pb-2",
    },
  },
  defaultVariants: {
    border: false,
  },
});

const DialogHeader: ForwardRefExoticComponent<DialogHeaderProps> = forwardRef(
  ({ className, border, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(dialog_header_cva({ border }), className)}
        {...props}
      />
    );
  },
);
/*========================================================================================================================*/

interface DialogContentProps extends ComponentProps<"div"> {}

const DialogContent: ForwardRefExoticComponent<DialogContentProps> = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={clx("w-full px-6", className)} {...props} />
    );
  },
);

/*========================================================================================================================*/

interface DialogFooterProps extends ComponentProps<"div"> {
  border?: boolean;
  align?: "start" | "full" | "end";
  action?: ReactNode;
}

const dialog_footer_cva = cva(
  [
    "flex w-full justify-between items-end p-6 gap-3",
    "[&>*]:w-full sm:[&>*]:w-auto",
    "[&>button]:place-content-center",
  ],
  {
    variants: {
      align: {
        start: "sm:flex-row-reverse flex-col-reverse",
        full: "sm:flex-row flex-col",
        end: "sm:flex-row flex-col",
      },
      border: {
        true: "border-otl-gray-200 border-t",
        false: "",
      },
    },
    defaultVariants: {
      align: "end",
      border: false,
    },
  },
);
const dialog_action_cva = cva(
  [
    "flex gap-3 grow",
    "[&>*]:w-full sm:[&>*]:w-auto",
    "[&>*]:place-content-center",
  ],
  {
    variants: {
      align: {
        start: "justify-end sm:flex-row-reverse flex-col-reverse",
        full: "justify-center grow [&>*]:flex-1 [&>*]:place-content-center sm:flex-row flex-col",
        end: "justify-end sm:flex-row flex-col",
      },
    },
    defaultVariants: {
      align: "end",
    },
  },
);

const DialogFooter: ForwardRefExoticComponent<DialogFooterProps> = forwardRef(
  ({ action, border, className, align = "end", ...props }, ref) => {
    return (
      <div className={clx(dialog_footer_cva({ border, align }), className)}>
        {action}
        <div
          ref={ref}
          className={clx(dialog_action_cva({ align }), className)}
          {...props}
        />
      </div>
    );
  },
);

/*========================================================================================================================*/

interface DialogTitleProps
  extends Omit<ComponentProps<typeof DialogPrimitive.Title>, "className"> {
  className?: string;
}

const DialogTitle: ForwardRefExoticComponent<DialogTitleProps> = forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={clx(
        "text-body-lg text-txt-black-900 font-body font-semibold",
        className,
      )}
      {...props}
    />
  ),
);

/*========================================================================================================================*/
interface DialogDescriptionProps
  extends Omit<
    ComponentProps<typeof DialogPrimitive.Description>,
    "className"
  > {
  className?: string;
}

const DialogDescription: ForwardRefExoticComponent<DialogDescriptionProps> =
  forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={clx("text-txt-black-700 text-body-sm font-normal", className)}
      {...props}
    />
  ));

/*========================================================================================================================*/

/**
 * `DialogIcon` forwards a ref to its child and applies a class based on the button size.
 *
 * @component
 * @param {DialogIconProps} props - The properties for the DialogIcon component.
 * @param {ReactNode} props.children - The child element to which the ref will be forwarded.
 * @param {Ref} ref - The ref to be forwarded to the child element.
 * @returns {ReactElement} The cloned child element with the forwarded ref and applied class name.
 */

const dialog_icon_cva = cva("block stroke-[1.5px] size-10.5 shrink-0", {
  variants: {
    variant: {
      default: "",
      primary: "text-txt-primary stroke-txt-primary",
      success: "text-txt-success stroke-txt-success",
      warning: "text-txt-warning stroke-txt-warning",
      danger: "text-txt-danger stroke-txt-danger",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface DialogIconProps {
  variant: "default" | "primary" | "success" | "warning" | "danger";
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  className?: string;
  ref?: Ref<HTMLElement>;
}

const DialogIcon: ForwardRefExoticComponent<DialogIconProps> = forwardRef(
  ({ variant, children, className }, ref) => {
    return useRender({
      render: children,
      ref,
      props: { className: clx(dialog_icon_cva({ variant }), className) },
    });
  },
);

/*========================================================================================================================*/

DialogBody.displayName = "DialogBody";
DialogHeader.displayName = "DialogHeader";
DialogFooter.displayName = "DialogFooter";
DialogTitle.displayName = "DialogTitle";
DialogDescription.displayName = "DialogDescription";
DialogIcon.displayName = "DialogIcon";
DialogClose.displayName = "DialogClose";
DialogContent.displayName = "DialogContent";
DialogTrigger.displayName = "DialogTrigger";
Dialog.displayName = "Dialog";

/*========================================================================================================================*/

export {
  Dialog,
  DialogIcon,
  DialogClose,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};

export type {
  DialogProps,
  DialogBodyProps,
  DialogHeaderProps,
  DialogContentProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogIconProps,
};
