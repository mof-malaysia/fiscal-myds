import CtaSplit from "@/components/blocks/cta-split.astro";
import { placeholder } from "./_logo";

const base = {
  title: "Satu akaun untuk semua invois anda",
  description:
    "Keluarkan, hantar dan simpan invois di satu tempat, dari telefon atau komputer.",
  points: [
    "Percuma untuk perniagaan kecil",
    "Log masuk dengan MyDigital ID",
    "Invois disahkan dalam masa nyata",
  ],
  primaryAction: { label: "Daftar sekarang", href: "#daftar" },
  secondaryAction: { label: "Tonton demo", href: "#demo" },
};
const media = `<img src="${placeholder("Ilustrasi", 800, 600)}" width="800" height="600" alt="" />`;

export default {
  title: "Marketing/CTA Split",
  component: CtaSplit,
};

export const Default = { args: { ...base, slots: { media } } };
export const MediaLeftWell = {
  args: { ...base, mediaPosition: "left", tone: "well", slots: { media } },
};
export const WithoutMedia = { args: { ...base, secondaryAction: undefined } };
