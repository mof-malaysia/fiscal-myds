import Button from "@/components/ui/button.astro";

const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default {
  title: "Core/Button",
  component: Button,
  parameters: { layout: "padded" },
};

export const Primary = {
  args: {
    variant: "primary-fill",
    size: "medium",
    slots: { default: "Mula membayar" },
  },
};
export const PrimaryOutline = {
  args: {
    variant: "primary-outline",
    size: "medium",
    slots: { default: "Simpan draf" },
  },
};
export const PrimaryGhost = {
  args: {
    variant: "primary-ghost",
    size: "medium",
    slots: { default: "Lihat butiran" },
  },
};
export const DefaultOutline = {
  args: {
    variant: "default-outline",
    size: "medium",
    slots: { default: "Kembali" },
  },
};
export const DefaultGhost = {
  args: {
    variant: "default-ghost",
    size: "medium",
    slots: { default: "Batal" },
  },
};
export const DangerFill = {
  args: {
    variant: "danger-fill",
    size: "medium",
    slots: { default: "Padam permohonan" },
  },
};
export const DangerOutline = {
  args: {
    variant: "danger-outline",
    size: "medium",
    slots: { default: "Tarik balik" },
  },
};
export const DangerGhost = {
  args: {
    variant: "danger-ghost",
    size: "medium",
    slots: { default: "Buang lampiran" },
  },
};

export const Small = {
  args: { size: "small", slots: { default: "Bayar sekarang" } },
};
export const Medium = {
  args: { size: "medium", slots: { default: "Bayar sekarang" } },
};
export const Large = {
  args: { size: "large", slots: { default: "Bayar sekarang" } },
};

export const WithIcon = {
  args: {
    variant: "primary-ghost",
    size: "medium",
    slots: { default: `Seterusnya ${arrow}` },
  },
};
export const IconOnly = {
  args: {
    variant: "default-outline",
    size: "medium",
    iconOnly: true,
    "aria-label": "Seterusnya",
    slots: { default: arrow },
  },
};
export const Disabled = {
  args: {
    size: "medium",
    disabled: true,
    slots: { default: "Hantar permohonan" },
  },
};
export const Link = {
  args: {
    variant: "default-outline",
    size: "large",
    href: "#",
    slots: { default: "Cara ia berfungsi" },
  },
};
