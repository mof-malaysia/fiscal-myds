---
title: Form
description: A form element that collects and validates the Fields inside it, and shows server errors on the right fields. Use it for any page that submits answers.
category: Forms and inputs
---

## When to use

- Use `Form` around the fields of one submission: a claim, an application, a sign-in. It validates the fields together on submit and passes you the values keyed by each field's `name`.
- Use `FormStep` for one page of a multi-page citizen form (it lays out the title, back link and buttons). Use `Fieldset` to group fields inside a form, and `ErrorSummary` to list errors at the top after a failed submit.

## Usage

`onFormSubmit` runs only when every field is valid and receives the values. Pass errors from your server as `errors`, keyed by field `name`; each field turns invalid and its `FieldError` shows.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/ui/error-summary";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Errors = Record<string, string>;

export function TaxpayerDetails({
  save,
}: {
  save: (values: Record<string, unknown>) => Promise<Errors>;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const summary = Object.entries(errors).map(([id, message]) => ({
    id,
    message,
  }));

  return (
    <Form
      errors={errors}
      onFormSubmit={async (values) => setErrors(await save(values))}
    >
      {summary.length > 0 && (
        <ErrorSummary title="There is a problem" errors={summary} />
      )}
      <Field name="ic">
        <FieldLabel>IC number</FieldLabel>
        <Input id="ic" inputMode="numeric" />
        <FieldError>{errors.ic}</FieldError>
      </Field>
      <Field name="tin">
        <FieldLabel>Tax identification number (TIN)</FieldLabel>
        <Input id="tin" />
        <FieldError>{errors.tin}</FieldError>
      </Field>
      <Button type="submit" className="w-fit">
        Save and continue
      </Button>
    </Form>
  );
}
```

## Notes

- Every field needs a `name`: it is the key in the submitted values and in `errors`.
- Validation runs on submit by default, then again as people change a field. Set `validationMode` to `"onBlur"` or `"onChange"` to validate earlier; a `Field`'s own `validationMode` wins.
- `onFormSubmit` prevents the browser's page reload for you. Use plain `onSubmit` instead if you need the native event.
- After a failed submit, show an `ErrorSummary` at the top with the same messages as the fields, and give each control an `id` that matches the summary's `id`.
- The form stacks its children with the large stack gap. Put buttons straight inside, with one primary button; give it `className="w-fit"` so it doesn't stretch.
