import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { FormStep } from "@mof-malaysia/ftds-react/form-step";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";
import { Input } from "@mof-malaysia/ftds-react/input";

/**
 * ### Overview
 * One page of a multi-step application: back link, progress, the application's
 * name as a caption, the page's h1, the fields, and Continue with "Save and come
 * back later". It renders a `<form>`; validate in the app and pass `errors` back
 * to show an ErrorSummary that takes focus and links to each field.
 *
 * Pass `steps` (with `currentStep`) for a Stepper, or `step` for plain
 * "Step 2 of 5" text. Every string can be changed with `labels`.
 *
 * ### Usage
 * ```tsx
 * <FormStep
 *   caption="Apply for an individual tax relief"
 *   title="Your details"
 *   steps={["Your details", "Income", "Reliefs", "Check and submit"]}
 *   currentStep={0}
 *   backHref="/apply"
 *   errors={errors}
 *   onContinue={(event) => { event.preventDefault(); next(); }}
 *   onSaveForLater={save}
 * >
 *   <Field name="ic">…</Field>
 * </FormStep>
 * ```
 */
const meta: Meta<typeof FormStep> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-blocks-formstep",
  title: "App/Blocks/FormStep",
  component: FormStep,
  parameters: { layout: "padded" },
};

export default meta;

const STEPS = ["Your details", "Your income", "Reliefs", "Check and submit"];

const Fields = ({ invalid = false }: { invalid?: boolean }) => (
  <>
    <Field name="employer">
      <FieldLabel>Employer name</FieldLabel>
      <Input id="employer" size="medium" defaultValue="Syarikat Maju Jaya" />
    </Field>
    <Field name="income" invalid={invalid}>
      <FieldLabel>Annual income</FieldLabel>
      <FieldDescription>
        Your total income for 2026 before tax, from your EA form
      </FieldDescription>
      <Input
        id="income"
        inputMode="decimal"
        size="medium"
        className="max-w-64"
      />
      <FieldError>Enter your annual income</FieldError>
    </Field>
  </>
);

export const Default = createRender(() => (
  <FormStep
    caption="Apply for an individual tax relief"
    title="Your income"
    steps={STEPS}
    currentStep={1}
    backHref="#"
    onContinue={(event) => event.preventDefault()}
    onSaveForLater={() => {}}
  >
    <Fields />
  </FormStep>
));

/** `step` instead of `steps`: plain progress text beside the caption. */
export const PlainProgress = createRender(() => (
  <FormStep
    caption="Apply for an individual tax relief"
    title="Your income"
    description="Tell us what you earned in 2026. We will check this against your employer's records."
    step={{ current: 2, total: 4 }}
    backHref="#"
    onContinue={(event) => event.preventDefault()}
  >
    <Fields />
  </FormStep>
));

/** After a failed Continue: the summary takes focus and links to the field. */
export const WithErrors = createRender(() => (
  <FormStep
    caption="Apply for an individual tax relief"
    title="Your income"
    steps={STEPS}
    currentStep={1}
    backHref="#"
    errors={[{ id: "income", message: "Enter your annual income" }]}
    onContinue={(event) => event.preventDefault()}
    onSaveForLater={() => {}}
  >
    <Fields invalid />
  </FormStep>
));

/** While the step is being saved. */
export const Pending = createRender(() => (
  <FormStep
    caption="Apply for an individual tax relief"
    title="Your income"
    steps={STEPS}
    currentStep={1}
    pending
    onSaveForLater={() => {}}
  >
    <Fields />
  </FormStep>
));

/** Bahasa Melayu labels. */
export const Malay = createRender(() => (
  <FormStep
    caption="Mohon pelepasan cukai individu"
    title="Pendapatan anda"
    step={{ current: 2, total: 4 }}
    backHref="#"
    onSaveForLater={() => {}}
    labels={{
      back: "Kembali",
      continue: "Teruskan",
      saveForLater: "Simpan dan sambung kemudian",
      progress: "Langkah {current} daripada {total}",
      errorTitle: "Terdapat masalah",
    }}
  >
    <Fields />
  </FormStep>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-6">
      <FormStep
        caption="Apply for an individual tax relief"
        title="Your income"
        steps={STEPS}
        currentStep={1}
        backHref="#"
        errors={[{ id: "income", message: "Enter your annual income" }]}
        onSaveForLater={() => {}}
      >
        <Fields invalid />
      </FormStep>
    </div>
  ),
  "dark",
);
