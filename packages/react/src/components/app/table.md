---
title: Table
description: Plain table parts for a small, static table such as a fee schedule or a breakdown of amounts. No sorting or selection; FTDS styling with a Hairline between rows.
category: Data display
---

## When to use

- Use `Table` for a small table you write out yourself: a fee schedule, a breakdown of relief amounts, a comparison.
- Use `DataTable` for lists of records people sort, select and act on, and `WorkQueue` for an officer's queue with filters, bulk actions and paging.
- Use `SummaryList` for one record's details as label and value pairs.

## Usage

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const reliefs = [
  { item: "Lifestyle", limit: 2500, claimed: 2500 },
  { item: "Medical expenses for parents", limit: 8000, claimed: 3120.5 },
  { item: "Education fees (self)", limit: 7000, claimed: 0 },
];

const rm = (value: number) =>
  value.toLocaleString("en-MY", { minimumFractionDigits: 2 });

export function ReliefBreakdown() {
  const total = reliefs.reduce((sum, row) => sum + row.claimed, 0);
  return (
    <Table>
      <TableCaption>Reliefs claimed for assessment year 2025</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Relief</TableHead>
          <TableHead numeric>Limit (RM)</TableHead>
          <TableHead numeric>Claimed (RM)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reliefs.map((row) => (
          <TableRow key={row.item}>
            <TableCell>{row.item}</TableCell>
            <TableCell numeric>{rm(row.limit)}</TableCell>
            <TableCell numeric>{rm(row.claimed)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell numeric>{rm(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
```

Loading and empty rows, and a help icon beside a header:

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  TableTooltip,
} from "@/components/ui/table";

type Payment = { ref: string; amount: string };

export function RecentPayments({
  payments,
  loading,
}: {
  payments: Payment[];
  loading: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead numeric>
            <span className="inline-flex items-center gap-1">
              Amount (RM)
              <TableTooltip>Includes the late payment penalty.</TableTooltip>
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          [1, 2, 3].map((row) => (
            <TableRow key={row}>
              <TableCell>
                <TableSkeleton />
              </TableCell>
              <TableCell numeric>
                <TableSkeleton className="ml-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : payments.length === 0 ? (
          <TableRow>
            <TableEmpty>No payments in the last 30 days.</TableEmpty>
          </TableRow>
        ) : (
          payments.map((payment) => (
            <TableRow key={payment.ref}>
              <TableCell>{payment.ref}</TableCell>
              <TableCell numeric>{payment.amount}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
```

## Notes

- No outer border or card: put the table straight on the page or panel.
- Set `numeric` on both the `TableHead` and the `TableCell`s of every amount column: it right-aligns in tabular figures.
- `className` and other props go to the `<table>`; `containerClassName` goes to the scrolling wrapper `<div>` (for a height or width limit). The wrapper scrolls sideways when the table is too wide, and `TableHeader` sticks to its top.
- Row height follows the density: 48px comfortable, 40px compact. Rows don't highlight on hover; add `hover:bg-bg-washed` to body rows yourself if they are clickable. `data-selected` on a `TableRow` gives it the Blue Wash.
- `TableEmpty` is a cell: put it inside a `TableRow`. It spans every column and shows "No data available" when it has no children; write a message that says why it is empty.
- `TableTooltip`'s icon button is named "More information"; pass `label` to translate it. In `DataTable`, use `labels.columnHelp`.
- For status, use a wash `Tag` with text in the cell, never colour alone.
