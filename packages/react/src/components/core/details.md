---
title: Details
description: A link-like toggle that reveals a short piece of help, such as "Help with your IC number". Use it for information only some users need.
category: Data display
---

## When to use

- Use `Details` to hide help that most people don't need, so the page stays short: where to find a reference number, what counts as a dependant, what to do if you don't have an EA form.
- Use `Accordion` for several sections of content that open and close (FAQ, long guidance), and `InsetText` for a passage everyone must read.
- Use `Callout` for a status or warning, and `Popover` for help that floats beside a control instead of opening inline.
- Don't hide information that is needed to complete the task.

## Usage

```tsx
import {
  Details,
  DetailsContent,
  DetailsTrigger,
} from "@/components/ui/details";

export function IcNumberHelp() {
  return (
    <Details>
      <DetailsTrigger>I don't have a MyKad</DetailsTrigger>
      <DetailsContent>
        If you are a permanent resident, use the number on your MyPR card. If
        you are not a Malaysian citizen, apply with your passport number
        instead.
      </DetailsContent>
    </Details>
  );
}
```

Placed under a form field, and controlled with `open` and `onOpenChange`:

```tsx
import { useState } from "react";
import {
  Details,
  DetailsContent,
  DetailsTrigger,
} from "@/components/ui/details";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TaxNumberField() {
  const [open, setOpen] = useState(false);

  return (
    <div className="gap-stack-sm flex flex-col">
      <Field name="taxNumber">
        <FieldLabel>Income tax number</FieldLabel>
        <Input autoComplete="off" />
      </Field>
      <Details open={open} onOpenChange={setOpen}>
        <DetailsTrigger>Where to find your income tax number</DetailsTrigger>
        <DetailsContent>
          It starts with IG and is printed on your notice of assessment and on
          any letter from LHDN, for example IG 12345678090.
        </DetailsContent>
      </Details>
    </div>
  );
}
```

## Notes

- `Details` is uncontrolled by default; use `defaultOpen` to start open, or `open` with `onOpenChange` to control it.
- The trigger is a button with the expanded state set for screen readers; it reads like a link, with a chevron that turns when open.
- Write the trigger as the user's question or problem ("I don't have a MyKad"), not "More information".
- The content sits in a Well (`bg-bg-washed`) and is capped at about 70 characters per line. `className` on `DetailsContent` goes to that inner box.
- Keep the content short: a sentence or two, or a short list.
