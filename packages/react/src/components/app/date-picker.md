---
title: Date Picker
description: A button that opens a calendar to pick one date: in a popover on large screens and a dialog on small ones. Use it for dates people choose, like appointments.
category: Forms and inputs
---

## When to use

- Use `DatePicker` for a date people pick from a calendar, often near today: an appointment, a payment date, a start date.
- Use `DateField` for a date people already know and can type faster than they can find it, such as a date of birth.
- Use `DateRangePicker` for a start and an end date, and `Calendar` when the calendar should stay visible on the page.

## Usage

```tsx
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export function AppointmentDate({ error }: { error?: string }) {
  const [date, setDate] = useState<Date | undefined>();
  const today = new Date();
  return (
    <Field name="appointment" invalid={Boolean(error)}>
      <FieldLabel>Appointment date</FieldLabel>
      <FieldDescription>Counters are open Monday to Friday</FieldDescription>
      <DatePicker
        value={date}
        onValueChange={setDate}
        disabled={[{ before: today }, { dayOfWeek: [0, 6] }]}
        minYear={today.getFullYear()}
        maxYear={today.getFullYear() + 1}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

In Bahasa Melayu, with your own display format (date-fns tokens) and placeholder:

```tsx
import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldLabel } from "@/components/ui/field";

export function TarikhBayaran({
  onChange,
}: {
  onChange: (date: Date) => void;
}) {
  return (
    <Field name="paymentDate">
      <FieldLabel>Tarikh bayaran</FieldLabel>
      <DatePicker
        locale="ms"
        formatStr="d MMMM yyyy"
        placeholder="Pilih tarikh"
        onValueChange={onChange}
      />
    </Field>
  );
}
```

## Notes

- It is not a form control: it doesn't join the surrounding `Field`, and neither `Form` nor a native form submits its value. Keep the date in state (`value` with `onValueChange`, or `defaultValue`) and submit it yourself. The `FieldLabel` and `FieldError` are visible but not linked to the button; set `invalid` on the `Field` to show the error.
- The trigger shows the chosen date in `formatStr` (default `"dd MMM yyy"`, for example "31 Aug 1957"), or `placeholder` (default "dd / mm / yyyy") when there is none.
- `disabled` takes react-day-picker matchers for days that can't be chosen (`{ before: new Date() }`, `{ dayOfWeek: [0, 6] }`); `disabled={true}` disables the whole picker.
- `locale` is `"en"` (default) or `"ms"`; it sets the month and weekday names and the trigger text. Some calendar buttons keep English accessible names.
- Choosing a day doesn't close the popup; people close it with Escape or by clicking outside. On small screens the calendar opens in a dialog with no close button.
- Choosing a month or year from the calendar's caption grids also changes the value (keeping the day of the month).
- `minYear` and `maxYear` (default 1900 and 2099) bound the year grid; `yearOrder="desc"` lists the latest year first. `size` sizes the trigger like a `Button`.
