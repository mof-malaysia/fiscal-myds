import CtaCards from "@/components/blocks/cta-cards.astro";
import DesktopIcon from "@/components/ui/icons/desktop.astro";
import GovtOfficeIcon from "@/components/ui/icons/govt-office.astro";
import EmailIcon from "@/components/ui/icons/email.astro";

const options = [
  {
    icon: DesktopIcon,
    title: "Dalam talian",
    description:
      "Cara paling cepat. Kebanyakan permohonan selesai dalam 15 minit.",
    action: { label: "Mohon dalam talian", href: "#mohon" },
    recommended: true,
  },
  {
    icon: GovtOfficeIcon,
    title: "Di kaunter",
    description:
      "Bawa MyKad anda ke mana-mana pejabat kami, Isnin hingga Jumaat.",
    action: { label: "Cari pejabat", href: "#pejabat" },
  },
  {
    icon: EmailIcon,
    title: "Melalui pos",
    description:
      "Cetak borang, isi dan poskan kepada kami. Mengambil masa sehingga 30 hari.",
    action: { label: "Muat turun borang", href: "#borang" },
  },
];

export default {
  title: "Marketing/CTA Cards",
  component: CtaCards,
};

export const ThreeOptions = {
  args: {
    title: "Pilih cara memohon",
    description: "Semua cara mempunyai syarat yang sama.",
    options,
  },
};
export const TwoOptionsPaper = {
  args: {
    title: "Perlukan bantuan?",
    tone: "paper",
    options: options.slice(0, 2),
  },
};
