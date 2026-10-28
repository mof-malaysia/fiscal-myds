import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Stat,
  StatDelta,
  StatDescription,
  StatGroup,
  StatLabel,
  StatValue,
} from "@mof-malaysia/myds-react/stat";

/**
 * ### Overview
 * `Stat` is a KPI tile for officer dashboards. The delta's `direction` (arrow) and
 * `tone` (colour) are set separately, because a rise is not always good.
 * `StatGroup` arranges tiles in a responsive grid.
 *
 * ### Usage
 * ```tsx
 * <Stat>
 *   <StatLabel>Tax collected this month</StatLabel>
 *   <StatValue prefix="RM">1,284,500.00</StatValue>
 *   <StatDelta direction="up" tone="success">8.2% from September</StatDelta>
 * </Stat>
 * ```
 */
const meta: Meta<typeof Stat> = {
  title: "App/Stat",
  component: Stat,
  parameters: { layout: "padded" },
};

export default meta;

const Dashboard = () => (
  <div className="bg-bg-gray-50 p-6">
    <StatGroup>
      <Stat>
        <StatLabel>Tax collected this month</StatLabel>
        <StatValue prefix="RM">1,284,500.00</StatValue>
        <StatDelta direction="up" tone="success">
          8.2% from September
        </StatDelta>
      </Stat>
      <Stat>
        <StatLabel>Overdue cases</StatLabel>
        <StatValue>312</StatValue>
        <StatDelta direction="up" tone="danger">
          24 more than last week
        </StatDelta>
      </Stat>
      <Stat>
        <StatLabel>Average processing time</StatLabel>
        <StatValue suffix="days">4.6</StatValue>
        <StatDelta direction="down" tone="success">
          0.8 days faster
        </StatDelta>
      </Stat>
      <Stat>
        <StatLabel>Applications received</StatLabel>
        <StatValue>1,920</StatValue>
        <StatDelta>No change</StatDelta>
        <StatDescription>1 to 27 October 2026</StatDescription>
      </Stat>
    </StatGroup>
  </div>
);
export const Default = createRender(Dashboard);

const Well = () => (
  <div className="bg-bg-gray-50 p-6">
    <StatGroup>
      <Stat surface="well">
        <StatLabel>Refunds issued</StatLabel>
        <StatValue prefix="RM">82,410.50</StatValue>
        <StatDescription>Paid to 214 taxpayers</StatDescription>
      </Stat>
      <Stat surface="well">
        <StatLabel>Pending refunds</StatLabel>
        <StatValue>57</StatValue>
        <StatDelta direction="down" tone="neutral">
          9 fewer than yesterday
        </StatDelta>
      </Stat>
    </StatGroup>
  </div>
);
export const WellSurface = createRender(Well);

const Compact = () => (
  <div data-density="compact">
    <Dashboard />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark">
    <Dashboard />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
