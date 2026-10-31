import { cva } from "class-variance-authority";

/**
 * Classes for navbar, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/navbar.variants.ts.
 */

/** The site title beside the logo; a long one is set smaller over two lines. */
export const navbar_logo_cva = cva(
  ["font-semibold max-w-[200px] font-heading text-txt-black-900 line-clamp-2"],
  {
    variants: {
      too_long: {
        false: "text-body-lg max-md:text-body-md max-md:leading-tight",
        true: "text-body-xs leading-[14px] line-clamp-2",
      },
    },
    defaultVariants: {
      too_long: false,
    },
  },
);

/** Marks the trigger or link of the section the visitor is in (DESIGN.md: Navigation). */
export const navbar_current_class = [
  "relative text-txt-black-900",
  // Inside the item's box: items truncate (overflow hidden), so it can't hang below
  "xl:after:absolute xl:after:inset-x-2.5 xl:after:bottom-0 xl:after:h-0.5 xl:after:rounded-full xl:after:bg-bg-primary-600",
];

/** A top-level link or dropdown trigger, or a plain link inside a dropdown. */
export const navbar_menu_item_cva = cva(
  [
    "bg-transparent hover:bg-bg-washed-active text-txt-black-700 truncate px-2.5 py-1.5",
    "transition-colors motion-reduce:transition-none list-none",
    "w-full xl:w-fit text-body-sm flex items-center cursor-pointer",
    // Tablet / mobile sheet: 44px rows and 16px text (DESIGN.md: Navigation, Mobile)
    "max-xl:min-h-11 max-xl:text-body-md",
  ],
  {
    variants: {
      is_from_dropdown: {
        true: "text-label-sm font-normal ml-3 xl:ml-0 xl:w-full rounded-md xl:rounded-xs text-left",
        false: "font-medium rounded-md",
      },
    },
  },
);

/** A dropdown link with an icon and/or description: the whole row is the link. */
export const navbar_menu_rich_link_class = [
  "group/item flex w-full items-start gap-3 rounded-md p-2.5 text-left",
  "hover:bg-bg-washed-active data-[active]:bg-bg-primary-50 transition-colors motion-reduce:transition-none",
];

/** Grid columns of a dropdown's plain links. */
export const navbar_dropdown_columns = {
  1: "grid-cols-[minmax(13rem,20rem)]",
  2: "grid-cols-[repeat(2,minmax(0,16rem))]",
  3: "grid-cols-[repeat(3,minmax(0,15rem))]",
};
