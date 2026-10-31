import LandingPage from "./components/landingPage";

export default {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "examples-landingpage",
  title: "Examples/LandingPage",
  component: LandingPage,
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
