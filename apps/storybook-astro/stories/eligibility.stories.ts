import Eligibility from "@/components/blocks/eligibility.astro";

const criteria = [
  "warganegara Malaysia yang tinggal di Malaysia",
  "berumur 18 tahun ke atas",
  "mempunyai pendapatan isi rumah RM 5,000 sebulan atau kurang",
];

export default {
  title: "Marketing/Eligibility",
  component: Eligibility,
};

export const Default = {
  args: {
    criteria,
    exclusions: [
      "ialah penjawat awam yang berpendapatan lebih RM 3,000 sebulan",
      "telah dibankrapkan",
    ],
    note: "Tidak pasti? Hubungi talian bantuan di 03-8000 8000 sebelum memohon.",
  },
};
export const CriteriaOnly = { args: { criteria, tone: "well" } };
export const English = {
  args: {
    lang: "en",
    criteria: [
      "are a Malaysian citizen",
      "are 18 or older",
      "earn RM 5,000 a month or less",
    ],
    exclusions: ["already receive another cash aid"],
    slots: {
      note: 'Not sure? <a href="#contact">Contact us</a> before you apply.',
    },
  },
};
