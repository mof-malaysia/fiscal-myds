import { cva } from "class-variance-authority";

/**
 * Classes for navbar, shared by the React and Astro components so both
 * stacks render the same. Edit here, not in the component. The registry
 * installs this file as components/ui/navbar.variants.ts.
 */

/** The sticky bar itself. */
export const navbar_header_class =
  "bg-bg-white border-otl-gray-200 z-sticky sticky top-0 h-16 w-full border-b max-md:h-14 print:hidden";

/** The bar's content row: brand, links, actions. */
export const navbar_bar_class =
  "relative mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4.5 max-md:h-14 md:px-6";

/** The logo and site title, linking home. */
export const navbar_brand_class = "flex h-full w-auto items-center gap-2.5";

/** The logo image in the brand link. */
export const navbar_brand_image_class =
  "aspect-auto h-full max-h-8 w-auto select-none";

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
  "hover:bg-bg-washed-active aria-[current=page]:bg-bg-primary-50 transition-colors motion-reduce:transition-none",
];

/** The icon tile in a rich link; it flips to the panel colour on the hovered or current row. */
export const navbar_menu_icon_tile_class = [
  "bg-bg-washed-active text-txt-black-700 flex size-9 shrink-0 items-center justify-center rounded-md [&_svg]:size-5",
  "group-hover/item:bg-bg-dialog group-aria-[current=page]/item:bg-bg-dialog group-aria-[current=page]/item:text-txt-primary",
  "transition-colors motion-reduce:transition-none",
];

/** The label and description column of a rich link. */
export const navbar_menu_rich_text_class =
  "flex min-w-0 flex-col gap-0.5 pt-px";

/** A rich link's label. */
export const navbar_menu_rich_label_class =
  "text-txt-black-900 group-aria-[current=page]/item:text-txt-primary text-body-sm font-medium";

/** A rich link's one-line description. */
export const navbar_menu_rich_description_class =
  "text-txt-black-700 text-body-sm font-normal";

/** A dropdown trigger (with `navbar_menu_item_cva({ is_from_dropdown: false })`). */
export const navbar_trigger_class =
  "group w-full select-none bg-transparent transition-colors xl:w-max";

/** The chevron in a dropdown trigger; the component adds the open rotation. */
export const navbar_chevron_class =
  "relative top-px ml-1.5 size-4 transition motion-reduce:transition-none";

/** A titled column of links inside a dropdown. */
export const navbar_group_class = [
  "flex list-none flex-col gap-1",
  // Mobile: space above each group, not below, so a heading reads with its own links
  "max-xl:gap-0 max-xl:not-first:mt-3",
];

/** A group's heading. */
export const navbar_group_heading_class =
  "text-txt-black-700 text-label-compact px-2.5 pt-1 font-medium max-xl:ml-3 max-xl:pt-2 max-xl:pb-0.5";

/** The one highlighted item in a dropdown: text on a Well. */
export const navbar_feature_class = [
  "bg-bg-washed-active flex h-full flex-col gap-2 rounded-md p-4 text-left",
  "group/feature transition-colors motion-reduce:transition-none",
];

/** Small label above the feature's title, e.g. "New". */
export const navbar_feature_eyebrow_class =
  "text-txt-primary text-label-compact font-medium";

/** The feature's title. */
export const navbar_feature_title_class =
  "text-txt-black-900 text-body-md font-semibold";

/** The feature's description. */
export const navbar_feature_description_class =
  "text-txt-black-700 text-body-sm";

/** The feature's call to action, at the bottom. */
export const navbar_feature_cta_class =
  "text-txt-primary text-body-sm mt-auto inline-flex items-center gap-1 pt-2 font-medium";

/** The arrow after the feature's call to action; nudges on hover. */
export const navbar_feature_arrow_class =
  "size-4 transition-transform group-hover/feature:translate-x-0.5 motion-reduce:transition-none";

/** "All services →": a dropdown's way out to the full index. */
export const navbar_footer_link_class =
  "text-txt-primary text-body-sm group/footer inline-flex items-center gap-1 font-medium";

/** The arrow after the footer link; nudges on hover. */
export const navbar_footer_arrow_class =
  "size-4 transition-transform group-hover/footer:translate-x-0.5 motion-reduce:transition-none";

/** Desktop dropdown: the links and the feature side by side. */
export const navbar_dropdown_body_class = "flex gap-2 p-2";

/** Desktop dropdown: the grid of links (add `navbar_dropdown_columns`). */
export const navbar_dropdown_list_class = "grid content-start gap-x-2 gap-y-1";

/** Desktop dropdown: the feature's column. */
export const navbar_dropdown_feature_class = "w-64 shrink-0";

/** Desktop dropdown: the footer band. A Well band, not a divider (DESIGN.md: tone, not lines). */
export const navbar_dropdown_footer_class = "bg-bg-washed-active px-4.5 py-3";

/** Tablet / mobile: an expanded dropdown, feature and footer stacked below the links. */
export const navbar_mobile_dropdown_class = "flex w-full flex-col gap-2 pb-2";

/** Tablet / mobile: the feature, in line with the links. */
export const navbar_mobile_feature_class = "ml-3";

/** Tablet / mobile: the footer link's row. */
export const navbar_mobile_footer_class =
  "ml-3 flex min-h-11 items-center px-2.5";

/** Grid columns of a dropdown's plain links. */
export const navbar_dropdown_columns = {
  1: "grid-cols-[minmax(13rem,20rem)]",
  2: "grid-cols-[repeat(2,minmax(0,16rem))]",
  3: "grid-cols-[repeat(3,minmax(0,15rem))]",
};
