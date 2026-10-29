---
title: Stat
description: A KPI tile for officer dashboards: a label, one large figure in tabular numerals, an optional change since the last period and a footnote.
category: Data display
---

## When to use

- Use `Stat` for headline figures at the top of a dashboard or case list: tax collected, overdue cases, average processing time.
- Use `StatGroup` to lay several tiles out in a responsive grid.
- Use `Meter` when the figure has a limit people should watch (budget spent of a total), and `DataTable` when people need to compare many rows.

## Usage

```tsx
import {
  Stat,
  StatDelta,
  StatDescription,
  StatGroup,
  StatLabel,
  StatValue,
} from "@/components/ui/stat";

export function CollectionsOverview() {
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Tax collected this month</StatLabel>
        <StatValue prefix="RM">1,284,500.00</StatValue>
        <StatDelta direction="up" tone="success">
          8.2% from September
        </StatDelta>
      </Stat>
      <Stat>
        <StatLabel>Overdue cases</StatLabel>
        <StatValue>312</StatValue>
        <StatDelta direction="up" tone="danger">
          24 more than last week
        </StatDelta>
      </Stat>
      <Stat>
        <StatLabel>Average processing time</StatLabel>
        <StatValue suffix="days">4.6</StatValue>
        <StatDelta direction="down" tone="success">
          0.8 days faster
        </StatDelta>
      </Stat>
      <Stat>
        <StatLabel>Applications received</StatLabel>
        <StatValue>1,920</StatValue>
        <StatDelta>No change</StatDelta>
        <StatDescription>1 to 27 October 2026</StatDescription>
      </Stat>
    </StatGroup>
  );
}
```

Secondary figures inside a panel use the Well surface:

```tsx
import {
  Stat,
  StatDelta,
  StatDescription,
  StatGroup,
  StatLabel,
  StatValue,
} from "@/components/ui/stat";

export function RefundFigures() {
  return (
    <StatGroup minItemWidth="12rem">
      <Stat surface="well">
        <StatLabel>Refunds issued</StatLabel>
        <StatValue prefix="RM">82,410.50</StatValue>
        <StatDescription>Paid to 214 taxpayers</StatDescription>
      </Stat>
      <Stat surface="well">
        <StatLabel>Pending refunds</StatLabel>
        <StatValue>57</StatValue>
        <StatDelta direction="down" tone="neutral">
          9 fewer than yesterday
        </StatDelta>
      </Stat>
    </StatGroup>
  );
}
```

## Notes

- `surface` is `sheet` (default, white on the Paper page), `well` (grouped secondary figures) or `none` (inside another container). Tiles have no border or shadow; don't add one, and don't put a `Stat` inside a `Card`.
- `direction` (`up`, `down`, `none` default) picks the arrow; `tone` (`success`, `danger`, `neutral` default) picks the colour. Set them separately: a rise in collections is good, a rise in overdue cases is not.
- Always write the change as text ("24 more than last week"); the arrow and colour only support it. Screen readers hear "Increased" or "Decreased" before the text; translate with `directionLabels` (`{ up: "Meningkat", down: "Menurun" }`).
- Pass the figure already formatted ("1,284,500.00"); `StatValue` sets it in tabular numerals. Put units in `prefix` ("RM") or `suffix` ("days", "%"), which are set smaller.
- `StatGroup` fits as many tiles per row as it can, each at least `minItemWidth` (default `14rem`).
