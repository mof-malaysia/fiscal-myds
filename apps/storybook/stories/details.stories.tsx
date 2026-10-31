import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Details,
  DetailsContent,
  DetailsTrigger,
} from "@mof-malaysia/ftds-react/details";

/**
 * ### Overview
 * `Details` hides help that only some users need behind a link-like trigger.
 * Built on Base UI Collapsible. For several sections, use an Accordion.
 *
 * ### Usage
 * ```tsx
 * <Details>
 *   <DetailsTrigger>I cannot find my reference number</DetailsTrigger>
 *   <DetailsContent>It's on the letter we sent you, under your name.</DetailsContent>
 * </Details>
 * ```
 */
const meta: Meta<typeof Details> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-details",
  title: "Core/Details",
  component: Details,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = ({ defaultOpen = false }: { defaultOpen?: boolean }) => (
  <div className="max-w-xl">
    <Details defaultOpen={defaultOpen}>
      <DetailsTrigger>I cannot find my reference number</DetailsTrigger>
      <DetailsContent>
        Your reference number is on the letter we sent you, under your name. It
        starts with MOF and has 10 digits, for example MOF-2026-004817.
      </DetailsContent>
    </Details>
  </div>
);
export const Default = createRender(() => <Basic />);
export const Open = createRender(() => <Basic defaultOpen />);

const Disabled = () => (
  <Details disabled>
    <DetailsTrigger>Help with this question</DetailsTrigger>
    <DetailsContent>Not available.</DetailsContent>
  </Details>
);
export const DisabledState = createRender(Disabled);

const Compact = () => (
  <div data-density="compact">
    <Basic defaultOpen />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Basic defaultOpen />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
