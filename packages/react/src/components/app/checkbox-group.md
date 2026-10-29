---
title: Checkbox Group
description: A set of checkboxes that share one value, an array of the ticked values, under one question. Supports a "Select all" checkbox.
category: Forms and inputs
---

## When to use

- Use `CheckboxGroup` when people can choose several options from a short list: "Which reliefs are you claiming?".
- Use `Radio` in a `Fieldset` when only one answer is allowed, and a single `Checkbox` in a `Field` with `FieldItem` for one yes/no statement such as a declaration.
- Use a multiple `Combobox` when the list is long and people need to search it.

## Usage

Put it in a `Field` (for the error and validity) and render it as a `Fieldset`, so the question is the legend. Each option is a `CheckboxGroupItem` with a `value` and a `label`, and an optional `hint`.

```tsx
import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "@/components/ui/checkbox-group";
import { Field, FieldError } from "@/components/ui/field";
import {
  Fieldset,
  FieldsetDescription,
  FieldsetLegend,
} from "@/components/ui/fieldset";

export function ReliefsClaimed({ error }: { error?: string }) {
  return (
    <Field name="reliefs" invalid={Boolean(error)}>
      <Fieldset id="reliefs" render={<CheckboxGroup defaultValue={[]} />}>
        <FieldsetLegend>Which reliefs are you claiming?</FieldsetLegend>
        <FieldsetDescription>Select all that apply.</FieldsetDescription>
        <CheckboxGroupItem value="epf" label="EPF contributions" />
        <CheckboxGroupItem
          value="medical"
          label="Medical expenses"
          hint="For serious illness, fertility treatment or vaccination"
        />
        <CheckboxGroupItem
          value="education"
          label="Education fees"
          hint="For yourself, at a recognised institution"
        />
      </Fieldset>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

For a "Select all" checkbox, pass every child value to `allValues`, add an item with `parent`, and indent the rest with `CheckboxGroupNested`. The parent ticks and unticks them all and shows a mixed state when only some are ticked. Controlled, the value is a `string[]`:

```tsx
import { useState } from "react";
import {
  CheckboxGroup,
  CheckboxGroupItem,
  CheckboxGroupNested,
} from "@/components/ui/checkbox-group";
import { Field } from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";

const documents = ["payslips", "ea-form", "receipts"];

export function DocumentsToDownload() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Field name="documents">
      <Fieldset
        render={
          <CheckboxGroup
            allValues={documents}
            value={selected}
            onValueChange={setSelected}
          />
        }
      >
        <FieldsetLegend>Documents to download</FieldsetLegend>
        <CheckboxGroupItem parent label="Select all documents" />
        <CheckboxGroupNested>
          <CheckboxGroupItem value="payslips" label="Payslips" />
          <CheckboxGroupItem value="ea-form" label="EA form" />
          <CheckboxGroupItem value="receipts" label="Receipts" />
        </CheckboxGroupNested>
      </Fieldset>
    </Field>
  );
}
```

## Notes

- `CheckboxGroupItem` wires its own label and hint to its checkbox; don't add a `FieldLabel` around it.
- `orientation="horizontal"` lays short options in a row that wraps (Email, SMS, Post). Keep long labels and hints vertical, the default.
- Pass `disabled` to one `CheckboxGroupItem` to disable that option, or to `Field` to disable them all.
- To link an `ErrorSummary` to the group, give the `Fieldset` an `id`: the summary focuses the first checkbox inside it.
- Error messages say what to do: "Select at least one relief", not "Required".
- `size` on `CheckboxGroupItem` defaults to `medium`.
