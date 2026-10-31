import LanguageSwitcher from "@/components/ui/language-switcher.astro";

const locales = [
  { code: "ms", href: "#ms" },
  { code: "en", href: "#en" },
];

export default {
  title: "Core/Language Switcher",
  component: LanguageSwitcher,
  parameters: { layout: "padded" },
};

export const Default = { args: { locales } };
export const English = { args: { locales, lang: "en" } };
export const CustomLabels = {
  args: {
    locales: [
      { code: "ms", label: "Bahasa Melayu", href: "#ms" },
      { code: "en", label: "English", href: "#en" },
    ],
    hideIcon: true,
  },
};
