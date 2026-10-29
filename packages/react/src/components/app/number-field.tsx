"use client";

import React, { forwardRef } from "react";
import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon } from "../../icons/minus";
import { PlusIcon } from "../../icons/plus";
import {
  combobox_icon_button_cva,
  combobox_input_cva,
  combobox_input_group_cva,
} from "./combobox";
import { clx, type WithClassName } from "../../utils";

/**
 * NumberField takes a number: a quantity, a year, an amount. It formats as people
 * type and on blur (thousands separators, currency), honours `min`/`max`/`step`,
 * and supports arrow keys, Shift/Alt for large/small steps, and optional
 * decrement/increment buttons. It joins a surrounding Field.
 *
 * Amounts use tabular figures and right-align (DESIGN.md: The Tabular Money Rule).
 * For ringgit, use `CurrencyField`.
 *
 * @example
 * <Field name="dependants">
 *   <FieldLabel>Number of dependants</FieldLabel>
 *   <NumberField min={0} max={20} defaultValue={0} />
 * </Field>
 *
 * <NumberField format={{ style: "currency", currency: "MYR" }} locale="ms-MY" defaultValue={1234.5} />
 * // → "RM 1,234.50"
 */

type Size = "small" | "medium" | "large";

interface NumberFieldProps
  extends WithClassName<NumberFieldPrimitive.Root.Props> {
  /** Class for the bordered box around the input and buttons. */
  groupClassName?: string;
  /** Props for the `<input>` (e.g. `placeholder`, `aria-label`, `className`). */
  inputProps?: WithClassName<NumberFieldPrimitive.Input.Props>;
  /** @default "small" */
  size?: Size;
  /**
   * Text alignment. Defaults to `"end"` for currency and percent formats, `"start"` otherwise.
   */
  align?: "start" | "center" | "end";
  /**
   * Show the decrement and increment buttons.
   * @default true
   */
  steppers?: boolean;
  /** Accessible name of the decrement button. */
  decrementLabel?: string;
  /** Accessible name of the increment button. */
  incrementLabel?: string;
  placeholder?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      groupClassName,
      inputProps,
      size = "small",
      align,
      steppers = true,
      decrementLabel = "Decrease",
      incrementLabel = "Increase",
      placeholder,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      format,
      ...props
    },
    ref,
  ) => {
    const resolvedAlign =
      align ??
      (format?.style === "currency" || format?.style === "percent"
        ? "end"
        : "start");
    const { className: inputClassName, ...restInputProps } = inputProps ?? {};

    return (
      <NumberFieldPrimitive.Root
        ref={ref}
        format={format}
        className={clx("w-full", className)}
        {...props}
      >
        <NumberFieldPrimitive.Group
          className={combobox_input_group_cva({
            size,
            edges: "both",
            className: groupClassName,
          })}
        >
          {steppers && (
            <NumberFieldPrimitive.Decrement
              aria-label={decrementLabel}
              className={combobox_icon_button_cva({ size, variant: "stepper" })}
            >
              <MinusIcon aria-hidden />
            </NumberFieldPrimitive.Decrement>
          )}
          <NumberFieldPrimitive.Input
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={combobox_input_cva({
              size,
              padding: "tight",
              align: resolvedAlign,
              className: clx("tabular-nums", !steppers && "px-2.5", inputClassName),
            })}
            {...restInputProps}
          />
          {steppers && (
            <NumberFieldPrimitive.Increment
              aria-label={incrementLabel}
              className={combobox_icon_button_cva({ size, variant: "stepper" })}
            >
              <PlusIcon aria-hidden />
            </NumberFieldPrimitive.Increment>
          )}
        </NumberFieldPrimitive.Group>
      </NumberFieldPrimitive.Root>
    );
  },
);
NumberField.displayName = "NumberField";

/*========================================================================================================================*/

interface CurrencyFieldProps extends Omit<NumberFieldProps, "format"> {
  /**
   * ISO 4217 currency code.
   * @default "MYR"
   */
  currency?: string;
  /** Extra `Intl.NumberFormat` options, merged over the currency preset. */
  format?: Omit<Intl.NumberFormatOptions, "style" | "currency">;
}

/**
 * NumberField preset for ringgit: "RM 1,234.50", tabular figures, right-aligned,
 * two decimal places, no negative amounts and no stepper buttons by default.
 *
 * @example
 * <Field name="income">
 *   <FieldLabel>Annual income</FieldLabel>
 *   <CurrencyField defaultValue={48000} />
 * </Field>
 */
const CurrencyField = forwardRef<HTMLDivElement, CurrencyFieldProps>(
  (
    {
      currency = "MYR",
      locale = "ms-MY",
      format,
      min = 0,
      step = "any",
      steppers = false,
      ...props
    },
    ref,
  ) => (
    <NumberField
      ref={ref}
      locale={locale}
      min={min}
      step={step}
      steppers={steppers}
      format={{
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        ...format,
      }}
      {...props}
    />
  ),
);
CurrencyField.displayName = "CurrencyField";

export { NumberField, CurrencyField };
export type { NumberFieldProps, CurrencyFieldProps };
