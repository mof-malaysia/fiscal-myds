import React, {
  ComponentProps,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  isValidElement,
  useContext,
  useState,
} from "react";
import { type VariantProps } from "class-variance-authority";
import { clx } from "@/lib/ftds/utils";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { CrossIcon } from "@/components/ui/icons/cross";
import { InfoIcon } from "@/components/ui/icons/info";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { WarningIcon } from "@/components/ui/icons/warning";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { calloutVariants } from "@/components/ui/callout.variants";

type CalloutVariant = "success" | "warning" | "info" | "danger";

const iconMap: Record<CalloutVariant, ReactNode> = {
  success: <CheckCircleIcon className="size-5 shrink-0" />,
  warning: <WarningCircleIcon className="size-5 shrink-0" />,
  info: <InfoIcon className="size-5 shrink-0" />,
  danger: <WarningIcon className="size-5 shrink-0" />,
};

interface CalloutProps
  extends VariantProps<typeof calloutVariants>, ComponentProps<"div"> {
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Accessible name of the ✕ button `dismissible` adds. @default "Dismiss" */
  dismissLabel?: string;
}

const CalloutContext = createContext<{
  show: boolean;
  handleDismiss: () => void;
} | null>(null);

const Callout: ForwardRefExoticComponent<CalloutProps> = forwardRef(
  (
    {
      className,
      variant = "info",
      children,
      dismissible = false,
      onDismiss,
      dismissLabel = "Dismiss",
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = useState<boolean>(true);
    const handleDismiss = () => {
      if (onDismiss) onDismiss();
      setShow(false);
    };
    return (
      <CalloutContext.Provider value={{ show, handleDismiss }}>
        {show && (
          <div
            ref={ref}
            // Danger interrupts; the rest are announced politely when they appear
            role={variant === "danger" ? "alert" : "status"}
            className={clx(calloutVariants({ variant }), className)}
            {...props}
          >
            {variant && iconMap[variant]}
            <div className="flex grow items-center justify-between gap-2 [&:has([role=definition])]:block [&:has([role=definition])]:space-y-1">
              {children}
            </div>
            {dismissible && show && (
              <Button
                variant="default-ghost"
                size="small"
                className="text-txt-black-700 ml-2 p-0 hover:bg-transparent"
                iconOnly
                aria-label={dismissLabel}
                onClick={handleDismiss}
              >
                <ButtonIcon>
                  <CrossIcon className="h-5 w-5" aria-hidden />
                </ButtonIcon>
              </Button>
            )}
          </div>
        )}
      </CalloutContext.Provider>
    );
  },
);
Callout.displayName = "Callout";

const CalloutTitle: ForwardRefExoticComponent<ComponentProps<"p">> = forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        role="term"
        className={clx("text-content font-semibold text-inherit", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
CalloutTitle.displayName = "CalloutTitle";

const CalloutContent: ForwardRefExoticComponent<ComponentProps<"p">> =
  forwardRef(({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        role="definition"
        className={clx(
          "text-txt-black-900 peer text-content font-normal",
          className,
        )}
        {...props}
      >
        {children}
      </p>
    );
  });
CalloutContent.displayName = "CalloutContent";

interface CalloutActionProps extends ComponentProps<"div"> {}

const CalloutAction: ForwardRefExoticComponent<CalloutActionProps> = forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "flex gap-1",
          "peer-[&[role=definition]]:pt-2",
          className,
        )}
        {...props}
      />
    );
  },
);
CalloutAction.displayName = "CalloutAction";

/**
 * Dismisses the parent Callout on click. Renders its single child element (e.g. a `Button`)
 * with the dismiss handler merged in, or the element passed via `render`.
 */
const CalloutClose: ForwardRefExoticComponent<
  useRender.ComponentProps<"button">
> = forwardRef(({ render, children, ...props }, ref) => {
  const context = useContext(CalloutContext);
  if (!context)
    throw new Error("CalloutClose must be used within a Callout component");
  const { handleDismiss } = context;
  const childIsElement = !render && isValidElement(children);

  const element = useRender({
    defaultTagName: "button",
    render: render ?? (childIsElement ? children : undefined),
    ref,
    props: mergeProps<"button">(
      { onClick: handleDismiss },
      childIsElement ? props : { ...props, children },
    ),
  });

  // Like the previous Slot-based version, render nothing without a child or `render`.
  if (!render && children == null) return null;
  return element;
});
CalloutClose.displayName = "CalloutClose";

export { Callout, CalloutTitle, CalloutContent, CalloutAction, CalloutClose };
