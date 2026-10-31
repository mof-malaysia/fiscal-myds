import { cva } from "class-variance-authority";

/**
 * Classes for footer, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/footer.variants.ts.
 */

export const footer_cva = cva(
  [
    "font-body text-content text-txt-black-700 w-full border-t border-otl-gray-200 print:hidden",
  ],
  {
    variants: {
      tone: {
        paper: "bg-bg-gray-50",
        well: "bg-bg-washed",
      },
    },
    defaultVariants: { tone: "paper" },
  },
);

/** Ink Secondary link that darkens on hover; shared with the marketing SiteFooterLink. */
export const footer_link_class = "text-txt-black-700 hover:text-txt-black-900";
