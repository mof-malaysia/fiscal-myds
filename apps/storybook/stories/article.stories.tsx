import Article from "./components/article";

export default {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "examples-article",
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
