import Callout from "@/components/ui/callout.astro";

export default {
  title: "Core/Callout",
  component: Callout,
  parameters: { layout: "padded" },
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
