"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "../../icons/check";
import { MinusIcon } from "../../icons/minus";
import { clx } from "../../utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, ForwardRefExoticComponent, useState } from "react";

/**
 * Checkbox (DESIGN.md, Inputs): a 1.5px Control Edge stroke on Sheet; checked and
 * indeterminate fill FTDS Blue with an On FTDS Blue mark (theme tokens, so dark mode
 * gets Dark FTDS Blue with a dark mark). The focus ring is the shared solid 2px ring,
 * and disabled is a Well box with a Hairline rather than a faded one.
 */
const checkbox_cva = cva(
  [
    "flex shrink-0 cursor-pointer items-center justify-center bg-bg-white",
    "border-[1.5px] border-otl-control hover:border-otl-control-hover",
    "transition-colors duration-150 motion-reduce:transition-none focus-ring",
    // Same red stroke as Input when its Field is invalid
    "data-[invalid]:border-bg-danger-600",
    "data-[checked]:bg-bg-primary-600 data-[checked]:border-transparent data-[checked]:hover:bg-bg-primary-700",
    "data-[indeterminate]:bg-bg-primary-600 data-[indeterminate]:border-transparent data-[indeterminate]:hover:bg-bg-primary-700",
    "data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-washed data-[disabled]:border-otl-gray-200",
    "data-[checked]:data-[disabled]:bg-bg-primary-disabled data-[indeterminate]:data-[disabled]:bg-bg-primary-disabled",
  ],
  {
    variants: {
      size: {
        small: "size-4 rounded-[4px]",
        medium: "size-5 rounded-[5px]",
        large: "size-6 rounded-[6px]",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

const checkbox_icon_cva = cva(
  [
    "flex items-center justify-center text-txt-white",
    "[&_.minus-icon]:hidden",
    "[&_.checked-icon]:hidden",
    "[&[data-checked]_.checked-icon]:inline-block",
    "[&[data-indeterminate]_.minus-icon]:inline-block",
  ],
  {
    variants: {
      size: {
        small: "size-3 stroke-[1.5px]",
        medium: "size-4 stroke-[2px]",
        large: "size-5 stroke-[2px]",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

/**
 * Checked state. `"indeterminate"` maps to Base UI's `indeterminate` prop.
 */
type CheckedState = boolean | "indeterminate";

interface CheckboxProps
  extends
    Omit<
      CheckboxPrimitive.Root.Props,
      "checked" | "defaultChecked" | "onCheckedChange" | "className"
    >,
    VariantProps<typeof checkbox_cva> {
  className?: string;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  // Base UI never reports "indeterminate" here; a user change always settles on true/false.
  onCheckedChange?: (
    checked: boolean,
    eventDetails: CheckboxPrimitive.Root.ChangeEventDetails,
  ) => void;
}

const Checkbox: ForwardRefExoticComponent<CheckboxProps> = forwardRef<
  HTMLElement,
  CheckboxProps
>(
  (
    {
      className,
      size,
      checked,
      defaultChecked,
      indeterminate,
      onCheckedChange,
      ...props
    },
    ref,
  ) => {
    // Uncontrolled `defaultChecked="indeterminate"` stays indeterminate until the first change.
    const [defaultIndeterminate, setDefaultIndeterminate] = useState(
      defaultChecked === "indeterminate",
    );

    const isIndeterminate =
      indeterminate ??
      (checked === undefined
        ? defaultIndeterminate
        : checked === "indeterminate");

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        className={clx(checkbox_cva({ size }), className)}
        checked={checked === undefined ? undefined : checked === true}
        defaultChecked={defaultChecked === true}
        indeterminate={isIndeterminate}
        onCheckedChange={(next, eventDetails) => {
          setDefaultIndeterminate(false);
          onCheckedChange?.(next, eventDetails);
        }}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={checkbox_icon_cva({ size })}
          keepMounted
        >
          <MinusIcon className="minus-icon" />
          <CheckIcon className="checked-icon" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps, CheckedState };
