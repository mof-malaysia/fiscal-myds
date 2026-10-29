"use client";

import React, { forwardRef } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import { clx } from "@/lib/ftds/utils";

/**
 * Switch turns a setting on or off immediately, with no submit step.
 * For a choice that is saved with a form, use a Checkbox instead.
 *
 * Label it by wrapping it in a `<label>` or placing it in a `Field`.
 *
 * @example
 * <label className="flex items-center gap-3">
 *   <Switch defaultChecked />
 *   Email me about deadlines
 * </label>
 */

const switch_cva = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-[3px] outline-none",
    "bg-otl-control hover:bg-otl-control-hover transition-colors duration-200 ease-standard",
    "data-[checked]:bg-bg-primary-600 data-[checked]:hover:bg-bg-primary-700",
    "focus-ring",
    "data-[invalid]:outline-solid data-[invalid]:outline-2 data-[invalid]:outline-offset-2 data-[invalid]:outline-fr-danger",
    "data-[disabled]:cursor-not-allowed data-[disabled]:bg-bg-washed data-[disabled]:data-[checked]:bg-bg-primary-disabled",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        small: "h-4 w-7",
        medium: "h-5 w-9",
        large: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

const switch_thumb_cva = cva(
  [
    "block rounded-full bg-white transition-transform duration-200 ease-standard",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      size: {
        small: "size-2.5 data-[checked]:translate-x-3",
        medium: "size-3.5 data-[checked]:translate-x-4",
        large: "size-4.5 data-[checked]:translate-x-5",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

interface SwitchProps
  extends Omit<SwitchPrimitive.Root.Props, "className">,
    VariantProps<typeof switch_cva> {
  className?: string;
}

const Switch = forwardRef<HTMLElement, SwitchProps>(
  ({ className, size, ...props }, ref) => (
    <SwitchPrimitive.Root
      ref={ref}
      className={clx(switch_cva({ size }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={switch_thumb_cva({ size })} />
    </SwitchPrimitive.Root>
  ),
);
Switch.displayName = "Switch";

export { Switch };
export type { SwitchProps };
