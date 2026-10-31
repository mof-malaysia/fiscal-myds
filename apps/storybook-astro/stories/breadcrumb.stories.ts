import Breadcrumb from "@/components/ui/breadcrumb.astro";

const items = [
  { label: "Utama", href: "/" },
  { label: "Perkhidmatan", href: "#" },
  { label: "Permohonan cukai pendapatan individu tahun taksiran 2025" },
];

export default {
  title: "Core/Breadcrumb",
  component: Breadcrumb,
  parameters: { layout: "padded" },
};

export const Default = { args: { items } };
export const TwoLevels = {
  args: { items: [{ label: "Utama", href: "/" }, { label: "Hubungi kami" }] },
};
export const English = {
  args: {
    lang: "en",
    items: [
      { label: "Home", href: "/" },
      { label: "Services", href: "#" },
      { label: "Applications" },
    ],
  },
};
