import Carousel from "@/components/ui/carousel.astro";

const updates = [
  [
    "Belanjawan 2027: apa yang berubah untuk isi rumah",
    "Ringkasan pelepasan cukai dan bantuan tunai baharu.",
  ],
  [
    "e-Invois untuk perniagaan kecil",
    "Siapa perlu mengeluarkan e-invois mulai Julai 2027, dan cara bermula.",
  ],
  [
    "Penyelenggaraan berjadual pada 2 November",
    "Pembayaran tidak tersedia dari 1 pagi hingga 4 pagi.",
  ],
  ["Sumbangan Tunai Rahmah fasa 2", "Permohonan dibuka sehingga 30 April."],
  [
    "Laporan Tinjauan Ekonomi 2027",
    "Unjuran pertumbuhan dan dasar fiskal tahun hadapan.",
  ],
];

const slides = updates
  .map(
    ([title, text], i) => `
<div class="bg-bg-washed p-surface flex h-full flex-col gap-3 rounded-lg">
  <h3 class="text-title text-txt-black-900 font-semibold"><a href="#update-${i + 1}" class="hover:underline">${title}</a></h3>
  <p class="text-content text-txt-black-700">${text}</p>
</div>`,
  )
  .join("");

export default {
  title: "Marketing/Carousel",
  component: Carousel,
  parameters: { layout: "padded" },
};

export const Default = {
  args: { "aria-label": "Kemas kini terkini", slots: { default: slides } },
};
export const ThreeInView = {
  args: {
    "aria-label": "Kemas kini terkini",
    perView: "third",
    slots: { default: slides },
  },
};
export const Autoplay = {
  args: {
    "aria-label": "Pengumuman",
    autoplay: 4000,
    slots: { default: slides },
  },
};
export const English = {
  args: {
    "aria-label": "Latest updates",
    lang: "en",
    perView: "half",
    indicators: false,
    slots: { default: slides },
  },
};
