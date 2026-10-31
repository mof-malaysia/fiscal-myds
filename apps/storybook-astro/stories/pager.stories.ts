import Pager from "@/components/ui/pager.astro";

// Story args are data, so href is a pattern here; a function works in a real page
const href = "#halaman-{n}";

export default {
  title: "Marketing/Pager",
  component: Pager,
  parameters: { layout: "padded" },
};

export const FirstPage = { args: { current: 1, total: 12, href } };
export const MiddlePage = { args: { current: 6, total: 12, href } };
export const LastPage = { args: { current: 12, total: 12, href } };
export const FewPages = { args: { current: 2, total: 3, href } };
export const FirstHref = {
  args: { current: 4, total: 9, href: "#berita-{n}", firstHref: "#berita" },
};
export const English = { args: { lang: "en", current: 4, total: 9, href } };
