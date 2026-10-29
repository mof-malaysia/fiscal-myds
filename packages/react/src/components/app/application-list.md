---
title: Application List
description: A citizen's applications on their dashboard, each with reference, date, a status tag in plain words and the next action. Shows an empty state when there are none.
---

## When to use

- Use `ApplicationList` on a citizen's dashboard or "Your applications" page to show what they have applied for, where each one stands and what to do next.
- Use `TaskList` for the sections of one application ("Your details: Completed"), and `Stepper` for progress through a multi-step form.
- Use `WorkQueue` or `DataTable` for officers' lists of cases, and `NotificationList` for an inbox of updates.

## Usage

Each item has a `status`: `"draft"`, `"submitted"`, `"in-review"`, `"action-needed"`, `"approved"` or `"rejected"`. The status picks the tag, a plain-language line and the default action text (Continue, Respond or View). Give `href` (or `render` with your router's link) to show the action. The list keeps your order, so sort items that need the citizen first yourself.

```tsx
import { ApplicationList } from "@/components/blocks/application-list";
import { Button } from "@/components/ui/button";

export function DashboardApplications() {
  return (
    <ApplicationList
      items={[
        {
          id: "MOF-2026-0412",
          title: "Individual tax relief 2025",
          reference: "MOF-2026-0412",
          date: new Date("2026-10-12"),
          status: "action-needed",
          statusText: "Upload your EA form by 30 November 2026",
          href: "/applications/MOF-2026-0412",
        },
        {
          id: "draft-118",
          title: "Sumbangan Tunai Rahmah",
          date: new Date("2026-10-27"),
          status: "draft",
          href: "/apply/str/draft-118",
        },
        {
          id: "MOF-2026-0291",
          title: "Refund of overpaid tax",
          reference: "MOF-2026-0291",
          date: new Date("2026-08-03"),
          status: "approved",
          statusText: "RM 1,240.00 was paid to your bank account",
          href: "/applications/MOF-2026-0291",
        },
      ]}
      emptyAction={
        <Button render={<a href="/apply" />}>Start an application</Button>
      }
    />
  );
}
```

In Bahasa Melayu. `labels.status` overrides only the statuses and fields you pass:

```tsx
import {
  ApplicationList,
  type ApplicationListItem,
} from "@/components/blocks/application-list";

export function PermohonanAnda({ items }: { items: ApplicationListItem[] }) {
  return (
    <ApplicationList
      items={items}
      locale="ms-MY"
      labels={{
        title: "Permohonan anda",
        reference: "Rujukan",
        started: "Dimulakan",
        submitted: "Dihantar",
        emptyTitle: "Tiada permohonan lagi",
        emptyDescription:
          "Permohonan yang anda mulakan akan dipaparkan di sini.",
        status: {
          draft: {
            label: "Draf",
            description: "Belum dihantar",
            action: "Teruskan",
          },
          submitted: {
            label: "Dihantar",
            description: "Kami telah menerimanya",
            action: "Lihat",
          },
          "in-review": {
            label: "Dalam semakan",
            description: "Pegawai sedang menyemaknya",
            action: "Lihat",
          },
          "action-needed": {
            label: "Tindakan diperlukan",
            description: "Kami perlukan maklumat lanjut daripada anda",
            action: "Balas",
          },
          approved: {
            label: "Diluluskan",
            description: "Permohonan anda telah diluluskan",
            action: "Lihat",
          },
          rejected: {
            label: "Tidak diluluskan",
            description: "Lihat sebabnya dan apa yang boleh anda lakukan",
            action: "Lihat",
          },
        },
      }}
    />
  );
}
```

## Notes

- Status is a wash `Tag` plus a sentence, never colour alone. `"rejected"` reads "Not approved" by default.
- The action is styled by status: a primary button for `"action-needed"`, a secondary button for `"draft"`, a ghost button otherwise. Each `"action-needed"` item gets a blue button, so a dashboard with several of them shows several; keep that in mind or override the styling in the installed file.
- When `title` is a string, the action link gets it as hidden text ("View Refund of overpaid tax"), so a list of "View" links still makes sense to screen readers.
- A `Date` in `date` is formatted with `locale` (default `"en-MY"`); drafts say "Started", everything else "Submitted". Pass a string or node to show the date as is.
- The heading is "Your applications" as an `h2`; pass `title` to change it, `title={null}` to drop it, and `headingLevel="h3"` to fit the page outline.
- With no items it shows an `EmptyState` with `emptyAction` (for example a "Start an application" button).
- The installed file is yours: edit it when the props don't cover what you need, such as another status.
