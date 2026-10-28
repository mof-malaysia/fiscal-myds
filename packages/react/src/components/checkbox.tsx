"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "../icons/check";
import { MinusIcon } from "../icons/minus";
import { clx } from "../utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, ForwardRefExoticComponent, useState } from "react";

const checkbox_cva = cva(
  [
    "outline-none flex items-center justify-center",
    "border border-otl-control hover:border-otl-control-hover bg-bg-white",
    "data-[checked]:bg-primary-600 data-[checked]:border-none data-[checked]:hover:border-primary-700 data-[checked]:hover:bg-primary-700",
    "data-[indeterminate]:bg-primary-600 data-[indeterminate]:border-none data-[indeterminate]:hover:border-primary-700 data-[indeterminate]:hover:bg-primary-700",
    "focus-visible:ring-[3px] focus-visible:ring-fr-primary",
    "focus:ring-[3px] focus:ring-fr-primary",
    "data-[disabled]:opacity-30 data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-washed data-[checked]:data-[disabled]:bg-primary-600 data-[indeterminate]:data-[disabled]:bg-primary-600",
  ],
  {
    variants: {
      size: {
        small: "size-4 rounded-xs",
        medium: "size-5 rounded-[5px]",
        large: "size-5 rounded-[5px]",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

const checkbox_icon_cva = cva(
  [
    "flex items-center justify-center text-white",
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
        large: "size-4 stroke-[2px]",
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
  extends Omit<
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
