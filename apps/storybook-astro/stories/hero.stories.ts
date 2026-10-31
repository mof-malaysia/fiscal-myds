import Hero from "@/components/blocks/hero.astro";
import { logo } from "./_logo";

const base = {
  title: "Bayar bil kerajaan di satu tempat",
  description:
    "Jelaskan yuran, saman dan taksiran daripada lebih 30 agensi dengan satu MyDigital ID.",
  primaryAction: { label: "Mula membayar", href: "#pay" },
};

export default {
  title: "Marketing/Hero",
  component: Hero,
};

export const Default = {
  args: {
    ...base,
    eyebrow: "Baharu",
    secondaryAction: { label: "Cara ia berfungsi", href: "#how" },
    footnote: "Mengambil masa kira-kira tiga minit.",
  },
};
export const PrimaryActionOnly = { args: base };
export const WithMedia = {
  args: {
    ...base,
    eyebrow: "Baharu",
    secondaryAction: { label: "Cara ia berfungsi", href: "#how" },
    slots: {
      media: `<img src="${logo("MyBayar")}" width="480" height="144" alt="" class="w-full rounded-lg" />`,
    },
  },
};
