import FeatureGrid from "@/components/blocks/feature-grid.astro";
import MoneyIcon from "@/components/ui/icons/money.astro";
import DocumentIcon from "@/components/ui/icons/document.astro";
import BellIcon from "@/components/ui/icons/bell.astro";
import CheckShieldIcon from "@/components/ui/icons/check-shield.astro";

const features = [
  {
    icon: MoneyIcon,
    title: "Bayar dalam talian",
    description:
      "FPX, kad debit dan kredit, serta e-dompet. Tiada barisan, tiada cek.",
    href: "#pay",
  },
  {
    icon: DocumentIcon,
    title: "Resit rasmi",
    description:
      "Setiap bayaran mendapat resit yang boleh dimuat turun, dicetak atau dikongsi.",
    href: "#resit",
    linkLabel: "Dapatkan resit",
  },
  {
    icon: BellIcon,
    title: "Peringatan tarikh akhir",
    description:
      "Kami mengingatkan anda melalui e-mel atau SMS sebelum bayaran perlu dijelaskan.",
  },
  {
    icon: CheckShieldIcon,
    title: "Selamat secara lalai",
    description: "Log masuk dengan MyDigital ID. Data anda kekal di Malaysia.",
  },
];
const heading = {
  title: "Semua dalam satu akaun",
  description:
    "Satu MyDigital ID untuk setiap bayaran Kementerian Kewangan, daripada saman hingga yuran pembekal.",
};

export default {
  title: "Marketing/Feature Grid",
  component: FeatureGrid,
};

export const Default = { args: { ...heading, features: features.slice(0, 3) } };
export const TwoColumnsSheet = {
  args: {
    ...heading,
    features,
    columns: 2,
    surface: "sheet",
    linkLabel: "Ketahui lanjut",
  },
};
export const English = {
  args: {
    lang: "en",
    title: "Everything in one account",
    features: [
      {
        icon: MoneyIcon,
        title: "Pay online",
        description: "FPX, cards and e-wallets.",
        href: "#pay",
      },
      {
        icon: DocumentIcon,
        title: "Official receipts",
        description: "Download, print or share every receipt.",
        href: "#receipts",
      },
      {
        icon: BellIcon,
        title: "Deadline reminders",
        description: "Email or SMS before a payment is due.",
      },
    ],
  },
};
export const WithoutIcons = {
  args: {
    ...heading,
    features: features.map(({ icon: _icon, ...f }) => f).slice(0, 3),
  },
};
