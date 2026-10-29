---
title: Card
description: Groups related content on its own surface, white on the page or Well for secondary content, with no border or shadow. Has header, content and footer parts.
category: Layout
---

## When to use

- Use `Card` to set apart one self-contained piece of a page: a payment summary, an account overview, one item on a dashboard.
- Use `Panel` for the outcome at the top of a confirmation page, `SummaryList` for label and value pairs, `InsetText` for a passage set apart from the text around it, and `Callout` for a status message.
- Don't use a card for one paragraph or one button; put that straight on the page.

## Usage

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function TaxPayable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Tax payable</CardTitle>
        <CardDescription>Year of assessment 2025</CardDescription>
        <CardAction>
          <Button variant="default-ghost" render={<a href="/returns/2025" />}>
            View return
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-headline text-txt-black-900 font-semibold tabular-nums">
          RM 2,481.50
        </p>
        <p className="text-txt-black-700">
          Pay by 30 April 2026 to avoid a penalty.
        </p>
      </CardContent>
      <CardFooter>
        <Button render={<a href="/pay" />}>Pay now</Button>
      </CardFooter>
    </Card>
  );
}
```

`tone="well"` puts secondary content on the Well tone, for example a help box beside a form:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";

export function HelpCard() {
  return (
    <Card tone="well">
      <CardHeader>
        <CardTitle as="h2">Need help?</CardTitle>
      </CardHeader>
      <CardContent>
        Call the LHDN contact centre on 03-8911 1000, Monday to Friday, 8.30am
        to 5.30pm, or <Link href="/help">read the filing guide</Link>.
      </CardContent>
    </Card>
  );
}
```

## Notes

- Cards have no border and no shadow. On a Paper page use the default `sheet` tone; inside a white panel use `tone="well"`. If a card seems to need an edge, the tones are too close.
- Never put a card inside a card.
- `CardTitle` renders an `h3` by default; set `as` (`h2`, `h3`, `h4` or `div`) to fit the page's heading order.
- `CardAction` sits in the top-right of the header for one quiet action, such as a ghost `Button` or a `Menu`. The main action goes in `CardFooter`, which is separated by spacing, not a divider.
- Padding and the gaps between parts follow the density (24px comfortable, 16px compact).
