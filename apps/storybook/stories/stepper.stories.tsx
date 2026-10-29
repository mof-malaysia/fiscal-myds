import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Stepper, StepperItem } from "@mof-malaysia/ftds-react/stepper";

/**
 * ### Overview
 * `Stepper` shows progress through a multi-step form. Wide containers list every
 * step; narrow ones collapse to "Step 2 of 4: Your income" and a progress line.
 * Steps before `current` are complete and can link back with `href`; the current
 * step has `aria-current="step"`.
 *
 * ### Usage
 * ```tsx
 * <Stepper current={1} aria-label="Application progress">
 *   <StepperItem href="#details">Your details</StepperItem>
 *   <StepperItem>Your income</StepperItem>
 *   <StepperItem>Reliefs</StepperItem>
 *   <StepperItem>Check and submit</StepperItem>
 * </Stepper>
 * ```
 */
const meta: Meta<typeof Stepper> = {
  title: "App/Stepper",
  component: Stepper,
  parameters: { layout: "padded" },
};

export default meta;

const Steps = ({ current, label }: { current: number; label: string }) => (
  <Stepper current={current} aria-label={label}>
    <StepperItem href="#details">Your details</StepperItem>
    <StepperItem href="#income">Your income</StepperItem>
    <StepperItem>Reliefs</StepperItem>
    <StepperItem>Check and submit</StepperItem>
  </Stepper>
);

const Basic = () => <Steps current={1} label="Application progress" />;
export const Default = createRender(Basic);

const States = () => (
  <div className="flex flex-col gap-8">
    <Steps current={0} label="Progress at the first step" />
    <Steps current={2} label="Progress at the third step" />
    <Steps current={3} label="Progress at the last step" />
  </div>
);
export const AllStates = createRender(States);

const Narrow = () => (
  <div className="max-w-xs">
    <Steps current={1} label="Application progress" />
  </div>
);
export const NarrowContainer = createRender(Narrow);

const Malay = () => (
  <Stepper
    current={1}
    aria-label="Kemajuan permohonan"
    completeLabel="Selesai"
    formatStep={(step, total) => `Langkah ${step} daripada ${total}`}
  >
    <StepperItem href="#butiran">Butiran anda</StepperItem>
    <StepperItem>Pendapatan anda</StepperItem>
    <StepperItem>Pelepasan</StepperItem>
  </Stepper>
);
export const CustomLabels = createRender(Malay);

const Compact = () => (
  <div data-density="compact" className="flex flex-col gap-6">
    <Basic />
    <div className="max-w-xs">
      <Steps current={2} label="Compact narrow progress" />
    </div>
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-6 p-4">
    <Basic />
    <div className="max-w-xs">
      <Steps current={2} label="Narrow progress" />
    </div>
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
