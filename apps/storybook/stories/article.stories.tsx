import Article from "./components/article";

export default {
  title: "Examples/Article",
  component: Article,
  // remove the automatic documentation for Layout
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export const Mobile = {
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
};

export const Tablet = {
  globals: {
    viewport: { value: "tablet", isRotated: false },
  },
};

export const Desktop = {
  globals: {
    viewport: { value: "desktop", isRotated: false },
  },
};
