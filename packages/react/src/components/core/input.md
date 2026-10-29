---
title: Input
description: A single-line text field, with optional icons inside it and add-ons (such as "https://") joined to its edges. Always place it in a Field.
category: Forms and inputs
---

## When to use

- Use `Input` for short free text: a name, an IC number, a postcode, an email address, a search term.
- Use `TextArea` (or `CharacterCount` for a limit) for more than one line, `PasswordInput` for passwords, `NumberField` or `CurrencyField` for numbers and amounts, `DateField` or `DatePicker` for dates, and `OTPField` for one-time codes.
- Use `Select` or `Combobox` when the answer comes from a fixed list.

## Usage

Put the input in a `Field` so it gets its label, hint and error. Set the HTML attributes that help people fill it in: `autoComplete`, `inputMode`, `type`.

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function PostcodeField() {
  return (
    <Field name="postcode">
      <FieldLabel>Postcode</FieldLabel>
      <FieldDescription>For example, 62000</FieldDescription>
      <Input
        id="postcode"
        inputMode="numeric"
        autoComplete="postal-code"
        pattern="[0-9]{5}"
        required
        className="max-w-32"
      />
      <FieldError match="valueMissing">Enter your postcode</FieldError>
      <FieldError match="patternMismatch">
        Enter a postcode with 5 digits, like 62000
      </FieldError>
    </Field>
  );
}
```

Icons go inside as children in an `InputIcon` with a `position`. Add-ons join the edges through `prepend` and `append`, each an `InputAddon`:

```tsx
import { Field, FieldLabel } from "@/components/ui/field";
import { Input, InputAddon, InputIcon } from "@/components/ui/input";
import { SearchIcon } from "@/components/ui/icons/search";

export function SearchAndWebsite() {
  return (
    <div className="gap-stack-md flex flex-col">
      <Field name="q">
        <FieldLabel>Search applications</FieldLabel>
        <Input type="search" placeholder="Reference or applicant name">
          <InputIcon position="left">
            <SearchIcon />
          </InputIcon>
        </Input>
      </Field>
      <Field name="website">
        <FieldLabel>Company website</FieldLabel>
        <Input
          type="url"
          autoComplete="url"
          prepend={<InputAddon>https://</InputAddon>}
        />
      </Field>
    </div>
  );
}
```

## Notes

- `className` goes on the outer frame (the stroke and add-ons), so use it for width (`max-w-32`, `w-full`). Size the field to the answer it expects: a postcode field is short.
- `size` is `small` (default), `medium` or `large`. Heights follow the density, so don't set them yourself.
- The stroke turns red when the `Field` is invalid. Never rely on `placeholder` as the label or the hint; it disappears when people type.
- For amounts, use `CurrencyField` rather than an `Input` with an "RM" add-on: it formats ringgit and right-aligns the amount in tabular figures.
- An `InputIcon` is decoration: it isn't clickable and doesn't replace the label. For show or hide password, use `PasswordInput`.
