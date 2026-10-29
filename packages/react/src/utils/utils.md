---
title: Utils
description: Helper functions shared by FTDS components, chiefly clx for joining and merging Tailwind classes with FTDS tokens. Imported from @/lib/ftds/utils.
category: Utilities
---

## When to use

- Use `clx` whenever you combine class names: conditional classes, or a component's `className` merged with your own. It replaces shadcn's `cn`; don't add a separate `cn` helper.
- The other exports (`splitPositionerProps`, `pick`, `isEditable` and the `WithClassName` and `PositionerProps` types) are used inside FTDS components. You rarely need them in app code.

## Usage

`clx` takes any mix of strings, falsy values and arrays, joins them, and resolves Tailwind conflicts so the last class wins. It knows FTDS's own utilities (`text-title`, `gap-stack-md`, `p-surface`, `control-sm`, ...), so these merge correctly too:

```tsx
import type { ReactNode } from "react";
import { clx } from "@/lib/ftds/utils";

export function Panel({
  highlighted,
  className,
  children,
}: {
  highlighted?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={clx(
        "gap-stack-md p-surface flex flex-col rounded-lg",
        highlighted ? "bg-bg-primary-50" : "bg-bg-white",
        className,
      )}
    >
      {children}
    </section>
  );
}
```

Here `<Panel className="p-4">` replaces `p-surface` instead of adding a second padding.

## Notes

- Use `clx` for layout and for merging, not to recolour FTDS components; check their `variant` props first.
- `WithClassName<P>` narrows a Base UI props type's `className` (which may be a function of state) to a plain string, as FTDS parts do.
- `isEditable(target)` tells whether a key press lands in a text field, so a keyboard shortcut handler can ignore typing.
- `splitPositionerProps(props, defaults)` splits a popup's props into Base UI positioner props (`side`, `align`, `sideOffset`, ...) and the rest; `PositionerProps` is the matching type.
- `pick(items, key, value)` turns an array of objects into a `{ [key]: value }` map.
