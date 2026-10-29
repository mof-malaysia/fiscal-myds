---
title: Checkbox
description: A single tick box for a yes or no answer that is sent with a form, such as a declaration or consent. Put it in a Field with its label beside it.
category: Forms and inputs
---

## When to use

- Use `Checkbox` for one yes or no answer that is submitted with the form: "I confirm the information I have given is correct", "My postal address is the same as my home address".
- Use `CheckboxGroup` when the question has several options and people can tick more than one ("Which reliefs are you claiming?"). It also gives you a "Select all" parent.
- Use `Radio` when people must choose exactly one option.
- Use `Switch` for a setting that takes effect straight away, with no submit step.

## Usage

Put the checkbox and its `FieldLabel` in a `FieldItem` inside a `Field`. The label sits beside the box and clicking it ticks the box.

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldItem,
  FieldLabel,
} from "@/components/ui/field";

export function Declaration() {
  return (
    <Field name="declaration">
      <FieldItem>
        <Checkbox required />
        <FieldLabel>
          I declare that the information I have given is true and complete
        </FieldLabel>
      </FieldItem>
      <FieldError match="valueMissing">
        Tick the box to confirm your declaration
      </FieldError>
    </Field>
  );
}
```

Controlled, to show or hide other questions:

```tsx
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldItem, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function PostalAddress() {
  const [sameAsHome, setSameAsHome] = useState(true);
  return (
    <div className="gap-stack-md flex flex-col">
      <Field name="same-address">
        <FieldItem>
          <Checkbox checked={sameAsHome} onCheckedChange={setSameAsHome} />
          <FieldLabel>
            My postal address is the same as my home address
          </FieldLabel>
        </FieldItem>
      </Field>
      {!sameAsHome && (
        <Field name="postal-address">
          <FieldLabel>Postal address</FieldLabel>
          <Input autoComplete="street-address" />
        </Field>
      )}
    </div>
  );
}
```

## Notes

- `checked` and `defaultChecked` take `true`, `false` or `"indeterminate"` (a dash, for a parent whose children are partly ticked). `onCheckedChange` always reports `true` or `false`: a click settles the mixed state. For a real "Select all", use `CheckboxGroup` with a `parent` item, which manages the mixed state for you.
- The stroke turns red when its `Field` is invalid; put the message in `FieldError`.
- `size` is `small` (16px box, the default), `medium` (20px) or `large` (24px).
- Never use a checkbox without a visible label. Don't pre-tick consent or declaration boxes.
