---
title: Label
description: A plain text label tied to a control with htmlFor. Only for controls outside a Field; inside a Field use FieldLabel.
category: Forms and inputs
---

## When to use

- Use `FieldLabel` for every control inside a `Field`. It is wired to the control for you and is styled as a form label (medium weight, Ink).
- Use `Label` only when a control has no `Field` around it, such as a switch in a settings row or a checkbox in a toolbar, and link it with `htmlFor` and the control's `id`.
- For the options of a radio group, use `RadioLabel`.

## Usage

```tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function DeadlineReminders({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Label htmlFor="deadline-reminders">
        Email me before tax filing deadlines
      </Label>
      <Switch id="deadline-reminders" checked={on} onCheckedChange={onChange} />
    </div>
  );
}
```

## Notes

- `Label` renders a `<label>` in regular weight, Ink Secondary. `size` is `small`, `medium` (default) or `large`.
- It does not know about the control's state. It dims when it follows a disabled control marked with the `peer` class, or sits inside a disabled element marked `group`; otherwise style a disabled row yourself.
- Use `render` to output another element with the same styles, for example `render={<span />}` for text that only looks like a label.
- A label that only visually sits next to a control isn't enough: always set `htmlFor` (or wrap the control in the label) so clicking it works and screen readers read it.
