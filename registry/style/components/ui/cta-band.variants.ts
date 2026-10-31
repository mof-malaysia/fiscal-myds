import { cva } from "class-variance-authority";

/**
 * Classes for cta-band, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/cta-band.variants.ts.
 */

export const band_cva = cva("font-body w-full", {
  variants: {
    tone: {
      well: "bg-bg-washed",
      primary: "bg-bg-primary-50",
    },
  },
  defaultVariants: { tone: "well" },
});
