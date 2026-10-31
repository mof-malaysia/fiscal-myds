import ThemeSwitch from "@/components/ui/theme-switch.astro";

export default {
  title: "Core/Theme Switch",
  component: ThemeSwitch,
  parameters: { layout: "centered" },
};

export const Default = { args: {} };
export const English = { args: { lang: "en" } };
