import NotFoundPage from "../../../../packages/astro/src/templates/not-found.astro";

// Same title as the other error pages template: Storybook lists both stories together
export default {
  title: "Marketing/Templates/Error Pages",
  component: NotFoundPage,
  tags: ["!autodocs"],
};

/** The 404 page, inside the site chrome, with popular pages. Source: packages/astro/src/templates/not-found.astro */
export const NotFound = {};
