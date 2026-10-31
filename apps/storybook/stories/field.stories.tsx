import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";
import {
  Fieldset,
  FieldsetDescription,
  FieldsetLegend,
} from "@mof-malaysia/ftds-react/fieldset";
import { Form } from "@mof-malaysia/ftds-react/form";
import { Input } from "@mof-malaysia/ftds-react/input";
import { TextArea } from "@mof-malaysia/ftds-react/textarea";
import { Button } from "@mof-malaysia/ftds-react/button";

/**
 * ### Overview
 * `Field` ties one control to its label, hint and error. `Fieldset` groups related
 * fields under a legend. `Form` validates every field inside it and accepts
 * server-side `errors` keyed by field name.
 *
 * Built on Base UI Field, Fieldset and Form: labels, `aria-describedby` and
 * `aria-invalid` are wired automatically.
 *
 * ### Usage
 * ```tsx
 * <Field name="email">
 *   <FieldLabel>Email address</FieldLabel>
 *   <FieldDescription>We'll send your receipt here.</FieldDescription>
 *   <Input type="email" required />
 *   <FieldError match="valueMissing">Enter your email address</FieldError>
 * </Field>
 * ```
 */
const meta: Meta<typeof Field> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-field",
  title: "Core/Field",
  component: Field,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-md">
    <Field name="ic">
      <FieldLabel>IC number</FieldLabel>
      <FieldDescription>For example, 900101-14-5678</FieldDescription>
      <Input />
    </Field>
  </div>
);
export const Default = createRender(Basic);

const Invalid = () => (
  <div className="max-w-md">
    <Field name="ic" invalid>
      <FieldLabel>IC number</FieldLabel>
      <FieldDescription>For example, 900101-14-5678</FieldDescription>
      <Input defaultValue="9001011" />
      <FieldError>Enter your IC number in the format 900101-14-5678</FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const WithForm = () => {
  const [submitted, setSubmitted] = React.useState<string | null>(null);
  return (
    <div className="max-w-md">
      <Form
        onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
        aria-label="Contact details"
      >
        <Fieldset>
          <FieldsetLegend>Contact details</FieldsetLegend>
          <FieldsetDescription>
            We use these to tell you about your application.
          </FieldsetDescription>
          <Field name="email">
            <FieldLabel>Email address</FieldLabel>
            <Input type="email" required />
            <FieldError match="valueMissing">
              Enter your email address
            </FieldError>
            <FieldError match="typeMismatch">
              Enter an email address in the format name@example.com
            </FieldError>
          </Field>
          <Field name="notes">
            <FieldLabel>Anything else (optional)</FieldLabel>
            <TextArea />
          </Field>
        </Fieldset>
        <Button type="submit" variant="primary-fill" size="medium">
          Continue
        </Button>
      </Form>
      {submitted && (
        <p className="text-txt-black-700 text-body-sm mt-4">
          Submitted: {submitted}
        </p>
      )}
    </div>
  );
};
export const ValidatedForm = createRender(WithForm);

const Compact = () => (
  <div data-density="compact" className="max-w-sm">
    <Field name="ref" invalid>
      <FieldLabel>Reference number</FieldLabel>
      <Input defaultValue="MOF-" />
      <FieldError>Reference numbers have 10 digits after MOF-</FieldError>
    </Field>
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white max-w-md p-4">
    <Invalid />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
