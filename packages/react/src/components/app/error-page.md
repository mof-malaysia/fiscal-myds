---
title: Error Page
description: Whole-page message for a page that doesn't exist, an error on our side, a page the user can't access, or planned maintenance. Says what happened and what to do next.
---

## When to use

- Use `ErrorPage` as the content of a 404, 500, 403 or maintenance page: pick the `kind` and it supplies a plain-language title and explanation.
- Use `ErrorSummary` for problems with a form the user submitted, and `Callout` for a problem with one part of a page that otherwise works.
- Use `EmptyState` when there is simply nothing to show yet (no results, no applications).

## Usage

`kind` is `"not-found"`, `"server-error"`, `"access-denied"` or `"maintenance"`. The actions appear from the props you set: `onRetry` ("Try again"), `homeHref` ("Go to the home page") and `supportHref` ("Contact support"). "Try again" is the primary button when you give it, otherwise "Go to the home page" is; "Contact support" is never the filled one.

```tsx
import { ErrorPage } from "@/components/blocks/error-page";

export function NotFoundPage() {
  return <ErrorPage kind="not-found" homeHref="/" supportHref="/contact" />;
}

export function ServerErrorPage({ requestId }: { requestId: string }) {
  return (
    <ErrorPage
      kind="server-error"
      onRetry={() => window.location.reload()}
      supportHref="/contact"
      reference={requestId}
    />
  );
}

export function MaintenancePage() {
  return <ErrorPage kind="maintenance" backAt="10:00 pm today" />;
}
```

Your own wording and Bahasa Melayu labels. `title` and `description` replace the kind's defaults; `code={null}` hides the status code:

```tsx
import { ErrorPage } from "@/components/blocks/error-page";

export function TiadaAkses() {
  return (
    <ErrorPage
      kind="access-denied"
      title="Anda tidak mempunyai akses ke halaman ini"
      description="Akaun anda tidak dibenarkan melihat halaman ini. Minta pentadbir anda untuk memberi akses, atau hubungi khidmat sokongan."
      homeHref="/"
      supportHref="/hubungi-kami"
      reference="REQ-8F2A-41C9"
      labels={{
        code: "Ralat {code}",
        home: "Pergi ke laman utama",
        contactSupport: "Hubungi khidmat sokongan",
        reference: "Rujukan",
        referenceHint: "Nyatakan rujukan ini jika anda menghubungi kami.",
        copy: "Salin",
        copied: "Disalin",
      }}
    />
  );
}
```

## Notes

- The title is the page's `h1`. The status code ("Error 404") sits small above it to help support staff; it defaults from the kind (404, 500, 403, 503), and `code` replaces or hides it.
- `reference` (an incident or request id) shows in a box with a Copy button and a hint to quote it. "Copied" is announced to screen readers.
- `backAt` shows only for `kind="maintenance"`, filling `{time}` in `labels.backAt` ("We expect to be back by {time}.").
- `actions` replaces the default buttons entirely. `children` sits between the explanation and the actions, for example a list of useful links.
- `media` puts an illustration above the code; it is decorative unless you give it a label.
- The block renders a `<section>`, not a full page: put it inside your page frame (`Masthead`, navigation, `Footer`) and set the HTTP status code on the server yourself.
- The installed file is yours: edit it when the props don't cover what you need.
