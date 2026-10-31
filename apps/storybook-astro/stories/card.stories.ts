import Card from "@/components/ui/card.astro";
import { button_cva } from "@mof-malaysia/ftds-style/variants/button";

export default {
  title: "Core/Card",
  component: Card,
  parameters: { layout: "padded" },
};

export const Default = {
  args: {
    title: "Cukai perlu dibayar",
    titleAs: "h3",
    description: "Tahun taksiran 2025",
    slots: {
      action: `<a href="#" class="${button_cva({ variant: "default-ghost" })}">Lihat penyata</a>`,
      default:
        '<p class="text-headline text-txt-black-900 font-semibold tabular-nums">RM 2,481.50</p><p class="text-txt-black-700">Bayar sebelum 30 April 2026 untuk mengelakkan penalti.</p>',
      footer: `<a href="#" class="${button_cva()}">Bayar sekarang</a>`,
    },
  },
};
export const Well = {
  args: {
    tone: "well",
    title: "Perlukan bantuan?",
    slots: {
      default:
        "Hubungi pusat panggilan LHDN di 03-8911 1000, atau baca panduan pemfailan.",
    },
  },
};
export const TitleOnly = {
  args: {
    title: "Maklumat peribadi",
    slots: { default: "<p>Nama, nombor MyKad dan alamat surat-menyurat.</p>" },
  },
};
export const NoHeader = {
  args: {
    slots: {
      default: "<p>Kad tanpa tajuk: hanya kandungan, tanpa pengepala.</p>",
    },
  },
};
