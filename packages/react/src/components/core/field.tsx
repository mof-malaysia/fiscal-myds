"use client";

import React, {
  ComponentRef,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { WarningCircleIcon } from "../../icons/warning-circle";
import { clx, type WithClassName } from "../../utils";

/**
 * Field groups one control with its label, hint and error, and wires them up for
 * assistive technology (label `for`, `aria-describedby`, `aria-invalid`).
 * Every FTDS control (Input, TextArea, Select, Checkbox, Radio, Switch, ...) picks
 * up the field it sits in, so validation state flows from `Field` or `Form`.
 *
 * @example
 * <Field name="ic" invalid={!!error}>
 *   <FieldLabel>IC number</FieldLabel>
 *   <FieldDescription>For example, 900101-14-5678</FieldDescription>
 *   <Input />
 *   <FieldError>Enter your IC number in the format 900101-14-5678</FieldError>
 * </Field>
 */

/** Base UI's `invalid` styles the control but doesn't show `Field.Error`; FieldError reads it from here. */
const FieldInvalidContext = createContext(false);

const Field = forwardRef<
  ComponentRef<typeof FieldPrimitive.Root>,
  WithClassName<FieldPrimitive.Root.Props>
>(({ className, ...props }, ref) => (
  <FieldInvalidContext.Provider value={!!props.invalid}>
    <FieldPrimitive.Root
      ref={ref}
      className={clx("flex w-full flex-col gap-1.5", className)}
      {...props}
    />
  </FieldInvalidContext.Provider>
));
Field.displayName = "Field";

const FieldLabel = forwardRef<
  ComponentRef<typeof FieldPrimitive.Label>,
  WithClassName<FieldPrimitive.Label.Props>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Label
    ref={ref}
    className={clx(
      "font-body text-label-md text-txt-black-900 inline-flex items-center gap-1 font-medium",
      "data-[disabled]:text-txt-black-disabled data-[disabled]:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

/** Hint text. Ink Secondary, never lighter (DESIGN.md: The Dark-Enough Rule). */
const FieldDescription = forwardRef<
  ComponentRef<typeof FieldPrimitive.Description>,
  WithClassName<FieldPrimitive.Description.Props>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Description
    ref={ref}
    className={clx("font-body text-content text-txt-black-700", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

/**
 * Shown only while the field is invalid, including when `Field` has `invalid` set.
 * Say what to do, not just what's wrong. Pass `match` (e.g. `"valueMissing"`) to
 * show a message for one validity state only.
 */
const FieldError = forwardRef<
  ComponentRef<typeof FieldPrimitive.Error>,
  WithClassName<FieldPrimitive.Error.Props>
>(({ className, children, match, ...props }, ref) => {
  const invalid = useContext(FieldInvalidContext);
  return (
    <FieldPrimitive.Error
      ref={ref}
      match={match ?? (invalid || undefined)}
      className={clx(
        "font-body text-content text-txt-danger flex items-start gap-1.5 font-medium",
        className,
      )}
      {...props}
    >
      <WarningCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        {/* Without children, fall back to the message from `validate` or the browser */}
        {children ?? (
          <FieldPrimitive.Validity>
            {(validity) => validity.error}
          </FieldPrimitive.Validity>
        )}
      </span>
    </FieldPrimitive.Error>
  );
});
FieldError.displayName = "FieldError";

/** One option inside a field that holds a group (checkbox group, radio group). */
const FieldItem = forwardRef<
  ComponentRef<typeof FieldPrimitive.Item>,
  WithClassName<FieldPrimitive.Item.Props>
>(({ className, ...props }, ref) => (
  <FieldPrimitive.Item
    ref={ref}
    className={clx("flex items-center gap-2", className)}
    {...props}
  />
));
FieldItem.displayName = "FieldItem";

/** Unstyled control for building custom inputs that join a Field. */
const FieldControl = FieldPrimitive.Control;

/** Render prop access to the field's validity, e.g. to show a live count of errors. */
const FieldValidity = FieldPrimitive.Validity;

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldControl,
  FieldValidity,
};
