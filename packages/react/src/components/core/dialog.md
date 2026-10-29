---
title: Dialog
description: A modal window over the page for a short task that needs the user's full attention, such as editing details or reviewing before submitting. Focus stays inside until it closes.
category: Overlays
---

## When to use

- Use `Dialog` for a short, self-contained task that must be finished or cancelled before going back to the page: edit a contact number, add a dependant, review a summary.
- Use `AlertDialog` for a confirmation or a result with a status icon ("Delete 3 records?"), `Sheet` or `Drawer` for a panel that slides in from an edge (filters, a case's details beside a list), and `Popover` for a small layer that doesn't block the page.
- Don't put a whole multi-step form in a dialog; give it its own pages.

## Usage

`DialogBody` is the window itself: it portals to `document.body`, adds the scrim and a close button. Inside it, `DialogHeader` holds the title and description, `DialogContent` the body, and `DialogFooter` the buttons.

```tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function EditPhoneNumber({
  phone,
  onSave,
}: {
  phone: string;
  onSave: (phone: string) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="default-outline" />}>
        Change phone number
      </DialogTrigger>
      <DialogBody>
        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            onSave(String(data.get("phone")));
          }}
        >
          <DialogHeader>
            <DialogTitle>Change phone number</DialogTitle>
            <DialogDescription>
              We send payment reminders to this number.
            </DialogDescription>
          </DialogHeader>
          <DialogContent>
            <Field name="phone">
              <FieldLabel>Mobile phone number</FieldLabel>
              <FieldDescription>For example, 012-345 6789</FieldDescription>
              <Input type="tel" autoComplete="tel" defaultValue={phone} />
            </Field>
          </DialogContent>
          <DialogFooter>
            <DialogClose render={<Button variant="default-outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save phone number</Button>
          </DialogFooter>
        </form>
      </DialogBody>
    </Dialog>
  );
}
```

Control the dialog with `open` and `onOpenChange` when something other than the trigger opens it, or when it should close only after work finishes. `DialogFooter`'s `action` puts extra content at the start of the row, opposite the buttons:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/components/ui/link";

export function ReliefSummary({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogBody>
        <DialogHeader>
          <DialogTitle>Your tax relief for 2025</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-content text-txt-black-700">
            You are claiming RM 9,000.00 individual relief and RM 2,500.00 for
            lifestyle purchases.
          </p>
        </DialogContent>
        <DialogFooter
          action={
            <Link primary href="/guidance/tax-relief">
              Read the guidance
            </Link>
          }
        >
          <DialogClose render={<Button variant="default-outline" />}>
            Back
          </DialogClose>
          <Button onClick={save} disabled={saving}>
            Save relief
          </Button>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
}
```

## Notes

- Always give the dialog a `DialogTitle`; it labels the dialog for screen readers. `DialogDescription` is announced with it.
- Focus moves into the dialog when it opens, stays there, and returns to the trigger when it closes. Esc, the close button and a click on the scrim close it.
- `dismissible={false}` on `DialogBody` stops a click outside from closing it (Esc and the close button still work). `onDismiss` runs when the user closes it with a click outside or a `DialogClose`.
- `hideClose` removes the built-in close button. Its accessible name is "Close" in English with no prop to change it, so to translate it, hide it and add your own `DialogClose` with an `aria-label`.
- `DialogFooter` `align` is `end` (default, buttons on the right), `start` or `full` (buttons share the width). Buttons stack full width on small screens.
- No dividers between header, body and footer: leave `border` off `DialogHeader` and `DialogFooter`; spacing separates them.
- The window is at most 512px wide on larger screens. Widen it with a layout class on `DialogBody` (for example `sm:max-w-2xl`), not by restyling it.
- `DialogIcon` sizes and colours one icon element (`variant` `primary`, `success`, `warning`, `danger` or `default`). For confirmations with an icon, use `AlertDialog`, which adds it for you.
- Prefer `render={<Button />}` on `DialogTrigger` and `DialogClose`. A single element child also works, for older code.
