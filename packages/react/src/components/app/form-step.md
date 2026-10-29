---
title: Form Step
description: One page of a multi-step application. Back link, progress, caption, the page's h1, your fields, an error summary, and Continue with "Save and come back later".
---

## When to use

- Use `FormStep` for each page of a long service split into one question or topic per page (your details, income, reliefs).
- End the service with `CheckAnswers`, then `ConfirmationPanel` (or `PaymentSummary` when there is a fee).
- Use a plain `Form` for a short form that fits on one page, and `SettingsSection` for editing account details.

## Usage

The block renders a `<form>` and passes the submit event to `onContinue` (Continue or Enter). Validate in the app and pass `errors` back as `{ id, message }`; give each control the error's `id` so the summary link can focus it. The block's form is a plain `<form>`, not `Form`, so mark each `Field` `invalid` and put the message in its `FieldError` yourself.

```tsx
import { useState } from "react";
import { FormStep } from "@/components/blocks/form-step";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function IncomeStep({
  onNext,
  onSave,
}: {
  onNext: (income: string) => void;
  onSave: () => void;
}) {
  const [error, setError] = useState<string>();

  return (
    <FormStep
      caption="Apply for an individual tax relief"
      title="Your income"
      steps={["Your details", "Your income", "Reliefs", "Check and submit"]}
      currentStep={1}
      backHref="/apply/details"
      errors={error ? [{ id: "income", message: error }] : undefined}
      onSaveForLater={onSave}
      onContinue={(event) => {
        event.preventDefault();
        const income = String(
          new FormData(event.currentTarget).get("income") ?? "",
        ).trim();
        if (!income) {
          setError("Enter your annual income");
          return;
        }
        setError(undefined);
        onNext(income);
      }}
    >
      <Field name="income" invalid={Boolean(error)}>
        <FieldLabel>Annual income</FieldLabel>
        <FieldDescription>
          Your total income for 2025 before tax, from your EA form
        </FieldDescription>
        <Input
          id="income"
          name="income"
          inputMode="decimal"
          className="max-w-64"
        />
        <FieldError>{error}</FieldError>
      </Field>
    </FormStep>
  );
}
```

Plain progress text with `step` instead of a `Stepper`, and Bahasa Melayu labels. `{current}` and `{total}` are replaced in `labels.progress`:

```tsx
import type { ReactNode } from "react";
import { FormStep } from "@/components/blocks/form-step";

export function LangkahPendapatan({
  children,
  onContinue,
}: {
  children: ReactNode;
  onContinue: () => void;
}) {
  return (
    <FormStep
      caption="Mohon pelepasan cukai individu"
      title="Pendapatan anda"
      step={{ current: 2, total: 4 }}
      backHref="/mohon/butiran"
      onContinue={(event) => {
        event.preventDefault();
        onContinue();
      }}
      labels={{
        back: "Kembali",
        continue: "Teruskan",
        saveForLater: "Simpan dan sambung kemudian",
        progress: "Langkah {current} daripada {total}",
        errorTitle: "Terdapat masalah",
        progressLabel: "Kemajuan permohonan",
      }}
    >
      {children}
    </FormStep>
  );
}
```

## Notes

- `title` is the page's only `h1`; `caption` (the service's name) sits small above it.
- `steps` with a zero-based `currentStep` shows a `Stepper`; `step` (one-based `{ current, total }`) shows "Step 2 of 4" beside the caption instead. If you pass both, `steps` wins.
- When `errors` is non-empty, an `ErrorSummary` appears above the fields and takes focus. Use the same message in the summary and the field's `FieldError`.
- The form has `noValidate`, so browser validation doesn't block Continue; validate in `onContinue`.
- "Save and come back later" shows only with `onSaveForLater` and doesn't submit the form: read and save the values yourself.
- The back link shows with `backHref`, `onBack` or `backRender` (your router's link).
- `pending` disables both buttons and marks the form busy while the step saves.
- The installed file is yours: edit it when the props don't cover what you need.
