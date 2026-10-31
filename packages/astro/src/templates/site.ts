/**
 * Example site data shared by the page templates (and the Storybook stories):
 * the agency, its navigation and footer, and the news, agencies, contacts and
 * people several pages show. Swap these for your own; one edit changes every
 * page that uses them.
 *
 * The content is illustrative. Names, figures and dates are examples, not
 * real Ministry of Finance data.
 */
import type { ComponentProps } from "astro/types";
import type Navbar from "@/components/ui/navbar.astro";
import type SiteFooter from "@/components/ui/site-footer.astro";
import type NewsList from "@/components/blocks/news-list.astro";
import type PartnerGrid from "@/components/blocks/partner-grid.astro";
import type ContactLocations from "@/components/blocks/contact-locations.astro";
import type PeopleGrid from "@/components/blocks/people-grid.astro";
// The Jata Negara at twice its 36px display height, inlined as a data URI so
// the templates need no asset path. In your site, put your crest in public/
// and point `jataNegara` at it, e.g. "/jata-negara.png".
import jataNegara from "./jata-negara.png?inline";

/** The agency's logo: the Jata Negara. Use your own crest or wordmark. */
export { jataNegara };

type NavbarItem = NonNullable<ComponentProps<typeof Navbar>["items"]>[number];
type FooterGroup = NonNullable<
  ComponentProps<typeof SiteFooter>["groups"]
>[number];

/**
 * A neutral placeholder image as an inline SVG data URI, so the templates need
 * no assets. Replace each with your own photo or illustration.
 */
export const placeholder = (text: string, width = 1200, height = 675) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#eff6ff"/><circle cx="${width * 0.78}" cy="${height * 0.3}" r="${height * 0.12}" fill="#bfdbfe"/><path d="M0 ${height * 0.8} L${width * 0.3} ${height * 0.5} L${width * 0.55} ${height * 0.72} L${width * 0.75} ${height * 0.58} L${width} ${height * 0.82} V${height} H0 Z" fill="#dbeafe"/><text x="${width / 2}" y="${height / 2}" font-family="sans-serif" font-size="${Math.round(height / 12)}" font-weight="600" fill="#1d4ed8" text-anchor="middle">${text}</text></svg>`,
  )}`;

export const agency = {
  name: "Kementerian Kewangan Malaysia",
  shortName: "Kementerian Kewangan",
  address:
    "Kompleks Kementerian Kewangan, No. 5 Persiaran Perdana, Presint 2, 62592 Putrajaya",
};

export const brand = {
  title: agency.shortName,
  // The title beside it names the site, so the logo is decorative
  logo: { src: jataNegara, alt: "" },
  // "Kementerian Kewangan" is 20 characters, one over the default of 19: keep
  // it at full title size, like the React examples. It wraps to two lines on
  // a phone.
  maxChars: 20,
};

/** Top navigation. Pass the label of the current section to underline it. */
export const navItems = (current?: string): NavbarItem[] =>
  [
    { label: "Utama", href: "#utama" },
    {
      label: "Perkhidmatan",
      href: "#perkhidmatan",
      children: [
        {
          label: "Bayar bil kerajaan",
          href: "#bayar",
          description: "Saman, yuran dan taksiran",
        },
        {
          label: "Bantuan tunai",
          href: "#bantuan",
          description: "Semak kelayakan dan mohon",
        },
        {
          label: "Pendaftaran pembekal",
          href: "#pembekal",
          description: "Untuk syarikat dan perunding",
        },
      ],
    },
    { label: "Media", href: "#media" },
    { label: "Penerbitan", href: "#penerbitan" },
    { label: "Mengenai kami", href: "#mengenai" },
    { label: "Hubungi kami", href: "#hubungi" },
  ].map((item) => ({ ...item, current: item.label === current }));

export const footerGroups: FooterGroup[] = [
  {
    title: "Mengenai kami",
    links: [
      { label: "Profil kementerian", href: "#profil" },
      { label: "Kepimpinan", href: "#kepimpinan" },
      { label: "Piagam pelanggan", href: "#piagam" },
    ],
  },
  {
    title: "Perkhidmatan",
    links: [
      { label: "Bayar bil kerajaan", href: "#bayar" },
      { label: "Bantuan tunai", href: "#bantuan" },
      { label: "Pendaftaran pembekal", href: "#pembekal" },
    ],
  },
  {
    title: "Sumber",
    links: [
      { label: "Berita dan kenyataan media", href: "#media" },
      { label: "Penerbitan", href: "#penerbitan" },
      { label: "Data terbuka", href: "#data" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Hubungi kami", href: "#hubungi" },
      { label: "Soalan lazim", href: "#soalan" },
      { label: "Maklum balas", href: "#maklum-balas" },
    ],
  },
];

export const legalLinks = [
  { label: "Dasar privasi", href: "#privasi" },
  { label: "Penafian", href: "#penafian" },
  { label: "Kebolehcapaian", href: "#kebolehcapaian" },
];

/** The first breadcrumb of every inner page. */
export const home = { label: "Utama", href: "#utama" };

/** Latest news, newest first. */
export const news: ComponentProps<typeof NewsList>["items"] = [
  {
    title: "Belanjawan 2027 dibentangkan di Dewan Rakyat",
    date: "2026-10-10",
    category: "Kenyataan media",
    summary:
      "Belanjawan memberi tumpuan kepada kos sara hidup, pendidikan dan pendigitalan perkhidmatan awam.",
  },
  {
    title: "Fasa kedua Sumbangan Tunai Rahmah mula dibayar",
    date: "2026-10-03",
    category: "Pengumuman",
    categoryVariant: "primary" as const,
    summary:
      "Bayaran dikreditkan terus ke akaun bank penerima mulai 3 Oktober.",
  },
  {
    title: "Sesi libat urus bersama perniagaan kecil di Kota Kinabalu",
    date: "2026-09-25",
    category: "Acara",
    summary:
      "Pegawai kementerian mendengar cadangan usahawan Sabah untuk Belanjawan 2027.",
  },
  {
    title: "Penyelenggaraan sistem pembayaran pada 2 November",
    date: "2026-09-20",
    category: "Notis",
    categoryVariant: "warning" as const,
    summary:
      "Pembayaran dalam talian tidak tersedia dari 1 pagi hingga 4 pagi.",
  },
  {
    title: "Laporan Ekonomi 2026/2027 kini boleh dimuat turun",
    date: "2026-09-12",
    category: "Penerbitan",
    summary:
      "Laporan merangkumi prestasi ekonomi dan unjuran bagi tahun hadapan.",
  },
].map((item, i) => ({
  ...item,
  href: `#berita-${i + 1}`,
  image: placeholder(`Berita ${i + 1}`),
}));

/** Agencies under the ministry. */
export const agencies: ComponentProps<typeof PartnerGrid>["partners"] = [
  {
    kind: "LHDN",
    name: "Lembaga Hasil Dalam Negeri",
    description: "Cukai pendapatan dan duti setem.",
    href: "https://www.hasil.gov.my",
  },
  {
    kind: "JKDM",
    name: "Jabatan Kastam Diraja Malaysia",
    description: "Cukai jualan, perkhidmatan dan duti kastam.",
    href: "https://www.customs.gov.my",
  },
  {
    kind: "JANM",
    name: "Jabatan Akauntan Negara Malaysia",
    description: "Perakaunan, pembayaran dan gaji kerajaan.",
    href: "https://www.anm.gov.my",
  },
  {
    kind: "JPPH",
    name: "Jabatan Penilaian dan Perkhidmatan Harta",
    description: "Penilaian harta untuk kerajaan.",
    href: "https://www.jpph.gov.my",
  },
].map((agency) => ({
  ...agency,
  logo: placeholder(agency.kind, 320, 96),
  external: true,
}));

type Channel = NonNullable<
  ComponentProps<typeof ContactLocations>["channels"]
>[number];

/** The helpline: phone, email, live chat and office hours. */
export const helpline: Channel[] = [
  {
    kind: "phone",
    value: "03-8000 8000",
    detail: "Isnin hingga Jumaat, 8 pagi hingga 5 petang",
  },
  {
    kind: "email",
    value: "pertanyaan@mof.gov.my",
    detail: "Kami membalas dalam 3 hari bekerja",
  },
  {
    kind: "chat",
    value: "Mula sembang",
    href: "#sembang",
    detail: "Setiap hari, 8 pagi hingga 10 malam",
  },
  {
    kind: "hours",
    value: "8 pagi – 5 petang",
    detail: "Isnin hingga Jumaat, kecuali cuti umum",
  },
];

const weekdays = "Isnin hingga Jumaat, 8 pagi hingga 5 petang";

/** Offices people can visit. */
export const offices: NonNullable<
  ComponentProps<typeof ContactLocations>["offices"]
> = [
  {
    name: "Ibu pejabat, Putrajaya",
    address: [
      "Kompleks Kementerian Kewangan",
      "No. 5 Persiaran Perdana, Presint 2",
      "62592 Putrajaya",
    ],
    phone: "03-8000 8000",
    email: "pertanyaan@mof.gov.my",
    hours: weekdays,
    mapHref: "https://maps.google.com/?q=Kementerian+Kewangan+Putrajaya",
  },
  {
    name: "Pejabat wilayah Sabah",
    address: [
      "Aras 5, Wisma Persekutuan",
      "Jalan Mat Salleh",
      "88300 Kota Kinabalu, Sabah",
    ],
    phone: "088-123 456",
    hours: weekdays,
    mapHref: "https://maps.google.com/?q=Wisma+Persekutuan+Kota+Kinabalu",
  },
  {
    name: "Pejabat wilayah Sarawak",
    address: [
      "Aras 3, Bangunan Sultan Iskandar",
      "Jalan Simpang Tiga",
      "93300 Kuching, Sarawak",
    ],
    phone: "082-123 456",
    hours: weekdays,
    mapHref: "https://maps.google.com/?q=Bangunan+Sultan+Iskandar+Kuching",
  },
];

/** Leadership: the minister and deputy (featured), then senior officers. Names are placeholders. */
export const leadership: ComponentProps<typeof PeopleGrid>["people"] = [
  {
    name: "Nama Menteri",
    role: "Menteri Kewangan",
    photo: placeholder("Gambar", 400, 500),
    bio: "Bertanggungjawab ke atas dasar kewangan negara dan pembentangan belanjawan di Parlimen.",
    href: "#menteri",
  },
  {
    name: "Nama Timbalan Menteri",
    role: "Timbalan Menteri Kewangan",
    photo: placeholder("Gambar", 400, 500),
    bio: "Membantu Menteri dalam hal ehwal cukai, perolehan dan agensi di bawah kementerian.",
    href: "#timbalan-menteri",
  },
  { name: "Aminah Rahman", role: "Ketua Setiausaha Perbendaharaan" },
  { name: "Lim Wei Ming", role: "Timbalan Ketua Setiausaha (Dasar)" },
  {
    name: "Kavitha Subramaniam",
    role: "Timbalan Ketua Setiausaha (Pengurusan)",
  },
  {
    name: "Mohd Hafiz Ismail",
    role: "Timbalan Ketua Setiausaha (Sistem dan Kawalan)",
  },
];
