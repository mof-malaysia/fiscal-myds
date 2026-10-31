import NewsList from "@/components/blocks/news-list.astro";
import { news } from "./_logo";

const viewAll = { label: "Semua berita", href: "#media" };

export default {
  title: "Marketing/News List",
  component: NewsList,
};

export const Grid = { args: { items: news, viewAll } };
export const List = { args: { title: "", layout: "list", items: news } };
export const Compact = {
  args: {
    title: "Pengumuman",
    layout: "compact",
    tone: "well",
    items: news,
    viewAll: { label: "Semua pengumuman", href: "#pengumuman" },
  },
};
export const English = {
  args: {
    lang: "en",
    items: news.slice(0, 3).map((item, i) => ({
      ...item,
      title: [
        "Budget 2027 tabled in Parliament",
        "Second phase of cash aid paid",
        "Small business session in Kota Kinabalu",
      ][i]!,
      category: ["Press statement", "Announcement", "Event"][i],
      summary: undefined,
    })),
    viewAll: { label: "All news", href: "#news" },
  },
};
