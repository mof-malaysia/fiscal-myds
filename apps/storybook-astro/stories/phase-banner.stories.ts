import PhaseBanner from "@/components/ui/phase-banner.astro";
import { link_cva } from "@mof-malaysia/ftds-style/variants/link";

export default {
  title: "Core/Phase Banner",
  component: PhaseBanner,
};

export const Default = { args: {} };
export const WithLink = {
  args: {
    phase: "Beta",
    slots: {
      default: `Ini perkhidmatan baharu. <a href="#" class="${link_cva({ primary: true })} font-medium">Maklum balas</a> anda membantu kami menambah baiknya.`,
    },
  },
};
export const Alpha = { args: { phase: "Alpha" } };
export const Maintenance = {
  args: { phase: "Penyelenggaraan", tagVariant: "warning" },
};
export const English = {
  args: { lang: "en", phase: "Maintenance", tagVariant: "warning" },
};
