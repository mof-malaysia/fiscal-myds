"use client";

import * as React from "react";
import { Toast as ToastPrimitives } from "@base-ui/react/toast";
import { clx } from "@/lib/ftds/utils";
import { cva, VariantProps } from "class-variance-authority";
import { FunctionComponent, ReactNode, useEffect } from "react";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { InfoIcon } from "@/components/ui/icons/info";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { WarningIcon } from "@/components/ui/icons/warning";
import { CrossIcon } from "@/components/ui/icons/cross";
import { emitter } from "@/lib/ftds/utils/events";

/*========================================================================================================================*/

export type ToastEvent = {
  variant:
    | "success"
    | "message"
    | "info"
    | "warning"
    | "error"
    | null
    | undefined;
  title: ReactNode;
  description?: ReactNode;
};

/*========================================================================================================================*/

const ToastProvider = ToastPrimitives.Provider;

const ToastContext = React.createContext<{
  variant: ToastEvent["variant"];
  duration: number;
}>({
  variant: "message",
  duration: 5000,
});

/*========================================================================================================================*/

interface ToastViewportProps
  extends Omit<ToastPrimitives.Viewport.Props, "className"> {
  className?: string;
}

const toast_viewport_cva = cva([
  "fixed flex max-h-screen w-full overflow-hidden flex-col gap-1",
  "p-4.5 sm:p-6 bottom-0 right-0 sm:top-auto sm:flex-col-reverse md:max-w-sm z-toast",
]);

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <ToastPrimitives.Portal>
      <ToastPrimitives.Viewport
        ref={ref}
        className={clx(toast_viewport_cva({ className }))}
        {...props}
      />
    </ToastPrimitives.Portal>
  ),
);
ToastViewport.displayName = "ToastViewport";

/*========================================================================================================================*/

interface ToastRootProps
  extends Omit<ToastPrimitives.Root.Props, "className">,
    VariantProps<typeof toast_cva> {
  className?: string;
  /** Defaults to the toast object's `type`, then "message". */
  variant?: "message" | "success" | "info" | "warning" | "error";
  /**
   * Auto-dismiss duration (ms), used for the progress bar. The dismiss timer itself comes from
   * the toast object's `timeout` (or ToastProvider's `timeout`).
   */
  duration?: number;
}

const toast_cva = cva([
  "group pointer-events-auto relative bg-bg-dialog-active z-toast p-3 flex w-full items-start gap-2 outline-none",
  "overflow-hidden rounded-md border shadow-card border-bg-washed-active transition-all duration-300 ease-out",
  "translate-x-[var(--toast-swipe-movement-x)] translate-y-[var(--toast-swipe-movement-y)] data-[swiping]:transition-none",
  "data-[starting-style]:translate-x-full data-[starting-style]:opacity-0",
  "data-[ending-style]:translate-x-full data-[ending-style]:opacity-0",
  "data-[limited]:hidden",
]);

const ToastRoot = React.forwardRef<HTMLDivElement, ToastRootProps>(
  ({ className, variant, duration, toast, ...props }, ref) => {
    const resolvedVariant =
      variant ?? (toast.type as ToastRootProps["variant"]) ?? "message";
    const resolvedDuration = duration ?? toast.timeout ?? 5000;
    return (
      <ToastContext.Provider
        value={{ variant: resolvedVariant, duration: resolvedDuration }}
      >
        <ToastPrimitives.Root
          ref={ref}
          toast={toast}
          className={toast_cva({ className })}
          swipeDirection="right"
          {...props}
        />
      </ToastContext.Provider>
    );
  },
);
ToastRoot.displayName = "ToastRoot";

/*========================================================================================================================*/

// interface ToastActionProps
//   extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action> {}

// const toast_action_cva = cva([
//   "hover:bg-secondary focus-visible:ring-ring group-[.destructive]:border-muted/40",
//   "group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive",
//   "group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus-visible:ring-destructive",
//   "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3",
//   "text-body-sm font-medium transition-colors focus:outline-none focus-visible:ring-1",
//   "disabled:pointer-events-none disabled:opacity-50",
// ]);

// const ToastAction = React.forwardRef<
//   React.ElementRef<typeof ToastPrimitives.Action>,
//   ToastActionProps
// >(({ className, ...props }, ref) => (
//   <ToastPrimitives.Action
//     ref={ref}
//     className={clx(toast_action_cva({ className }))}
//     {...props}
//   />
// ));
// ToastAction.displayName = ToastPrimitives.Action.displayName;
// type ToastActionElement = React.ReactElement<typeof ToastAction>;

/*========================================================================================================================*/

const toast_close_cva = cva([
  "text-txt-black-500 hover:text-txt-black-700 absolute right-1 top-1 rounded-md p-1",
  "focus:outline-none",
]);
const ToastClose = React.forwardRef<
  HTMLButtonElement,
  Omit<ToastPrimitives.Close.Props, "className"> & { className?: string }
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={clx(toast_close_cva({ className }))}
    toast-close=""
    // Pass aria-label to translate it
    aria-label="Close"
    {...props}
  >
    <CrossIcon className="size-5 shrink-0" aria-hidden />
  </ToastPrimitives.Close>
));
ToastClose.displayName = "ToastClose";

/*========================================================================================================================*/

const toast_title_cva = cva(["text-body-sm font-semibold"], {
  variants: {
    variant: {
      success: "text-txt-success",
      message: "text-txt-black-700",
      info: "text-txt-primary",
      warning: "text-txt-warning",
      error: "text-txt-danger",
    },
  },
});

const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  Omit<ToastPrimitives.Title.Props, "className"> & { className?: string }
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(ToastContext);
  return (
    <ToastPrimitives.Title
      ref={ref}
      className={clx(toast_title_cva({ variant, className }))}
      {...props}
    />
  );
});
ToastTitle.displayName = "ToastTitle";

/*========================================================================================================================*/

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  Omit<ToastPrimitives.Description.Props, "className"> & {
    className?: string;
  }
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Description
      ref={ref}
      className={clx("text-txt-black-700 text-body-sm", className)}
      {...props}
    />
  );
});
ToastDescription.displayName = "ToastDescription";

/*========================================================================================================================*/

const toast_icon_cva = cva("size-5 shrink-0", {
  variants: {
    variant: {
      success: "text-txt-success",
      info: "text-txt-primary",
      warning: "text-txt-warning",
      error: "text-txt-danger",
      message: "text-txt-black-700",
    },
  },
});

const ToastIcon = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => {
  const { variant } = React.useContext(ToastContext);
  const className = toast_icon_cva({ variant, className: props.className });

  if (!variant || variant === "message") return null;

  return (
    <div ref={ref} role="img" {...props}>
      {
        {
          success: <CheckCircleIcon className={className} />,
          info: <InfoIcon className={className} />,
          warning: <WarningCircleIcon className={className} />,
          error: <WarningIcon className={className} />,
        }[variant]
      }
    </div>
  );
});
ToastIcon.displayName = "ToastIcon";

/*========================================================================================================================*/

const toast_progress_cva = cva("w-full h-1", {
  variants: {
    variant: {
      success: "bg-txt-success",
      info: "bg-txt-primary",
      warning: "bg-txt-warning",
      error: "bg-txt-danger",
      message: "bg-bg-washed",
    },
  },
});

const ToastProgress = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>((props, ref) => {
  const { variant, duration } = React.useContext(ToastContext);

  return (
    <div
      role="progressbar"
      ref={ref}
      className="animate-expire absolute bottom-0 left-0 w-full group-hover:transition-none group-data-[expanded]:[animation-play-state:paused]"
      style={{ animationDuration: `${duration}ms` }}
      {...props}
    >
      <div className={toast_progress_cva({ variant })} />
    </div>
  );
});
ToastProgress.displayName = "ToastProgress";

/*========================================================================================================================*/

/**
 * Forwards `useToast().toast({...})` events (mitt emitter) to Base UI's toast manager.
 */
const ToastEventBridge: FunctionComponent = () => {
  const toastManager = ToastPrimitives.useToastManager();

  useEffect(() => {
    const handleAddToast = (event: ToastEvent) => {
      toastManager.add({
        type: event.variant || "message",
        title: event.title,
        description: event.description,
      });
    };
    emitter.on("toast.add", handleAddToast);
    return () => {
      emitter.off("toast.add", handleAddToast);
    };
  }, [toastManager]);

  return null;
};

const AutoToastList: FunctionComponent<AutoToastProps> = ({
  duration,
  ...props
}) => {
  const { toasts } = ToastPrimitives.useToastManager();

  return toasts.map((toast) => (
    <ToastRoot key={toast.id} toast={toast} duration={duration} {...props}>
      <ToastIcon />
      <div className="space-y-1">
        <ToastTitle />
        {toast.description && <ToastDescription />}
      </div>
      <ToastClose />
      <ToastProgress />
    </ToastRoot>
  ));
};

type AutoToastProps = Omit<ToastRootProps, "toast" | "variant">;

const AutoToast: FunctionComponent<AutoToastProps> = (props) => {
  return (
    <ToastProvider timeout={props.duration ?? 5000}>
      <ToastEventBridge />
      <ToastViewport>
        <AutoToastList {...props} />
      </ToastViewport>
    </ToastProvider>
  );
};

/** Base UI toast manager: `{ toasts, add, close, update, promise }`. Must be used inside ToastProvider. */
const useToastManager = ToastPrimitives.useToastManager;

export {
  ToastProvider,
  ToastViewport,
  ToastRoot,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastIcon,
  ToastProgress,
  AutoToast,
  useToastManager,
};
export type { ToastRootProps, ToastViewportProps, AutoToastProps };
