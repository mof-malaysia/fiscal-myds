import AnnounceBar from "@/components/ui/announce-bar.astro";
import { link_cva } from "@mof-malaysia/ftds-style/variants/link";

export default {
  title: "Marketing/Announce Bar",
  component: AnnounceBar,
};

export const Maintenance = {
  args: {
    tag: "Penyelenggaraan",
    tagVariant: "warning",
    slots: {
      default: `<p>Pembayaran dalam talian tidak tersedia pada 2 November, 1 pagi hingga 4 pagi. <a href="#notis" class="${link_cva({ primary: true })}">Baca notis</a></p>`,
    },
  },
};
export const NewService = {
  args: {
    tag: "Baharu",
    tagVariant: "primary",
    slots: {
      default: "<p>Kini anda boleh membayar saman JPJ melalui MyBayar.</p>",
    },
  },
};
export const NoBorder = {
  args: {
    tag: "Makluman",
    border: false,
    slots: {
      default: "<p>Pejabat ditutup pada 31 Ogos sempena Hari Kebangsaan.</p>",
    },
  },
};
