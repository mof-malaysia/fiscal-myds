---
title: Building forms
description: The FTDS form pattern: Field around every control, Form for validation and server errors, ErrorSummary after a failed submit, and how to write error messages.
order: 4
---

Government forms are where people get nervous. FTDS forms follow one pattern so that every field is labelled, every error says what to do, and keyboard and screen-reader users are told about problems straight away.

## The parts

- **`Field`** (`@/components/ui/field`) wraps one control with `FieldLabel`, an optional `FieldDescription` (hint) and `FieldError`. It wires `for`, `aria-describedby` and `aria-invalid` for you. Every FTDS input (`Input`, `TextArea`, `Select`, `Checkbox`, `Radio`, `Switch`, `NumberField`, `DateField`, `Combobox`, ...) picks up the `Field` it sits in. `DatePicker` and `DateRangePicker` are buttons that open a calendar, so they don't: give them an `id`, point `FieldLabel`'s `htmlFor` at it and keep their value in state, as their pages show. Give the `Field` a `name`: that is the key the value and errors use.
- **`Fieldset`** groups related fields or a radio group under a `FieldsetLegend` ("Your address", "Do you have a spouse?").
- **`Form`** (`@/components/ui/form`) collects the values of its fields on submit (`onFormSubmit`) and shows server-side `errors`, keyed by field `name`, on the right fields.
- **`ErrorSummary`** (`@/components/ui/error-summary`, app tier) is the "There is a problem" box at the top of the form after a failed submit. Each error links to its control by `id` and the summary takes focus when it appears.

## A complete form

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/ui/error-summary";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Errors = Record<string, string>;

function validate(values: Record<string, unknown>): Errors {
  const errors: Errors = {};
  const ic = String(values.ic ?? "");
  if (!ic) errors.ic = "Enter your IC number";
  else if (!/^\d{6}-\d{2}-\d{4}$/.test(ic))
    errors.ic = "Enter your IC number in the format 900101-14-5678";
  if (!values.email) errors.email = "Enter your email address";
  return errors;
}

export function ApplicantDetails({
  onContinue,
}: {
  onContinue: (values: Record<string, unknown>) => void;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const list = Object.entries(errors).map(([id, message]) => ({ id, message }));

  return (
    <Form
      className="gap-stack-lg flex max-w-xl flex-col"
      errors={errors}
      onFormSubmit={(values) => {
        const found = validate(values);
        setErrors(found);
        if (Object.keys(found).length === 0) onContinue(values);
      }}
    >
      {list.length > 0 && (
        <ErrorSummary title="There is a problem" errors={list} />
      )}

      <Field name="ic">
        <FieldLabel>IC number</FieldLabel>
        <FieldDescription>For example, 900101-14-5678</FieldDescription>
        <Input id="ic" inputMode="numeric" autoComplete="off" />
        <FieldError />
      </Field>

      <Field name="email">
        <FieldLabel>Email address</FieldLabel>
        <Input id="email" type="email" autoComplete="email" />
        <FieldError />
      </Field>

      <Button type="submit" className="w-fit">
        Continue
      </Button>
    </Form>
  );
}
```

The control's `id` matches the error's `id`, so the summary link can focus it. `FieldError` with no children shows the message for that field from `Form`'s `errors` (or from the browser's built-in validation).

## Writing messages

- **Say what to do**, not what went wrong: "Enter your IC number in the format 900101-14-5678", not "Invalid input".
- **Use the same message** in the `ErrorSummary` and in the field's `FieldError`.
- **Hints go in `FieldDescription`**, above the control, and are never the only place a rule is stated in an error.
- **Labels are short nouns** ("Email address"); questions are for radio groups in a `Fieldset` ("Are you a Malaysian citizen?").
- **Don't use placeholders as labels** or for instructions; placeholder text is too light to read and disappears.

## Choosing a control

| Need                             | Use                                                                       |
| -------------------------------- | ------------------------------------------------------------------------- |
| Short text                       | `Input`                                                                   |
| Long text, with a limit          | `TextArea` with `CharacterCount`                                          |
| One choice of 2 to 6             | `Radio` in a `Fieldset`                                                   |
| One choice of 7 or more          | `Select`; `Combobox` when people need to search                           |
| Several choices                  | `CheckboxGroup`                                                           |
| On/off that applies immediately  | `Switch`; a `Checkbox` when it is submitted with the form                 |
| A date people know (birth date)  | `DateField`                                                               |
| A date people pick (appointment) | `DatePicker`; `DateRangePicker` for a range (keep the value in state)     |
| Money and numbers                | `NumberField` (or `Input` with `inputMode="decimal"` and an "RM" prepend) |
| One-time code                    | `OTPField`                                                                |
| Password                         | `PasswordInput`                                                           |
| Files                            | `FileUpload`                                                              |

## Long forms and services

Split long services into one question or topic per page with `FormStep`, end with `CheckAnswers` so people can review and change their answers, and confirm with `ConfirmationPanel`. These blocks follow the same field and error pattern.
