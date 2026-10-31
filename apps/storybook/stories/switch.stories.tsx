import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRender, createStory } from "../utils";
import { Switch } from "@mof-malaysia/ftds-react/switch";

/**
 * ### Overview
 * Switch turns a setting on or off immediately. For a choice saved with a form, use a Checkbox.
 * Built on Base UI Switch; label it with a wrapping `<label>` or a `Field`.
 *
 * ### Usage
 * ```tsx
 * <label className="flex items-center gap-3">
 *   <Switch defaultChecked />
 *   Email me about deadlines
 * </label>
 * ```
 */
const meta: Meta<typeof Switch> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-switch",
  title: "Core/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
  },
  render: (args) => (
    <label className="text-txt-black-900 text-body-md flex items-center gap-3">
      <Switch {...args} />
      Email me about deadlines
    </label>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = createStory({ size: "medium" });
export const Checked: Story = createStory({
  size: "medium",
  defaultChecked: true,
});
export const Disabled: Story = createStory({
  disabled: true,
  defaultChecked: true,
});

const Sizes = () => (
  <div className="flex items-center gap-4">
    <Switch size="small" aria-label="Small" defaultChecked />
    <Switch size="medium" aria-label="Medium" defaultChecked />
    <Switch size="large" aria-label="Large" defaultChecked />
  </div>
);
export const AllSizes = createRender(Sizes);

const Dark = () => (
  <div className="dark bg-bg-white flex items-center gap-4 p-4">
    <Switch aria-label="Off" />
    <Switch aria-label="On" defaultChecked />
    <Switch aria-label="Disabled" disabled defaultChecked />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
