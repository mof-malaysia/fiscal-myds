---
title: Phase Banner
description: A slim bar under the masthead that says a service is in Alpha or Beta (or under maintenance) and asks for feedback.
category: Government chrome
---

## When to use

- Use `PhaseBanner` while a service is new (Alpha or Beta) or temporarily limited (Maintenance). Place it directly under the `Masthead`, or under the site's top bar.
- Remove it once the service is live and stable.
- Use `AnnounceBar` for a marketing announcement on an agency site, and `Callout` for a message about one page or task.

## Usage

`phase` is the text in the tag (default "Beta"). The children are the message; put the feedback link in a `PhaseBannerLink`:

```tsx
import { PhaseBanner, PhaseBannerLink } from "@/components/ui/phase-banner";

export function BetaBanner() {
  return (
    <PhaseBanner phase="Beta">
      This is a new service. Your{" "}
      <PhaseBannerLink href="/feedback">feedback</PhaseBannerLink> will help us
      improve it.
    </PhaseBanner>
  );
}
```

`tagVariant` colours the tag: `primary` (default) for Alpha and Beta, `warning` for Maintenance, `default` for a retired service:

```tsx
import { PhaseBanner, PhaseBannerLink } from "@/components/ui/phase-banner";

export function MaintenanceBanner() {
  return (
    <PhaseBanner phase="Maintenance" tagVariant="warning">
      Online payment is unavailable from 10pm to 2am on 1 November 2026. You can
      still{" "}
      <PhaseBannerLink href="/payments/other-ways">
        pay at a counter
      </PhaseBannerLink>
      .
    </PhaseBanner>
  );
}
```

## Notes

- The children are wrapped in a `<p>`, so pass inline content only (text and links, no blocks or lists).
- It scrolls away with the page. Don't make it sticky.
- `className` styles the full-width bar; `containerClassName` styles the inner row, which is centred at 1280px to line up with the masthead and navigation.
- `PhaseBannerLink` is a blue, always-underlined `Link`; pass `render` to use your router's link.
- Write the tag in the service's language ("Beta" works in both English and Bahasa Melayu).
