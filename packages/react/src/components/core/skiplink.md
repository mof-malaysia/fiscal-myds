---
title: Skiplink
description: A "Skip to main content" link that stays hidden until it gets keyboard focus. Put it first on every page so keyboard users can jump past the masthead and navigation.
category: Government chrome
---

## When to use

- Add one `Skiplink` to every page, as the first focusable element, before the `Masthead`.
- Point it at the page's `<main>` element. Every page has one.

## Usage

```tsx
import type { ReactNode } from "react";
import { Skiplink } from "@/components/ui/skiplink";

export function PageFrame({
  masthead,
  children,
}: {
  masthead: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Skiplink href="#main">Skip to main content</Skiplink>
      {masthead}
      <main id="main" tabIndex={-1} className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

## Notes

- `href` is required and must match the target's `id` (`href="#main"` with `<main id="main">`).
- `tabIndex={-1}` on the target lets focus move to it in every browser, so the next Tab continues from the main content.
- The link is visually hidden until focused, then appears near the top left as a button-styled link. It is absolutely positioned, so it shows against the nearest positioned ancestor (the page wrapper above has `relative`).
- Pass the text as children, in the page's language: "Skip to main content" or "Langkau ke kandungan utama".
