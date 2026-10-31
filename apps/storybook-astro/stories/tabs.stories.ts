import Tabs from "@/components/ui/tabs.astro";

const items = [
  { value: "details", label: "Butiran" },
  { value: "documents", label: "Dokumen", count: 3 },
  { value: "history", label: "Sejarah" },
];
const slots = {
  details: "<p>Permohonan cukai pendapatan bagi tahun taksiran 2025.</p>",
  documents: "<p>Tiga dokumen dimuat naik.</p>",
  history: "<p>Diterima pada 2 November 2026.</p>",
};

export default {
  title: "Core/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
};

export const Default = { args: { items, slots } };
export const Medium = { args: { items, slots, size: "medium", width: "full" } };
export const ManualActivation = {
  args: { items, slots, activationMode: "manual", defaultValue: "documents" },
};
