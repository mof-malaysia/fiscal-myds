import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Meter,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@mof-malaysia/myds-react/meter";

/**
 * ### Overview
 * `Meter` shows a measured quantity within a range. `warningAt` / `dangerAt` set
 * thresholds; past one the bar changes tone and the value gains an icon, and the
 * accessible value adds a note, so colour is never the only signal. Built on Base UI Meter.
 *
 * ### Usage
 * ```tsx
 * <Meter value={72} warningAt={70} dangerAt={90} label="Storage used" />
 * ```
 */
const meta: Meta<typeof Meter> = {
  title: "App/Meter",
  component: Meter,
  parameters: { layout: "centered" },
};

export default meta;

const Examples = () => (
  <div className="flex w-96 flex-col gap-8">
    <Meter value={38} warningAt={70} dangerAt={90} label="Storage used" />
    <Meter value={72} warningAt={70} dangerAt={90} label="Storage used" />
    <Meter value={96} warningAt={70} dangerAt={90} label="Storage used" />
    <Meter
      value={41250}
      max={50000}
      warningAt={40000}
      dangerAt={50000}
      locale="en-MY"
      format={{ style: "currency", currency: "MYR" }}
    >
      <MeterLabel>Budget spent</MeterLabel>
      <MeterValue>{(formatted) => `${formatted} of RM 50,000.00`}</MeterValue>
      <MeterTrack />
    </Meter>
    <Meter
      value={12}
      tone="danger"
      label="Leave days remaining"
      format={{ style: "decimal" }}
      max={30}
      toneLabels={{ danger: "Running low" }}
    />
  </div>
);
export const Default = createRender(Examples);

const Compact = () => (
  <div data-density="compact">
    <Examples />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Examples />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
