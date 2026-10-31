import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@mof-malaysia/ftds-react/toolbar";
import { Toggle } from "@mof-malaysia/ftds-react/toggle";
import { ToggleGroup } from "@mof-malaysia/ftds-react/toggle-group";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  DownloadIcon,
  ItalicIcon,
  PrinterIcon,
  UnderlineIcon,
} from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * Toolbar groups controls that act on one thing. Arrow keys move between controls;
 * Tab leaves in one step (Base UI Toolbar). Buttons are ghost; render a `Toggle`
 * through `ToolbarButton` for a pressed state, and wrap toggles in a `ToggleGroup`
 * for a segmented choice.
 *
 * ### Usage
 * ```tsx
 * <Toolbar aria-label="Formatting">
 *   <ToolbarButton render={<Toggle iconOnly aria-label="Bold" />}><BoldIcon /></ToolbarButton>
 *   <ToolbarSeparator />
 *   <ToolbarButton>Export</ToolbarButton>
 * </Toolbar>
 * ```
 */
const meta: Meta<typeof Toolbar> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-toolbar",
  title: "App/Toolbar",
  component: Toolbar,
  parameters: { layout: "centered" },
};

export default meta;

const Formatting = ({ variant }: { variant?: "plain" | "well" }) => (
  <Toolbar aria-label="Formatting" variant={variant}>
    <ToolbarGroup aria-label="Text style">
      <ToolbarButton render={<Toggle iconOnly aria-label="Bold" />}>
        <BoldIcon />
      </ToolbarButton>
      <ToolbarButton render={<Toggle iconOnly aria-label="Italic" />}>
        <ItalicIcon />
      </ToolbarButton>
      <ToolbarButton render={<Toggle iconOnly aria-label="Underline" />}>
        <UnderlineIcon />
      </ToolbarButton>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
      <ToolbarButton
        render={<Toggle value="left" iconOnly aria-label="Align left" />}
      >
        <AlignLeftIcon />
      </ToolbarButton>
      <ToolbarButton
        render={<Toggle value="center" iconOnly aria-label="Align centre" />}
      >
        <AlignCenterIcon />
      </ToolbarButton>
      <ToolbarButton
        render={<Toggle value="right" iconOnly aria-label="Align right" />}
      >
        <AlignRightIcon />
      </ToolbarButton>
    </ToggleGroup>
    <ToolbarSeparator />
    <ToolbarButton>
      <PrinterIcon aria-hidden className="size-4" />
      Print
    </ToolbarButton>
    <ToolbarLink href="#help">Help</ToolbarLink>
  </Toolbar>
);

export const Default = createRender(() => <Formatting />);

/** `variant="well"` sets the toolbar on a Well track. */
export const Well = createRender(() => <Formatting variant="well" />);

const BulkActions = () => (
  <Toolbar aria-label="Case actions">
    <ToolbarInput
      aria-label="Filter cases"
      placeholder="Filter by reference"
      className="w-56"
    />
    <ToolbarSeparator />
    <ToolbarButton>Assign</ToolbarButton>
    <ToolbarButton>
      <DownloadIcon aria-hidden className="size-4" />
      Export
    </ToolbarButton>
    <ToolbarButton disabled>Archive</ToolbarButton>
  </Toolbar>
);
export const WithInput = createRender(BulkActions);

export const Compact = createRender(() => (
  <div data-density="compact" className="flex flex-col items-start gap-4">
    <Formatting />
    <BulkActions />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white flex flex-col items-start gap-4 p-4">
      <Formatting />
      <Formatting variant="well" />
    </div>
  ),
  "dark",
);
