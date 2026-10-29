---
title: Date Field
description: A typed date input with day, month and year segments, based on the native date input. Use it for dates people know, like a date of birth.
category: Forms and inputs
---

## When to use

- Use `DateField` for a date people know and can type: a date of birth, the date on a receipt, the date a business was registered.
- Use `DatePicker` when people need to see a calendar to choose (an appointment), and `DateRangePicker` for a period.

## Usage

`DateField` wraps a native `<input type="date">`: the value is a string in `yyyy-mm-dd` form and changes come through `onChange`. It is a plain input, so wire it to the `Field` yourself: give it an `id`, point `FieldLabel`'s `htmlFor` at the same id, and pass `invalid`.

```tsx
import { useState } from "react";
import { DateField } from "@/components/ui/date-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function DateOfBirth({ error }: { error?: string }) {
  const [dob, setDob] = useState("");
  return (
    <Field name="dob" invalid={Boolean(error)}>
      <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
      <FieldDescription id="dob-hint">For example, 01/01/1990</FieldDescription>
      <DateField
        id="dob"
        name="dob"
        value={dob}
        onChange={(event) => setDob(event.target.value)}
        max={new Date().toISOString().slice(0, 10)}
        invalid={Boolean(error)}
        aria-describedby="dob-hint"
        className="w-fit"
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

## Notes

- Always pass an `id`. Without one, every `DateField` on the page uses the same id, `"date-field"`.
- Because it isn't a Base UI control, it doesn't pick up the `Field`'s label, hint, invalid or disabled state, and `Form`'s `onFormSubmit` values don't include it. A native form submits it by `name`. Pass `invalid` and `disabled` to `DateField` itself.
- Always pass `invalid` as a boolean (`invalid={Boolean(error)}`): it also sets the normal border.
- The order and look of the day, month and year segments come from the browser and the user's language settings. Explain the format in the `FieldDescription`.
- `min` and `max` take `yyyy-mm-dd` strings and limit what the browser accepts.
- The calendar icon is not a button, and the browser's own picker button is hidden in Chromium and Safari: people type the date.
- `size` is `small` (default), `medium` or `large`, relative to the density. `className` goes to the bordered wrapper.
- Error messages say what to do: "Enter your date of birth, for example 01/01/1990", or "Date of birth must be in the past".
