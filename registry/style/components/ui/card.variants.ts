import { cva } from "class-variance-authority";

/**
 * Classes for card, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/card.variants.ts.
 */

export const card_cva = cva(
  [
    "font-body text-txt-black-900 flex flex-col rounded-lg",
    "gap-stack-lg p-surface",
  ],
  {
    variants: {
      tone: {
        sheet: "bg-bg-white",
        well: "bg-bg-washed",
      },
    },
    defaultVariants: {
      tone: "sheet",
    },
  },
);
