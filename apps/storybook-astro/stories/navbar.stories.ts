import Navbar from "@/components/ui/navbar.astro";

const MOF_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png";

const brand = {
  title: "Kementerian Kewangan",
  logo: { src: MOF_LOGO, alt: "Jata Negara" },
};

/** Plain links and one plain dropdown. */
const standardItems = [
  { label: "Utama", href: "#utama", current: true },
  { label: "Mengenai kami", href: "#mengenai" },
  {
    label: "Agensi",
    href: "#agensi",
    children: [
      { label: "Lembaga Hasil Dalam Negeri", href: "#lhdn" },
      { label: "Jabatan Kastam Diraja Malaysia", href: "#jkdm" },
      { label: "Jabatan Akauntan Negara Malaysia", href: "#anm" },
    ],
  },
  { label: "Hubungi kami", href: "#hubungi" },
];

/** Described items, grouped columns with a footer, and a feature. */
const expressiveItems = [
  {
    label: "Perkhidmatan",
    current: true,
    children: [
      {
        label: "Bayar bil",
        href: "#bayar",
        description: "Saman, yuran dan taksiran",
        current: true,
      },
      {
        label: "Dapatkan resit",
        href: "#resit",
        description: "Muat turun atau cetak semula resit rasmi",
      },
      {
        label: "Jejak permohonan",
        href: "#jejak",
        description: "Lihat status permohonan anda",
      },
    ],
  },
  {
    label: "Untuk anda",
    footer: { label: "Semua perkhidmatan", href: "#semua" },
    groups: [
      {
        title: "Untuk rakyat",
        links: [
          { label: "Pelepasan cukai", href: "#pelepasan" },
          { label: "Bayaran balik", href: "#bayaran-balik" },
          { label: "Bantuan tunai", href: "#bantuan" },
        ],
      },
      {
        title: "Untuk perniagaan",
        links: [
          { label: "Pendaftaran pembekal", href: "#pembekal" },
          { label: "Tender", href: "#tender" },
          { label: "e-Invois", href: "#einvois" },
        ],
      },
    ],
  },
  {
    label: "Penerbitan",
    href: "#penerbitan",
    feature: {
      href: "#belanjawan-2027",
      eyebrow: "Baharu",
      title: "Belanjawan 2027 telah dibentangkan",
      description: "Apa maknanya bagi isi rumah dan perniagaan kecil.",
      linkLabel: "Baca ringkasan",
    },
    children: [
      { label: "Dokumen belanjawan", href: "#dokumen" },
      { label: "Tinjauan ekonomi", href: "#tinjauan" },
      { label: "Pekeliling perbendaharaan", href: "#pekeliling" },
    ],
  },
  { label: "Berita", href: "#berita" },
];

// Static markup of the LanguageSwitcher: story slots carry HTML strings, not components
const languageSwitcher = `
<nav aria-label="Bahasa" class="font-body flex items-center gap-1">
  <ul class="flex items-center gap-0.5">
    <li class="list-none"><a href="#ms" hreflang="ms" lang="ms" title="Bahasa Melayu" aria-current="true" class="control-sm text-label-sm focus-ring inline-flex items-center rounded-md px-2 font-medium bg-bg-washed-active text-txt-black-900">BM</a></li>
    <li class="list-none"><a href="#en" hreflang="en" lang="en" title="English" class="control-sm text-label-sm focus-ring inline-flex items-center rounded-md px-2 font-medium text-txt-black-700 hover:bg-bg-washed-active hover:text-txt-black-900">EN</a></li>
  </ul>
</nav>`;

export default {
  title: "Marketing/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};

export const Standard = { args: { brand, items: standardItems } };
export const Expressive = { args: { brand, items: expressiveItems } };
export const WithLanguageSwitcher = {
  args: { brand, items: standardItems, slots: { actions: languageSwitcher } },
};
export const English = {
  args: {
    lang: "en",
    brand: { ...brand, title: "Ministry of Finance" },
    items: [
      { label: "Home", href: "#home", current: true },
      {
        label: "Services",
        href: "#services",
        children: [
          {
            label: "Pay a bill",
            href: "#pay",
            description: "Summonses, fees and assessments",
          },
          {
            label: "Get a receipt",
            href: "#receipts",
            description: "Download or reprint an official receipt",
          },
        ],
      },
      { label: "Contact us", href: "#contact" },
    ],
  },
};
