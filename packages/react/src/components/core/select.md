---
title: Select
description: Choose one option, or several with multiple, from a list that opens below a field-like trigger. Pass items for a plain list or compose the parts for groups.
category: Forms and inputs
---

## When to use

- Use `Select` to choose from a fixed list that is too long for radios: a state, an assessment year, an agency.
- Use `Radio` for a few options people should see side by side, and `Combobox` or `Autocomplete` when the list is long enough that people would rather type to find the option.
- Use `Menu` for a list of actions, not values.

## Usage

For a plain list, pass `items` and Select renders the trigger and the list. It sits in a `Field` like any other control:

```tsx
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export function AssessmentYear() {
  return (
    <Field name="year">
      <FieldLabel>Year of assessment</FieldLabel>
      <Select
        required
        placeholder="Select a year"
        className="max-w-64"
        items={[
          { value: "2025", label: "2025" },
          { value: "2024", label: "2024" },
          { value: "2023", label: "2023", description: "Closes 31 December" },
        ]}
      />
      <FieldError>Select the year of assessment</FieldError>
    </Field>
  );
}
```

Items with the same `group` (next to each other in the list) share a heading. Controlled state uses `value` and `onValueChange`; `""` means nothing is chosen:

```tsx
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export function AgencySelect() {
  const [agency, setAgency] = useState("");
  return (
    <Field name="agency">
      <FieldLabel>Agency</FieldLabel>
      <Select
        value={agency}
        onValueChange={setAgency}
        clearable
        placeholder="Any agency"
        items={[
          { value: "mof", label: "Ministry of Finance", group: "Ministries" },
          { value: "moh", label: "Ministry of Health", group: "Ministries" },
          {
            value: "lhdn",
            label: "Inland Revenue Board (LHDN)",
            group: "Agencies",
          },
          {
            value: "kwsp",
            label: "Employees Provident Fund (KWSP)",
            group: "Agencies",
          },
        ]}
      />
    </Field>
  );
}
```

Compose the parts for a filter with several choices, an icon, or custom content. Pass `items` as well whenever labels differ from values, so the trigger shows "In review" rather than "review" before the list has opened:

```tsx
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupTitle,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon } from "@/components/ui/icons/filter";

const statuses = [
  { value: "submitted", label: "Submitted" },
  { value: "review", label: "In review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export function StatusFilter({
  onChange,
}: {
  onChange: (statuses: string[]) => void;
}) {
  return (
    <Field name="status">
      <FieldLabel>Status</FieldLabel>
      <Select
        multiple
        clearable
        defaultValue={[]}
        onValueChange={onChange}
        items={statuses}
      >
        <SelectTrigger icon={<FilterIcon />} className="w-fit min-w-48">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupTitle>Open</SelectGroupTitle>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="review">In review</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectGroupTitle>Closed</SelectGroupTitle>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
```

| `variant`           | Use for                                                 |
| ------------------- | ------------------------------------------------------- |
| `outline` (default) | Forms: white field with the control stroke, like Input  |
| `ghost`             | Toolbars and dense table headers: no stroke until hover |

## Notes

- The label goes above in `FieldLabel`, never inside the trigger. `placeholder` is for "Select a state" or "Any", not for the question.
- With `multiple`, `value` is a `string[]`, each option shows a checkbox, and the trigger shows the first choice and "+2 more" (screen readers hear every choice).
- `clearable` adds a clear button once something is chosen; `onValueChange` then gets `""` (or `[]`) with no event details.
- With the `items` shorthand, `className`, `placeholder` and `icon` go on the `Select`; when composing, they go on `SelectTrigger` and `SelectValue`. The trigger fills its container, so pass `w-fit` or a `max-w-*`.
- `SelectHeader` and `SelectFooter` pin content above or below the options (a note, a "Select all"); `SelectSeparator` draws a line between sections.
- `SelectContent` opens below the trigger; `position="item-aligned"` places the chosen option over the trigger instead.
- Translate built-in text with `clearLabel` (default "Clear selection") on `Select` and `moreLabel` (default "+{count} more") on `SelectValue`.
- `size` is `small` (default), `medium` or `large` and follows the density, like `Input`.
