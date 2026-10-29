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

`DatePicker` is a button that opens a calendar: a popover on wide screens and a dialog below 1024px. Choosing a day closes it. Because it is a button, not an input, it doesn't register with `Field` or `Form`: give it an `id`, point `FieldLabel`'s `htmlFor` at it, keep the value in state, and pass `invalid` for the error style. `name` adds a hidden input, so a native form post submits the date as `yyyy-mm-dd`.

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
      <FieldLabel htmlFor="appointment">Appointment date</FieldLabel>
      <FieldDescription>Counters are open Monday to Friday</FieldDescription>
      <DatePicker
        id="appointment"
        name="appointment"
        invalid={Boolean(error)}
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
      <FieldLabel htmlFor="paymentDate">Tarikh bayaran</FieldLabel>
      <DatePicker
        id="paymentDate"
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

- `Form`'s `onFormSubmit` values don't include it: keep the date in state (`value` with `onValueChange`) and add it yourself. With `name`, a native form post includes it as `yyyy-mm-dd`. Use `DateField` when the date should go through `Form` like any other field.
- Set `invalid` on both the `Field` (to show `FieldError`) and the `DatePicker` (for the trigger's error ring). An `ErrorSummary` error with the picker's `id` focuses the trigger.
- The trigger shows the chosen date in `formatStr` (default `"dd MMM yyy"`, for example "31 Aug 1957"), or `placeholder` (default "dd / mm / yyyy") when there is none.
- `disabled` takes react-day-picker matchers for days that can't be chosen (`{ before: new Date() }`, `{ dayOfWeek: [0, 6] }`); `disabled={true}` disables the whole picker.
- `locale` is `"en"` (default) or `"ms"`; it sets the month and weekday names, the trigger text and the calendar's year button names.
- Choosing a day closes the popup and returns focus to the trigger. Choosing a month or year from the calendar's caption grids only moves the calendar; the date changes when a day is picked.
- `minYear` and `maxYear` (default 1900 and 2099) bound the year grid; `yearOrder="desc"` lists the latest year first. `size` sizes the trigger like a `Button`.
