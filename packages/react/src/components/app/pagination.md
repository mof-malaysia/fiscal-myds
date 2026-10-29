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

Pagination is controlled: pass the current `page` (starting at 1), `limit` (items per page), `count` (total items) and `onPageChange`, and fetch or slice the data yourself. `type` defaults to `default`.

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
| `simple`  | Previous, "Page 2 of 10" and Next                                                                          |
| `full`    | "Page 2 of 10" (or your `fullText`) on the left, Previous and Next on the right                            |

In Bahasa Melayu, with the `full` layout. `labels` translates the visible text and the accessible names; `{page}` and `{total}` are filled in:

```tsx
import { AutoPagination } from "@/components/ui/pagination";

export function HalamanPermohonan({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <AutoPagination
      type="full"
      page={page}
      limit={20}
      count={total}
      onPageChange={onPageChange}
      labels={{
        navigation: "Penomboran",
        previous: "Sebelum",
        next: "Seterusnya",
        previousPage: "Halaman sebelum",
        nextPage: "Halaman seterusnya",
        page: "Halaman {page}",
        pageOf: "Halaman {page} daripada {total}",
        morePages: "Lagi halaman",
      }}
    />
  );
}
```

`previous` and `next` replace the buttons entirely; build them from `PaginationPrevious` and `PaginationNext` so they keep the page handling.

## Notes

- Previous is disabled on the first page, and Next on the last page or when there are no results.
- The `nav` landmark is named "Pagination", page numbers "Page 3", and icon-only Previous and Next buttons "Previous page" and "Next page"; buttons with visible text are named by it. Translate all of them with `labels`.
- The current page number has `aria-current="page"` and a darker fill. Say which results are showing in text near the list too (for example "Showing 21 to 40 of 187 applications").
- `PaginationLabel` shows "Page 2 of 10" (`labels.pageOf`), or its `content`. `fullText` on `AutoPagination` replaces it in the `full` layout.
- `PaginationPrevious` and `PaginationNext` with `render` render your element as it is, without the built-in styles or page handling.
- After a page change, move focus or scroll to the top of the list so keyboard and screen reader users land on the new results.
