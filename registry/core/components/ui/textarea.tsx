"use client";

import { cva, VariantProps } from "class-variance-authority";
import React, { forwardRef } from "react";
import { Field as FieldPrimitive } from "@base-ui/react/field";

const text_area_cva = cva(
  [
    "w-full rounded-md border border-otl-control bg-bg-white resize-none",
    "placeholder:text-txt-black-500 text-txt-black-700 transition-colors font-body placeholder:font-body",
    "focus:outline-none focus-visible:ring focus-visible:ring-fr-primary focus-visible:border-otl-primary-300",
    "disabled:bg-bg-washed disabled:cursor-not-allowed disabled:text-txt-black-disabled",
    "data-[invalid]:border-bg-danger-600",
  ],
  {
    variants: {
      size: {
        small: "min-h-[100px] px-3 py-2.5 text-field-sm",
        medium: "min-h-[120px] p-3 text-field-md",
        large: "min-h-[150px] p-3.5 text-field-lg",
      },
    },
    // Small, like Input and Select: sizes are relative to the density
    defaultVariants: {
      size: "small",
    },
  },
);

interface TextAreaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof text_area_cva> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, size, ...props }, ref) => {
    // Field.Control joins the surrounding Field: label, hint, error, validity
    return (
      <FieldPrimitive.Control
        // Control is typed for <input>; the props it forwards are the same for <textarea>
        {...(props as FieldPrimitive.Control.Props)}
        ref={ref as React.Ref<HTMLInputElement>}
        className={text_area_cva({ size, className })}
        render={<textarea />}
      />
    );
  },
);

TextArea.displayName = "TextArea";

export { TextArea };
