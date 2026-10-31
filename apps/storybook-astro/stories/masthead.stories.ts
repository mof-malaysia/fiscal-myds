import Masthead from "@/components/ui/masthead.astro";

export default {
  title: "Core/Masthead",
  component: Masthead,
};

export const Default = { args: {} };
export const English = { args: { lang: "en" } };
export const Open = { args: { open: true } };
export const OpenEnglish = { args: { open: true, lang: "en" } };
