import { cva } from "class-variance-authority";

/**
 * Classes for feature-grid, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/feature-grid.variants.ts.
 */

export const grid_cva = cva(
  "grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2",
  {
    variants: {
      columns: {
        2: "",
        3: "lg:grid-cols-3",
      },
    },
    defaultVariants: { columns: 3 },
  },
);

export const item_cva = cva("flex flex-col items-start gap-4", {
  variants: {
    surface: {
      none: "",
      // Sheet on Paper (both themes: Sheet is one step above Paper).
      sheet: "bg-bg-white rounded-lg p-surface",
    },
  },
  defaultVariants: { surface: "none" },
});
