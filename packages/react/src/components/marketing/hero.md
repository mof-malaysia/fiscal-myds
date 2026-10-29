---
title: Hero
description: The opening section of an agency or landing page, with the page's only h1, supporting text, up to two actions and optional media beside the text.
---

## When to use

- Use `Hero` as the first section in `<main>` on an agency or landing page, after the `Masthead` and `Navbar`. Follow it with blocks such as `LogoCloud`, `FeatureGrid`, `StatsBand`, `Faq` and `CtaBand`.
- Use `PageHeader` with `PageHeaderTitle` for the title of a service or officer screen, and `SectionHeading` for headings further down a landing page.
- Use `CtaBand` for the closing call to action at the end of the page.

## Usage

Actions take `{ label, href }`, which renders a large `Button` link: the primary one filled blue, the secondary one tonal (`default-outline`):

```tsx
import { Hero } from "@/components/blocks/hero";

export function MyBayarHero() {
  return (
    <Hero
      eyebrow="New: instalments for JPJ summonses"
      title="Pay your government bills in one place"
      description="Settle fees, fines and assessments from more than 30 agencies with one MyDigital ID. Every payment gets an official receipt."
      primaryAction={{ label: "Start a payment", href: "/pay" }}
      secondaryAction={{ label: "How it works", href: "#features" }}
      footnote="Takes about three minutes. Keep your bill number handy."
      media={
        <img
          src="/images/mybayar-preview.png"
          alt=""
          className="h-auto w-full"
        />
      }
    />
  );
}
```

An action can also be any node, such as your own `Button`. Content in `children` renders under the actions:

```tsx
import { Hero } from "@/components/blocks/hero";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

export function BudgetHero({ onDownload }: { onDownload: () => void }) {
  return (
    <Hero
      title="Budget 2027"
      description="What the budget means for households, workers and small businesses, in plain language."
      primaryAction={{
        label: "Read the summary",
        href: "/budget-2027/summary",
      }}
      secondaryAction={
        <Button
          type="button"
          variant="default-outline"
          size="large"
          onClick={onDownload}
        >
          Download the speech (PDF, 2 MB)
        </Button>
      }
    >
      <p className="text-content text-txt-black-700">
        Looking for an earlier year?{" "}
        <Link href="/budget/archive" primary underline="always">
          See previous budgets
        </Link>
      </p>
    </Hero>
  );
}
```

## Notes

- `title` is the page's only `h1`; the section is labelled by it. Don't add another `h1` to the page.
- A string `eyebrow` renders a primary `Tag`. Keep it to a few words; pass a node for anything else.
- Without `media` the text column is capped at 760px and left aligned. With `media`, text and media sit side by side from the `lg` breakpoint and stack below it, media last. Give decorative images `alt=""`.
- One filled blue button: the primary action. If you pass your own node as `secondaryAction`, make it `default-outline` or a ghost variant, never `primary-fill`.
- The background is Paper (`bg-bg-gray-50`) with no gradient. Don't add a gradient, a dark background or a full-bleed photo behind the text.
- Put the reassurance a nervous user needs (how long it takes, what to have ready) in `footnote`.
