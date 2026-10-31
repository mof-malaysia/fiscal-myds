import { cva } from "class-variance-authority";

/**
 * Classes for tag, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/tag.variants.ts.
 */

export const tag_cva = cva(
  [
    "font-body inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium",
    "[&>svg]:size-3.5 [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Washed-active: the same grey as Well in light, one step up in dark so it shows
        default: "bg-bg-washed-active text-txt-black-700",
        primary: "bg-bg-primary-50 text-txt-primary",
        success: "bg-bg-success-50 text-txt-success",
        danger: "bg-bg-danger-50 text-txt-danger",
        warning: "bg-bg-warning-50 text-txt-warning",
      },
      size: {
        // The DESIGN.md badge: Label Compact, 2px 10px
        small: "text-label-compact h-[22px] px-2.5",
        medium: [
          "text-label-sm h-6 px-2.5",
          "in-data-[density=compact]:text-label-compact in-data-[density=compact]:h-[22px]",
        ],
        large: [
          "h-8 px-3 text-base leading-6",
          "in-data-[density=compact]:text-label-sm in-data-[density=compact]:h-6 in-data-[density=compact]:px-2.5",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);
