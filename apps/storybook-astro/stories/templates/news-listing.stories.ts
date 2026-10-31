import NewsListing from "../../../../packages/astro/src/templates/news-listing.astro";

// Same title as the other news template: Storybook lists both stories together
export default {
  title: "Marketing/Templates/News",
  component: NewsListing,
  tags: ["!autodocs"],
};

/** Every news item, newest first, with a Pager. Source: packages/astro/src/templates/news-listing.astro */
export const Listing = {};
