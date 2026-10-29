---
title: Site Search
description: A labelled "search this site" field with a Search button, for agency sites and service landing pages. Submits a GET request, or calls onSearch.
category: Marketing
---

## When to use

- Use `SiteSearch` to search a whole site, with results on their own page: in a hero, at the top of a help centre or on the results page itself.
- Use `Autocomplete` to show suggestions while the user types.
- Use a search `Input` to filter a list already on screen (as `WorkQueue` does), and the `Command` palette for "go to anything" in an officer app.

## Usage

By default it is a plain `<form role="search">` that sends `?q=…` to `action`, so it works before JavaScript loads:

```tsx
import { SiteSearch } from "@/components/ui/site-search";

export function HelpSearch() {
  return (
    <div className="gap-stack-md bg-bg-washed p-surface flex flex-col rounded-lg">
      <h1 className="text-display text-txt-black-900 font-semibold">
        How can we help?
      </h1>
      <SiteSearch
        action="/search"
        size="large"
        showLabel
        shortcut
        placeholder="For example, tax relief, refund status"
      />
    </div>
  );
}
```

Pass `onSearch` to handle the query in the page instead; the form's own submit is prevented and you receive the trimmed query. `labels` translates the label and button:

```tsx
import { useState } from "react";
import { SiteSearch } from "@/components/ui/site-search";

export function CarianPekeliling({ initial }: { initial?: string }) {
  const [query, setQuery] = useState(initial ?? "");
  return (
    <div className="gap-stack-sm flex flex-col">
      <SiteSearch
        defaultValue={initial}
        onSearch={setQuery}
        placeholder="Contoh: pekeliling perbendaharaan"
        labels={{ label: "Cari pekeliling", submit: "Cari" }}
      />
      {query && (
        <p className="text-content text-txt-black-700">
          Hasil carian untuk "{query}"
        </p>
      )}
    </div>
  );
}
```

## Notes

- The label is always there for screen readers ("Search this site" by default); `showLabel` makes it visible above the field. Use `showLabel` when the search is the main thing on the page.
- `name` sets the query parameter (default `"q"`). Other form props such as `action` and `method` pass through to the `<form>`.
- `size` is `small`, `medium` (default) or `large`, relative to the density; `large` suits a hero.
- `shortcut` makes "/" focus the field from anywhere on the page (except while typing in another field) and shows a key hint while the field is empty. Turn it on for one search per page at most.
- Escape leaves the field when it is empty.
- The placeholder is an example, not the label: start it with "For example".
- The Search button is a filled primary button. If the page already has a primary action, the search is usually that action; don't add another filled blue button beside it.
