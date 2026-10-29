export const createStory = (args: any, theme: "light" | "dark" = "light") => {
  return {
    parameters: {
      backgrounds: { default: theme },
    },
    args: args,
  };
};

export const createRender = (
  render: any,
  theme: "light" | "dark" = "light",
) => {
  return {
    parameters: {
      backgrounds: { default: theme },
    },
    render,
  };
};
