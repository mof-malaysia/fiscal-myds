---
title: Date Range Picker
description: Picks a start and end date from one button that opens two months side by side, with optional quick ranges such as "Last 30 days".
category: Forms and inputs
---

## When to use

- Use `DateRangePicker` for a period: a report filter, a leave application, the dates of a trip claim.
- Use `DatePicker` for one date, and two `DateField`s ("Start date", "End date") when people already know both dates, such as an employment period years ago.

## Usage

The value is a react-day-picker `DateRange` (`{ from, to }`), exported again from this file. People click the start date, then the end date; the range is set and the popup closes. `onValueChange` only fires for a finished range (or `undefined` after Clear).

```tsx
import { useState } from "react";
import {
  DateRangePicker,
  type DateRange,
} from "@/components/ui/daterange-picker";
import { Field, FieldLabel } from "@/components/ui/field";

export function PaymentsFilter() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <div className="gap-stack-sm flex flex-col">
      <Field name="period">
        <FieldLabel htmlFor="paymentDate">Payment date</FieldLabel>
        <DateRangePicker
          id="paymentDate"
          presets
          value={range}
          onValueChange={setRange}
        />
      </Field>
      <p className="text-content text-txt-black-700">
        {range?.from && range.to
          ? `Showing payments from ${range.from.toLocaleDateString("en-MY")} to ${range.to.toLocaleDateString("en-MY")}.`
          : "Showing all payments."}
      </p>
    </div>
  );
}
```

`presets` adds quick ranges beside the calendar: `true` gives Today, Last 7 days, Last 30 days, This month, Last month and This year, or pass your own list. Each preset's `range` is a function, so relative ranges are worked out when chosen. `disabled` with `excludeDisabled` restarts a range that would span a day that can't be chosen:

```tsx
import { startOfYear, subYears, endOfYear } from "date-fns";
import {
  DateRangePicker,
  type DateRange,
  type DateRangePreset,
} from "@/components/ui/daterange-picker";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

const presets: DateRangePreset[] = [
  {
    label: "Year of assessment 2025",
    range: () => {
      const year = new Date(2025, 0, 1);
      return { from: startOfYear(year), to: endOfYear(year) };
    },
  },
  {
    label: "Last year",
    range: () => {
      const year = subYears(new Date(), 1);
      return { from: startOfYear(year), to: endOfYear(year) };
    },
  },
];

export function LeaveDates({
  onChange,
}: {
  onChange: (range: DateRange | undefined) => void;
}) {
  return (
    <Field name="leave">
      <FieldLabel>Leave dates</FieldLabel>
      <FieldDescription>Weekends are not counted as leave</FieldDescription>
      <DateRangePicker
        presets={presets}
        onValueChange={onChange}
        disabled={{ dayOfWeek: [0, 6] }}
        excludeDisabled
      />
    </Field>
  );
}
```

## Notes

- It is a button, not an input, so it doesn't register with `Field` or `Form`. Give it an `id`, point `FieldLabel`'s `htmlFor` at it, keep the range in state, and pass `invalid` for the error style. With `name`, a native form post submits the range as an ISO 8601 interval (`2026-01-01/2026-03-31`), empty until both ends are chosen.
- While choosing the end date, the days up to the pointer are previewed, and the footer says "Choose a start date", "Choose an end date", or the range and its length ("3 Mar 2026 – 7 Mar 2026 · 5 days"). It is a polite live region.
- Clicking a day before the start, or after a finished range, starts a new range.
- Two months show side by side from 640px wide; phones show one.
- Click the month or year in a caption to jump to another month or year. Escape in those grids steps back to the days instead of closing the popup.
- `locale="ms"` switches dates, presets and all built-in text to Bahasa Melayu. Override any text with `labels` (`placeholder`, `clear`, `chooseStart`, `chooseEnd`, `days`, `presets`, `chooseMonth`, `chooseYear`, `previousYear`, `nextYear`, `backToMonths`). The `placeholder` prop is deprecated; use `labels.placeholder`.
- `formatStr` (default `"d MMM yyyy"`, date-fns tokens) formats the trigger and footer. `minYear` and `maxYear` (default 1900 and 2099) bound navigation.
- `disabled={true}` disables the whole picker. `align` (default `"start"`) aligns the popup to the trigger; `className` goes to the trigger.
