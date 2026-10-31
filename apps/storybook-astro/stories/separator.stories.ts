import Separator from "@/components/ui/separator.astro";

export default {
  title: "Core/Separator",
  component: Separator,
  parameters: { layout: "padded" },
};

export const Horizontal = { args: {} };
export const Vertical = {
  args: { orientation: "vertical", decorative: true, class: "h-5" },
};
export const Decorative = { args: { decorative: true } };
