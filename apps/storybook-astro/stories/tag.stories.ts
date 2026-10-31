import Tag from "@/components/ui/tag.astro";

export default {
  title: "Core/Tag",
  component: Tag,
  parameters: { layout: "padded" },
};

export const Default = { args: { slots: { default: "Draf" } } };
export const Primary = {
  args: { variant: "primary", slots: { default: "Baharu" } },
};
export const Success = {
  args: { variant: "success", slots: { default: "Dibayar" } },
};
export const Warning = {
  args: { variant: "warning", slots: { default: "Tamat dalam 3 hari" } },
};
export const Danger = {
  args: { variant: "danger", slots: { default: "Tertunggak" } },
};
export const WithDot = {
  args: { variant: "success", dot: true, slots: { default: "Aktif" } },
};
export const Small = {
  args: { variant: "danger", size: "small", slots: { default: "Tertunggak" } },
};
export const Large = {
  args: {
    variant: "warning",
    size: "large",
    slots: { default: "Perlu tindakan" },
  },
};
