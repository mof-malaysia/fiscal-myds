import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, VariantProps } from "class-variance-authority";
import React, { ComponentProps, ForwardRefExoticComponent } from "react";
import { CrossIcon } from "@/components/ui/icons/cross";
import { Button } from "@/components/ui/button";

/**
 * Pill is a removable tag: an applied filter, a chosen recipient, a selected option in
 * a multi-select. It shares Tag's neutral wash and pill shape (DESIGN.md, Badges and
 * Tags) and adds a ghost ✕ inside; the pill itself stays borderless.
 *
 * Sizes follow `data-density` like Tag's, a step taller so the ✕ is easy to hit.
 * The ✕ is named "Remove {label}" when the children are plain text; pass
 * `dismissLabel` otherwise (and for Bahasa Melayu).
 *
 * @example
 * <Pill onDismiss={() => removeFilter("approved")}>Approved</Pill>
 */

const pill_cva = cva(
  "font-body inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-medium",
  {
    variants: {
      size: {
        small: "text-label-compact h-6 px-2.5",
        medium: [
          "text-label-sm h-7 px-3",
          "in-data-[density=compact]:text-label-compact in-data-[density=compact]:h-6 in-data-[density=compact]:px-2.5",
        ],
        large: [
          "h-8 px-3.5 text-base leading-6",
          "in-data-[density=compact]:text-label-sm in-data-[density=compact]:h-7 in-data-[density=compact]:px-3",
        ],
      },
      disabled: {
        false: "bg-bg-washed-active text-txt-black-700",
        true: "bg-bg-white-disabled text-txt-black-disabled",
      },
      // The ✕ sits close to the right edge, so its circle lines up with the pill's end
      dismissible: {
        true: "pr-1 in-data-[density=compact]:pr-1",
        false: "",
      },
    },
    defaultVariants: {
      size: "medium",
      disabled: false,
      dismissible: false,
    },
  },
);

interface PillProps
  extends useRender.ComponentProps<"div">,
    Omit<VariantProps<typeof pill_cva>, "dismissible"> {
  disabled?: boolean;
  /** Shows a ✕ that calls this. Hidden while `disabled`. */
  onDismiss?: ComponentProps<typeof Button>["onClick"];
  /** Accessible name of the ✕. Defaults to "Remove {children}" for plain-text children. */
  dismissLabel?: string;
}

export const Pill: ForwardRefExoticComponent<PillProps> = React.forwardRef(
  (
    {
      render,
      children,
      disabled,
      size,
      className,
      onDismiss,
      dismissLabel,
      ...props
    },
    ref,
  ) => {
    const dismissible = Boolean(onDismiss) && !disabled;
    const label =
      dismissLabel ??
      (typeof children === "string" ? `Remove ${children}` : "Remove");

    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          className: pill_cva({ size, disabled, dismissible, className }),
          "aria-disabled": disabled || undefined,
          children: (
            <>
              {children}
              {dismissible && (
                // Ghost ✕ sized to the pill, not to the density's control height
                <button
                  type="button"
                  aria-label={label}
                  className="text-txt-black-700 hover:text-txt-black-900 hover:bg-otl-gray-200 focus-ring inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 motion-reduce:transition-none"
                  onClick={onDismiss}
                >
                  <CrossIcon className="size-3.5" aria-hidden />
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
