import Faq from "@/components/blocks/faq.astro";

const items = [
  {
    question: "Siapa yang layak memohon?",
    answer: "Semua warganegara Malaysia berumur 18 tahun ke atas.",
  },
  { value: "documents", question: "Apakah dokumen yang diperlukan?" },
  {
    question: "Berapa lama permohonan diproses?",
    answer: "Kebanyakan permohonan diproses dalam 14 hari bekerja.",
  },
];
const slots = {
  documents:
    "<ul class='list-disc pl-5'><li>Salinan MyKad</li><li>Slip gaji terkini</li></ul>",
  contact:
    "Masih perlukan bantuan? <a class='text-txt-primary underline' href='#'>Hubungi kami</a>",
};

export default {
  title: "Marketing/FAQ",
  component: Faq,
  parameters: { layout: "fullscreen" },
};

export const Default = {
  args: {
    items,
    slots,
    description:
      "Jawapan kepada soalan yang paling kerap ditanya tentang permohonan.",
  },
};
export const Multiple = {
  args: { items, slots, multiple: true, defaultOpen: "documents" },
};
export const English = {
  args: {
    lang: "en",
    items: [
      {
        question: "Who can apply?",
        answer: "Any Malaysian citizen aged 18 and above.",
      },
      {
        question: "How long does it take?",
        answer: "Most applications are processed within 14 working days.",
      },
    ],
  },
};
