import Navbar from "@/components/ui/navbar.astro";
import { brand, standardItems } from "./_navbar";

// WithLanguageSwitcher is in navbar-with-language-switcher.stories.ts

/** Described items, grouped columns with a footer, and a feature. */
const expressiveItems = [
  {
    label: "Perkhidmatan",
    current: true,
    children: [
      {
        label: "Bayar bil",
        href: "#bayar",
        description: "Saman, yuran dan taksiran",
        current: true,
      },
      {
        label: "Dapatkan resit",
        href: "#resit",
        description: "Muat turun atau cetak semula resit rasmi",
      },
      {
        label: "Jejak permohonan",
        href: "#jejak",
        description: "Lihat status permohonan anda",
      },
    ],
  },
  {
    label: "Untuk anda",
    footer: { label: "Semua perkhidmatan", href: "#semua" },
    groups: [
      {
        title: "Untuk rakyat",
        links: [
          { label: "Pelepasan cukai", href: "#pelepasan" },
          { label: "Bayaran balik", href: "#bayaran-balik" },
          { label: "Bantuan tunai", href: "#bantuan" },
        ],
      },
      {
        title: "Untuk perniagaan",
        links: [
          { label: "Pendaftaran pembekal", href: "#pembekal" },
          { label: "Tender", href: "#tender" },
          { label: "e-Invois", href: "#einvois" },
        ],
      },
    ],
  },
  {
    label: "Penerbitan",
    href: "#penerbitan",
    feature: {
      href: "#belanjawan-2027",
      eyebrow: "Baharu",
      title: "Belanjawan 2027 telah dibentangkan",
      description: "Apa maknanya bagi isi rumah dan perniagaan kecil.",
      linkLabel: "Baca ringkasan",
    },
    children: [
      { label: "Dokumen belanjawan", href: "#dokumen" },
      { label: "Tinjauan ekonomi", href: "#tinjauan" },
      { label: "Pekeliling perbendaharaan", href: "#pekeliling" },
    ],
  },
  { label: "Berita", href: "#berita" },
];

export default {
  title: "Marketing/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};

export const Standard = { args: { brand, items: standardItems } };
export const Expressive = { args: { brand, items: expressiveItems } };
export const English = {
  args: {
    lang: "en",
    brand: { ...brand, title: "Ministry of Finance" },
    items: [
      { label: "Home", href: "#home", current: true },
      {
        label: "Services",
        href: "#services",
        children: [
          {
            label: "Pay a bill",
            href: "#pay",
            description: "Summonses, fees and assessments",
          },
          {
            label: "Get a receipt",
            href: "#receipts",
            description: "Download or reprint an official receipt",
          },
        ],
      },
      { label: "Contact us", href: "#contact" },
    ],
  },
};
