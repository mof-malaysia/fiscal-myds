import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  CheckboxGroup,
  CheckboxGroupItem,
  CheckboxGroupNested,
} from "@mof-malaysia/ftds-react/checkbox-group";
import { Field, FieldError } from "@mof-malaysia/ftds-react/field";
import {
  Fieldset,
  FieldsetDescription,
  FieldsetLegend,
} from "@mof-malaysia/ftds-react/fieldset";

/**
 * ### Overview
 * `CheckboxGroup` holds checkboxes that share one array value. Add `allValues` and a
 * `parent` item for "Select all". Wrap it in a `Field` for the error, and render it
 * as a `Fieldset` so the question is the legend. Built on Base UI Checkbox Group.
 *
 * ### Usage
 * ```tsx
 * <Field name="reliefs">
 *   <Fieldset render={<CheckboxGroup defaultValue={[]} />}>
 *     <FieldsetLegend>Which reliefs are you claiming?</FieldsetLegend>
 *     <CheckboxGroupItem value="medical" label="Medical expenses" />
 *   </Fieldset>
 *   <FieldError>Select at least one relief</FieldError>
 * </Field>
 * ```
 */
const meta: Meta<typeof CheckboxGroup> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-checkboxgroup",
  title: "App/CheckboxGroup",
  component: CheckboxGroup,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-md">
    <Field name="reliefs">
      <Fieldset render={<CheckboxGroup defaultValue={["epf"]} />}>
        <FieldsetLegend>Which reliefs are you claiming?</FieldsetLegend>
        <FieldsetDescription>Select all that apply.</FieldsetDescription>
        <CheckboxGroupItem value="epf" label="EPF contributions" />
        <CheckboxGroupItem
          value="medical"
          label="Medical expenses"
          hint="For serious illness, fertility treatment or vaccination"
        />
        <CheckboxGroupItem
          value="education"
          label="Education fees"
          hint="For yourself, at a recognised institution"
        />
        <CheckboxGroupItem
          value="lifestyle"
          label="Lifestyle purchases"
          disabled
        />
      </Fieldset>
    </Field>
  </div>
);
export const Default = createRender(Basic);

const documents = ["payslips", "ea-form", "receipts"];

const SelectAll = () => (
  <div className="max-w-md">
    <Field name="documents">
      <Fieldset
        render={
          <CheckboxGroup allValues={documents} defaultValue={["ea-form"]} />
        }
      >
        <FieldsetLegend>Documents to download</FieldsetLegend>
        <CheckboxGroupItem parent label="Select all documents" />
        <CheckboxGroupNested>
          <CheckboxGroupItem value="payslips" label="Payslips" />
          <CheckboxGroupItem value="ea-form" label="EA form" />
          <CheckboxGroupItem value="receipts" label="Receipts" />
        </CheckboxGroupNested>
      </Fieldset>
    </Field>
  </div>
);
export const WithSelectAll = createRender(SelectAll);

const Horizontal = () => (
  <Field name="contact">
    <Fieldset
      render={<CheckboxGroup orientation="horizontal" defaultValue={[]} />}
    >
      <FieldsetLegend>How should we contact you?</FieldsetLegend>
      <CheckboxGroupItem value="email" label="Email" />
      <CheckboxGroupItem value="sms" label="SMS" />
      <CheckboxGroupItem value="post" label="Post" />
    </Fieldset>
  </Field>
);
export const HorizontalOrientation = createRender(Horizontal);

const Invalid = () => (
  <div className="max-w-md">
    <Field name="declaration" invalid>
      <Fieldset render={<CheckboxGroup defaultValue={[]} />}>
        <FieldsetLegend>Declaration</FieldsetLegend>
        <CheckboxGroupItem
          value="true"
          label="I declare that the information I have given is correct"
        />
      </Fieldset>
      <FieldError>
        Confirm that the information you have given is correct
      </FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Compact = () => (
  <div data-density="compact" className="flex flex-col gap-6">
    <Basic />
    <SelectAll />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-6 p-4">
    <Basic />
    <SelectAll />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
