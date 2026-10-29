---
title: Switch
description: Turns a setting on or off straight away, with no submit step, such as email reminders. For a choice saved with a form, use a Checkbox.
category: Forms and inputs
---

## When to use

- Use `Switch` for a setting that takes effect the moment it is flipped: notifications, a preference, showing extra columns.
- Use `Checkbox` for a choice that is sent with a form and only counts after the person presses Submit or Save.
- Use `Toggle` for a pressed button in a toolbar (Bold, "Show archived"), and `ThemeSwitch` for light and dark mode.

## Usage

Put the switch in a `Field` with a `FieldItem`, so its label sits beside it and is linked to it. Save the change as soon as it happens:

```tsx
import { useState } from "react";
import {
  Field,
  FieldDescription,
  FieldItem,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export function ReminderSetting({
  save,
}: {
  save: (on: boolean) => Promise<void>;
}) {
  const [on, setOn] = useState(true);
  const [saving, setSaving] = useState(false);

  return (
    <Field name="reminders" disabled={saving}>
      <FieldItem className="justify-between gap-4">
        <FieldLabel>Email me before tax filing deadlines</FieldLabel>
        <Switch
          checked={on}
          onCheckedChange={async (next) => {
            setOn(next);
            setSaving(true);
            await save(next);
            setSaving(false);
          }}
        />
      </FieldItem>
      <FieldDescription>
        We send a reminder 14 days before each deadline.
      </FieldDescription>
    </Field>
  );
}
```

Outside a form, wrapping the switch in a `<label>` is enough:

```tsx
import { Switch } from "@/components/ui/switch";

export function ShowClosedCases() {
  return (
    <label className="text-content text-txt-black-900 flex items-center gap-3">
      <Switch defaultChecked size="small" />
      Show closed cases
    </label>
  );
}
```

## Notes

- State: `defaultChecked` uncontrolled, or `checked` with `onCheckedChange`.
- The label names the setting, not the state ("Email reminders", not "Turn on email reminders"). The switch itself shows on or off; don't add "On" and "Off" text next to it.
- If saving can fail, put the switch back and say so (for example with a toast from `useToastManager`), so the screen never shows a setting that wasn't saved.
- `size` is `small`, `medium` (default) or `large`. Inside an invalid `Field` it shows a red outline.
- Don't put switches in a form that has a Submit button; use checkboxes there.
