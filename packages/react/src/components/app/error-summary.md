---
title: Error Summary
description: The "There is a problem" box at the top of a form after a failed submit. Lists each error as a link that focuses the field, and takes focus itself.
category: Feedback and status
---

## When to use

- Use `ErrorSummary` at the top of every form, above the first field, after a submit fails validation. Show it together with each field's own `FieldError`, never instead of it.
- Use `Callout` for problems that aren't about a field: a service is down, a payment failed.

## Usage

Pass `errors` as `{ id, message }` pairs. Each `id` is the `id` of the control to focus, and each message is the same text as that field's `FieldError`. It renders nothing while `errors` is empty.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/ui/error-summary";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Errors = Partial<Record<"ic" | "email", string>>;

export function ApplicantForm({ onContinue }: { onContinue: () => void }) {
  const [errors, setErrors] = useState<Errors>({});
  const [attempt, setAttempt] = useState(0);

  const list = Object.entries(errors).map(([id, message]) => ({
    id,
    message,
  }));

  return (
    <form
      noValidate
      className="gap-stack-lg flex max-w-xl flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const next: Errors = {};
        if (!/^\d{6}-\d{2}-\d{4}$/.test(String(data.get("ic") ?? "")))
          next.ic = "Enter your IC number in the format 900101-14-5678";
        if (!String(data.get("email") ?? "").includes("@"))
          next.email = "Enter an email address in the format name@example.com";
        setErrors(next);
        setAttempt((n) => n + 1);
        if (Object.keys(next).length === 0) onContinue();
      }}
    >
      {/* A new key on each failed submit moves focus back to the summary */}
      <ErrorSummary key={attempt} errors={list} />

      <Field name="ic" invalid={Boolean(errors.ic)}>
        <FieldLabel>IC number</FieldLabel>
        <FieldDescription>For example, 900101-14-5678</FieldDescription>
        <Input id="ic" name="ic" inputMode="numeric" />
        <FieldError>{errors.ic}</FieldError>
      </Field>

      <Field name="email" invalid={Boolean(errors.email)}>
        <FieldLabel>Email address</FieldLabel>
        <Input id="email" name="email" type="email" autoComplete="email" />
        <FieldError>{errors.email}</FieldError>
      </Field>

      <Button type="submit" className="w-fit">
        Continue
      </Button>
    </form>
  );
}
```

Compose the parts to translate the title, add a description or change the heading level:

```tsx
import {
  ErrorSummary,
  ErrorSummaryDescription,
  ErrorSummaryItem,
  ErrorSummaryList,
  ErrorSummaryTitle,
} from "@/components/ui/error-summary";

export function RingkasanRalat() {
  return (
    <ErrorSummary>
      <ErrorSummaryTitle as="h2">Ada masalah</ErrorSummaryTitle>
      <ErrorSummaryDescription>
        Betulkan perkara berikut sebelum anda meneruskan.
      </ErrorSummaryDescription>
      <ErrorSummaryList>
        <ErrorSummaryItem targetId="ic">
          Masukkan nombor MyKad anda dalam format 900101-14-5678
        </ErrorSummaryItem>
        <ErrorSummaryItem targetId="income">
          Masukkan jumlah pendapatan tahunan anda
        </ErrorSummaryItem>
      </ErrorSummaryList>
    </ErrorSummary>
  );
}
```

## Notes

- It moves focus to itself when it first mounts (`autoFocus`, default true) and has `role="alert"`, so keyboard and screen reader users hear the problem straight away. It only takes focus on mount: give it a new `key` on every failed submit, as above, so focus returns after a second failed attempt.
- Each link scrolls the field into view and focuses the control with the matching `id`, or the first focusable control inside the element with that id (give a `Fieldset` an `id` for a radio or checkbox group). If nothing on the page has that id, it falls back to a normal `#id` jump.
- Controls must have an `id` for this to work: `Input id="ic"`, `ComboboxInput id="state"`, `NumberField inputProps={{ id: "income" }}`.
- The title defaults to "There is a problem" and renders an `h2`; `title` changes the text. With `children`, `title` and `errors` are ignored and you compose `ErrorSummaryTitle`, `ErrorSummaryDescription`, `ErrorSummaryList` and `ErrorSummaryItem` yourself. `ErrorSummaryTitle`'s `as` takes `h2`, `h3`, `h4` or `p`.
- With `Form`, list the same errors you pass to `Form`'s `errors`, keyed by field `name`, and give each control an `id` equal to its `name` (see the forms guide).
- Messages say what to do: "Enter your IC number in the format 900101-14-5678", not "IC number is invalid".
