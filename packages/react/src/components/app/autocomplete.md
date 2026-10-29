---
title: Autocomplete
description: A free-text input that suggests matches as people type. The value is the text in the input; choosing a suggestion only fills it in.
category: Forms and inputs
---

## When to use

- Use `Autocomplete` when any text is a valid answer but suggestions save typing: an employer name, a street, a search box.
- Use `Combobox` when the answer must be one of the listed options (a state, an agency). `Autocomplete` accepts text that isn't in the list.
- Use `Input` when there is nothing useful to suggest.

## Usage

Pass the suggestions to `items` and render each one from a function child of `AutocompleteList`. Base UI filters the suggestions by what has been typed.

```tsx
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

const employers = [
  "Petroliam Nasional Berhad",
  "Tenaga Nasional Berhad",
  "Malayan Banking Berhad",
  "Telekom Malaysia Berhad",
  "Sime Darby Berhad",
];

export function EmployerName({ error }: { error?: string }) {
  return (
    <Field name="employer" invalid={Boolean(error)}>
      <FieldLabel>Employer name</FieldLabel>
      <FieldDescription>As shown on your EA form</FieldDescription>
      <Autocomplete items={employers}>
        <AutocompleteInput id="employer" />
        <AutocompleteContent>
          <AutocompleteEmpty>
            No suggestions. You can still type the full name.
          </AutocompleteEmpty>
          <AutocompleteList>
            {(name: string) => (
              <AutocompleteItem key={name} value={name}>
                {name}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

Controlled, the value is a string. `openOnInputClick` opens the suggestions when the input is clicked, and `showTrigger` adds a chevron button that opens them:

```tsx
import { useState } from "react";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/components/ui/autocomplete";
import { Field, FieldLabel } from "@/components/ui/field";

const topics = [
  "Income tax refund",
  "Tax relief for parents",
  "Form BE",
  "e-Filing",
  "Payment by instalments",
];

export function HelpSearch({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(query);
      }}
    >
      <Field name="q">
        <FieldLabel>Search help topics</FieldLabel>
        <Autocomplete
          items={topics}
          value={query}
          onValueChange={setQuery}
          openOnInputClick
        >
          <AutocompleteInput type="search" showTrigger />
          <AutocompleteContent>
            <AutocompleteEmpty>No matching topics</AutocompleteEmpty>
            <AutocompleteList>
              {(topic: string) => (
                <AutocompleteItem key={topic} value={topic}>
                  {topic}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompleteContent>
        </Autocomplete>
      </Field>
    </form>
  );
}
```

Group suggestions the same way as `Combobox`: `items` as a list of `{ value, items }`, rendered with `AutocompleteGroup`, `AutocompleteGroupLabel` and an `AutocompleteCollection` function child.

## Notes

- It joins the surrounding `Field` for label, hint, error and invalid state. Give `AutocompleteInput` an `id` when an `ErrorSummary` needs to link to it.
- `AutocompleteInput` shows a clear button while there is text (`showClear`, default true); the chevron (`showTrigger`) is off by default. Translate their accessible names with `clearLabel` ("Clear") and `triggerLabel` ("Show suggestions").
- Suggestions have no check mark: picking one only fills the text, and people can edit it afterwards.
- Because any text is accepted, validate the value yourself on submit if it must match a record.
- Keep `AutocompleteEmpty` mounted: it renders nothing while there are matches and announces politely when there are none. Say that free text is still allowed. Use `AutocompleteStatus` for async states such as "Searching…".
- Don't use the placeholder for instructions or examples; put them in `FieldDescription`.
