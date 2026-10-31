import InsetText from "@/components/ui/inset-text.astro";

export default {
  title: "Core/Inset Text",
  component: InsetText,
  parameters: { layout: "padded" },
};

export const Default = {
  args: {
    slots: {
      default:
        "Anda mesti menghantar borang cukai pendapatan sebelum 30 April 2026. Selepas itu, penalti sehingga RM 2,000.00 boleh dikenakan.",
    },
  },
};
export const Quote = {
  args: {
    author: "Kementerian Kewangan Malaysia",
    slots: {
      default:
        "Setiap ringgit wang awam mesti dibelanjakan dengan berhemat dan dipertanggungjawabkan.",
    },
  },
};
