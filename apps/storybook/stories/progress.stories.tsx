import React, { useEffect, useState } from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  Progress,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@mof-malaysia/myds-react/progress";

/**
 * ### Overview
 * `Progress` shows how far a task has got. `value={null}` means the amount is
 * unknown and the bar sweeps (still under reduced motion). Built on Base UI Progress.
 * For a measured quantity (storage, budget), use `Meter`.
 *
 * ### Usage
 * ```tsx
 * <Progress value={45} label="Uploading documents" />
 * ```
 */
const meta: Meta<typeof Progress> = {
  title: "App/Progress",
  component: Progress,
  parameters: { layout: "centered" },
};

export default meta;

const Examples = () => (
  <div className="flex w-96 flex-col gap-8">
    <Progress value={45} label="Uploading documents" />
    <Progress value={100} label="Upload complete" successOnComplete />
    <Progress value={null} label="Checking your details" />
    <Progress value={2} max={4} format={{ style: "decimal" }}>
      <ProgressLabel>Application</ProgressLabel>
      <ProgressValue>{(_, value) => `Step ${value} of 4`}</ProgressValue>
      <ProgressTrack size="small" />
    </Progress>
  </div>
);
export const Default = createRender(Examples);

const Live = () => {
  const [value, setValue] = useState(10);
  useEffect(() => {
    const id = setInterval(() => setValue((v) => (v >= 100 ? 10 : v + 15)), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="w-96">
      <Progress value={Math.min(value, 100)} label="Processing batch" successOnComplete />
    </div>
  );
};
export const Animated = createRender(Live);

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
