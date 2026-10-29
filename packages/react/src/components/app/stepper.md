---
title: Stepper
description: Shows where someone is in a multi-step form. Lists every step on wide containers and collapses to "Step 2 of 4" with a progress bar on narrow ones.
category: Navigation
---

## When to use

- Use `Stepper` at the top of each page of a linear, multi-step form: details, income, reliefs, check and submit.
- `FormStep` already renders a `Stepper` when you pass it `steps`; use the block for whole form pages.
- Use `TaskList` instead when the parts can be done in any order and the user returns to a list between them. Use `Progress` for the progress of an upload or a process.

## Usage

`current` is the zero-based index of the current step. Steps before it are complete and show a check; give them `href` to link back.

```tsx
import { Stepper, StepperItem } from "@/components/ui/stepper";

export function ReliefProgress({ current }: { current: number }) {
  return (
    <Stepper current={current} aria-label="Application progress">
      <StepperItem href="/apply/details">Your details</StepperItem>
      <StepperItem href="/apply/income">Your income</StepperItem>
      <StepperItem href="/apply/reliefs">Reliefs</StepperItem>
      <StepperItem>Check and submit</StepperItem>
    </Stepper>
  );
}
```

Translate the built-in text with `formatStep` and `completeLabel`, and route links on the client with `onLinkClick`:

```tsx
import type { MouseEvent } from "react";
import { Stepper, StepperItem } from "@/components/ui/stepper";

export function KemajuanPermohonan({
  current,
  navigate,
}: {
  current: number;
  navigate: (href: string) => void;
}) {
  const go = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(href);
  };
  return (
    <Stepper
      current={current}
      aria-label="Kemajuan permohonan"
      formatStep={(step, total) => `Langkah ${step} daripada ${total}`}
      completeLabel="Selesai"
    >
      <StepperItem href="/mohon/butiran" onLinkClick={go("/mohon/butiran")}>
        Butiran anda
      </StepperItem>
      <StepperItem
        href="/mohon/pendapatan"
        onLinkClick={go("/mohon/pendapatan")}
      >
        Pendapatan
      </StepperItem>
      <StepperItem>Semak dan hantar</StepperItem>
    </Stepper>
  );
}
```

## Notes

- `href` only takes effect on complete steps; current and upcoming steps are never links.
- The current step has `aria-current="step"`, and complete steps announce `completeLabel` (default "Completed") before their name.
- The layout follows the width of the stepper's container, not the screen: below 36rem it shows the "Step 2 of 4: Your income" line and a progress bar.
- `state` on a `StepperItem` (`complete`, `current` or `upcoming`) overrides the state worked out from `current`. The narrow summary follows a step marked `current` too.
- The stepper is a `nav` named "Progress" by default; pass `aria-label` to name it for the form.
- Children must be `StepperItem`s; the name of the current one is shown in the narrow summary.
