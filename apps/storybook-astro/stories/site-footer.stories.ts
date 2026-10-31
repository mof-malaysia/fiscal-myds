import SiteFooter from "@/components/ui/site-footer.astro";
import { logo } from "./_logo";

const groups = [
  {
    title: "Tentang kami",
    links: [
      { label: "Profil kementerian", href: "#profil" },
      { label: "Carta organisasi", href: "#carta" },
      { label: "Piagam pelanggan", href: "#piagam" },
    ],
  },
  {
    title: "Perkhidmatan",
    links: [
      { label: "Bayar bil", href: "#pay" },
      { label: "Pendaftaran pembekal", href: "#pembekal" },
      { label: "Insentif cukai", href: "#insentif" },
    ],
  },
  {
    title: "Sumber",
    links: [
      { label: "Belanjawan 2027", href: "#belanjawan" },
      { label: "Pekeliling perbendaharaan", href: "#pekeliling" },
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
const address =
  "<p>Kompleks Kementerian Kewangan, No. 5 Persiaran Perdana, Presint 2, 62592 Putrajaya</p>";

export default {
  title: "Marketing/Site Footer",
  component: SiteFooter,
};

export const Default = {
  args: {
    logoTitle: "Kementerian Kewangan Malaysia",
    groups,
    slots: {
      logo: `<img src="${logo("MOF")}" width="36" height="36" alt="" class="size-9 rounded-sm" />`,
      default: address,
    },
  },
};
export const TwoGroups = {
  args: {
    logoTitle: "Kementerian Kewangan Malaysia",
    groups: groups.slice(0, 2),
    slots: { default: address },
  },
};
export const LimitedLinks = {
  args: {
    logoTitle: "Kementerian Kewangan Malaysia",
    groups: groups.map((g) => ({ ...g, linkCount: 2 })),
    slots: { default: address },
  },
};
