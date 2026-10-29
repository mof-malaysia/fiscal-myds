---
title: Link
description: A styled anchor for links in text and lists, with options for colour, underline and opening in a new tab. Pass render to use your router's link.
category: Navigation
---

## When to use

- Use `Link` for links inside text and in lists of links: guidance pages, contact details, related services.
- Use a `Button` rendered as a link (`<Button render={<a href="/apply" />}>`) for a call to action such as "Start now", and `Backlink` for going back a step in a flow.
- The navigation parts have their own links: `BreadcrumbLink`, `MenuLinkItem`, `FooterLink` and `PhaseBannerLink`.

## Usage

| Prop        | Values                              | Effect                                                                     |
| ----------- | ----------------------------------- | -------------------------------------------------------------------------- |
| `primary`   | `false` (default), `true`           | `true` colours the link FTDS Blue; `false` inherits the surrounding colour |
| `underline` | `always` (default), `hover`, `none` | When the underline shows; it thickens on hover                             |
| `newTab`    | `false` (default), `true`           | Opens in a new tab with `rel="noopener noreferrer"`                        |

```tsx
import { Link } from "@/components/ui/link";

export function ReliefGuidance() {
  return (
    <p className="text-content text-txt-black-900 max-w-prose">
      You can claim up to RM 2,500.00 for lifestyle purchases. Read{" "}
      <Link primary href="/guidance/lifestyle-relief">
        what counts as a lifestyle purchase
      </Link>{" "}
      before you claim.
    </p>
  );
}
```

A link to another site, and a router link through `render`:

```tsx
import type { ComponentProps } from "react";
import { Link } from "@/components/ui/link";

function RouterLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}

export function UsefulLinks() {
  return (
    <ul className="gap-stack-sm flex flex-col">
      <li>
        <Link primary newTab href="https://www.hasil.gov.my">
          Inland Revenue Board of Malaysia (opens in new tab)
        </Link>
      </li>
      <li>
        <Link primary render={<RouterLink href="/payments/history" />}>
          Your payment history
        </Link>
      </li>
    </ul>
  );
}
```

## Notes

- Set `primary` for links in body text; the default (`primary={false}`) takes the colour of the text around it, which suits links on coloured surfaces and in quiet lists.
- Keep `underline="always"` in body text so links don't rely on colour alone. Use `hover` or `none` only where the context makes it obvious that it is a link (navigation lists).
- `newTab` doesn't add any text. Say "(opens in new tab)" in the link text, and only open new tabs when leaving the service would lose the user's progress.
- Write link text that makes sense on its own ("what counts as a lifestyle purchase"), never "click here".
- Links go to pages; for actions on the same page, use a `Button`.
