---
title: Date Field
description: A typed date input with day, month and year segments, based on the native date input. Use it for dates people know, like a date of birth.
category: Forms and inputs
---

## When to use

- Use `DateField` for a date people know and can type: a date of birth, the date on a receipt, the date a business was registered.
- Use `DatePicker` when people need to see a calendar to choose (an appointment), and `DateRangePicker` for a period.

## Usage

`DateField` is a native `<input type="date">` styled as an FTDS control: the value is a string in `yyyy-mm-dd` form. Like `Input`, it joins the `Field` it sits in, so the label, hint, error and disabled state are wired for you, and `Form` collects its value under the field's `name`.

```tsx
import { DateField } from "@/components/ui/date-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function DateOfBirth() {
  return (
    <Field name="dob">
      <FieldLabel>Date of birth</FieldLabel>
      <FieldDescription>For example, 01/01/1990</FieldDescription>
      <DateField
        required
        max={new Date().toISOString().slice(0, 10)}
        className="w-fit"
      />
      <FieldError match="valueMissing">Enter your date of birth</FieldError>
      <FieldError match="rangeOverflow">
        Date of birth must be in the past
      </FieldError>
    </Field>
  );
}
```

Controlled, with an error from the server:

```tsx
import { useState } from "react";
import { DateField } from "@/components/ui/date-field";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export function RegistrationDate({ error }: { error?: string }) {
  const [date, setDate] = useState("");
  return (
    <Field name="registeredOn" invalid={Boolean(error)}>
      <FieldLabel>Date the business was registered</FieldLabel>
      <DateField
        id="registeredOn"
        value={date}
        onValueChange={setDate}
        className="w-fit"
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

## Notes

- Set `invalid` and `disabled` on the `Field`, not on `DateField`. `DateField`'s own `invalid` prop is for using it outside a `Field`.
- Give it an `id` when an `ErrorSummary` links to it; otherwise the `Field` generates one.
- The order and look of the day, month and year segments come from the browser and the user's language settings. Explain the format in the `FieldDescription`.
- `min` and `max` take `yyyy-mm-dd` strings and limit what the browser accepts; `FieldError` with `match="rangeUnderflow"` or `"rangeOverflow"` explains the limit.
- The browser's own picker button is hidden in Chromium and Safari: people type the date. Clicking the calendar icon focuses the field and opens the browser's picker where it has one.
- `size` is `small` (default), `medium` or `large`, relative to the density. `className` goes to the bordered wrapper.
- Error messages say what to do: "Enter your date of birth, for example 01/01/1990", or "Date of birth must be in the past".
