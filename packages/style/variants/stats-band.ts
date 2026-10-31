import { cva } from "class-variance-authority";

/**
 * Classes for stats-band, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/stats-band.variants.ts.
 */

export const grid_cva = cva(
  "grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2",
  {
    variants: {
      count: {
        1: "sm:grid-cols-1",
        2: "",
        3: "lg:grid-cols-3",
        4: "lg:grid-cols-4",
      },
    },
    defaultVariants: { count: 3 },
  },
);
