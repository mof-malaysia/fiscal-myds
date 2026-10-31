import { cva } from "class-variance-authority";

/**
 * Classes for button, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/button.variants.ts.
 */

export const button_cva = cva(
  [
    "group flex select-none items-center gap-1.5 rounded-md w-fit",
    "font-body font-medium outline-none transition disabled:cursor-not-allowed",
    "text-center active:translate-y-[0.5px]",
    // outline-solid is required: outline-2 alone keeps the base outline-none style
    "focus-ring",
  ],
  {
    variants: {
      variant: {
        "default-outline": [
          // Tonal, not outlined (DESIGN.md: separate with tone, not lines)
          "bg-bg-washed border border-transparent text-txt-black-900",
          "hover:bg-bg-washed-active",
          "disabled:bg-bg-white-disabled disabled:text-txt-black-disabled disabled:border-transparent",
        ],
        "default-ghost": [
          "bg-transparent border border-transparent text-txt-black-700",
          "hover:bg-bg-washed hover:text-txt-black-900",
          "disabled:bg-bg-white-disabled disabled:text-txt-black-disabled disabled:border-transparent",
        ],
        "danger-fill": [
          // Theme tokens: Danger Fill with white text in light, a lighter red with
          // Dark Sheet text in dark
          "bg-bg-danger-600 border border-transparent text-txt-white",
          "hover:bg-bg-danger-700",
          "disabled:bg-bg-danger-disabled disabled:text-txt-white-disabled",
        ],
        "danger-outline": [
          "bg-bg-danger-50 border border-transparent text-txt-danger",
          "hover:bg-bg-danger-100",
          "disabled:bg-bg-white-disabled disabled:text-txt-danger-disabled disabled:border-transparent",
        ],
        "danger-ghost": [
          "bg-transparent border border-transparent text-txt-danger",
          "hover:bg-bg-danger-50",
          "disabled:bg-bg-white-disabled disabled:text-txt-danger-disabled disabled:border-transparent",
        ],
        "primary-fill": [
          // Theme tokens (DESIGN.md, Dark theme): FTDS Blue with white text in light,
          // Dark FTDS Blue with Dark Sheet text in dark
          "bg-bg-primary-600 border border-transparent text-txt-white",
          "hover:bg-bg-primary-700",
          "disabled:bg-bg-primary-disabled disabled:text-txt-white-disabled",
        ],
        "primary-outline": [
          "bg-bg-primary-50 border border-transparent text-txt-primary",
          "hover:bg-bg-primary-100",
          "disabled:bg-bg-white-disabled disabled:text-txt-primary-disabled disabled:border-transparent",
        ],
        "primary-ghost": [
          "bg-transparent border border-transparent text-txt-primary",
          "hover:bg-bg-primary-50",
          "disabled:bg-bg-white-disabled disabled:text-txt-primary-disabled disabled:border-transparent",
        ],
        unset: null,
      },

      size: {
        // Height, padding and type follow data-density (comfortable / compact)
        small: "control-sm text-label-sm",
        medium: "control-md text-label-md",
        large: "control-lg text-label-lg",
      },

      iconOnly: {
        true: "aspect-square justify-center rounded-md px-0",
        false: "",
      },
    },
    compoundVariants: [
      {
        iconOnly: true,
        size: "small",
        className: "control-square-sm",
      },
      {
        iconOnly: true,
        size: "medium",
        className: "control-square-md",
      },
      {
        iconOnly: true,
        size: "large",
        className: "control-square-lg",
      },
    ],
    defaultVariants: {
      variant: "primary-fill",
      size: "small",
      iconOnly: false,
    },
  },
);

export const button_counter_cva = cva(
  [
    "flex aspect-square shrink-0 items-center justify-center",
    "rounded-full px-1 leading-none bg-bg-primary-600 text-txt-white",
    "group-disabled:bg-bg-white-disabled group-disabled:text-inherit",
  ],
  {
    variants: {
      variant: {
        // The counter inverts the fill: on-colour pill, coloured number
        "primary-fill": ["bg-txt-white text-txt-primary"],
        "danger-fill": ["bg-txt-white text-txt-danger"],
        "default-outline": "",
        "default-ghost": "",
        "danger-outline": "",
        "danger-ghost": "",
        "primary-outline": "",
        "primary-ghost": "",
        unset: "",
      },
      size: {
        small: "h-4.5 w-4.5 text-body-sm",
        medium: "h-5 w-5 text-body-sm",
        large: "h-6 w-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary-fill",
      size: "small",
    },
  },
);

export const button_icon_cva = cva(
  "block stroke-inherit text-inherit stroke-[1.5px] shrink-0",
  {
    variants: {
      size: {
        small: "h-4 w-4",
        medium: "h-5 w-5",
        large: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);
