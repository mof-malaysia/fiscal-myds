import { cva } from "class-variance-authority";

/**
 * Classes for tabs, shared by the React and Astro components so both stacks
 * render the same. Edit here, not in the component. The registry installs
 * this file as components/ui/tabs.variants.ts.
 *
 * State selectors come in both forms: Base UI (React) sets `data-active` /
 * `data-disabled`; the Astro script uses `aria-selected` / `disabled`.
 */

/** The tab row. The Hairline is an inset shadow so the indicator can sit on top of it. */
export const tabs_list_cva = cva(
  [
    "relative z-0 flex max-w-full items-stretch gap-1 overflow-x-auto shadow-[inset_0_-1px_0_var(--color-otl-gray-200)]",
    "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
  ],
  {
    variants: {
      /** `full` runs the Hairline across the container; `fit` stops it at the last tab. */
      width: {
        fit: "w-fit",
        full: "w-full",
      },
    },
    defaultVariants: {
      width: "fit",
    },
  },
);

export const tabs_trigger_cva = cva(
  [
    "relative flex shrink-0 cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-md font-medium",
    "text-txt-black-700 hover:text-txt-black-900 data-[active]:text-txt-black-900 aria-selected:text-txt-black-900",
    "transition-colors duration-150 motion-reduce:transition-none",
    // Inset so the ring isn't clipped by the scrolling list
    "focus-ring-inset",
    "data-[disabled]:text-txt-black-disabled data-[disabled]:cursor-not-allowed",
    "disabled:text-txt-black-disabled disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        small: "control-sm px-3 text-label-sm",
        medium: "control-md px-4 text-label-md",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

/** The 2px FTDS Blue underline, placed by `--active-tab-left` / `--active-tab-width`. */
export const tabs_indicator_cva = cva([
  "bg-txt-primary absolute bottom-0 left-0 z-10 h-0.5 rounded-full",
  "w-(--active-tab-width) translate-x-(--active-tab-left)",
  "transition-[translate,width] duration-200 ease-(--ease-standard) motion-reduce:transition-none",
]);
