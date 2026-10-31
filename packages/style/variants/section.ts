import { cva } from "class-variance-authority";

/**
 * Classes the Astro marketing blocks share: the section band and its
 * container, a card that is one stretched link, the icon badge, and a meta
 * row with dots between its items. The Astro Section component renders the
 * band and container; blocks import the rest. The registry installs this file
 * as components/ui/section.variants.ts.
 */

/** The full-width band: Paper (the page) or Well (a recessed band). */
export const band_cva = cva("font-body w-full", {
  variants: {
    tone: {
      paper: "bg-bg-gray-50",
      well: "bg-bg-washed",
    },
  },
  defaultVariants: { tone: "paper" },
});

/** The centred column inside a band. `flush` drops the band padding (e.g. in a tab panel). */
export const container_cva = cva("mx-auto flex w-full flex-col gap-10", {
  variants: {
    width: {
      wide: "max-w-[1280px]",
      article: "max-w-[808px]",
    },
    flush: {
      true: "",
      false: "px-4 py-12 md:px-6 md:py-16",
    },
  },
  defaultVariants: { width: "wide", flush: false },
});

/**
 * A list item that is one link: put `linked_item_class` on the item and
 * `stretched_link_class` on its one `<a>`, whose box then covers the item.
 * The item shows the focus ring; the link text underlines on hover.
 */
export const linked_item_class =
  "group relative has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-fr-primary has-[a:focus-visible]:ring-offset-2";
export const stretched_link_class =
  "outline-none after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4";

/** An icon in a primary-wash circle. The icon is sized by the badge. */
export const icon_badge_cva = cva(
  "bg-bg-primary-50 text-txt-primary flex shrink-0 items-center justify-center rounded-full",
  {
    variants: {
      size: {
        medium: "size-10 [&_svg]:size-5",
        large: "size-12 [&_svg]:size-6",
      },
    },
    defaultVariants: { size: "large" },
  },
);

/**
 * A row of short facts (date, category, file size) with a dot between each.
 * Each dot sits in the gap left of its item and the row clips its left edge,
 * so the first item on every line, wrapped or not, has none.
 */
export const meta_row_class = [
  "text-txt-black-700 text-body-sm flex flex-wrap items-center gap-x-4 gap-y-1 overflow-hidden",
  "[&>*]:relative [&>*]:before:absolute [&>*]:before:top-1/2 [&>*]:before:-left-2.5 [&>*]:before:size-1 [&>*]:before:-translate-y-1/2 [&>*]:before:rounded-full [&>*]:before:bg-txt-black-500 [&>*]:before:content-['']",
].join(" ");
