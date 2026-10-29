---
title: Summary List
description: One record's details as rows of label and value, with an optional action per row such as "Change". Use it for application or case details.
category: Data display
---

## When to use

- Use `SummaryList` to show the details of one record: an application, a taxpayer, a case.
- Use the `CheckAnswers` block for the review page before submitting a service; it has change links, a declaration and the submit button built in, and wraps long answers better on phones.
- Use `DataTable` for many records, and `Stat` for headline figures.

## Usage

`SummaryListBody` is a table; each `SummaryListRow` holds a `SummaryListTerm` (the label, a row header), a `SummaryListDetail` (the value) and, if the row has one, a `SummaryListAction`. `SummaryListAddition` is an optional extra cell, for example a date or amount beside the value.

```tsx
import { Link } from "@/components/ui/link";
import {
  SummaryList,
  SummaryListAction,
  SummaryListBody,
  SummaryListDetail,
  SummaryListHeader,
  SummaryListRow,
  SummaryListTerm,
} from "@/components/ui/summary-list";
import { Tag } from "@/components/ui/tag";

export function ApplicationDetails() {
  return (
    <SummaryList>
      <SummaryListHeader>Application details</SummaryListHeader>
      <SummaryListBody>
        <SummaryListRow>
          <SummaryListTerm>Reference</SummaryListTerm>
          <SummaryListDetail>BKR-2026-004512</SummaryListDetail>
          <SummaryListAction />
        </SummaryListRow>
        <SummaryListRow>
          <SummaryListTerm>Applicant</SummaryListTerm>
          <SummaryListDetail>Nur Aisyah binti Ahmad</SummaryListDetail>
          <SummaryListAction>
            <Link href="/apply/details" primary>
              Change<span className="sr-only"> applicant</span>
            </Link>
          </SummaryListAction>
        </SummaryListRow>
        <SummaryListRow>
          <SummaryListTerm>IC number</SummaryListTerm>
          <SummaryListDetail>900101-14-5678</SummaryListDetail>
          <SummaryListAction>
            <Link href="/apply/details" primary>
              Change<span className="sr-only"> IC number</span>
            </Link>
          </SummaryListAction>
        </SummaryListRow>
        <SummaryListRow>
          <SummaryListTerm>Amount claimed</SummaryListTerm>
          <SummaryListDetail className="tabular-nums">
            RM 2,500.00
          </SummaryListDetail>
          <SummaryListAction />
        </SummaryListRow>
        <SummaryListRow>
          <SummaryListTerm>Status</SummaryListTerm>
          <SummaryListDetail>
            <Tag variant="warning">In review</Tag>
          </SummaryListDetail>
          <SummaryListAction />
        </SummaryListRow>
      </SummaryListBody>
    </SummaryList>
  );
}
```

## Notes

- `SummaryListHeader` is an `h2` by default; pass `as="h3"` when the list sits under another section heading. The page's `h1` is its title.
- Give every row the same cells. If some rows have an action, put an empty `SummaryListAction` in the others so the columns line up.
- Action links say what they change: add visually hidden text (`<span className="sr-only"> IC number</span>`) so screen reader users hear which row each link belongs to.
- Show status as a wash `Tag` with text, and set amounts in tabular figures.
- Rows are separated by a Hairline; don't add borders or wrap the list in a bordered box.
- Every part passes its props to the underlying element (`div`, `table`, `tr`, `th`, `td`), so `className` adjusts layout.
