---
title: Feature Grid
description: A section that introduces what a service offers: a heading and intro, then a grid of features, each with an icon, title, text and optional link.
---

## When to use

- Use `FeatureGrid` on an agency or landing page to list what a service does or the ways it helps, usually three to six items, straight after the `Hero` or `LogoCloud`.
- Use `TaskList` or plain links for the steps of a process, `StatsBand` for figures, and `Carousel` only when the items are too many to show at once.
- Use `Card` for a single panel of content inside a service screen.

## Usage

```tsx
import { FeatureGrid } from "@/components/blocks/feature-grid";
import { BellIcon } from "@/components/ui/icons/bell";
import { CheckShieldIcon } from "@/components/ui/icons/check-shield";
import { DocumentIcon } from "@/components/ui/icons/document";
import { MoneyIcon } from "@/components/ui/icons/money";

export function MyBayarFeatures() {
  return (
    <FeatureGrid
      id="features"
      title="Everything in one account"
      description="One MyDigital ID for every Ministry of Finance payment, from a summons to a supplier fee."
      surface="sheet"
      columns={2}
      features={[
        {
          icon: <MoneyIcon />,
          title: "Pay online",
          description:
            "FPX, debit and credit cards, and e-wallets. No queue, no cheque.",
          href: "/pay",
        },
        {
          icon: <DocumentIcon />,
          title: "Official receipts",
          description:
            "Every payment gets a receipt you can download, print or share.",
          href: "/receipts",
          linkLabel: "Get a receipt",
        },
        {
          icon: <BellIcon />,
          title: "Due-date reminders",
          description: "We remind you by email or SMS before a payment is due.",
        },
        {
          icon: <CheckShieldIcon />,
          title: "Secure by default",
          description:
            "Sign in with MyDigital ID. Your data stays in Malaysia.",
        },
      ]}
    />
  );
}
```

## Notes

- `columns` is `3` (default) or `2` on desktop; the grid is one column on mobile and two from `md`.
- `surface="sheet"` puts each feature on a Sheet panel (`bg-bg-white`, no border), which reads well on the Paper background. The default `"none"` leaves features on the page.
- Features with an `href` get a link under the text. Its text is the feature's `linkLabel`, then the grid's `linkLabel`, then "Learn more". When the feature's `title` is a string, screen readers also hear it after the link text ("Learn more: Pay online"), so a repeated "Learn more" still makes sense out of context.
- Icons sit in a blue-wash circle and are decorative. Pass the icon component only, without sizing classes.
- Feature titles are `h3`s under the section's `h2`, so pass a `title` to the grid whenever it has features.
- `children` render under the grid, for a "See all services" link.
