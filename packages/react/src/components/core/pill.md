---
title: Pill
description: A removable tag with a ✕, for an applied filter, a chosen recipient or a selected option. For a status label that can't be removed, use Tag.
category: Data display
---

## When to use

- Use `Pill` to show something people have chosen and can take away again: applied filters above a table, recipients of a message, chosen options.
- Use `Tag` for a status or category that people can't remove.
- For picking several options from a list with chips in the field, use `Combobox` (with `ComboboxChips`) rather than building it from pills.

## Usage

Pass `onDismiss` to show the ✕. It is named "Remove {label}" when the children are plain text:

```tsx
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";

type Filter = { id: string; label: string };

export function AppliedFilters({
  filters,
  onRemove,
  onClear,
}: {
  filters: Filter[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (filters.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <Pill key={filter.id} onDismiss={() => onRemove(filter.id)}>
          {filter.label}
        </Pill>
      ))}
      <Button variant="primary-ghost" size="small" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}
```

When the children aren't plain text, or for another language, pass `dismissLabel`:

```tsx
import { Pill } from "@/components/ui/pill";

export function Penerima({ onRemove }: { onRemove: () => void }) {
  return (
    <Pill onDismiss={onRemove} dismissLabel="Buang Aminah binti Yusof">
      Aminah binti Yusof
    </Pill>
  );
}
```

## Notes

- `disabled` greys the pill and hides the ✕.
- After removing a pill, move focus somewhere sensible (the next pill, or the filter control), because the focused ✕ is gone.
- `size` is `small`, `medium` (default) or `large`, following the density like `Tag`'s, a step taller so the ✕ is easy to hit.
- The pill is a `div`; use `render` to output another element, for example `render={<li />}` inside a list.
- Pills are the neutral wash only. Don't colour them by status; that is what `Tag` is for.
