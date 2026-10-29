---
title: Number Field
description: Takes a number, formatted as people type, with min, max, step, arrow keys and optional steppers. CurrencyField is the preset for ringgit amounts.
category: Forms and inputs
---

## When to use

- Use `NumberField` for a number people type: a quantity, a count of dependants, a year, a percentage.
- Use `CurrencyField` (exported from the same file) for ringgit amounts: it formats "RM 1,234.50", right-aligns in tabular figures, allows no negative amounts and has no stepper buttons.
- Use `Input` with `inputMode="numeric"` for numbers that aren't quantities: an IC number, a phone number, an account number. They have leading zeros and dashes and must not be formatted.
- Use `Slider` when an approximate value is fine and dragging is quicker than typing.

## Usage

```tsx
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { NumberField } from "@/components/ui/number-field";

export function Dependants({ error }: { error?: string }) {
  return (
    <Field name="dependants" invalid={Boolean(error)}>
      <FieldLabel>Number of children under 18</FieldLabel>
      <NumberField min={0} max={20} defaultValue={0} />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

A ringgit amount with `CurrencyField`, controlled. The value is a `number`, or `null` when the field is empty:

```tsx
import { useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { CurrencyField } from "@/components/ui/number-field";

export function AnnualIncome() {
  const [income, setIncome] = useState<number | null>(null);
  return (
    <Field name="income">
      <FieldLabel>Annual employment income</FieldLabel>
      <FieldDescription>Before tax, as shown on your EA form</FieldDescription>
      <CurrencyField
        value={income}
        onValueChange={(value) => setIncome(value)}
        inputProps={{ id: "income" }}
        className="max-w-xs"
      />
    </Field>
  );
}
```

Any other format is an `Intl.NumberFormat` options object on `format`, with `locale`:

```tsx
import { Field, FieldLabel } from "@/components/ui/field";
import { NumberField } from "@/components/ui/number-field";

export function OwnershipShare() {
  return (
    <Field name="share">
      <FieldLabel>Your share of the property</FieldLabel>
      <NumberField
        defaultValue={0.5}
        min={0}
        max={1}
        step={0.05}
        format={{ style: "percent" }}
        locale="ms-MY"
        steppers={false}
        className="max-w-40"
      />
    </Field>
  );
}
```

## Notes

- It joins the surrounding `Field` for label, hint, error and invalid state. Props for the `<input>` itself (`id`, `placeholder`, `className`) go in `inputProps`; give it an `id` when an `ErrorSummary` needs to link to it.
- Arrow keys step by `step`; Shift steps by `largeStep` and Alt by `smallStep` (Base UI props). The decrement and increment buttons (`steppers`, default true on `NumberField`) also step and repeat while held.
- Text right-aligns for currency and percent formats and left-aligns otherwise; set `align` to change it. Figures are always tabular.
- Translate the stepper buttons' accessible names with `decrementLabel` ("Decrease") and `incrementLabel` ("Increase").
- `className` goes to the root; use `groupClassName` for the bordered box. `size` (`small`, `medium`, `large`) is relative to the density.
- `CurrencyField` defaults to `currency="MYR"`, `locale="ms-MY"`, `min={0}`, `step="any"` and two decimal places. Pass `format` to add `Intl.NumberFormat` options on top (it can't change `style` or `currency`).
- Error messages say what to do: "Enter your annual income, for example 48,000.00".
