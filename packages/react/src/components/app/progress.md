---
title: Progress
description: A bar showing how far a task has got, such as an upload or a batch being processed. Shows an animated sweep when the amount is unknown.
category: Feedback and status
---

## When to use

- Use `Progress` for a task moving towards done: uploading documents, processing a batch of payments, generating a report.
- Use `Meter` for a measured level that isn't a task (budget spent, storage used).
- Use `Stepper` or `FormStep` to show where someone is in a multi-page service, and `Spinner` for a short wait inside a button or small area.

## Usage

With `label` and no children it lays itself out: label left, value right, bar below. The value is a percentage of `max` (default 100). `successOnComplete` turns the bar Success green once it reaches `max`.

```tsx
import { Progress } from "@/components/ui/progress";

export function UploadProgress({ percent }: { percent: number }) {
  return (
    <Progress
      value={percent}
      label={percent < 100 ? "Uploading documents" : "Upload complete"}
      successOnComplete
    />
  );
}
```

Pass `value={null}` while the amount is unknown; the bar sweeps across the rail:

```tsx
import { Progress } from "@/components/ui/progress";

export function CheckingDetails() {
  return <Progress value={null} label="Checking your details with JPN" />;
}
```

Compose the parts for your own value text:

```tsx
import {
  Progress,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "@/components/ui/progress";

export function BatchProgress({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  return (
    <Progress value={done} max={total} format={{ style: "decimal" }}>
      <ProgressLabel>Processing refunds</ProgressLabel>
      <ProgressValue>
        {(_, value) => `${value} of ${total} processed`}
      </ProgressValue>
      <ProgressTrack size="small" />
    </Progress>
  );
}
```

## Notes

- Always pair the bar with a label (`label` or `ProgressLabel`), so the state is never carried by the bar alone. Change the label when the task finishes or fails.
- Under reduced motion the unknown-amount bar is still and faded instead of sweeping.
- `ProgressValue` formats with `format` and `locale` on the root (a percentage by default); pass a function child `(formattedValue, value) => ReactNode` to write your own text.
- `size` (`small`, `medium` default, `large`) sets the bar thickness. In composed layouts pass `size` to `ProgressTrack`, which renders a `ProgressIndicator` when it has no children.
- For uploads inside a form, `FileUpload` already shows a progress bar per file.
