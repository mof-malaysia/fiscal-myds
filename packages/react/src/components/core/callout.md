---
title: Callout
description: A wash-coloured message with an icon for information, success, a warning or an error about the current page or task. It can carry an action and be dismissed.
category: Feedback and status
---

## When to use

- Use `Callout` for a message about the page or the task in hand: "Your draft was saved", "Your MyKad details don't match our records", "Online services will be down on Saturday night".
- Use `ErrorSummary` for form errors after a failed submit, and `FieldError` for an error on one field.
- Use a toast (`useToastManager`) for a brief confirmation that doesn't need to stay on the page, `Panel` for the outcome at the top of a confirmation page, and `InsetText` for a passage set apart with no status.
- Use `AnnounceBar` or `PhaseBanner` for site-wide notices across the top of every page.

## Usage

A title alone, or a title with `CalloutContent` below it. `CalloutAction` holds buttons:

```tsx
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutAction,
  CalloutContent,
  CalloutTitle,
} from "@/components/ui/callout";

export function DetailsMismatch() {
  return (
    <Callout variant="warning">
      <CalloutTitle>Your details don't match our records</CalloutTitle>
      <CalloutContent>
        The name you entered is different from the name on IC 900101-14-5678.
        Check it matches your MyKad, or update your details with JPN first.
      </CalloutContent>
      <CalloutAction>
        <Button
          variant="default-outline"
          size="small"
          render={<a href="/profile" />}
        >
          Check my details
        </Button>
      </CalloutAction>
    </Callout>
  );
}
```

| `variant`        | Use for                                                  |
| ---------------- | -------------------------------------------------------- |
| `info` (default) | Something to know before going on: maintenance, a change |
| `success`        | Something finished: saved, submitted, paid               |
| `warning`        | Something needs attention: a mismatch, a deadline        |
| `danger`         | Something failed or is blocked: payment declined         |

To let people dismiss it, put a labelled button in `CalloutClose`. It hides the callout and calls `onDismiss`:

```tsx
import { Button } from "@/components/ui/button";
import {
  Callout,
  CalloutAction,
  CalloutClose,
  CalloutContent,
  CalloutTitle,
} from "@/components/ui/callout";

export function MaintenanceNotice({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Callout variant="info" onDismiss={onDismiss}>
      <CalloutTitle>Scheduled maintenance</CalloutTitle>
      <CalloutContent>
        MyTax will be unavailable on Saturday 14 June from 10pm to 2am.
      </CalloutContent>
      <CalloutAction>
        <CalloutClose>
          <Button variant="default-ghost" size="small">
            Dismiss
          </Button>
        </CalloutClose>
      </CalloutAction>
    </Callout>
  );
}
```

## Notes

- Every callout has `role="alert"`, so screen readers announce it as soon as it appears. Render it in response to something (a save, a failed check), and avoid stacking several on one page.
- The icon is chosen by `variant`; the title and text must still say what happened, so the colour is never the only signal.
- `dismissible` adds a ✕ button, but that button has no accessible name and its text can't be translated. Prefer `CalloutClose` with a labelled button, as above.
- Dismissing hides the callout until it is mounted again (after a reload, for example). Save the choice in `onDismiss` if it should stay hidden.
- The callout is a wash with no border and no side stripe. Don't add either.
