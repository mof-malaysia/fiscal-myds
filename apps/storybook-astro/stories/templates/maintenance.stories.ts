import MaintenancePage from "../../../../packages/astro/src/templates/maintenance.astro";

// Same title as the other error pages template: Storybook lists both stories together
export default {
  title: "Marketing/Templates/Error Pages",
  component: MaintenancePage,
  tags: ["!autodocs"],
};

/** Served on its own while the site is down: Masthead, agency name and when it'll be back. Source: packages/astro/src/templates/maintenance.astro */
export const Maintenance = {};
