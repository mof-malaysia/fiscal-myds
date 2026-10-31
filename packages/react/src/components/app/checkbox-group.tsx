"use client";

import React, { ReactNode, forwardRef } from "react";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cva, type VariantProps } from "class-variance-authority";
import { Checkbox, type CheckboxProps } from "../core/checkbox";
import { FieldDescription, FieldItem, FieldLabel } from "../core/field";
import { clx, type WithClassName } from "../../utils";

/**
 * CheckboxGroup holds a set of checkboxes that share one value (an array of the
 * ticked `value`s): "Which reliefs are you claiming?". Pass `allValues` and add a
 * `parent` item for a "Select all" checkbox that ticks, unticks and shows the mixed
 * state of the rest.
 *
 * Put it in a `Field` (for the error and validity) and render it as a `Fieldset`
 * so the question is the legend.
 *
 * @example
 * <Field name="reliefs">
 *   <Fieldset render={<CheckboxGroup defaultValue={[]} />}>
 *     <FieldsetLegend>Which reliefs are you claiming?</FieldsetLegend>
 *     <CheckboxGroupItem value="medical" label="Medical expenses" />
 *     <CheckboxGroupItem value="education" label="Education fees" hint="For yourself only" />
 *   </Fieldset>
 *   <FieldError>Select at least one relief</FieldError>
 * </Field>
 *
 * // Select all
 * <CheckboxGroup allValues={["a", "b"]} defaultValue={[]} aria-labelledby="files">
 *   <CheckboxGroupItem parent label="Select all" />
 *   <CheckboxGroupNested>
 *     <CheckboxGroupItem value="a" label="Payslips" />
 *     <CheckboxGroupItem value="b" label="EA form" />
 *   </CheckboxGroupNested>
 * </CheckboxGroup>
 */

const checkbox_group_cva = cva("flex w-full min-w-0 border-none p-0", {
  variants: {
    orientation: {
      // Comfortable 16px between options, compact 12px (DESIGN.md: Density)
      vertical: "flex-col gap-stack-md",
      // A legend or description rendered inside the group keeps its own row
      horizontal: [
        "flex-row flex-wrap gap-x-stack-lg gap-y-stack-sm",
        "[&>:not([data-slot=checkbox-group-item])]:basis-full",
      ],
    },
  },
  defaultVariants: { orientation: "vertical" },
});

interface CheckboxGroupProps
  extends
    WithClassName<CheckboxGroupPrimitive.Props>,
    VariantProps<typeof checkbox_group_cva> {}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ className, orientation, ...props }, ref) => (
    <CheckboxGroupPrimitive
      ref={ref}
      data-orientation={orientation ?? "vertical"}
      // Orientation wins over classes merged in from `<Fieldset render={<CheckboxGroup />}>`
      className={clx(className, checkbox_group_cva({ orientation }))}
      {...props}
    />
  ),
);
CheckboxGroup.displayName = "CheckboxGroup";

/*========================================================================================================================*/

interface CheckboxGroupItemProps extends Omit<
  CheckboxProps,
  "children" | "className"
> {
  /** Class for the row. */
  className?: string;
  label: ReactNode;
  /** Hint under the label, in Ink Secondary. */
  hint?: ReactNode;
}

/**
 * One option: checkbox, label and optional hint, wired to each other with `FieldItem`.
 * Give it a `value`, or `parent` for a "Select all" checkbox.
 */
const CheckboxGroupItem = forwardRef<HTMLElement, CheckboxGroupItemProps>(
  ({ className, label, hint, size = "medium", disabled, ...props }, ref) => (
    <FieldItem
      data-slot="checkbox-group-item"
      disabled={disabled}
      className={clx("gap-stack-sm items-start", className)}
    >
      {/* Optical alignment of the box with the first line of the label */}
      <span className="flex h-[var(--content-leading)] shrink-0 items-center">
        <Checkbox ref={ref} size={size} disabled={disabled} {...props} />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <FieldLabel className="text-content cursor-pointer font-normal">
          {label}
        </FieldLabel>
        {hint && <FieldDescription>{hint}</FieldDescription>}
      </span>
    </FieldItem>
  ),
);
CheckboxGroupItem.displayName = "CheckboxGroupItem";

/** Indents the children of a "Select all" item so the hierarchy is visible. */
const CheckboxGroupNested = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clx(
      "gap-stack-md flex flex-col pl-8 in-data-[density=compact]:pl-6",
      className,
    )}
    {...props}
  />
));
CheckboxGroupNested.displayName = "CheckboxGroupNested";

export { CheckboxGroup, CheckboxGroupItem, CheckboxGroupNested };
export type { CheckboxGroupProps, CheckboxGroupItemProps };
