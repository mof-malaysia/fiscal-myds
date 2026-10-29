---
title: Fieldset
description: Groups related fields under one legend, such as an address or a question answered with radios or checkboxes. Disabling it disables every field inside.
category: Forms and inputs
---

## When to use

- Use `Fieldset` to group several fields that answer one question or describe one thing: an address, a bank account, the parts of a date.
- Use it as the question for a set of options: render it as a `Radio` or `CheckboxGroup` so the `FieldsetLegend` labels the whole group.
- Use `Field` for a single control with its own label. Use `FormStep` or `Form` for the form as a whole.

## Usage

```tsx
import {
  Fieldset,
  FieldsetDescription,
  FieldsetLegend,
} from "@/components/ui/fieldset";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function CorrespondenceAddress() {
  return (
    <Fieldset>
      <FieldsetLegend>Correspondence address</FieldsetLegend>
      <FieldsetDescription>
        We will post your tax refund letter to this address.
      </FieldsetDescription>
      <Field name="address-line-1">
        <FieldLabel>Address line 1</FieldLabel>
        <Input autoComplete="address-line1" />
      </Field>
      <Field name="postcode">
        <FieldLabel>Postcode</FieldLabel>
        <Input
          autoComplete="postal-code"
          inputMode="numeric"
          className="max-w-32"
        />
      </Field>
      <Field name="state">
        <FieldLabel>State</FieldLabel>
        <Select
          placeholder="Select a state"
          items={[
            { value: "johor", label: "Johor" },
            { value: "selangor", label: "Selangor" },
            { value: "wp-kuala-lumpur", label: "W.P. Kuala Lumpur" },
          ]}
        />
      </Field>
    </Fieldset>
  );
}
```

A question that is the whole page uses `size="large"` on the legend. Render the fieldset as the option group, inside a `Field` that carries the name and the error:

```tsx
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Field, FieldError, FieldItem } from "@/components/ui/field";
import {
  Radio,
  RadioButton,
  RadioItem,
  RadioLabel,
} from "@/components/ui/radio";

export function ResidentStatus() {
  return (
    <Field name="resident">
      <Fieldset render={<Radio required />}>
        <FieldsetLegend size="large">
          Were you a tax resident in Malaysia in 2025?
        </FieldsetLegend>
        <FieldItem>
          <RadioItem>
            <RadioButton value="yes" id="resident-yes" />
            <RadioLabel htmlFor="resident-yes">Yes</RadioLabel>
          </RadioItem>
        </FieldItem>
        <FieldItem>
          <RadioItem>
            <RadioButton value="no" id="resident-no" />
            <RadioLabel htmlFor="resident-no">No</RadioLabel>
          </RadioItem>
        </FieldItem>
      </Fieldset>
      <FieldError>Select yes if you were a tax resident in 2025</FieldError>
    </Field>
  );
}
```

`FieldsetLegend` `size` is `medium` (default, the 18px title used for form sections) or `large` (the 24px headline, for a question that is the page's main content).

## Notes

- `disabled` on the `Fieldset` disables every field inside it and dims the legend.
- The fieldset has no border or background; it groups by spacing alone. Don't add a box around it.
- `FieldsetDescription` sits just under the legend; use it for a hint that applies to every field in the group.
- `FieldsetLegend` renders a `div` that names the group through `aria-labelledby`; it is not a heading. When the question is also the page title, make it the `h1` with `render={<h1 />}` instead of adding a separate heading that repeats it.
