---
title: Popover
description: A small floating panel anchored to its trigger, opened by a click. Use it for short help or a few controls that don't need a full dialog.
category: Overlays
---

## When to use

- Use `Popover` for a little extra content beside a control: an explanation with a link, a short filter form, a share panel. It doesn't block the page.
- Use `Tooltip` for a plain text label on hover or focus, `PreviewCard` for a preview of a link's destination on hover, and `Menu` for a list of actions.
- Use `Dialog` when the content needs the user's full attention, or is longer than a few lines.
- Use `Details` for help that should open inline and push the page down rather than float over it.

## Usage

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuestionCircleIcon } from "@/components/ui/icons/question-circle";

export function ChargeableIncomeHelp() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="default-ghost"
            iconOnly
            aria-label="What is chargeable income?"
          />
        }
      >
        <ButtonIcon>
          <QuestionCircleIcon />
        </ButtonIcon>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        aria-label="Chargeable income"
      >
        <div className="gap-stack-sm flex flex-col">
          <p className="text-content text-txt-black-700">
            Your total income minus the tax relief you claim. Your tax is worked
            out on this amount.
          </p>
          <Link primary href="/guidance/chargeable-income">
            How chargeable income is worked out
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

Controlled, to close the popover after its form is applied:

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function MinimumAmountFilter({
  onApply,
}: {
  onApply: (amount: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="default-outline" />}>
        Minimum amount
      </PopoverTrigger>
      <PopoverContent align="start" aria-label="Filter by minimum amount">
        <div className="gap-stack-md flex flex-col">
          <Field name="minAmount">
            <FieldLabel>Minimum amount (RM)</FieldLabel>
            <Input
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <Button
            onClick={() => {
              onApply(amount);
              setOpen(false);
            }}
          >
            Apply filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## Notes

- Render the trigger as a `Button` with `render`. An icon-only trigger needs `iconOnly` and an `aria-label`.
- `PopoverContent` portals to `document.body` and forwards positioning props (`side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding`, ...) to Base UI's positioner. Defaults: `align="center"`, `sideOffset={4}`. Pass `container` to portal somewhere else.
- The panel is 288px wide (`w-72`) with 16px padding. Change the width with a layout class on `PopoverContent` if the content needs it.
- The popup has the dialog role. FTDS doesn't export a popover title part, so give `PopoverContent` an `aria-label` (or `aria-labelledby` pointing at a heading inside).
- Esc and a click outside close it, and focus returns to the trigger.
- It floats, so it already has the Float shadow; don't add borders or shadows to the content inside.
