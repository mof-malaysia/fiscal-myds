---
title: Alert Dialog
description: A short modal message with a status icon and one or two actions. Use it to confirm a high-stakes or destructive action, or to report a result the user must acknowledge.
category: Overlays
---

## When to use

- Use `AlertDialog` to confirm something that is hard to undo (delete, withdraw, submit for payment) or to stop the user with a result they must read before going on.
- Use `Dialog` when the modal holds a form or longer content, `Sheet` or `Drawer` for a panel that slides in from an edge, and `Popover` for a small non-blocking layer beside its trigger.
- Use a toast (`AutoToast` with `useToast`) for a brief "Saved" message that needs no answer, and `Callout` for a message that stays on the page.

## Usage

`variant` is required on `AlertDialog`. It sets the icon and its colour:

| `variant` | Icon                  | Use for                                     |
| --------- | --------------------- | ------------------------------------------- |
| `default` | none                  | A neutral question                          |
| `info`    | Info, blue            | Information to read before going on         |
| `success` | Check circle, green   | A result the user must acknowledge          |
| `warning` | Warning circle, amber | An action with consequences worth a pause   |
| `danger`  | Warning diamond, red  | Deleting or withdrawing: anything permanent |

Put the title, description and actions inside `AlertDialogContent`. Each button that should close the dialog is an `AlertDialogClose`, rendered as a `Button`:

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteDependants({
  count,
  onDelete,
}: {
  count: number;
  onDelete: () => void;
}) {
  return (
    <AlertDialog variant="danger">
      <AlertDialogTrigger render={<Button variant="danger-outline" />}>
        Delete dependants
      </AlertDialogTrigger>
      <AlertDialogContent dismissible={false}>
        <AlertDialogTitle>
          This will permanently delete {count} dependants
        </AlertDialogTitle>
        <AlertDialogDescription>
          Any child relief you claimed for them on this form will be removed.
          You cannot undo this.
        </AlertDialogDescription>
        <AlertDialogAction>
          <AlertDialogClose render={<Button variant="default-outline" />}>
            Keep dependants
          </AlertDialogClose>
          <AlertDialogClose
            render={<Button variant="danger-fill" />}
            onClick={onDelete}
          >
            Delete dependants
          </AlertDialogClose>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

When the action is asynchronous, control `open` so the dialog stays open until the work finishes. The confirm button is a plain `Button`, not an `AlertDialogClose`:

```tsx
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function SubmitDeclaration({
  onSubmit,
}: {
  onSubmit: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    await onSubmit();
    setSubmitting(false);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Submit declaration</Button>
      <AlertDialog variant="warning" open={open} onOpenChange={setOpen}>
        <AlertDialogContent dismissible={false}>
          <AlertDialogTitle>Submit your declaration for 2025?</AlertDialogTitle>
          <AlertDialogDescription>
            You cannot change your answers after you submit. Your tax payable of
            RM 1,240.00 will be due by 30 April 2026.
          </AlertDialogDescription>
          <AlertDialogAction>
            <AlertDialogClose render={<Button variant="default-outline" />}>
              Check answers again
            </AlertDialogClose>
            <Button onClick={submit} disabled={submitting}>
              Submit declaration
            </Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```

## Notes

- `AlertDialog` is a `Dialog` with an icon: it takes the same `open`, `defaultOpen` and `onOpenChange` props, and `AlertDialogContent` takes `DialogBody`'s `dismissible`, `onDismiss` and `hideClose`.
- `dismissible={false}` stops a click outside from closing the dialog. Esc and the close button still close it. Use it on confirmations so a stray click doesn't count as an answer.
- The title states the consequence in plain language ("This will permanently delete 3 dependants"), the confirm button repeats the verb ("Delete dependants"), and the safe choice is the `default-outline` button. Use `danger-fill` only for the final destructive button.
- `AlertDialogAction` lays out the buttons like `DialogFooter`: `align` is `end` (default), `start` or `full`, and `action` puts extra content at the other end of the row. Buttons stack full width on small screens.
- Prefer `render={<Button />}` on `AlertDialogTrigger` and `AlertDialogClose`. A single element child also works, for older code.
- The built-in close button is labelled "Close" in English and has no prop to change it. To translate it, set `hideClose` and keep a labelled `AlertDialogClose` in the actions.
