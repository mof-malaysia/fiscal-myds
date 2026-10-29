"use client";

import React, {
  ComponentProps,
  createContext,
  FunctionComponent,
  useContext,
} from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { clx } from "@/lib/ftds/utils";

type RadioSize = "small" | "medium" | "large";
const DEFAULT_SIZE = "medium";

/**
 * Extends Base UI's RadioGroup props.
 * @see https://base-ui.com/react/components/radio#radiogroup
 */
export interface RadioProps
  extends Omit<RadioGroupPrimitive.Props<string>, "className"> {
  className?: string;
  size?: RadioSize;
}

const RadioContext = createContext<
  Required<Pick<RadioProps, "size" | "disabled">>
>({
  size: DEFAULT_SIZE,
  disabled: false,
});

// An item needs it's own context because labels and radio buttons need to be
// aware if only the specific item was disabled.
const RadioItemContext = createContext<
  Required<Pick<ComponentProps<typeof RadioItem>, "disabled">>
>({ disabled: false });

/**
 * Uses Base UI's RadioGroup API.
 * @see https://base-ui.com/react/components/radio#api-reference
 */
const Radio = React.forwardRef<HTMLDivElement, RadioProps>(
  ({ className, size = DEFAULT_SIZE, disabled = false, ...props }, ref) => {
    return (
      <RadioContext.Provider value={{ size, disabled }}>
        <RadioGroupPrimitive
          className={clx("grid gap-3", className)}
          disabled={disabled}
          ref={ref}
          {...props}
        />
      </RadioContext.Provider>
    );
  },
);
Radio.displayName = "Radio";

const RadioItem: FunctionComponent<
  ComponentProps<"div"> & { disabled?: boolean }
> = ({ className, children, disabled: itemDisabled, ...props }) => {
  const { disabled } = useContext(RadioContext);
  return (
    // `disabled` reaches the RadioButton through context; a div has no disabled state
    <RadioItemContext.Provider value={{ disabled: itemDisabled ?? disabled }}>
      <div className={clx("flex items-center gap-3", className)} {...props}>
        {children}
      </div>
    </RadioItemContext.Provider>
  );
};
RadioItem.displayName = "RadioItem";

/**
 * Uses Base UI's Radio.Root API.
 * @see https://base-ui.com/react/components/radio#root
 */
const RadioButton = React.forwardRef<
  HTMLElement,
  Omit<RadioPrimitive.Root.Props<string>, "className"> & { className?: string }
>(({ className, ...props }, ref) => {
  const { size } = useContext(RadioContext);
  const { disabled } = useContext(RadioItemContext);
  return (
    <RadioPrimitive.Root
      ref={ref}
      className={clx(
        // DESIGN.md, Inputs: 1.5px Control Edge stroke; checked fills FTDS Blue with an
        // On FTDS Blue dot (theme tokens, so dark mode follows); disabled is a Well circle with a Hairline
        "bg-bg-white border-otl-control hover:border-otl-control-hover inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px]",
        "focus-ring transition-colors duration-150 motion-reduce:transition-none",
        "data-[invalid]:border-bg-danger-600",
        "data-[checked]:bg-bg-primary-600 data-[checked]:hover:bg-bg-primary-700 data-[checked]:border-transparent",
        "data-[disabled]:bg-bg-washed data-[disabled]:border-otl-gray-200 data-[disabled]:cursor-not-allowed",
        "data-[checked]:data-[disabled]:bg-bg-primary-disabled",
        size === "small" ? "size-4" : "size-5",
        className,
      )}
      disabled={props.disabled ?? disabled}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex size-full items-center justify-center">
        <div
          className="bg-txt-white aspect-square w-2/5 rounded-full"
          aria-hidden="true"
        />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
});
RadioButton.displayName = "RadioButton";

const RadioLabel = ({
  className,
  children,
  ...props
}: ComponentProps<"label">) => {
  const { size } = useContext(RadioContext);
  const { disabled } = useContext(RadioItemContext);
  return (
    <label
      className={clx(
        // An option reads as content: Ink, regular weight, density-aware at medium
        "text-txt-black-900 cursor-pointer",
        size === "small" && "text-label-sm",
        size === "medium" && "text-content",
        size === "large" && "text-body-lg",
        disabled && "text-txt-black-disabled cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
};
RadioLabel.displayName = "RadioLabel";

const RadioHintText = ({
  className,
  children,
  ...props
}: ComponentProps<"p">) => {
  const { size } = useContext(RadioContext);
  const { disabled } = useContext(RadioItemContext);
  return (
    <p
      className={clx(
        // Hints are Ink Secondary (DESIGN.md: never lighter for text the user reads)
        "text-txt-black-700",
        size === "small" && "text-label-compact",
        size === "medium" && "text-body-sm",
        size === "large" && "text-body-md",
        disabled && "text-txt-black-disabled",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};
RadioHintText.displayName = "RadioHintText";

export { Radio, RadioItem, RadioButton, RadioLabel, RadioHintText };
