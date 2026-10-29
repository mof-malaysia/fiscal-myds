---
title: Text Area
description: A multi-line text field for longer answers, such as the reason for an appeal. Place it in a Field; use CharacterCount when the answer has a limit.
category: Forms and inputs
---

## When to use

- Use `TextArea` when the answer may run to more than one line: a description, a reason, a message to an officer.
- Use `CharacterCount` instead when the answer has a character or word limit. It renders the text area for you and adds a live "characters remaining" message.
- Use `Input` for a short single-line answer such as a name or reference number.

## Usage

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { TextArea } from "@/components/ui/textarea";

export function AppealReason() {
  return (
    <Field name="reason">
      <FieldLabel>Why are you appealing against this assessment?</FieldLabel>
      <FieldDescription>
        Include the dates and amounts that you think are wrong.
      </FieldDescription>
      <TextArea id="reason" required rows={6} />
      <FieldError match="valueMissing">
        Enter the reason for your appeal
      </FieldError>
    </Field>
  );
}
```

## Notes

- The text area joins its `Field` like `Input`: label, hint, error and invalid stroke are wired for you.
- `size` is `small`, `medium` (default) or `large`; each sets a minimum height (100, 120 or 150px) and the text size. Set `rows` for a taller box.
- People can't drag to resize it. Size it to the length of answer you expect, so the box itself hints at how much to write.
- Don't use `maxLength` to cap the answer: it silently cuts off pasted text. Use `CharacterCount`, which lets people go over and then asks them to shorten it.
- The export is `TextArea` (capital A), from `@/components/ui/textarea`.
