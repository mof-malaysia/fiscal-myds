import Skiplink from "@/components/ui/skiplink.astro";

/** Hidden until focused: press Tab inside the canvas to see it. */
export default {
  title: "Core/Skiplink",
  component: Skiplink,
  parameters: { layout: "padded" },
};

export const Default = { args: {} };
export const English = { args: { lang: "en" } };
export const CustomText = {
  args: { href: "#kandungan", slots: { default: "Langkau ke borang" } },
};
