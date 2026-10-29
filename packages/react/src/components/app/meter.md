---
title: Meter
description: Shows a measured quantity within a known range, such as budget spent or storage used, turning Warning or Danger past thresholds you set.
category: Feedback and status
---

## When to use

- Use `Meter` for a level that is measured, not a task: budget spent, quota used, leave days remaining, storage used.
- Use `Progress` for a task moving towards done (an upload, a batch job, steps of an application).
- Use `Stat` for a single headline figure without a range.

## Usage

With `label` and no children it lays itself out: label left, value right, bar below. Set `warningAt` and `dangerAt` in the same units as `value`; the bar and value turn Warning or Danger once the value reaches them. The value is a percentage of `max` (default 100) unless you pass `format`.

```tsx
import { Meter } from "@/components/ui/meter";

export function StorageUsed({ percent }: { percent: number }) {
  return (
    <Meter
      value={percent}
      warningAt={70}
      dangerAt={90}
      label="Document storage used"
    />
  );
}
```

Compose the parts for your own value text. Here a budget in ringgit:

```tsx
import {
  Meter,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@/components/ui/meter";

export function BudgetSpent({ spent }: { spent: number }) {
  return (
    <Meter
      value={spent}
      max={50000}
      warningAt={40000}
      dangerAt={50000}
      locale="en-MY"
      format={{ style: "currency", currency: "MYR" }}
    >
      <MeterLabel>Training budget spent</MeterLabel>
      <MeterValue>{(formatted) => `${formatted} of RM 50,000.00`}</MeterValue>
      <MeterTrack />
    </Meter>
  );
}
```

When a low value is the bad one, set `tone` yourself:

```tsx
import { Meter } from "@/components/ui/meter";

export function LeaveRemaining({ days }: { days: number }) {
  return (
    <Meter
      value={days}
      max={30}
      format={{ style: "decimal" }}
      tone={days <= 5 ? "danger" : days <= 10 ? "warning" : "default"}
      toneLabels={{ warning: "Running low", danger: "Almost none left" }}
      label="Annual leave days remaining"
    />
  );
}
```

## Notes

- The state is never carried by colour alone: past a threshold the value gains a warning icon and the accessible value adds the tone label ("Nearing the limit", "At or over the limit" by default). Translate them with `toneLabels`.
- `tone` (`default`, `warning` or `danger`) overrides `warningAt` and `dangerAt`.
- Always give it a label, with `label` or `MeterLabel`, so people know what is measured. The value is shown in tabular figures.
- `size` (`small`, `medium` default, `large`) sets the bar thickness. In composed layouts pass `size` to `MeterTrack`.
- `MeterTrack` renders a `MeterIndicator` when it has no children.
- Don't use it for a figure without a meaningful maximum; use `Stat`.
