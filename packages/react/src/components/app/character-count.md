---
title: Character Count
description: A TextArea with a live limit ("You have 12 characters remaining"). Over the limit the field becomes invalid, but text is never cut off.
category: Forms and inputs
---

## When to use

- Use `CharacterCount` instead of `TextArea` whenever long text has a limit: an appeal reason, a project summary, a complaint.
- Use a plain `TextArea` when there is no limit, and `Input` for short text.
- Don't use the native `maxLength`: it silently cuts off pasted text. `CharacterCount` lets people go over and tells them by how much.

## Usage

Put it in a `Field` in place of the `TextArea`. Add a `FieldError` with no children to show the over-limit message.

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { CharacterCount } from "@/components/ui/character-count";

export function AppealReason() {
  return (
    <Field name="reason">
      <FieldLabel>Why are you appealing this decision?</FieldLabel>
      <FieldDescription>
        Do not include bank account or card details.
      </FieldDescription>
      <CharacterCount id="reason" limit={500} />
      <FieldError />
    </Field>
  );
}
```

Count words instead, with your own messages (here in Bahasa Melayu), controlled:

```tsx
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CharacterCount } from "@/components/ui/character-count";

export function RingkasanProjek() {
  const [summary, setSummary] = useState("");
  return (
    <Field name="summary">
      <FieldLabel>Ringkasan projek</FieldLabel>
      <CharacterCount
        limit={150}
        countBy="words"
        value={summary}
        onValueChange={setSummary}
        formatMessage={({ remaining }) =>
          remaining >= 0
            ? `Anda ada ${remaining} patah perkataan lagi`
            : `Anda melebihi had sebanyak ${-remaining} patah perkataan`
        }
        overLimitMessage={({ limit }) =>
          `Masukkan ${limit} patah perkataan atau kurang`
        }
      />
      <FieldError />
    </Field>
  );
}
```

## Notes

- The count joins the field's description, so screen readers hear it when the text area is focused. While typing, it is announced politely once typing pauses for `announceDelay` (default 1000 ms).
- The message turns to Warning when the remaining count reaches `warningThreshold` (default 10% of `limit`) and to Danger past the limit.
- Over the limit, the text area's validity is set to `overLimitMessage` (default "Enter 500 characters or fewer"). `Field`, `Form` and native form submission all block until the text is shortened, and an empty `FieldError` shows that message.
- Characters are counted as code points, so an emoji counts as one.
- Translate the text with `formatMessage` (the live count) and `overLimitMessage` (the error). Both receive `count`, `limit`, `remaining` (negative over the limit) and `countBy`.
- Use `value` with `onValueChange` (a string) to control it, or `defaultValue`. The native `onChange` still fires.
- `className` goes to the text area; `wrapperClassName` to the wrapper around the text area and message. Other `TextArea` props (`id`, `rows`, `name`) pass through.
