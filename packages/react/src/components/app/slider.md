---
title: Slider
description: Picks a value, or a range with two thumbs, by dragging along a track. Use it where an approximate value is fine, such as a filter range.
category: Forms and inputs
---

## When to use

- Use `Slider` for approximate values on a known scale: a share in percent, an income range in a filter.
- Use `NumberField` (or `CurrencyField` for ringgit) when the exact number matters, such as an amount on a tax return. Dragging to an exact value is hard, especially on a phone.
- Show the value with `showValue` so people can see what they have chosen.

## Usage

```tsx
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

export function PropertyShare() {
  return (
    <Field name="share">
      <FieldLabel>Your share of the property</FieldLabel>
      <FieldDescription>If you own it jointly</FieldDescription>
      <Slider
        defaultValue={0.5}
        min={0}
        max={1}
        step={0.05}
        format={{ style: "percent" }}
        showValue
      />
    </Field>
  );
}
```

A range: pass an array of two values and name each thumb with `thumbLabels`. Controlled, `onValueChange` receives the array:

```tsx
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";

export function IncomeRangeFilter() {
  const [range, setRange] = useState<readonly number[]>([2000, 8000]);
  return (
    <Field name="income">
      <FieldLabel>Monthly income</FieldLabel>
      <Slider
        value={range}
        onValueChange={(value) => setRange(value)}
        min={0}
        max={20000}
        step={100}
        format={{
          style: "currency",
          currency: "MYR",
          maximumFractionDigits: 0,
        }}
        locale="ms-MY"
        thumbLabels={["Minimum monthly income", "Maximum monthly income"]}
        showValue
      />
    </Field>
  );
}
```

## Notes

- It joins the surrounding `Field` for label, error and invalid state.
- `format` takes `Intl.NumberFormat` options, so a percent format expects values from 0 to 1 (0.5 shows "50%"). Use `min={0}` and `max={1}` with it, as above.
- `showValue` shows the formatted value (a range is joined with " – ") above the track in tabular figures. Pass a function `(formattedValues, values) => ReactNode` to write the text yourself, or place a `SliderValue` in `children`.
- Arrow keys, Page Up and Page Down, Home and End all move the thumb.
- Give every thumb of a range an accessible name with `thumbLabels`; translate them as needed.
- The number of thumbs is set by the initial `value` or `defaultValue` (a number gives one thumb, an array one per item).
- Error messages say what to do: "Your share must be more than 0%".
