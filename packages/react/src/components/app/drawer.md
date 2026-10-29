---
title: Drawer
description: A panel that slides in from an edge and can be swiped away: filters as a bottom sheet on a phone, or a case's details in a side panel. Traps focus; Esc, scrim and close dismiss it.
category: Overlays
---

## When to use

- Use `Drawer` for secondary content or a short task that should keep the page in view: filters, a record's details beside a list, a mobile menu.
- Use `Dialog` for a focused task or confirmation in the middle of the screen, and `AlertDialog` for a destructive confirmation.
- Use `SplitPane` when the detail should stay open beside the list rather than over it. `Sheet` is a bare edge panel without these parts; prefer `Drawer`.

## Usage

`side` sets the edge and the swipe direction together: `bottom` (default), `top`, `left` or `right`. `DrawerContent` renders the portal, the scrim and a ghost close button in the top corner.

```tsx
import { Button } from "@/components/ui/button";
import {
  CheckboxGroup,
  CheckboxGroupItem,
} from "@/components/ui/checkbox-group";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field } from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";

export function ApplicationFilters({ onApply }: { onApply: () => void }) {
  return (
    <Drawer side="right">
      <DrawerTrigger render={<Button variant="default-outline" />}>
        Filters
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter applications</DrawerTitle>
          <DrawerDescription>
            Show only the applications you need to act on.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <Field name="status">
            <Fieldset render={<CheckboxGroup defaultValue={["pending"]} />}>
              <FieldsetLegend>Status</FieldsetLegend>
              <CheckboxGroupItem value="pending" label="Pending review" />
              <CheckboxGroupItem value="approved" label="Approved" />
              <CheckboxGroupItem value="returned" label="Returned" />
              <CheckboxGroupItem value="overdue" label="Overdue" />
            </Fieldset>
          </Field>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button variant="default-outline" />}>
            Cancel
          </DrawerClose>
          <DrawerClose render={<Button />} onClick={onApply}>
            Show results
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
```

Controlled, to open a record's details from a row:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function CasePeek({ reference }: { reference: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="default-ghost" onClick={() => setOpen(true)}>
        View {reference}
      </Button>
      <Drawer side="right" open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{reference}</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            Lifestyle relief claim of RM 2,500.00, submitted 14 October 2026.
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
```

## Notes

- Focus is trapped while open. Esc, the close button, the scrim and a swipe towards the edge all dismiss it (Base UI Drawer).
- Always include a `DrawerTitle`: it names the dialog for screen readers.
- `DrawerBody` scrolls; the header and footer stay put. `DrawerFooter` stacks its buttons full-width on narrow screens and puts them in a row from `sm`, safe area included.
- Bottom drawers show a grab handle by default; set `handle` to show or hide it on any side. `hideClose` removes the close button; `closeLabel` translates its accessible name (default "Close").
- Left and right drawers are up to 24rem wide; top and bottom drawers are up to 85% of the screen height.
- `keepMounted` keeps the content in the DOM while closed. `container` portals it somewhere other than `document.body`.
- Open state follows Base UI: `defaultOpen`, or `open` with `onOpenChange`.
