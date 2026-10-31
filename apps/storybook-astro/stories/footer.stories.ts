import Footer from "@/components/ui/footer.astro";

const links = [
  { label: "Dasar privasi", href: "#" },
  { label: "Penafian", href: "#" },
  { label: "Kebolehcapaian", href: "#" },
];

export default {
  title: "Core/Footer",
  component: Footer,
};

export const Default = {
  args: {
    copyright: "© 2026 Kementerian Kewangan Malaysia",
    meta: "Kemas kini terakhir: 28 Okt 2026",
    links,
  },
};
export const Owner = {
  args: { owner: "Kementerian Kewangan Malaysia", links },
};
export const Well = {
  args: {
    tone: "well",
    copyright: "© 2026 Kementerian Kewangan Malaysia",
    links,
  },
};
export const CopyrightOnly = {
  args: { copyright: "© 2026 Kementerian Kewangan Malaysia" },
};
export const English = {
  args: {
    lang: "en",
    tone: "well",
    copyright: "© 2026 Ministry of Finance Malaysia",
    linksLabel: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "MOF website", href: "https://www.mof.gov.my", newTab: true },
    ],
  },
};
