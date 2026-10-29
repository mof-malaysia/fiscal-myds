import React from "react";
import { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clx } from "@/lib/ftds/utils";

const spinnerVariants = cva(
  [
    "animate-spin",
    "[animation-duration:600ms]",
    "rounded-full",
    "bg-[conic-gradient(var(--tw-gradient-stops))]",
    "from-transparent",
    "[mask:radial-gradient(transparent_56%,#000_56%)]",
  ],
  {
    variants: {
      size: {
        small: "h-4 w-4",
        medium: "h-5 w-5",
        large: "h-6 w-6",
      },
      color: {
        gray: "to-txt-black-500",
        white: "to-white",
      },
    },
    defaultVariants: {
      size: "small",
      color: "gray",
    },
  },
);

interface SpinnerProps
  extends VariantProps<typeof spinnerVariants>,
    Omit<ComponentProps<"div">, "color"> {
  className?: string;
  show?: boolean;
  /**
   * What is loading, read by screen readers. Pass `null` when text beside the
   * spinner already says it (the spinner is then hidden from them).
   * @default "Loading"
   */
  label?: string | null;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size,
  color,
  className = "",
  show = true,
  label = "Loading",
  ...props
}) => {
  if (!show) {
    return null;
  }
  return (
    <div
      {...(label === null
        ? { "aria-hidden": true }
        : { role: "status", "aria-label": label })}
      {...props}
      className={clx("relative flex items-center justify-center", className)}
    >
      <div className={spinnerVariants({ size, color })}></div>
    </div>
  );
};
Spinner.displayName = "Spinner";
