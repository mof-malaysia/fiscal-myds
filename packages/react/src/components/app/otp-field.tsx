"use client";

import React, { forwardRef } from "react";
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field";
import { combobox_field_box_class } from "./combobox";
import { clx, type WithClassName } from "../../utils";

/**
 * OTPField takes a one-time code split across single-character slots. Pasting a
 * whole code fills every slot, and SMS autofill (`autoComplete="one-time-code"`)
 * works out of the box. It joins a surrounding Field for label, hint and error.
 *
 * @example
 * <Field>
 *   <FieldLabel>Verification code</FieldLabel>
 *   <OTPField length={6} onValueComplete={verify}>
 *     {Array.from({ length: 6 }, (_, i) => <OTPFieldSlot key={i} />)}
 *   </OTPField>
 * </Field>
 */

type OTPFieldProps = WithClassName<OTPFieldPrimitive.Root.Props>;

const OTPField = forwardRef<HTMLDivElement, OTPFieldProps>(
  ({ className, autoComplete = "one-time-code", ...props }, ref) => (
    <OTPFieldPrimitive.Root
      ref={ref}
      autoComplete={autoComplete}
      className={clx("flex items-center gap-2", className)}
      {...props}
    />
  ),
);
OTPField.displayName = "OTPField";

/** One character of the code. Render one per `length`. */
const OTPFieldSlot = forwardRef<
  HTMLInputElement,
  WithClassName<OTPFieldPrimitive.Input.Props>
>(({ className, ...props }, ref) => (
  <OTPFieldPrimitive.Input
    ref={ref}
    className={clx(
      combobox_field_box_class,
      "text-center font-medium tabular-nums",
      // Taller than a text field: the digits are the whole task
      "h-14 w-12 text-heading-xs in-data-[density=compact]:h-11 in-data-[density=compact]:w-10 in-data-[density=compact]:text-body-xl",
      className,
    )}
    {...props}
  />
));
OTPFieldSlot.displayName = "OTPFieldSlot";

/** Visual divider between groups of slots, e.g. `123 – 456`. */
const OTPFieldSeparator = ({ className }: { className?: string }) => (
  <OTPFieldPrimitive.Separator
    className={clx("bg-otl-control h-0.5 w-3 rounded-full", className)}
  />
);
OTPFieldSeparator.displayName = "OTPFieldSeparator";

export { OTPField, OTPFieldSlot, OTPFieldSeparator };
export type { OTPFieldProps };
