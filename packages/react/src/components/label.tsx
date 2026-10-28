import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, VariantProps } from "class-variance-authority";
import React, { ForwardRefExoticComponent } from "react";

const label_cva = cva(
  [
    "inline-flex gap-1 text-txt-black-700",
    "group-disabled:text-txt-black-disabled group-disabled:cursor-not-allowed group-disabled:shadow-none",
    "peer-disabled:text-txt-black-disabled peer-disabled:cursor-not-allowed peer-disabled:shadow-none",
  ],
  {
    variants: {
      size: {
        small: "text-body-sm",
        medium: "text-body-md",
        large: "text-body-lg",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

interface LabelProps
  extends useRender.ComponentProps<"label">,
    VariantProps<typeof label_cva> {}

const Label: ForwardRefExoticComponent<LabelProps> = React.forwardRef(
  ({ render, size, className, ...props }, ref) => {
    return useRender({
      defaultTagName: "label",
      render,
      ref,
      props: mergeProps<"label">(
        { className: label_cva({ size, className }) },
        props,
      ),
    });
  },
);
Label.displayName = "Label";

export { Label };
