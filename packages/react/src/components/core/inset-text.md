---
title: Inset Text
description: Sets a passage apart from the text around it, such as a deadline, a requirement or a quote, on a grey Well with no icon.
category: Data display
---

## When to use

- Use `InsetText` to make one passage stand out from the body text: a deadline ("Submit by 30 April 2026"), a condition, an example, a quote.
- Use `Callout` for a status or warning that needs an icon and colour (success, warning, danger), and `Details` for help that only some users need.
- Use it sparingly: if everything is inset, nothing stands out.

## Usage

```tsx
import { InsetText } from "@/components/ui/inset-text";

export function DeclarationDeadline() {
  return (
    <InsetText>
      You must submit your income tax return by 30 April 2026. After that, a
      penalty of up to RM 2,000.00 may apply.
    </InsetText>
  );
}
```

A quote with its author: render the inset text as a `<figure>`, put the words in a `<blockquote>`, and add `InsetTextAuthor`, which renders a `<figcaption>`:

```tsx
import { InsetText, InsetTextAuthor } from "@/components/ui/inset-text";

export function BudgetQuote() {
  return (
    <InsetText render={<figure />}>
      <blockquote>
        Every ringgit of public money must be spent with care and accounted for.
      </blockquote>
      <InsetTextAuthor>Ministry of Finance Malaysia</InsetTextAuthor>
    </InsetText>
  );
}
```

## Notes

- It is a Well (`bg-bg-washed`) with padding and rounded corners, no border and no side stripe. Don't add a coloured left border; that is not an FTDS pattern.
- Text is capped at about 70 characters per line; children stack with `gap-stack-sm`, so several paragraphs space themselves.
- `render` changes the element (default `<div>`), for example `<aside />` or `<figure />`.
