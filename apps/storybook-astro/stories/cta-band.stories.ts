import CtaBand from "@/components/blocks/cta-band.astro";

export default {
  title: "Marketing/CTA Band",
  component: CtaBand,
};

export const Default = {
  args: {
    title: "Ada soalan?",
    description: "Pasukan kami menjawab dalam satu hari bekerja.",
    primaryAction: { label: "Hubungi kami", href: "#hubungi" },
    secondaryAction: { label: "Soalan lazim", href: "#soalan" },
  },
};
export const Primary = {
  args: {
    tone: "primary",
    title: "Sedia untuk membayar?",
    description:
      "Mengambil masa kira-kira tiga minit. Sediakan nombor bil atau rujukan anda.",
    primaryAction: { label: "Mula membayar", href: "#pay" },
    secondaryAction: { label: "Hubungi kami", href: "#hubungi" },
  },
};
export const PrimaryActionOnly = {
  args: {
    title: "Daftar sebagai pembekal",
    description: "Pendaftaran dibuka sepanjang tahun.",
    primaryAction: { label: "Mula mendaftar", href: "#daftar" },
  },
};
