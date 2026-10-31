import CookieBanner from "@/components/ui/cookie-banner.astro";

export default {
  title: "Core/Cookie Banner",
  component: CookieBanner,
  parameters: { layout: "fullscreen" },
};

// The banner shows only while no choice is saved under its storageKey:
// clear localStorage (or change the key) to see it again.
export const Default = { args: {} };
export const English = {
  args: { lang: "en", storageKey: "ftds-cookie-consent-en" },
};
export const WithPolicyLink = {
  args: {
    storageKey: "ftds-cookie-consent-policy",
    slots: {
      default:
        "Kami menggunakan kuki yang perlu untuk laman web ini berfungsi. <a class='text-txt-primary underline' href='#'>Baca dasar kuki</a>.",
    },
  },
};
