import Callout from "@/components/ui/callout.astro";
import { button_cva } from "@mof-malaysia/ftds-style/variants/button";

export default {
  title: "Core/Callout",
  component: Callout,
  parameters: { layout: "padded" },
};

export const Info = {
  args: {
    title: "Penyelenggaraan berjadual",
    slots: {
      default:
        "MyTax tidak tersedia pada Sabtu 14 Jun, 10 malam hingga 2 pagi.",
    },
  },
};
export const Success = {
  args: { variant: "success", title: "Bayaran diterima" },
};
export const Warning = {
  args: {
    variant: "warning",
    title: "Butiran anda tidak sepadan dengan rekod kami",
    slots: {
      default: "Nama yang anda masukkan berbeza daripada nama pada MyKad anda.",
      actions: `<a href="#" class="${button_cva({ variant: "default-outline" })}">Semak butiran saya</a>`,
    },
  },
};
export const Danger = {
  args: {
    variant: "danger",
    title: "Bayaran ditolak",
    slots: { default: "Bank anda menolak bayaran ini. Tiada wang diambil." },
  },
};
export const WithDismiss = {
  args: {
    variant: "info",
    title: "Sistem akan diselenggara pada 2 November",
    dismissible: true,
    slots: {
      default:
        "Perkhidmatan tidak dapat digunakan dari 12 tengah malam hingga 2 pagi.",
    },
  },
};
