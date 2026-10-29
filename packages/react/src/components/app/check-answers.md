---
title: Check Answers
description: The last page before submitting an application. Every answer by section with a Change link, an optional declaration to accept, and "Accept and submit".
---

## When to use

- Use `CheckAnswers` as the final step of a multi-step service built with `FormStep`, so people can review and change their answers before they submit.
- After a successful submit, show `ConfirmationPanel`. If there is a fee, go to `PaymentSummary` after this page.
- Use `SummaryList` to show a record's details anywhere else (a case page, an account page), where nothing is being submitted.

## Usage

Group rows into `sections`. Each row's `changeHref` (or `changeRender` with your router's link) is the step that asked the question. The block renders a `<form>` and passes the submit event to `onSubmit`; check the declaration there and pass `declarationError` back if it wasn't ticked.

```tsx
import { useState } from "react";
import { CheckAnswers } from "@/components/blocks/check-answers";

export function CheckYourAnswers({
  submit,
  submitting,
}: {
  submit: () => void;
  submitting: boolean;
}) {
  const [error, setError] = useState<string>();

  return (
    <CheckAnswers
      sections={[
        {
          title: "Your details",
          rows: [
            {
              label: "Full name",
              value: "Nur Aisyah binti Ahmad",
              changeHref: "/apply/details",
            },
            {
              label: "IC number",
              value: "900101-14-5678",
              changeHref: "/apply/details",
            },
          ],
        },
        {
          title: "Your relief",
          rows: [
            {
              label: "Relief type",
              value: "Medical treatment for parents",
              changeHref: "/apply/relief",
            },
            {
              label: "Amount claimed",
              value: "RM 5,000.00",
              changeHref: "/apply/relief",
            },
          ],
        },
      ]}
      declaration="I confirm that the information I have given is true and complete. I understand that giving false information may lead to a penalty."
      declarationError={error}
      pending={submitting}
      onSubmit={(event) => {
        event.preventDefault();
        const accepted = new FormData(event.currentTarget).get("declaration");
        if (!accepted) {
          setError("Confirm the declaration to submit your application");
          return;
        }
        setError(undefined);
        submit();
      }}
    />
  );
}
```

No declaration, a fee notice between the answers and the button (`children`), and Bahasa Melayu labels:

```tsx
import {
  CheckAnswers,
  type CheckAnswersSection,
} from "@/components/blocks/check-answers";
import { Callout, CalloutContent, CalloutTitle } from "@/components/ui/callout";

export function SemakJawapan({
  sections,
  onSubmit,
}: {
  sections: CheckAnswersSection[];
  onSubmit: () => void;
}) {
  return (
    <CheckAnswers
      sections={sections}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      labels={{
        title: "Semak jawapan anda sebelum menghantar",
        description:
          "Pastikan semuanya betul. Anda boleh menukar jawapan sebelum menghantar.",
        change: "Tukar",
        submit: "Terima dan hantar",
        errorTitle: "Terdapat masalah",
      }}
    >
      <Callout variant="info">
        <CalloutTitle>Fi sebanyak RM 50.00 dikenakan</CalloutTitle>
        <CalloutContent>
          Anda akan membayarnya di halaman seterusnya.
        </CalloutContent>
      </Callout>
    </CheckAnswers>
  );
}
```

## Notes

- The block's title ("Check your answers before submitting") is the page's `h1`; change it with `labels.title`. Section titles are `h2`s.
- Each "Change" link carries hidden text naming what it changes: the row's `label` when it is a string, or `changeHint`. Set `changeHint` when the label is not a string or would read badly ("Change address").
- The declaration checkbox submits as `declaration` in the form data. Its `id` is `"declaration"` unless you set `declarationId`; the error summary links to it.
- With `declarationError` set, an `ErrorSummary` appears at the top and takes focus, and the same message shows under the checkbox. Write it as what to do: "Confirm the declaration to submit your application".
- `pending` disables the button and marks the form busy while you submit. The button reads "Accept and submit" whether or not there is a declaration; change `labels.submit` if that doesn't fit.
- The installed file is yours: edit it when the props don't cover what you need.
