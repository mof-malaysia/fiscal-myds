---
title: Empty State
description: Fills the space where a table, list or search would show results but has none, with a short title, what to do next and at most two actions.
category: Feedback and status
---

## When to use

- Use `EmptyState` where a list, table, queue or search has nothing to show: no applications yet, no cases assigned, no results for the filters.
- Pass it to `DataTable`'s `emptyState` prop, or put it in a `TableEmpty` cell for a `Table`.
- Use `ErrorPage` for a page that failed to load or doesn't exist, and `Callout` for a message beside content that is there.

## Usage

Write the copy for the situation. A first-use empty state offers a way to start:

```tsx
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { DocumentIcon } from "@/components/ui/icons/document";

export function NoApplicationsYet() {
  return (
    <EmptyState>
      <EmptyStateIcon>
        <DocumentIcon />
      </EmptyStateIcon>
      <EmptyStateTitle>No applications yet</EmptyStateTitle>
      <EmptyStateDescription>
        Tax relief applications you start will appear here, with their status.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button render={<a href="/apply" />}>Apply for a tax relief</Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
```

No results for a search or filter offers a way out:

```tsx
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/ui/empty-state";

export function NoMatchingCases({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <EmptyState>
      <EmptyStateTitle as="h2">No cases match "{query}"</EmptyStateTitle>
      <EmptyStateDescription>
        Check the case reference, for example MOF-2026-0412, or clear the
        filters to see every case in your queue.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button variant="default-outline" onClick={onClear}>
          Clear filters
        </Button>
      </EmptyStateActions>
    </EmptyState>
  );
}
```

## Notes

- `EmptyStateTitle` renders an `h3`; pass `as` (`h2`, `h3`, `h4` or `p`) to fit the page's heading outline.
- `EmptyStateIcon` is decorative and hidden from screen readers. On a Well surface, pass `className="bg-bg-white"` so its circle still shows.
- One primary action and at most one secondary. A "no results" state usually needs only a secondary "Clear filters".
- The title says what is empty; the description says why or what to do next. Avoid "No data" on its own.
- Padding shrinks in the compact density; don't add a card or border around it.
