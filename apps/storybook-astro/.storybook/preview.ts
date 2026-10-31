import "./global.css";

const preview = {
  parameters: {
    layout: "fullscreen",
    options: {
      storySort: {
        order: ["Introduction", "Core", "Marketing", ["*", "Templates"]],
      },
    },
    a11y: { test: "error" },
  },
};
export default preview;
