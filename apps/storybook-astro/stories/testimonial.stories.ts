import Testimonial from "@/components/blocks/testimonial.astro";

const items = [
  {
    quote:
      "Saya bayar taksiran syarikat dalam lima minit dan dapat resit sebelum menutup tab.",
    name: "Nurul Aina Rahman",
    role: "Pemilik perniagaan, Shah Alam",
  },
  {
    quote:
      "Peringatan itulah yang terbaik. Saya tidak pernah terlepas tarikh akhir sejak mendaftar.",
    name: "Tan Wei Ming",
    role: "Pesara, Ipoh",
  },
  {
    quote:
      "Saya boleh semak status tuntutan tanpa menelefon sesiapa. Semuanya jelas.",
    name: "Muthu Krishnan",
    role: "Penjawat awam, Putrajaya",
  },
];

export default {
  title: "Marketing/Testimonial",
  component: Testimonial,
};

export const Grid = { args: { title: "Kata pengguna", items } };
export const Single = {
  args: {
    items: [
      {
        quote: "Urusan bayaran cukai jalan kini selesai sambil menunggu kopi.",
        name: "Siti Hajar Ismail",
        role: "Guru, Kota Bharu",
      },
    ],
  },
};
export const TwoQuotes = {
  args: { title: "Kata pengguna", items: items.slice(0, 2) },
};
