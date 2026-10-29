---
title: Backlink
description: A "Back" link with an arrow that takes the user to the previous step of a multi-page flow. Place it at the top of the page, above the heading.
category: Navigation
---

## When to use

- Use `Backlink` on each step of a transaction (apply, declare, pay) so people can go back to the previous question without losing their place.
- Use `Breadcrumb` to show where a page sits in a site's hierarchy, and `Link` for links inside text.
- Don't add a `Backlink` on the first page of a flow, or on a confirmation page after submitting.

## Usage

With no children it reads "Back":

```tsx
import { Backlink } from "@/components/ui/backlink";

export function DependantsStepHeader() {
  return (
    <div className="gap-stack-md flex flex-col">
      <Backlink href="/apply/income" />
      <h1 className="text-headline text-txt-black-900 font-semibold">
        Do you have any dependants?
      </h1>
    </div>
  );
}
```

Give it context where it helps, and use `render` for your router's link component:

```tsx
import type { ComponentProps } from "react";
import { Backlink } from "@/components/ui/backlink";

function RouterLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}

export function BackToPayments() {
  return (
    <Backlink render={<RouterLink href="/payments" />}>
      Back to payments
    </Backlink>
  );
}
```

## Notes

- It renders an `<a>`, so it needs an `href` (or a link component through `render`). Link to the real previous step rather than calling `history.back()`, so it works after a refresh or a validation error.
- The arrow is decorative and hidden from screen readers; the text is the accessible name.
- To translate it, pass the text as children (`<Backlink href="/apply">Kembali</Backlink>`).
- It sits above the page's `h1`, separate from the form's buttons. Don't also put a "Back" button next to "Continue".
