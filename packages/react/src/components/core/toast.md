---
title: Toast
description: A brief message in the corner of the screen that confirms something just happened, such as "Draft saved". Mount AutoToast once and call useToast().toast() anywhere.
category: Feedback and status
---

## When to use

- Use a toast to confirm an action the user just took that has no page of its own: a draft saved, a reference number copied, a file uploaded.
- Use `Callout` for a message that must stay on the page, `ErrorSummary` for form errors, and `AlertDialog` for a result the user must acknowledge.
- Don't use a toast for errors that need the user to do something, or for anything they must not miss: it disappears on its own.

## Usage

Mount `AutoToast` once, near the root of the app. It holds the toast stack in the bottom-right corner and listens for toasts from `useToast`:

```tsx
import type { ReactNode } from "react";
import { AutoToast } from "@/components/ui/toast";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AutoToast duration={5000} />
    </>
  );
}
```

Then call `toast` from `useToast` in any component. It takes a `variant`, a `title` and an optional `description`:

```tsx
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/ftds/hooks";

export function SaveDraftButton({ onSave }: { onSave: () => Promise<void> }) {
  const { toast } = useToast();

  async function save() {
    await onSave();
    toast({
      variant: "success",
      title: "Draft saved",
      description: "Your tax relief claim is saved until 30 April 2026.",
    });
  }

  return (
    <Button variant="default-outline" onClick={save}>
      Save as draft
    </Button>
  );
}
```

| `variant`           | Looks like                   | Use for                         |
| ------------------- | ---------------------------- | ------------------------------- |
| `message` (default) | Grey title, no icon          | Neutral updates                 |
| `info`              | Blue title and info icon     | Information about what happened |
| `success`           | Green title and check icon   | An action that worked           |
| `warning`           | Amber title and warning icon | It worked, but check something  |
| `error`             | Red title and warning icon   | A background action that failed |

To build your own toast layout, compose the parts inside `ToastProvider` and add toasts with `useToastManager().add()`. Its `type` sets the variant:

```tsx
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToastManager,
} from "@/components/ui/toast";

function ToastList() {
  const { toasts } = useToastManager();
  return toasts.map((toast) => (
    <ToastRoot key={toast.id} toast={toast}>
      <ToastIcon />
      <div className="flex flex-col gap-1">
        <ToastTitle />
        <ToastDescription />
      </div>
      <ToastClose aria-label="Dismiss" />
    </ToastRoot>
  ));
}

function CopyReference({ reference }: { reference: string }) {
  const { add } = useToastManager();
  return (
    <Button
      variant="default-outline"
      onClick={() => {
        void navigator.clipboard.writeText(reference);
        add({ type: "info", title: `Copied ${reference}`, timeout: 3000 });
      }}
    >
      Copy reference
    </Button>
  );
}

export function PaymentPage({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <CopyReference reference="LHDN-2026-004512" />
      <ToastViewport>
        <ToastList />
      </ToastViewport>
    </ToastProvider>
  );
}
```

## Notes

- `useToast().toast()` only reaches an `AutoToast` that is mounted. With your own `ToastProvider`, use `useToastManager` instead; `useToast` won't show anything there.
- `variant` is a required key in the `toast()` call; pass `"message"` for a neutral toast.
- `AutoToast`'s `duration` (default 5000ms) sets both how long toasts stay and the length of the progress bar along the bottom. Hovering over the toasts pauses them.
- People can dismiss a toast with its close button or by swiping it to the right.
- Keep the title to a few words that say what happened ("Draft saved"), and put any detail in `description`.
- `ToastClose` is named "Close"; pass `aria-label` to translate it.
- Toasts float, so they already have a shadow; don't add borders or shadows.
