import { cva } from "class-variance-authority";

/**
 * Classes for link, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/link.variants.ts.
 */

export const link_cva = cva(
  "decoration-1 underline-offset-[3px] transition-colors rounded-xs outline-none focus-ring",
  {
    variants: {
      underline: {
        always: "underline hover:decoration-2",
        hover: "no-underline hover:underline",
        none: "no-underline",
      },
      primary: {
        true: "text-txt-primary",
        false: "text-inherit decoration-inherit",
      },
    },
  },
);
