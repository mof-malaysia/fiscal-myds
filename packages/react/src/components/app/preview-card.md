---
title: Preview Card
description: A short preview of what a link points to, shown on hover or focus, such as an officer's unit and contact details. The link must work on its own.
category: Overlays
---

## When to use

- Use `PreviewCard` to preview a person, case or document behind a link, so officers can check it without leaving the page.
- The card is a convenience: never put the only copy of information or an action in it, since touch and many keyboard users won't see it.
- Use `Tooltip` for a short label on a control, and `Popover` for content that opens on click and can hold interactive controls.

## Usage

`PreviewCardTrigger` renders an `<a>` styled as an inline link; give it a real `href`.

```tsx
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";

export function AssignedOfficer() {
  return (
    <p className="text-content text-txt-black-700">
      Assigned to{" "}
      <PreviewCard>
        <PreviewCardTrigger href="/officers/1024">
          Nur Aisyah binti Rahman
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div className="flex flex-col gap-1">
            <span className="text-txt-black-900 font-semibold">
              Nur Aisyah binti Rahman
            </span>
            <span className="text-txt-black-700">
              Senior Assistant Director, Budget Division
            </span>
            <span className="text-txt-black-700">
              14 open cases, 3 due this week
            </span>
          </div>
        </PreviewCardContent>
      </PreviewCard>
    </p>
  );
}
```

## Notes

- The card opens on hover or keyboard focus of the trigger and closes when the pointer or focus leaves (Base UI PreviewCard). Adjust the timing with `delay` and `closeDelay` on `PreviewCardTrigger`.
- `PreviewCardContent` is 18rem wide, centred under the trigger by default; positioning props (`side`, `align`, `sideOffset`) go to the positioner.
- Use `render` on `PreviewCardTrigger` for your router's link.
- Keep the content short and read-only: a name, a role, a status, a count.
