---
title: Combobox
description: Pick one or more values from a long list by typing to filter it. The value is always an item from the list, never free text.
category: Forms and inputs
---

## When to use

- Use `Combobox` when people choose from a long, known list and typing helps them find their answer: a state, a district, an agency, a tax relief category.
- Use `Select` for a list of 7 or more options that people can scan without searching, and `Radio` in a `Fieldset` for 2 to 6 options.
- Use `Autocomplete` when any text is a valid answer and the list only offers suggestions (an employer name, a street).
- Use `CheckboxGroup` instead of a multiple `Combobox` when there are only a few options and people should see them all.

## Usage

Pass the options to `items` on the root and render each one from a function child of `ComboboxList`. Base UI filters the list as people type. `ComboboxEmpty` shows when nothing matches.

```tsx
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const states = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
];

export function StateOfResidence({ error }: { error?: string }) {
  return (
    <Field name="state" invalid={Boolean(error)}>
      <FieldLabel>State of residence</FieldLabel>
      <FieldDescription>Where you lived on 31 December</FieldDescription>
      <Combobox items={states}>
        <ComboboxInput id="state" placeholder="Search states" />
        <ComboboxContent>
          <ComboboxEmpty>No states match your search</ComboboxEmpty>
          <ComboboxList>
            {(state: string) => (
              <ComboboxItem key={state} value={state}>
                {state}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

Controlled, with `value` and `onValueChange`. The value is `null` when nothing is chosen:

```tsx
import { useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";

const agencies = [
  "Jabatan Akauntan Negara",
  "Jabatan Kastam Diraja Malaysia",
  "Lembaga Hasil Dalam Negeri",
  "Kementerian Kewangan",
  "Suruhanjaya Syarikat Malaysia",
];

export function AgencyFilter() {
  const [agency, setAgency] = useState<string | null>(null);
  return (
    <Field name="agency">
      <FieldLabel>Agency</FieldLabel>
      <Combobox items={agencies} value={agency} onValueChange={setAgency}>
        <ComboboxInput placeholder="Search agencies" />
        <ComboboxContent>
          <ComboboxEmpty>No agencies match your search</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
```

For several values, set `multiple` and replace `ComboboxInput` with `ComboboxChips`: chosen values show as chips inside the box. Pass a ref to `ComboboxChips` and the same ref to `ComboboxContent`'s `anchor`, so the list opens under the whole box:

```tsx
import { useRef } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";

const agencies = [
  "Jabatan Akauntan Negara",
  "Jabatan Kastam Diraja Malaysia",
  "Lembaga Hasil Dalam Negeri",
  "Kementerian Kewangan",
  "Bank Negara Malaysia",
];

export function AgenciesToNotify() {
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <Field name="agencies">
      <FieldLabel>Agencies to notify</FieldLabel>
      <Combobox items={agencies} multiple defaultValue={[agencies[2]!]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) =>
              values.map((value) => (
                <ComboboxChip key={value}>
                  {value}
                  <ComboboxChipRemove aria-label={`Remove ${value}`} />
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput placeholder="Add an agency" />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No agencies match your search</ComboboxEmpty>
          <ComboboxList>
            {(agency: string) => (
              <ComboboxItem key={agency} value={agency}>
                {agency}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
```

To group options, pass `items` as a list of groups (`{ value, items }`) and render each with `ComboboxGroup` (give it the group's `items`), `ComboboxGroupLabel` and a `ComboboxCollection` function child.

## Notes

- It joins the surrounding `Field`: label, hint, error and invalid state are wired for you. Give `ComboboxInput` an `id` when an `ErrorSummary` needs to link to it.
- `ComboboxInput` shows a clear button while there is a value (`showClear`, default true) and a chevron that opens the list (`showTrigger`, default true). Translate their accessible names with `clearLabel` ("Clear") and `triggerLabel` ("Show options").
- `ComboboxChipRemove` is named "Remove" by default; pass an `aria-label` that names the value, as above, or a translation.
- Keep `ComboboxEmpty` mounted (it renders nothing while the list has matches): it announces "no results" politely to screen readers. Use `ComboboxStatus` for async states such as "Searching…".
- `className` on `ComboboxInput` goes to the `<input>`; use `groupClassName` for the bordered box. `size` (`small`, `medium`, `large`) is relative to the density.
- `useComboboxFilter` gives Base UI's locale-aware `contains` and `startsWith` matchers when you filter `items` yourself.
- Error messages say what to do: "Select the state you lived in on 31 December".
