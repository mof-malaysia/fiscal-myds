import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentProps, ForwardRefExoticComponent } from "react";
import { CrossIcon } from "../icons/cross";
import { Button } from "./button";

const pill_cva = cva(
  "rounded-full font-medium text-txt-black-700 inline-flex justify-between items-center",
  {
    variants: {
      size: {
        small: "px-[6px] py-[2px] text-body-xs gap-[2px]",
        medium: "px-[8px] py-[4px] text-body-sm gap-[4px]",
        large: "px-[10px] py-[4px] text-body-md gap-[4px]",
      },
      disabled: {
        false: "bg-bg-washed",
        true: "bg-bg-white-disabled text-txt-black-disabled",
      },
    },
    defaultVariants: {
      size: "medium",
      disabled: false,
    },
  },
);

interface PillProps
  extends useRender.ComponentProps<"div">,
    VariantProps<typeof pill_cva> {
  disabled?: boolean;
  onDismiss?: ComponentProps<typeof Button>["onClick"];
}

export const Pill: ForwardRefExoticComponent<PillProps> = React.forwardRef(
  (
    { render, children, disabled, size, className, onDismiss, ...props },
    ref,
  ) => {
    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          className: pill_cva({ size, disabled, className }),
          "aria-disabled": disabled || undefined,
          children: (
            <>
              {children}
              {onDismiss && !disabled && (
                // Inline control: sized to the pill, not to the density's control height
                <button
                  type="button"
                  aria-label="Remove"
                  className="text-txt-black-500 hover:bg-bg-washed-active hover:text-txt-black-900 focus-visible:outline-fr-primary rounded-full p-0.5 transition outline-none focus-visible:outline-2 focus-visible:outline-solid"
                  onClick={onDismiss}
                >
                  <CrossIcon className="size-4" aria-hidden />
                </button>
              )}
            </>
          ),
        },
        props,
      ),
    });
  },
);
Pill.displayName = "Pill";
