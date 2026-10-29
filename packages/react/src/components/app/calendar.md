---
title: Calendar
description: An always-visible month grid for choosing days, built on react-day-picker, with month and year jump grids. DatePicker and DateRangePicker use it.
category: Forms and inputs
---

## When to use

- Use `Calendar` when the calendar itself is the content and stays on the page: choosing an appointment day on a booking screen, or showing available days.
- Use `DatePicker` for a date field in a form (it opens `Calendar` in a popover), `DateRangePicker` for a start and end date, and `DateField` for a date people already know, such as a birth date.

## Usage

`Calendar` takes every prop of react-day-picker's DayPicker. Set `mode` (`"single"`, `"multiple"` or `"range"`) with `selected` and `onSelect`, and `disabled` with react-day-picker matchers for days that can't be chosen.

```tsx
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function AppointmentDay() {
  const [day, setDay] = useState<Date | undefined>();
  return (
    <section className="gap-stack-sm flex flex-col">
      <h2 className="text-title text-txt-black-900 font-semibold">
        Choose a day for your appointment
      </h2>
      <Calendar
        mode="single"
        selected={day}
        onSelect={setDay}
        disabled={[{ before: new Date() }, { dayOfWeek: [0, 6] }]}
        className="bg-bg-white rounded-lg"
      />
      <p className="text-content text-txt-black-700" aria-live="polite">
        {day
          ? `You have chosen ${day.toLocaleDateString("en-MY", { dateStyle: "full" })}.`
          : "No day chosen yet."}
      </p>
    </section>
  );
}
```

Month and weekday names come from a date-fns `locale`, for example Bahasa Melayu. `minYear` and `maxYear` (default 1900 and 2099, both included) bound the year grid and navigation, and `yearOrder="desc"` lists the latest year first:

```tsx
import { useState } from "react";
import { ms } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

export function TarikhTemujanji() {
  const [day, setDay] = useState<Date | undefined>();
  return (
    <Calendar
      mode="single"
      selected={day}
      onSelect={setDay}
      locale={ms}
      minYear={2024}
      maxYear={2027}
      yearOrder="desc"
    />
  );
}
```

## Notes

- Clicking the month or year in the caption opens a month grid or a year grid. In `single` mode they only move the calendar; the value changes when a day is picked. In `range` mode, set `daterange="from"` or `"to"` to say which end the grid changes.
- `month` sets the month shown first; after that the calendar manages navigation itself.
- Day cells are 40px in the comfortable density and 32px in compact; the width follows, so wrap it with `w-fit` in a popover.
- Outside days are shown by default (`showOutsideDays`).
- The previous and next year buttons in the month grid are named in English ("Go to the Previous Year", "Go to the Next Year") and can't be translated. react-day-picker's own accessible names can be translated with its `labels` prop.
- It is not a form control: it doesn't join a `Field` and submits nothing. Keep the selected date in state and send it yourself.
