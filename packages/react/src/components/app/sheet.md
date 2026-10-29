---
title: Sheet
description: A plain modal panel fixed to one edge of the screen, built on Base UI Dialog. Minimal styling and no close button; prefer Drawer for new screens.
category: Overlays
---

## When to use

- Prefer `Drawer` for a panel that slides in from an edge: it has FTDS header, body and footer parts, a close button, the scrim and swipe to dismiss.
- Use `Sheet` only when you want a bare edge panel and will lay out its content yourself.
- Use `Dialog` for a short focused task or a confirmation in the middle of the screen, and `AlertDialog` for a destructive confirmation.

## Usage

`SheetContent` renders its own portal and, by default, a `SheetOverlay` behind the panel. `side` is `right` (default), `left`, `top` or `bottom`. There is no built-in close button: add a `SheetClose`.

```tsx
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function OfficerNotes() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="default-outline" />}>
        Case notes
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Notes for MOF-2026-0412</SheetTitle>
          <SheetDescription>
            Visible to officers in the Relief Assessment Unit.
          </SheetDescription>
        </SheetHeader>
        <p className="text-content text-txt-black-900 flex-1">
          Applicant sent a corrected EA form on 21 October 2026. Receipts match
          the RM 2,500.00 claimed.
        </p>
        <SheetFooter>
          <SheetClose render={<Button variant="default-outline" />}>
            Close
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

## Notes

- Focus is trapped while open, and Esc and a click on the overlay close it (Base UI Dialog). It does not close on a swipe.
- Always give it a `SheetTitle`; it names the dialog for screen readers. `SheetDescription` is announced with it.
- Open state follows Base UI: `defaultOpen`, or `open` with `onOpenChange`.
- The panel is Sheet-toned with the dialog shadow, over a scrim of Ink at 40%; `overlay={false}` removes the scrim. It has no close button of its own: put a `SheetClose` in it.
- Left and right sheets are three quarters of the screen wide, up to `sm:max-w-sm`; top and bottom sheets span the width. Change the width with `className`.
