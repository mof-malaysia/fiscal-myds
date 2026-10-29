---
title: CTA Band
description: The closing call to action of a landing page: a title, short text, one primary action and an optional secondary one, on a Well or blue-wash band.
---

## When to use

- Use `CtaBand` once, near the end of an agency or landing page, to repeat the main action after people have read the page.
- Use `Hero` for the opening of the page, and `Callout` for a message inside page content.
- Don't use it inside a service flow; the form's own primary button is the call to action there.

## Usage

```tsx
import { CtaBand } from "@/components/blocks/cta-band";

export function PayCta() {
  return (
    <CtaBand
      tone="primary"
      title="Ready to pay?"
      description="It takes about three minutes. Keep your bill or reference number handy."
      primaryAction={{ label: "Start a payment", href: "/pay" }}
      secondaryAction={{ label: "Contact us", href: "/contact" }}
    />
  );
}
```

## Notes

- `tone` is `"well"` (default, `bg-bg-washed`) or `"primary"` (the blue wash, `bg-bg-primary-50`). The band is never a saturated blue block, so the primary button stays the only filled blue on screen.
- Actions take `{ label, href }` (a large `Button` link) or any node. The primary action is filled blue; the secondary one is a ghost button (blue text on the Well tone, grey on the primary tone).
- `primaryAction` is required. Keep it the same action as the hero's primary action.
- The title is an `h2` that labels the section. Text and actions sit side by side from the `lg` breakpoint and stack below it.
