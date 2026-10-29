---
title: Radio
description: A group of radio buttons for choosing exactly one option from a short list that people should see all at once. Label the group with a Fieldset legend.
category: Forms and inputs
---

## When to use

- Use `Radio` when people must choose exactly one option and there are few enough (up to about six) to show them all: marital status, a refund method, yes or no.
- Use `Select` for longer lists, or `Combobox` when people would rather type to find the option.
- Use `CheckboxGroup` when people can choose more than one, and `ToggleGroup` to switch a view (Day, Week, Month) rather than answer a question.

## Usage

`Radio` is the group: it holds the value. Each option is a `RadioItem` with a `RadioButton` and a `RadioLabel`; give the button an `id` and the label a matching `htmlFor`. Put the group in a `Field` (for the name and error) and render it as a `Fieldset` so the question is the legend. Wrap each option in a `FieldItem`, so every button gets its own label inside the field.

```tsx
import { Field, FieldError, FieldItem } from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import {
  Radio,
  RadioButton,
  RadioItem,
  RadioLabel,
} from "@/components/ui/radio";

const statuses = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced or widowed" },
];

export function MaritalStatus() {
  return (
    <Field name="marital-status">
      <Fieldset render={<Radio required />}>
        <FieldsetLegend>What is your marital status?</FieldsetLegend>
        {statuses.map((status) => (
          <FieldItem key={status.value}>
            <RadioItem>
              <RadioButton value={status.value} id={`status-${status.value}`} />
              <RadioLabel htmlFor={`status-${status.value}`}>
                {status.label}
              </RadioLabel>
            </RadioItem>
          </FieldItem>
        ))}
      </Fieldset>
      <FieldError>Select your marital status</FieldError>
    </Field>
  );
}
```

Controlled, with a hint under each option and one option disabled. Stack the label and the hint in a grid; `RadioHintText` is a `<label>` too, so point it at the same button:

```tsx
import { useState } from "react";
import { Field, FieldItem } from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import {
  Radio,
  RadioButton,
  RadioHintText,
  RadioItem,
  RadioLabel,
} from "@/components/ui/radio";

const methods = [
  {
    value: "bank",
    label: "Bank transfer",
    hint: "Paid into the account you registered with LHDN, within 30 days.",
  },
  {
    value: "cheque",
    label: "Cheque",
    hint: "Posted to your correspondence address.",
    disabled: true,
  },
];

export function RefundMethod() {
  const [method, setMethod] = useState("bank");
  return (
    <Field name="refund-method">
      <Fieldset render={<Radio value={method} onValueChange={setMethod} />}>
        <FieldsetLegend>How should we pay your tax refund?</FieldsetLegend>
        {methods.map((option) => (
          <FieldItem key={option.value}>
            <RadioItem disabled={option.disabled} className="items-start">
              <RadioButton
                value={option.value}
                id={`refund-${option.value}`}
                className="mt-0.5"
              />
              <div className="grid gap-0.5">
                <RadioLabel htmlFor={`refund-${option.value}`}>
                  {option.label}
                </RadioLabel>
                <RadioHintText htmlFor={`refund-${option.value}`}>
                  {option.hint}
                </RadioHintText>
              </div>
            </RadioItem>
          </FieldItem>
        ))}
      </Fieldset>
    </Field>
  );
}
```

## Notes

- State lives on `Radio`: `defaultValue` uncontrolled, or `value` with `onValueChange`. Pass `value=""` to keep a controlled group with nothing chosen.
- `disabled` on `Radio` disables every option; `disabled` on a `RadioItem` disables that option and greys its label and hint.
- `size` is set once on `Radio` and applies to every button and label: `small` (16px button, 14px text), `medium` (default: 20px button, body text that follows the density) or `large` (20px button, 18px text).
- Without a `Fieldset`, name the group with `aria-label` or `aria-labelledby` on `Radio`, but a visible question is better.
- Don't pre-select an option for a question about the person (marital status, residency); only pre-select a safe, common default such as a refund method.
- Option labels are regular weight and full Ink, so the legend reads as the question and the options as answers.
