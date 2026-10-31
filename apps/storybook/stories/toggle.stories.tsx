import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Toggle } from "@mof-malaysia/ftds-react/toggle";
import { ToggleGroup } from "@mof-malaysia/ftds-react/toggle-group";
import { BoldIcon } from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * `Toggle` is a button that stays pressed (a filter, Bold in a toolbar).
 * `ToggleGroup` turns Toggles into a segmented control.
 * Built on Base UI Toggle and ToggleGroup.
 *
 * ### Usage
 * ```tsx
 * <ToggleGroup defaultValue={["week"]} aria-label="Period">
 *   <Toggle value="day">Day</Toggle>
 *   <Toggle value="week">Week</Toggle>
 * </ToggleGroup>
 * ```
 */
const meta: Meta<typeof Toggle> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-toggle",
  title: "Core/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
};

export default meta;

const Standalone = () => (
  <div className="flex items-center gap-2">
    <Toggle>Show archived</Toggle>
    <Toggle defaultPressed>Overdue only</Toggle>
    <Toggle iconOnly aria-label="Bold">
      <BoldIcon />
    </Toggle>
  </div>
);
export const Default = createRender(Standalone);

const Group = () => (
  <ToggleGroup defaultValue={["week"]} aria-label="Period">
    <Toggle value="day">Day</Toggle>
    <Toggle value="week">Week</Toggle>
    <Toggle value="month">Month</Toggle>
  </ToggleGroup>
);
export const Segmented = createRender(Group);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col items-start gap-4 p-4">
    <Standalone />
    <Group />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
