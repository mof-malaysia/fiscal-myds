"use client";

import React, { ComponentRef, forwardRef } from "react";
import { Fieldset as FieldsetPrimitive } from "@base-ui/react/fieldset";
import { clx, type WithClassName } from "@/lib/ftds/utils";

/**
 * Fieldset groups related fields under one legend, such as an address or the
 * parts of a date. Disabling the fieldset disables every field inside it.
 *
 * @example
 * <Fieldset>
 *   <FieldsetLegend>Correspondence address</FieldsetLegend>
 *   <FieldsetDescription>We'll post your certificate here.</FieldsetDescription>
 *   <Field>...</Field>
 * </Fieldset>
 */

const Fieldset = forwardRef<
  ComponentRef<typeof FieldsetPrimitive.Root>,
  WithClassName<FieldsetPrimitive.Root.Props>
>(({ className, ...props }, ref) => (
  <FieldsetPrimitive.Root
    ref={ref}
    className={clx(
      // Comfortable 16–24px gaps, compact 8–12px (DESIGN.md: Density)
      "gap-stack-md flex w-full min-w-0 flex-col border-none p-0",
      className,
    )}
    {...props}
  />
));
Fieldset.displayName = "Fieldset";

const fieldset_legend_sizes = {
  // Title: form section headings
  medium: "text-title font-semibold",
  // Headline: a question that is the whole page ("What is your income?")
  large: "text-headline font-semibold",
};

interface FieldsetLegendProps
  extends WithClassName<FieldsetPrimitive.Legend.Props> {
  size?: keyof typeof fieldset_legend_sizes;
}

const FieldsetLegend = forwardRef<
  ComponentRef<typeof FieldsetPrimitive.Legend>,
  FieldsetLegendProps
>(({ className, size = "medium", ...props }, ref) => (
  <FieldsetPrimitive.Legend
    ref={ref}
    className={clx(
      "font-heading text-txt-black-900",
      "data-[disabled]:text-txt-black-disabled",
      fieldset_legend_sizes[size],
      className,
    )}
    {...props}
  />
));
FieldsetLegend.displayName = "FieldsetLegend";

const FieldsetDescription = forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clx(
      "font-body text-content text-txt-black-700 -mt-2",
      className,
    )}
    {...props}
  />
));
FieldsetDescription.displayName = "FieldsetDescription";

export { Fieldset, FieldsetLegend, FieldsetDescription };
export type { FieldsetLegendProps };
