---
title: Skeleton
description: A shimmering placeholder in the shape of content that is still loading, so the layout doesn't jump when the data arrives.
category: Feedback and status
---

## When to use

- Use `Skeleton` while a known layout loads: a profile header, a summary card, a list of notifications.
- Use `DataTable`'s `loading` prop for tables; it draws its own placeholder rows.
- Use `Spinner` for a short wait on one action (a button that is submitting), and `Progress` when you can show how far along a long task is.

## Usage

Shape each skeleton with `className` (height, width, radius) to match the content it stands in for. Announce loading once for the region, not for each block:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function OfficerCardLoading() {
  return (
    <div
      aria-busy="true"
      className="bg-bg-white p-surface flex items-center gap-3 rounded-lg"
    >
      <span className="sr-only">Loading officer details</span>
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
```

## Notes

- Each skeleton is hidden from screen readers. Put `aria-busy="true"` and visually hidden text ("Loading applications") on the container instead.
- The default block is a full-width, 16px tall line with 8px corners. Pass `rounded-full` for avatars and pills.
- The shimmer stops under reduced motion; the block stays.
- Match the real layout closely, then swap the skeletons for the content in the same place.
