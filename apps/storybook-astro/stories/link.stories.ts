import Link from "@/components/ui/link.astro";

export default {
  title: "Core/Link",
  component: Link,
  parameters: { layout: "padded" },
};

export const Default = {
  args: { href: "#", slots: { default: "Baca panduan pemfailan" } },
};
export const Primary = {
  args: {
    href: "#",
    primary: true,
    slots: { default: "Semak status permohonan" },
  },
};
export const UnderlineOnHover = {
  args: { href: "#", underline: "hover", slots: { default: "Soalan lazim" } },
};
export const NoUnderline = {
  args: {
    href: "#",
    underline: "none",
    primary: true,
    slots: { default: "Hubungi kami" },
  },
};
export const NewTab = {
  args: {
    href: "https://www.mof.gov.my",
    newTab: true,
    primary: true,
    slots: { default: "Kementerian Kewangan" },
  },
};
