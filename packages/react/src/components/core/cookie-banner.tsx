import {
  ComponentProps,
  ReactNode,
  RefAttributes,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  useContext,
  useState,
} from "react";
import { Button } from "./button";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { clx } from "../../utils";
import { cva } from "class-variance-authority";
import { CrossIcon } from "../../icons/cross";

interface CookieBannerContextValue {
  showPreferences: boolean;
  setShowPreferences: (show: boolean) => void;
}

const CookieBannerContext = createContext<CookieBannerContextValue>({
  showPreferences: false,
  setShowPreferences: () => {},
});

type CookieBannerProps = Omit<DialogPrimitive.Root.Props, "children"> & {
  className?: string;
  children?: ReactNode;
};

const cookie_content_cva = cva([
  "bg-bg-white p-4.5 shadow-card border-otl-gray-200 fixed bottom-0 right-0 z-30 max-w-[500px]",
  "space-y-1 rounded-lg border transition-all outline-none",
  "data-[open]:animate-in data-[open]:slide-in-from-bottom-full data-[open]:fade-in data-[open]:duration-400",
  "data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:slide-out-to-bottom-full data-[closed]:fade-out data-[closed]:duration-200",
  "sm:mb-4 sm:mr-4 sm:p-6",
]);

const CookieBanner: FunctionComponent<CookieBannerProps> = ({
  className,
  children,
  onOpenChange,
  ...props
}) => {
  const [showPreferences, setShowPreferences] = useState(false);
  const resetPreferences = () => setShowPreferences(false);

  return (
    <CookieBannerContext.Provider
      value={{ showPreferences, setShowPreferences }}
    >
      <DialogPrimitive.Root
        onOpenChange={(open, eventDetails) => {
          if (
            eventDetails.reason === "outside-press" ||
            eventDetails.reason === "focus-out"
          )
            resetPreferences();
          onOpenChange?.(open, eventDetails);
        }}
        {...props}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Popup
            className={clx(cookie_content_cva(), className)}
          >
            <DialogPrimitive.Close className="ring-fr-primary absolute top-0 right-0 mt-4 mr-4 rounded-md p-1.5 transition-all outline-none focus-visible:ring">
              <CrossIcon className="size-4 shrink-0" />
            </DialogPrimitive.Close>
            {children}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </CookieBannerContext.Provider>
  );
};

const cookie_action_cva = cva(
  ["w-full flex-col justify-start gap-[0.5rem] p-0 pt-3 sm:flex-row"],
  {
    variants: {
      showPreferences: {
        true: "flex",
        false: "hidden",
      },
    },
    defaultVariants: {
      showPreferences: false,
    },
  },
);

type CookieBannerTitleProps = Omit<DialogPrimitive.Title.Props, "className"> & {
  className?: string;
} & RefAttributes<HTMLHeadingElement>;

type CookieBannerDescriptionProps = Omit<
  DialogPrimitive.Description.Props,
  "className"
> & {
  className?: string;
} & RefAttributes<HTMLParagraphElement>;

const CookieBannerTitle: ForwardRefExoticComponent<CookieBannerTitleProps> =
  forwardRef(({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Title
        ref={ref}
        className={clx(
          "text-body-md font-body text-txt-black-900 font-semibold",
          className,
        )}
        {...props}
      />
    );
  });
const CookieBannerDescription: ForwardRefExoticComponent<CookieBannerDescriptionProps> =
  forwardRef(({ className, ...props }, ref) => {
    return (
      <DialogPrimitive.Description
        ref={ref}
        className={clx(
          "text-body-sm font-body text-txt-black-900 font-normal",
          className,
        )}
        {...props}
      />
    );
  });

const CookieBannerAction: ForwardRefExoticComponent<
  ComponentProps<"div"> & { preferences?: boolean }
> = forwardRef(({ className, preferences = false, ...props }, ref) => {
  const context = useContext(CookieBannerContext);

  if (!context)
    throw new Error("CookieBannerAction must be used within CookieBanner");

  return (
    <div
      ref={ref}
      className={clx(
        cookie_action_cva({
          showPreferences: context.showPreferences === preferences,
        }),
        className,
      )}
      {...props}
    />
  );
});

const CookieBannerPreferences: ForwardRefExoticComponent<CookieBannerDescriptionProps> =
  forwardRef(({ children, className, ...props }, ref) => {
    const context = useContext(CookieBannerContext);

    if (!context)
      throw new Error(
        "CookieBannerPreferences must be used within CookieBanner",
      );
    if (!context.showPreferences) return null;

    return (
      <DialogPrimitive.Description
        ref={ref}
        className={clx("flex flex-col gap-2 px-0 py-3", className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Description>
    );
  });

const CookieBannerPreferencesTrigger: ForwardRefExoticComponent<
  ComponentProps<typeof Button>
> = forwardRef(
  ({ className, render, variant, size, iconOnly, ...props }, ref) => {
    const context = useContext(CookieBannerContext);
    if (!context)
      throw new Error(
        "CookieBannerPreferencesTrigger must be used within CookieBanner",
      );

    const togglePreferences = () => {
      context.setShowPreferences(!context.showPreferences);
    };

    return useRender({
      render: render ?? (
        <Button
          variant={variant ?? "primary-outline"}
          size={size ?? "medium"}
          iconOnly={iconOnly}
        />
      ),
      ref,
      props: mergeProps<"button">(
        {
          className: clx("w-full justify-center sm:w-auto", className),
          onClick: togglePreferences,
        },
        props,
      ),
    });
  },
);

const CookieBannerClose = DialogPrimitive.Close;
CookieBanner.displayName = "CookieBanner";
CookieBannerAction.displayName = "CookieBannerAction";
CookieBannerDescription.displayName = "CookieBannerDescription";
CookieBannerClose.displayName = "CookieBannerClose";
CookieBannerPreferences.displayName = "CookieBannerPreferences";
CookieBannerTitle.displayName = "CookieBannerTitle";
CookieBannerPreferencesTrigger.displayName = "CookieBannerPreferencesTrigger";

export {
  CookieBanner,
  CookieBannerTitle,
  CookieBannerDescription,
  CookieBannerClose,
  CookieBannerPreferences,
  CookieBannerAction,
  CookieBannerPreferencesTrigger,
};
