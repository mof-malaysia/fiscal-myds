export const createStory = (args: any, theme: "light" | "dark" = "light") => {
  return {
    globals: {
      backgrounds: { value: theme },
    },
    args: args,
  };
};

export const createRender = (
  render: any,
  theme: "light" | "dark" = "light",
) => {
  return {
    globals: {
      backgrounds: { value: theme },
    },
    render,
  };
};
