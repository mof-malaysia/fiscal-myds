---
title: Spinner
description: A small spinning ring for a short wait on one action, such as a button that is submitting. It has no accessible name, so pair it with text.
category: Feedback and status
---

## When to use

- Use `Spinner` inside a button or beside a row while one action is in progress: signing in, submitting, uploading a file.
- Use `Skeleton` while a page or section loads, `DataTable`'s `loading` prop for tables, and `Progress` when you know how far along a long task is.

## Usage

In a button, show the spinner and change the label to say what is happening. Use `color="white"` on a `primary-fill` or `danger-fill` button:

```tsx
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SubmitReturn({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: () => void;
}) {
  return (
    <Button
      type="button"
      aria-disabled={pending}
      onClick={() => {
        if (!pending) onSubmit();
      }}
    >
      <Spinner show={pending} color="white" aria-hidden />
      {pending ? "Submitting your return…" : "Submit return"}
    </Button>
  );
}
```

On its own, give it a role and a name so screen readers know something is loading:

```tsx
import { Spinner } from "@/components/ui/spinner";

export function CheckingStatus() {
  return (
    <div className="text-content text-txt-black-700 flex items-center gap-2">
      <Spinner size="medium" role="status" aria-label="Loading" />
      Checking your payment status
    </div>
  );
}
```

## Notes

- The spinner renders no text, role or label of its own. Either put visible text next to it and add `aria-hidden`, or give it `role="status"` and an `aria-label`.
- `show={false}` renders nothing, so you can leave it in place and toggle it.
- `size` is `small` (16px, default), `medium` (20px) or `large` (24px). `color` is `gray` (default) or `white`.
- `color="white"` is plain white in both themes. In dark mode, filled buttons have dark text, so check the contrast there.
- Ignore repeated clicks while the action runs (as `aria-disabled` and your handler do above) rather than disabling the button, which would drop keyboard focus.
