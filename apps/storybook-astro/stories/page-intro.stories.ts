import PageIntro from "@/components/blocks/page-intro.astro";
import { placeholder } from "./_logo";

const breadcrumb = [
  { label: "Utama", href: "#utama" },
  { label: "Media", href: "#media" },
  { label: "Belanjawan 2027 dibentangkan" },
];

export default {
  title: "Marketing/Page Intro",
  component: PageIntro,
};

export const Default = {
  args: {
    breadcrumb: [
      { label: "Utama", href: "#utama" },
      { label: "Mengenai kami" },
    ],
    title: "Mengenai kami",
    description:
      "Kementerian Kewangan merancang, mengurus dan memantau kewangan negara supaya setiap ringgit memberi manfaat kepada rakyat.",
  },
};
export const Article = {
  args: {
    tone: "paper",
    width: "article",
    breadcrumb,
    eyebrow: "Kenyataan media",
    title: "Belanjawan 2027 dibentangkan di Dewan Rakyat",
    meta: ["10 Oktober 2026", "4 minit bacaan"],
    slots: {
      media: `<img src="${placeholder("Gambar berita")}" width="1200" height="675" alt="" class="w-full" />`,
    },
  },
};
export const WithActions = {
  args: {
    breadcrumb: [{ label: "Utama", href: "#utama" }, { label: "Penerbitan" }],
    title: "Penerbitan",
    description:
      "Laporan, dokumen belanjawan dan pekeliling untuk dimuat turun.",
    slots: {
      actions: `<a href="#langgan" class="text-txt-primary underline">Langgan kemas kini</a>`,
    },
  },
};
