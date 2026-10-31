import Accordion from "@/components/blocks/accordion.astro";

const items = [
  {
    value: "eligibility",
    title: "Siapa yang layak memohon?",
    content: "Semua warganegara Malaysia berumur 18 tahun ke atas.",
  },
  { value: "documents", title: "Apakah dokumen yang diperlukan?" },
  {
    value: "duration",
    title: "Berapa lama permohonan diproses?",
    content: "Kebanyakan permohonan diproses dalam 14 hari bekerja.",
  },
];
const slots = {
  documents:
    "<ul class='list-disc pl-5'><li>Salinan MyKad</li><li>Slip gaji terkini</li></ul>",
};

export default {
  title: "Marketing/Accordion",
  component: Accordion,
  parameters: { layout: "padded" },
};

export const Default = { args: { items, slots } };
export const DefaultOpen = {
  args: { items, slots, defaultValue: "eligibility" },
};
export const Multiple = {
  args: {
    items,
    slots,
    type: "multiple",
    defaultValue: ["eligibility", "duration"],
  },
};
