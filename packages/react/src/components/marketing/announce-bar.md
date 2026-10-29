---
title: Announce Bar
description: A one-line notice with a tag under the site's navigation, such as planned maintenance or a new feature. For a service's alpha or beta phase, use PhaseBanner.
category: Marketing
---

## When to use

- Use `AnnounceBar` for a short, site-wide notice on an agency or landing site: planned maintenance, a new service, a changed deadline. Put it directly under the `Navbar`.
- Use `PhaseBanner` to say a service is in alpha or beta and ask for feedback; it is the standard phase banner and sets its own tag, width and spacing.
- Use `Callout` for a message about the content of one page, and a toast (`useToast` from `@/lib/ftds/hooks`) for feedback on something the user just did.

## Usage

`AnnounceBarTag` is the core `Tag`, so it takes the same `variant` values (`default`, `primary`, `success`, `warning`, `danger`). Put the message in `AnnounceBarDescription`:

```tsx
import {
  AnnounceBar,
  AnnounceBarDescription,
  AnnounceBarTag,
} from "@/components/ui/announce-bar";
import { Link } from "@/components/ui/link";

export function MaintenanceNotice() {
  return (
    <AnnounceBar>
      <AnnounceBarTag variant="warning">Maintenance</AnnounceBarTag>
      <AnnounceBarDescription>
        <p>
          Online payments are unavailable on 2 November from 1 am to 4 am.{" "}
          <Link href="/notices/maintenance" primary underline="always">
            Read the notice
          </Link>
        </p>
      </AnnounceBarDescription>
    </AnnounceBar>
  );
}
```

## Notes

- `border` (on by default) draws a Hairline under the bar. Pass `border={false}` when the bar sits directly above another rule, such as the bottom edge of the `Navbar`.
- The bar has side margins but no maximum width; to line it up with a centred page, place it inside your page's max-width container.
- The tag text is the label for the notice, so make it a word that stands on its own ("Maintenance", "New"). Don't rely on the tag's colour alone.
- The description text is small (14px). Keep it to one sentence and at most one link.
- Remove the bar when the notice no longer applies; don't leave it as a permanent banner.
