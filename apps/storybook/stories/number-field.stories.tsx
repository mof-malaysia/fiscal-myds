import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  CurrencyField,
  NumberField,
} from "@mof-malaysia/myds-react/number-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";

/**
 * ### Overview
 * `NumberField` takes a number with optional decrement/increment buttons, `min`,
 * `max` and `step`, and formats with `Intl.NumberFormat`. `CurrencyField` is the
 * ringgit preset: "RM 1,234.50", tabular figures, right-aligned
 * (DESIGN.md: The Tabular Money Rule). Built on Base UI Number Field; joins a `Field`.
 *
 * ### Usage
 * ```tsx
 * <NumberField min={0} max={20} defaultValue={0} />
 * <NumberField format={{ style: "currency", currency: "MYR" }} locale="ms-MY" />
 * <CurrencyField defaultValue={48000} />
 * ```
 */
const meta: Meta<typeof NumberField> = {
  title: "App/NumberField",
  component: NumberField,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-xs">
    <Field name="dependants">
      <FieldLabel>Number of children</FieldLabel>
      <FieldDescription>Under 18, or in full-time education.</FieldDescription>
      <NumberField min={0} max={20} defaultValue={2} />
    </Field>
  </div>
);
export const Default = createRender(Basic);

const Currency = () => (
  <div className="flex max-w-xs flex-col gap-6">
    <Field name="income">
      <FieldLabel>Annual income</FieldLabel>
      <FieldDescription>Before tax, from your EA form.</FieldDescription>
      <CurrencyField defaultValue={1234.5} />
    </Field>
    <Field name="donation">
      <FieldLabel>Donation (with buttons)</FieldLabel>
      <NumberField
        format={{ style: "currency", currency: "MYR" }}
        locale="ms-MY"
        min={0}
        step={50}
        defaultValue={250}
      />
    </Field>
  </div>
);
export const CurrencyFormat = createRender(Currency);

const Percent = () => (
  <div className="max-w-xs">
    <Field name="share">
      <FieldLabel>Your share of ownership</FieldLabel>
      <NumberField
        format={{ style: "percent" }}
        min={0}
        max={1}
        step={0.05}
        defaultValue={0.5}
      />
    </Field>
  </div>
);
export const PercentFormat = createRender(Percent);

const Invalid = () => (
  <div className="max-w-xs">
    <Field name="income-invalid" invalid>
      <FieldLabel>Annual income</FieldLabel>
      <CurrencyField />
      <FieldError>
        Enter your annual income, for example RM 48,000.00
      </FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Disabled = () => (
  <div className="max-w-xs">
    <Field name="year" disabled>
      <FieldLabel>Year of assessment</FieldLabel>
      <NumberField
        defaultValue={2025}
        format={{ useGrouping: false }}
        disabled
      />
    </Field>
  </div>
);
export const DisabledState = createRender(Disabled);

const Sizes = () => (
  <div className="flex max-w-xs flex-col gap-4">
    {(["small", "medium", "large"] as const).map((size) => (
      <NumberField
        key={size}
        size={size}
        defaultValue={10}
        aria-label={`Quantity (${size})`}
      />
    ))}
  </div>
);
export const AllSizes = createRender(Sizes);

const Compact = () => (
  <div data-density="compact" className="flex flex-col gap-4">
    <Basic />
    <Currency />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-4 p-4">
    <Basic />
    <Currency />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
