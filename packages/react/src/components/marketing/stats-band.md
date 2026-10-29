---
title: Stats Band
description: Two to four headline figures on a Well band, each with a label and optional footnote, and a source line. For landing pages, not dashboards.
---

## When to use

- Use `StatsBand` on an agency or landing page to show a few public figures about a service or programme: amounts collected, people helped, time saved.
- Use `Stat` and `StatGroup` for KPI tiles on an officer dashboard, with a change since the last period.
- Use `Table` or `DataTable` when people need to compare more than four figures.

## Usage

```tsx
import { StatsBand } from "@/components/blocks/stats-band";

export function MyBayarInNumbers() {
  return (
    <StatsBand
      title="MyBayar in numbers"
      stats={[
        { value: "RM 4.2 bil", label: "Collected online in 2025" },
        {
          value: "1.8 juta",
          label: "Payments a month",
          footnote: "Average, January to September 2026",
        },
        { value: "32", label: "Agencies connected" },
        { value: "3 min", label: "Typical time to pay" },
      ]}
      source="Source: Kementerian Kewangan Malaysia, September 2026"
    />
  );
}
```

## Notes

- Pass two to four `stats`. Items after the fourth are dropped; the grid takes as many columns as there are figures on desktop and two on tablet.
- The figures are a description list: the label is the term and the value its description, so screen readers hear "Payments a month, 1.8 juta". The value is shown first visually.
- Values are set large in tabular figures. Pass them already formatted, with the unit ("RM 4.2 bil", "3 min").
- Always give a `source` with the date of the figures, so people know how current they are.
- The band is Well (`bg-bg-washed`). Don't place it directly next to a `CtaBand` with the same tone.
