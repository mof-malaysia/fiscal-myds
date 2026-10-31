import { cva } from "class-variance-authority";

/**
 * Classes for callout, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/callout.variants.ts.
 */

export const calloutVariants = cva(
  [
    "flex justify-between items-center gap-2",
    "p-3 rounded-md w-full",
    "[&:has([role=definition])]:items-start",
  ],
  {
    variants: {
      variant: {
        success: "bg-bg-success-50 text-txt-success",
        warning: "bg-bg-warning-50 text-txt-warning",
        info: "bg-bg-primary-50 text-txt-primary",
        danger: "bg-bg-danger-50 text-txt-danger",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);
