---
title: Scroll Area
description: A fixed-size region with native scrolling and a thin scrollbar that shows only on hover or while scrolling. Use it for long lists inside panels, sidebars and dialogs.
category: Layout
---

## When to use

- Use `ScrollArea` when part of a layout has a fixed height and its content may be longer: a list of notifications in a panel, a sidebar's navigation, terms and conditions inside a dialog.
- Let the page itself scroll normally; don't wrap whole pages or main content in a `ScrollArea`.
- `DataTable` and `SplitPane` handle their own scrolling, so you don't need to wrap them.

## Usage

Give the `ScrollArea` a height (or max height) so it has something to scroll:

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";

type Payment = { id: string; date: string; amount: string };

export function RecentPayments({ payments }: { payments: Payment[] }) {
  return (
    <ScrollArea className="h-72 w-full" viewportClassName="pr-3">
      <ul className="gap-stack-sm flex flex-col">
        {payments.map((payment) => (
          <li
            key={payment.id}
            className="text-content flex justify-between gap-4"
          >
            <span className="text-txt-black-700">{payment.date}</span>
            <span className="text-txt-black-900 tabular-nums">
              RM {payment.amount}
            </span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
```

`scrollbars` picks which scrollbars to render: `both` (default), `vertical` or `horizontal`. A row of items that scrolls sideways:

```tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag } from "@/components/ui/tag";

export function ReliefCategories({ categories }: { categories: string[] }) {
  return (
    <ScrollArea scrollbars="horizontal" className="w-full">
      <div className="flex w-max gap-2 pb-3">
        {categories.map((category) => (
          <Tag key={category}>{category}</Tag>
        ))}
      </div>
    </ScrollArea>
  );
}
```

To label the region for screen readers, or to choose the parts yourself, compose `ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollBar` and `ScrollAreaCorner`:

```tsx
import type { ReactNode } from "react";
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollBar,
} from "@/components/ui/scroll-area";

export function TermsAndConditions({ children }: { children: ReactNode }) {
  return (
    <ScrollAreaRoot className="h-80 w-full">
      <ScrollAreaViewport aria-label="Terms and conditions">
        <div className="text-content text-txt-black-700 pr-3">{children}</div>
      </ScrollAreaViewport>
      <ScrollBar orientation="vertical" />
    </ScrollAreaRoot>
  );
}
```

## Notes

- Scrolling stays native: wheel, touch and keyboard all work. The viewport is focusable while its content overflows, so keyboard users can scroll it with the arrow keys, and it shows a focus outline.
- `className` sizes the root; `viewportClassName` styles the scrolling viewport (for example padding so text doesn't sit under the scrollbar).
- Each scrollbar only shows when the content overflows in that direction, and only while the pointer is over it or the content is scrolling.
- With horizontal scrolling, make the content wider than the area (for example `w-max`), or nothing will overflow.
