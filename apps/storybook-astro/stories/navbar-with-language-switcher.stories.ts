import NavbarWithLanguageSwitcher from "./navbar-with-language-switcher.astro";
import { brand, standardItems } from "./_navbar";

// Same title as navbar.stories.ts: Storybook lists this story under Marketing/Navbar
export default {
  title: "Marketing/Navbar",
  component: NavbarWithLanguageSwitcher,
  parameters: { layout: "fullscreen" },
};

export const WithLanguageSwitcher = {
  args: {
    brand,
    items: standardItems,
    locales: [
      { code: "ms", href: "#ms" },
      { code: "en", href: "#en" },
    ],
  },
};
