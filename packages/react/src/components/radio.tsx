"use client";

import React, {
  ComponentProps,
  createContext,
  FunctionComponent,
  useContext,
} from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { clx } from "../utils";

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
> = ({ className, children, ...props }) => {
  const { disabled } = useContext(RadioContext);
  return (
    <RadioItemContext.Provider value={{ disabled: props.disabled ?? disabled }}>
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
        "hover:border-otl-control-hover border-otl-control inline-flex aspect-square shrink-0 rounded-full border",
        "focus-visible:ring-fr-primary focus-visible:ring-opacity-40 focus:outline-none focus-visible:ring-4",
        "data-[disabled]:bg-bg-washed data-[disabled]:cursor-not-allowed",
        "data-[checked]:bg-primary-600 data-[checked]:border-none",
        "data-[checked]:data-[disabled]:bg-primary-600 data-[checked]:data-[disabled]:opacity-30",
        size === "small" && "w-4",
        size === "medium" && "w-5",
        size === "large" && "w-5",
        className,
      )}
      disabled={props.disabled ?? disabled}
      {...props}
    >
      <RadioPrimitive.Indicator className="flex size-full items-center justify-center">
        <div
          className="bg-bg-white aspect-square w-2/5 rounded-full"
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
        "text-txt-black-700 font-medium",
        size === "small" && "text-body-sm",
        size === "medium" && "text-body-md",
        size === "large" && "text-lg",
        disabled && "text-txt-black-disabled",
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
}: ComponentProps<"label">) => {
  const { size } = useContext(RadioContext);
  const { disabled } = useContext(RadioItemContext);
  return (
    <label
      className={clx(
        "text-txt-black-500",
        size === "small" && "text-xs",
        size === "medium" && "text-body-sm",
        size === "large" && "text-body-md",
        disabled && "text-otl-gray-300",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
};
RadioHintText.displayName = "RadioHintText";

export { Radio, RadioItem, RadioButton, RadioLabel, RadioHintText };
