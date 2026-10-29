---
title: Data Table
description: Sortable, selectable table of records from TanStack Table column definitions, with amount columns, pinned columns, nested rows, loading and empty states. The officer's main list view.
category: Data display
---

## When to use

- Use `DataTable` for lists of records people scan, sort and act on: applications, cases, payments, users.
- Use `Table` for a small static table (a fee schedule, a comparison) with no sorting or selection.
- Use `SummaryList` for one record's details as label and value pairs, and `WorkQueue` for an officer's queue of tasks with filters and bulk actions.

## Usage

Columns are TanStack Table `ColumnDef`s (exported again from this file, so you don't need to import `@tanstack/react-table`). Column `meta` turns on FTDS features: `sortable`, `numeric` (right-aligned tabular figures), `expandable` (truncate with a toggle to show in full) and `tooltip` (help beside the header).

```tsx
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Tag } from "@/components/ui/tag";

type Application = {
  ref: string;
  applicant: string;
  submitted: string;
  amount: number;
  status: "Approved" | "In review" | "Rejected";
};

const statusVariant = {
  Approved: "success",
  "In review": "warning",
  Rejected: "danger",
} as const;

const columns: ColumnDef<Application>[] = [
  { accessorKey: "ref", header: "Reference", meta: { sortable: true } },
  {
    accessorKey: "applicant",
    header: "Applicant",
    meta: { sortable: true, expandable: true },
  },
  { accessorKey: "submitted", header: "Submitted", meta: { sortable: true } },
  {
    accessorKey: "amount",
    header: "Amount (RM)",
    meta: { sortable: true, numeric: true },
    cell: ({ row }) =>
      row.original.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Tag variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Tag>
    ),
  },
];

export function Applications({
  data,
  loading,
}: {
  data: Application[];
  loading: boolean;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyState="No applications match your filters."
    />
  );
}
```

Select rows with checkboxes (or a single row with `mode: "radio"`). `id_by` names the field that identifies a row; `onSelectionChange` receives the selected ids. `pin` keeps columns in view while the rest scroll sideways; it takes column ids (the `accessorKey` or `id`), and the selection column's id is `_checkbox` (`_radio` in radio mode):

```tsx
import { useState } from "react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";

type Payment = { id: string; payer: string; amount: number };

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "payer", header: "Payer" },
  { accessorKey: "amount", header: "Amount (RM)", meta: { numeric: true } },
];

export function Payments({ data }: { data: Payment[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-3">
      <p className="text-content text-txt-black-700">
        {selected.length} selected
      </p>
      <DataTable
        columns={columns}
        data={data}
        selection={{
          id_by: "id",
          mode: "checkbox",
          onSelectionChange: setSelected,
        }}
        pin={{ left: ["_checkbox", "payer"] }}
      />
    </div>
  );
}
```

## Notes

- No outer border or card: put the table straight on the page or panel.
- Show status as a wash `Tag` with text, never colour alone; set every amount column to `numeric`.
- Row actions are ghost buttons or one overflow `Menu`, never a column of outlined buttons.
- Paginate long lists with `Pagination` below the table, or use `WorkQueue`, which includes filtering and paging.
- Header controls and checkboxes have English accessible names; pass `labels` (for example `{ selectAll: "Pilih semua" }`) to translate them.
- `Cell` holds the reserved cells used by nested rows (`Cell.Expand` with the `nest` prop).
