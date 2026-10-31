import ImpactStats from "@/components/blocks/impact-stats.astro";

const stats = [
  {
    value: "5.4 juta",
    label: "isi rumah menerima Sumbangan Tunai Rahmah",
    period: "Januari hingga September 2026",
    source: { label: "Kementerian Kewangan", href: "#data" },
  },
  {
    value: "RM 4.2 bil",
    label: "bayaran kerajaan dijelaskan dalam talian",
    period: "Tahun 2025",
    source: { label: "Akauntan Negara Malaysia", href: "#data" },
  },
  {
    value: "92%",
    label: "pengguna berpuas hati dengan perkhidmatan dalam talian",
    period: "Tinjauan Julai 2026, 12,400 responden",
    source: { label: "Tinjauan kepuasan pelanggan" },
  },
  {
    value: "32",
    label: "agensi menerima bayaran melalui satu portal",
    period: "September 2026",
  },
];

export default {
  title: "Marketing/Impact Stats",
  component: ImpactStats,
};

export const Default = {
  args: {
    title: "Kesan program kami",
    description: "Angka terkini, dengan sumbernya.",
    stats: stats.slice(0, 3),
    slots: {
      default:
        '<p>Cara angka ini dikira diterangkan dalam <a href="#metodologi">nota metodologi</a>.</p>',
    },
  },
};
export const FourColumnsPaper = {
  args: { title: "Dalam angka", tone: "paper", columns: 4, stats },
};
export const English = {
  args: {
    lang: "en",
    title: "Our impact",
    columns: 2,
    stats: [
      {
        value: "5.4 million",
        label: "households received cash aid",
        period: "January to September 2026",
        source: { label: "Ministry of Finance", href: "#data" },
      },
      {
        value: "RM 4.2 bil",
        label: "in government bills paid online",
        period: "2025",
        source: { label: "Accountant General's Department" },
      },
    ],
  },
};
