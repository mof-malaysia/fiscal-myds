import DownloadList from "@/components/blocks/download-list.astro";

const files = [
  {
    title: "Panduan permohonan Sumbangan Tunai Rahmah 2026",
    href: "#panduan.pdf",
    type: "pdf",
    size: "1.2 MB",
    date: "2026-01-05",
  },
  {
    title: "Borang pengesahan pendapatan",
    href: "#borang.docx",
    type: "docx",
    size: "84 KB",
    date: "2026-01-05",
    description: "Diisi dan ditandatangani oleh ketua kampung atau penghulu.",
  },
  {
    title: "Data penerima mengikut negeri",
    href: "#data.xlsx",
    type: "xlsx",
    size: "640 KB",
    date: "2026-09-30",
  },
  {
    title: "Slaid taklimat Belanjawan 2027",
    href: "#slaid.pptx",
    type: "pptx",
    size: "6.8 MB",
    date: "2026-10-10",
  },
];

export default {
  title: "Marketing/Download List",
  component: DownloadList,
};

export const Default = { args: { title: "Borang dan panduan", files } };
export const Cards = {
  args: {
    title: "Penerbitan terkini",
    layout: "cards",
    tone: "well",
    files: files.map((file, i) => ({
      ...file,
      category: ["Panduan", "Borang", "Data", "Taklimat"][i],
    })),
  },
};
export const English = {
  args: {
    lang: "en",
    files: [
      {
        title: "Application guide",
        href: "#guide.pdf",
        type: "pdf",
        size: "1.2 MB",
        date: "2026-01-05",
      },
      {
        title: "Income declaration form",
        href: "#form.docx",
        type: "docx",
        size: "84 KB",
      },
    ],
  },
};
