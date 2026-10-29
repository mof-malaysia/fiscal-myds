---
title: Work Queue
description: An officer's list of cases to work through. Search, status and assignee filters, a selectable table, bulk actions, paging and j/k keyboard navigation.
---

## When to use

- Use `WorkQueue` for an officer's queue of cases or applications to review, inside `DeskShell` or `AppShell`. Open a case into a page or a `SplitPane` with its details, `ActivityTimeline` and `DecisionPanel`.
- Use `DataTable` for lists that need sortable columns, pinned columns or nested rows but no queue workflow.
- Use `ApplicationList` for a citizen's own applications.

## Usage

The app owns the data: `items` are the cases on the current page, and every change (search, filters, selection, page) comes back through a callback for you to query again. `getId` names each case; mark one column `primary` and its cell becomes the button that calls `onOpen`.

```tsx
import { useState } from "react";
import {
  WorkQueue,
  type WorkQueueAssignee,
  type WorkQueueColumn,
} from "@/components/blocks/work-queue";
import { Tag } from "@/components/ui/tag";

type Case = {
  id: string;
  ref: string;
  applicant: string;
  relief: string;
  amount: number;
  status: "pending" | "in-review" | "returned";
};

const statusTag = {
  pending: <Tag variant="warning">Pending</Tag>,
  "in-review": <Tag variant="primary">In review</Tag>,
  returned: <Tag variant="default">Returned</Tag>,
};

const columns: WorkQueueColumn<Case>[] = [
  { id: "ref", header: "Reference", cell: (c) => c.ref, primary: true },
  { id: "applicant", header: "Applicant", cell: (c) => c.applicant },
  { id: "relief", header: "Relief", cell: (c) => c.relief },
  {
    id: "amount",
    header: "Amount (RM)",
    cell: (c) => c.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 }),
    className: "text-right tabular-nums",
  },
  { id: "status", header: "Status", cell: (c) => statusTag[c.status] },
];

const statuses = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-review", label: "In review" },
  { value: "returned", label: "Returned" },
];

export function ReliefQueue({
  query,
  openCase,
  assignToMe,
  changeStatus,
}: {
  query: (filters: {
    search: string;
    status: string;
    assignee: WorkQueueAssignee;
    page: number;
  }) => { items: Case[]; total: number; loading: boolean };
  openCase: (id: string) => void;
  assignToMe: (ids: string[]) => void;
  changeStatus: (ids: string[], status: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [assignee, setAssignee] = useState<WorkQueueAssignee>("mine");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const { items, total, loading } = query({ search, status, assignee, page });

  const resetPaging = () => {
    setPage(1);
    setSelected([]);
  };

  return (
    <WorkQueue
      items={items}
      getId={(c) => c.id}
      columns={columns}
      loading={loading}
      search={search}
      onSearchChange={(value) => {
        setSearch(value);
        resetPaging();
      }}
      statuses={statuses}
      status={status}
      onStatusChange={(value) => {
        setStatus(value);
        resetPaging();
      }}
      assignee={assignee}
      onAssigneeChange={(value) => {
        setAssignee(value);
        resetPaging();
      }}
      filtered={search !== "" || status !== "all" || assignee !== "all"}
      selected={selected}
      onSelectedChange={setSelected}
      onAssign={(ids) => {
        assignToMe(ids);
        setSelected([]);
      }}
      onChangeStatus={(ids, next) => {
        changeStatus(ids, next);
        setSelected([]);
      }}
      onOpen={(c) => openCase(c.id)}
      page={page}
      pageSize={25}
      total={total}
      onPageChange={setPage}
    />
  );
}
```

A read-only preview on a dashboard: no filters, selection or paging, and Bahasa Melayu labels:

```tsx
import {
  WorkQueue,
  type WorkQueueColumn,
} from "@/components/blocks/work-queue";

type Kes = { id: string; ref: string; applicant: string };

const columns: WorkQueueColumn<Kes>[] = [
  { id: "ref", header: "Rujukan", cell: (c) => c.ref, primary: true },
  { id: "applicant", header: "Pemohon", cell: (c) => c.applicant },
];

export function KesTerkini({
  items,
  onOpen,
}: {
  items: Kes[];
  onOpen: (kes: Kes) => void;
}) {
  return (
    <WorkQueue
      items={items}
      getId={(c) => c.id}
      columns={columns}
      selectable={false}
      keyboard={false}
      onOpen={onOpen}
      labels={{
        table: "Kes terkini",
        empty: "Tiada kes dalam baris gilir ini.",
      }}
    />
  );
}
```

## Notes

- Each filter shows only with its callback: search with `onSearchChange`, status with `statuses` and `onStatusChange`, the Mine/Unassigned/All toggle with `onAssigneeChange`. Status `"all"` is left out of the "Change status" menu unless you pass `statusTargets`.
- Set `filtered` when a filter or search is applied, so the empty message suggests clearing them. `emptyState` replaces the message.
- The bulk-action bar appears once rows are selected. "Assign to me", "Change status" and "Export" each show only with `onAssign`, `onChangeStatus` or `onExport`. The block doesn't clear the selection after an action; do it yourself, as above.
- Selection is by id and survives paging; "select all" selects the cases on the current page. Control it with `selected` to clear it when filters change.
- Paging shows with `onPageChange` and `total > 0`. `page` is one-based, and `total` is the count across all pages.
- Inside a `ShortcutProvider` (or `DeskShell`) the queue binds `j`/`k` to move the highlight, Enter to open it, `x` to select it and `/` to jump to search (Escape leaves the search field). Without a provider, or with `keyboard={false}`, it works the same minus the shortcuts.
- Every control has an English accessible name ("Select all cases on this page", "Select {name}", "Previous page"); translate them with `labels`. Placeholders such as `{count}`, `{from}`, `{to}` and `{total}` are filled in.
- Use compact density: `DeskShell` sets it, otherwise put `data-density="compact"` on a container.
- The installed file is yours: edit it when the props don't cover what you need, such as sortable columns.
