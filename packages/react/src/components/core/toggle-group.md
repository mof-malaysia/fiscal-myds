---
title: Toggle Group
description: A segmented control: a short row of Toggles where one, or several with multiple, is pressed. Use it to switch a view or filter, like Day, Week, Month.
category: Actions
---

## When to use

- Use `ToggleGroup` to switch how the same content is shown or filtered: a period (Day, Week, Month), list or grid view, text alignment.
- Use `Tabs` to switch between different panels of content, and `Radio` to answer a question in a form.
- Use a single `Toggle` for one on or off button.

## Usage

The group's value is always an array of the pressed toggles' `value`s, even when only one can be pressed:

```tsx
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";

type Period = "day" | "week" | "month";

export function PeriodSwitch({
  onChange,
}: {
  onChange: (period: Period) => void;
}) {
  const [period, setPeriod] = useState<Period>("week");
  return (
    <ToggleGroup
      aria-label="Period"
      value={[period]}
      onValueChange={(value) => {
        // Pressing the current segment again would leave nothing pressed
        const next = value[0] as Period | undefined;
        if (!next) return;
        setPeriod(next);
        onChange(next);
      }}
    >
      <Toggle value="day">Day</Toggle>
      <Toggle value="week">Week</Toggle>
      <Toggle value="month">Month</Toggle>
    </ToggleGroup>
  );
}
```

Several pressed at once with `multiple`, and icon-only segments:

```tsx
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { GridIcon } from "@/components/ui/icons/grid";
import { ListIcon } from "@/components/ui/icons/list";

export function ViewSwitch() {
  return (
    <ToggleGroup aria-label="View" defaultValue={["list"]} size="medium">
      <Toggle value="list" iconOnly aria-label="List view">
        <ListIcon />
      </Toggle>
      <Toggle value="grid" iconOnly aria-label="Grid view">
        <GridIcon />
      </Toggle>
    </ToggleGroup>
  );
}

export function DocumentFilter() {
  return (
    <ToggleGroup aria-label="Document types" multiple defaultValue={["ea"]}>
      <Toggle value="ea">EA form</Toggle>
      <Toggle value="payslip">Payslips</Toggle>
      <Toggle value="receipt">Receipts</Toggle>
    </ToggleGroup>
  );
}
```

## Notes

- Name the group with `aria-label` (or `aria-labelledby` pointing at a visible label). Arrow keys move between segments.
- Without `multiple`, pressing the pressed segment unpresses it and the value becomes `[]`. Ignore the empty value, as above, when one segment must always be pressed.
- `size` goes on the group (`small` by default, `medium`, `large`) and applies to every toggle in it. The group is a Well track with no outline; the pressed segment lifts onto a raised surface.
- `orientation="vertical"` stacks the segments.
- Keep it to two to five short labels. For more options, use a `Select`.
