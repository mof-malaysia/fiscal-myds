---
title: Decision Panel
description: Records an officer's decision on a case (approve, return for changes or reject) with a reason, an option to notify the applicant, and a confirmation before rejecting.
---

## When to use

- Use `DecisionPanel` on an officer's case page, usually beside or below the case details and its `ActivityTimeline`, to record the outcome of a review.
- Use `WorkQueue` for the list of cases and its bulk actions (assign, change status) when officers act on many cases at once.
- For any other destructive confirmation, use `AlertDialog` with `variant="danger"` directly.

## Usage

`onDecide` is called only with a valid result: a decision is chosen, and a reason is given for `"return"` and `"reject"`. A rejection first opens a danger `AlertDialog` ("Reject this application?"), and `onDecide` runs only after "Reject application" is pressed. Show save failures with `errors.form`.

```tsx
import { useState } from "react";
import {
  DecisionPanel,
  type DecisionResult,
} from "@/components/blocks/decision-panel";

export function CaseDecision({
  caseRef,
  save,
}: {
  caseRef: string;
  save: (caseRef: string, result: DecisionResult) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <DecisionPanel
      pending={saving}
      errors={{ form: error }}
      onDecide={async (result) => {
        setSaving(true);
        setError(undefined);
        try {
          await save(caseRef, result);
        } catch {
          setError(
            "The decision was not saved. Check your connection and try again.",
          );
        } finally {
          setSaving(false);
        }
      }}
    />
  );
}
```

Only approve or return, with the applicant not notified by default, in Bahasa Melayu:

```tsx
import {
  DecisionPanel,
  type DecisionResult,
} from "@/components/blocks/decision-panel";

export function KeputusanSemakan({
  onDecide,
}: {
  onDecide: (result: DecisionResult) => void;
}) {
  return (
    <DecisionPanel
      options={["approve", "return"]}
      defaultNotify={false}
      onDecide={onDecide}
      labels={{
        title: "Keputusan anda",
        description: "Keputusan dan sebab akan ditambah ke sejarah kes.",
        approve: "Luluskan",
        approveHint: "Permohonan memenuhi syarat.",
        return: "Pulangkan untuk pembetulan",
        returnHint: "Pemohon boleh membetulkannya dan menghantar semula.",
        reason: "Sebab",
        reasonOptional: "Pilihan. Dipaparkan kepada pemohon.",
        reasonRequired:
          "Dipaparkan kepada pemohon. Nyatakan apa yang perlu dibetulkan.",
        chooseDecision: "Pilih keputusan",
        giveReason: "Masukkan sebab untuk pemohon",
        notify: "E-mel pemohon tentang keputusan ini",
        submit: "Rekod keputusan",
      }}
    />
  );
}
```

## Notes

- `DecisionResult` is `{ decision, reason, notify }`. `reason` is trimmed; `notify` is always `false` when `showNotify` is `false`.
- The panel validates on submit: with no decision it shows "Choose a decision", and with an empty reason for return or reject it shows "Enter a reason for the applicant". `errors.decision` and `errors.reason` replace those messages; `errors.form` shows above the button in an alert.
- The reason hint switches between optional and required as the decision changes. The reason is shown to the applicant, so the default hint asks the officer to say what to fix or why.
- When "Reject" is chosen the submit button turns red (`danger-fill`). The confirmation dialog's title, description and button come from `confirmTitle`, `confirmDescription` and `confirmAction`; keep the button repeating the verb ("Reject application").
- The heading "Your decision" is an `h2` and names the form. Use `decision`/`defaultDecision` with `onDecisionChange` to control or preset the choice.
- The panel keeps the reason after `onDecide`; navigate away or remount it (change its `key`) once the decision is saved.
- It sits inside the page's density; in `DeskShell` or a `data-density="compact"` container it is compact.
- The installed file is yours: edit it when the props don't cover what you need, such as a fourth decision.
