import { Preview } from "@storybook/react";
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
  },
  decorators: [
    (Story, context) => {
      document.documentElement.dataset.density =
        context.globals.density ?? "comfortable";
      return Story();
    },
    // Dark stories set `backgrounds.default` to "dark" (see utils/createStory).
    // Put `.dark` on <html> so portaled content (dialogs, menus, tooltips)
    // switches theme too, not just the story root.
    (Story, context) => {
      const isDark = context.parameters.backgrounds?.default === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      return Story();
    },
  ],
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "dark", value: "#18181B" },
      ],
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
