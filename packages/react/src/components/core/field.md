---
title: Field
description: Wraps one form control with its label, hint and error message, and wires them together for assistive technology. Use it around every input.
category: Forms and inputs
---

## When to use

Put every form control in a `Field`: `Input`, `TextArea`, `Select`, `Combobox`, `NumberField`, `Checkbox`, `Switch` and the rest. The control picks up the label (`for`), hint and error (`aria-describedby`) and invalid state (`aria-invalid`) from the field it sits in, so you never wire ids by hand. The exceptions are `DateField`, `DatePicker` and `DateRangePicker`, which are plain inputs: give them an `id`, point `FieldLabel`'s `htmlFor` at it and pass `invalid` (see their pages).

To group several fields or a set of radios under one question, put them in a `Fieldset`. To submit and validate several fields together, put them in a `Form`.

## Usage

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function IcNumberField({ error }: { error?: string }) {
  return (
    <Field name="ic" invalid={Boolean(error)}>
      <FieldLabel>IC number</FieldLabel>
      <FieldDescription>For example, 900101-14-5678</FieldDescription>
      <Input id="ic" inputMode="numeric" />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

`FieldError` is shown only while the field is invalid: when `invalid` is set, when `Form` has an error for the field's `name`, or when the browser's validation fails (`required`, `type="email"`, `pattern`). With no children it shows the validation message; pass `match` (for example `match="valueMissing"`) to give a message for one validity state:

```tsx
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function EmailField() {
  return (
    <Field name="email">
      <FieldLabel>Email address</FieldLabel>
      <Input type="email" required autoComplete="email" />
      <FieldError match="valueMissing">Enter your email address</FieldError>
      <FieldError match="typeMismatch">
        Enter an email address in the correct format, like name@example.com
      </FieldError>
    </Field>
  );
}
```

A checkbox or switch puts the label beside the control with `FieldItem`:

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldItem, FieldLabel } from "@/components/ui/field";

export function ConsentField() {
  return (
    <Field name="consent">
      <FieldItem>
        <Checkbox />
        <FieldLabel>
          I confirm the information I have given is correct
        </FieldLabel>
      </FieldItem>
    </Field>
  );
}
```

## Notes

- The label is required and always visible; never rely on a placeholder.
- Hints go in `FieldDescription`, errors in `FieldError`. Error messages say what to do: "Enter your IC number in the format 900101-14-5678".
- `name` is the key the value is submitted under and the key `Form`'s `errors` use.
- Give the control an `id` when an `ErrorSummary` needs to link to it.
- `disabled` on the `Field` disables the control and dims the label.
