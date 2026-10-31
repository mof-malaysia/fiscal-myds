/** Navbar story data shared by navbar.stories.ts and navbar-with-language-switcher.stories.ts. */
import { logo } from "./_logo";

export const brand = {
  title: "Kementerian Kewangan",
  // The title beside it names the site, so the placeholder logo is decorative
  logo: { src: logo("MOF"), alt: "" },
};

/** Plain links and one plain dropdown. */
export const standardItems = [
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
