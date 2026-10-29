---
title: Separator
description: A single hairline between two groups of content, horizontal or vertical. Lines must earn their place; reach for spacing and tone first.
category: Layout
---

## When to use

- Use `Separator` for the few places a line helps: between groups in a toolbar, between items of metadata on one line, under a top bar.
- Don't use it between cards, inside cards, between form sections or between every list item. Separate those with spacing (`gap-stack-lg`) or a tonal surface (`bg-bg-washed`) instead.
- Menus and select lists have their own separators: `MenuSeparator`, `SelectSeparator`.

## Usage

A vertical separator between items of metadata. Give the row a height so the line has something to stretch to:

```tsx
import { Separator } from "@/components/ui/separator";

export function ApplicationMeta() {
  return (
    <div className="text-content text-txt-black-700 flex h-5 items-center gap-3">
      <span>Reference LHDN-2025-004821</span>
      <Separator orientation="vertical" decorative />
      <span>Updated 3 May 2026</span>
    </div>
  );
}
```

A horizontal separator between two groups that spacing alone doesn't split clearly:

```tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DraftActions() {
  return (
    <div className="gap-stack-md flex flex-col">
      <div className="flex flex-wrap gap-3">
        <Button variant="default-outline">Save as draft</Button>
        <Button variant="default-outline">Download PDF</Button>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-3">
        <Button variant="danger-outline">Delete draft…</Button>
      </div>
    </div>
  );
}
```

## Notes

- The separator is announced as a separator by screen readers. Pass `decorative` when the line only repeats a split that is already obvious, so they skip it.
- `orientation` is `horizontal` (default, full width) or `vertical` (stretches to the row's height).
- It is always the Hairline colour, 1px. Don't thicken or recolour it.
