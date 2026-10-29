---
title: Pagination
description: Moves through a long list split into pages, below a table or list of results. Numbered pages, Previous and Next only, or a summary with Previous and Next.
category: Navigation
---

## When to use

- Use `AutoPagination` below a `DataTable`, `Table` or list of search results that is split into pages.
- `WorkQueue` already includes paging; don't add another.
- Build your own layout from `Pagination` and its parts only when none of the three `type`s fits.

## Usage

Pagination is controlled: pass the current `page` (starting at 1), `limit` (items per page), `count` (total items) and `onPageChange`, and fetch or slice the data yourself. `type` is required.

```tsx
import { useState } from "react";
import { AutoPagination } from "@/components/ui/pagination";

const PAGE_SIZE = 20;

export function ApplicationPages({ total }: { total: number }) {
  const [page, setPage] = useState(1);
  return (
    <AutoPagination
      type="default"
      page={page}
      limit={PAGE_SIZE}
      count={total}
      onPageChange={setPage}
    />
  );
}
```

| `type`    | Shows                                                                                                      |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| `default` | Previous, page numbers with ellipses, Next. `maxDisplay` (4) sets how many numbers show before an ellipsis |
| `simple`  | Previous and Next buttons only                                                                             |
| `full`    | "Page 2 of 10" (or your `fullText`) on the left, Previous and Next on the right                            |

The `full` type with your own summary, for example in Bahasa Melayu. `previous` and `next` replace the buttons; build them from `PaginationPrevious` and `PaginationNext` so they keep the page handling:

```tsx
import {
  AutoPagination,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function HalamanPermohonan({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Math.ceil(total / 20);
  return (
    <AutoPagination
      type="full"
      page={page}
      limit={20}
      count={total}
      onPageChange={onPageChange}
      fullText={`Halaman ${page} daripada ${pages}`}
      previous={<PaginationPrevious>Sebelum</PaginationPrevious>}
      next={<PaginationNext>Seterusnya</PaginationNext>}
    />
  );
}
```

## Notes

- Previous is disabled on the first page and Next on the last.
- The accessible names are fixed English: the `nav` is "pagination", the buttons are "previous page", "next page" and "page 3". Visible text can be translated as above, but these names can't be changed through props.
- The current page number has a darker fill but no `aria-current`. Say which page is showing in text near the list too (for example "Showing 21 to 40 of 187 applications").
- The `full` layout is a fixed 512px wide; on narrow screens prefer `simple` or `default`.
- `PaginationPrevious` and `PaginationNext` with `render` render your element as it is, without the built-in styles or page handling.
- After a page change, move focus or scroll to the top of the list so keyboard and screen reader users land on the new results.
