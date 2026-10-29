---
title: Tag
description: A small wash label for the status or category of an item, such as Paid, In review or Overdue. The words carry the meaning, never colour alone.
category: Data display
---

## When to use

- Use `Tag` to show the status or category of a record: in a table cell, beside a title, on a card.
- Use `Pill` for a tag people can remove (an applied filter, a chosen recipient).
- Use `Callout` for a message about the page, and `ButtonCounter` or `TabsCounter` for a count on a button or tab.

## Usage

```tsx
import { Tag } from "@/components/ui/tag";

type Status = "paid" | "due" | "overdue" | "draft";

const tags = {
  paid: { variant: "success", label: "Paid" },
  due: { variant: "warning", label: "Due in 3 days" },
  overdue: { variant: "danger", label: "Overdue" },
  draft: { variant: "default", label: "Draft" },
} as const;

export function PaymentStatus({ status }: { status: Status }) {
  const tag = tags[status];
  return (
    <Tag variant={tag.variant} dot={status === "due"}>
      {tag.label}
    </Tag>
  );
}
```

| `variant`           | Use for                                              |
| ------------------- | ---------------------------------------------------- |
| `default` (default) | Neutral states and categories: Draft, Closed, Online |
| `primary`           | New or current: Submitted, Your application          |
| `success`           | Finished well: Paid, Approved, Verified              |
| `warning`           | Needs attention soon: Due in 3 days, Incomplete      |
| `danger`            | Failed or overdue: Rejected, Overdue, Payment failed |

`size` follows the density: `small` is the 13px badge for tables and dense lists, `medium` (default) is 14px in comfortable density and 13px in compact, and `large` is 16px for citizen-facing emphasis (14px in compact).

## Notes

- The text must say the status on its own; colour only reinforces it. Write "Overdue", not a red tag with a date.
- `dot` adds a dot in the tag's colour before the label, for extra emphasis on a live state. It is hidden from screen readers.
- An icon placed as a direct child is sized for you.
- Tags are borderless washes. Don't add outlines or solid fills, and don't make a tag clickable; use a `Button` or `Link` for actions.
