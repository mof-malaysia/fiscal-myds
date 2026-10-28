import { Preview } from "@storybook/react-vite";
import { createElement } from "react";
import "./global.css";

const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    density: {
      description: "Component density (DESIGN.md)",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "comfortable", title: "Comfortable (citizens)" },
          { value: "compact", title: "Compact (officers)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    density: "comfortable",
    backgrounds: { value: "light" },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.density =
        context.globals.density ?? "comfortable";
      return Story();
    },
    // Dark stories set the `backgrounds` global to "dark" (see utils/createStory).
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "dark";

      // A Docs page renders every story into one document, so a class on <html>
      // would turn the light stories dark too. Scope dark to this story instead.
      if (context.viewMode === "docs") {
        document.documentElement.classList.remove("dark");
        return isDark
          ? createElement(
              "div",
              {
                className: "dark bg-bg-white text-txt-black-900 rounded-md p-4",
              },
              Story(),
            )
          : Story();
      }

      // On a story page, put `.dark` on <html> so portaled content (dialogs,
      // menus, tooltips) switches theme too, not just the story root.
      document.documentElement.classList.toggle("dark", isDark);
      return Story();
    },
  ],
  parameters: {
    backgrounds: {
      options: {
        light: { name: "light", value: "#FFFFFF" },
        dark: { name: "dark", value: "#18181B" },
      },
    },
    options: {
      storySort: {
        order: ["Introduction", "Core", "App", "Marketing", "Examples"],
      },
    },
    deepControls: { enabled: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
