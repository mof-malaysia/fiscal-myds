import StatsBand from "@/components/blocks/stats-band.astro";

const stats = [
  { value: "RM 4.2 bil", label: "Dikutip dalam talian pada 2025" },
  {
    value: "1.8 juta",
    label: "Bayaran sebulan",
    footnote: "Purata, Januari hingga September 2026",
  },
  { value: "32", label: "Agensi disambungkan" },
  { value: "3 min", label: "Masa biasa untuk membayar" },
];

export default {
  title: "Marketing/Stats Band",
  component: StatsBand,
};

export const FourStats = {
  args: {
    title: "MyBayar dalam angka",
    stats,
    source: "Sumber: Kementerian Kewangan Malaysia, September 2026",
  },
};
export const ThreeStats = {
  args: {
    title: "MyBayar dalam angka",
    description: "Angka bagi tahun 2025.",
    stats: stats.slice(0, 3),
  },
};
export const TwoStatsNoTitle = { args: { stats: stats.slice(0, 2) } };
