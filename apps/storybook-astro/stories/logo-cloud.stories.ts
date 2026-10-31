import LogoCloud from "@/components/blocks/logo-cloud.astro";
import { logo } from "./_logo";

const logos = [
  {
    src: logo("LHDN"),
    alt: "Lembaga Hasil Dalam Negeri",
    href: "https://www.hasil.gov.my",
    width: 160,
    height: 48,
  },
  {
    src: logo("JKDM"),
    alt: "Jabatan Kastam Diraja Malaysia",
    href: "https://www.customs.gov.my",
    width: 160,
    height: 48,
  },
  {
    src: logo("JANM"),
    alt: "Jabatan Akauntan Negara Malaysia",
    width: 160,
    height: 48,
  },
  {
    src: logo("JPJ"),
    alt: "Jabatan Pengangkutan Jalan",
    width: 160,
    height: 48,
  },
];

export default {
  title: "Marketing/Logo Cloud",
  component: LogoCloud,
};

export const Default = {
  args: { title: "Agensi yang menggunakan MyBayar", logos },
};
export const FullColour = {
  args: { title: "Agensi yang menggunakan MyBayar", logos, muted: false },
};
export const NoTitle = { args: { logos } };
