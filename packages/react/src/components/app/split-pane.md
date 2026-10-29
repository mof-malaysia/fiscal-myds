---
title: Split Pane
description: A list beside its detail, with a divider the officer can drag or move with arrow keys. Remembers the width per browser. Use it inside AppShell or DeskShell.
category: Layout
---

## When to use

- Use `SplitPane` for list and detail screens in officer tools: a queue of cases on the left, the selected case on the right.
- Put it inside `AppShellMain` or `DeskPage`; it fills the height it is given and each pane scrolls on its own.
- For a detail view that opens over the page instead, use `Drawer`. For a full list with sorting and selection, put a `DataTable` or `WorkQueue` on its own page.

## Usage

Pass the two panes as `start` (the list, with an adjustable width) and `end` (the detail, which takes the rest). Name both panes so screen reader users can find them.

```tsx
import { useState } from "react";
import { SplitPane } from "@/components/ui/split-pane";
import { DeskPage } from "@/components/ui/desk-shell";
import { Tag } from "@/components/ui/tag";

type Case = { ref: string; applicant: string; amount: string };

export function CaseReview({ cases }: { cases: Case[] }) {
  const [selected, setSelected] = useState(cases[0]);

  return (
    <DeskPage className="p-0">
      <SplitPane
        storageKey="case-review.split"
        defaultWidth={320}
        startLabel="Cases"
        endLabel="Case detail"
        start={
          <ul className="m-0 list-none p-0" aria-label="Cases">
            {cases.map((item) => (
              <li key={item.ref}>
                <button
                  type="button"
                  aria-current={item.ref === selected?.ref || undefined}
                  onClick={() => setSelected(item)}
                  className="border-otl-gray-200 hover:bg-bg-washed aria-[current]:bg-bg-primary-50 focus-ring-inset flex w-full flex-col items-start border-b px-3 py-2 text-left"
                >
                  <span className="text-txt-black-700 text-label-compact tabular-nums">
                    {item.ref}
                  </span>
                  <span className="text-txt-black-900 text-content">
                    {item.applicant}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        }
        end={
          selected ? (
            <div className="p-surface gap-stack-sm flex flex-col">
              <h2 className="text-title text-txt-black-900 font-semibold">
                {selected.ref}
              </h2>
              <p className="text-content text-txt-black-700">
                {selected.applicant} claims RM {selected.amount} in lifestyle
                relief.
              </p>
              <Tag variant="warning">Pending review</Tag>
            </div>
          ) : null
        }
      />
    </DeskPage>
  );
}
```

## Notes

- Inside `DeskPage` or `AppShellMain`, pass `className="p-0"` to the page so the panes reach its edges, and add padding inside the panes instead.
- The divider is a focusable `separator`: Left and Right arrows move it by 16px (64px with Shift), Home and End jump to `minWidth` and `maxWidth`, and a double-click resets it to `defaultWidth`.
- Widths are in pixels: `defaultWidth` 380, `minWidth` 240 and `maxWidth` 760 by default.
- `storageKey` remembers the width in localStorage. It is a per-browser convenience; the stored width is restored after the first render, so the default shows briefly.
- The panes stay side by side at every width. On narrow screens, show the list and the detail one at a time instead of using `SplitPane`.
- Translate the divider's accessible name with `handleLabel` (default "Resize panes"). `startLabel` and `endLabel` have no default; set them.
