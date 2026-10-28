import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Slider } from "@mof-malaysia/myds-react/slider";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";

/**
 * ### Overview
 * `Slider` picks a value, or a range with two thumbs. The track is a Well, the
 * filled part MYDS Blue, and the thumb has a 28px hit area. `showValue` prints the
 * value in tabular figures. Built on Base UI Slider; joins a surrounding `Field`.
 *
 * ### Usage
 * ```tsx
 * <Slider defaultValue={50} showValue />
 * <Slider defaultValue={[2000, 8000]} min={0} max={10000} thumbLabels={["Minimum", "Maximum"]} />
 * ```
 */
const meta: Meta<typeof Slider> = {
  title: "App/Slider",
  component: Slider,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-sm">
    <Field name="share">
      <FieldLabel>Your share of the property</FieldLabel>
      <FieldDescription>If you own it jointly.</FieldDescription>
      <Slider
        defaultValue={0.5}
        min={0}
        max={1}
        step={0.05}
        format={{ style: "percent" }}
        showValue
      />
    </Field>
  </div>
);
export const Default = createRender(Basic);

const Range = () => (
  <div className="max-w-sm">
    <Field name="income-range">
      <FieldLabel>Monthly income</FieldLabel>
      <Slider
        defaultValue={[2000, 8000]}
        min={0}
        max={20000}
        step={100}
        format={{
          style: "currency",
          currency: "MYR",
          maximumFractionDigits: 0,
        }}
        locale="ms-MY"
        thumbLabels={["Minimum monthly income", "Maximum monthly income"]}
        showValue
      />
    </Field>
  </div>
);
export const RangeValue = createRender(Range);

const Invalid = () => (
  <div className="max-w-sm">
    <Field name="share-invalid" invalid>
      <FieldLabel>Your share of the property</FieldLabel>
      <Slider defaultValue={0} min={0} max={100} showValue />
      <FieldError>Your share must be more than 0%</FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Disabled = () => (
  <div className="max-w-sm">
    <Field name="share-disabled" disabled>
      <FieldLabel>Your share of the property</FieldLabel>
      <Slider defaultValue={40} disabled showValue />
    </Field>
  </div>
);
export const DisabledState = createRender(Disabled);

const Compact = () => (
  <div data-density="compact" className="flex flex-col gap-6">
    <Basic />
    <Range />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-6 p-4">
    <Basic />
    <Range />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
