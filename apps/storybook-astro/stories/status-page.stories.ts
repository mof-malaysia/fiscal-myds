import StatusPage from "@/components/blocks/status-page.astro";

export default {
  title: "Marketing/Status Page",
  component: StatusPage,
};

export const NotFound = {
  args: { kind: "not-found", homeHref: "#utama", supportHref: "#hubungi" },
};
export const ServerError = {
  args: { kind: "server-error", homeHref: "#utama" },
};
export const Maintenance = {
  args: { kind: "maintenance", backAt: "4.00 pagi, 2 November 2026" },
};
export const English = {
  args: {
    lang: "en",
    kind: "not-found",
    homeHref: "#home",
    supportHref: "#contact",
  },
};
