---
title: Panel
description: The outcome at the top of a confirmation or result page, such as Payment received, with an icon and the reference number set large. Success, info, warning and danger.
category: Feedback and status
---

## When to use

- Use `Panel` first on a page that tells someone how a task ended: payment received, application submitted, action needed, application rejected.
- Use the `ConfirmationPanel` block for a whole confirmation screen (panel, what happens next and follow-up links) when it fits.
- Use `Callout` for a message inside a page that isn't its outcome, and a toast (`AutoToast` with `useToastManager`) for a brief note that an action worked.

## Usage

`PanelTitle` states the outcome in plain words and is the page's `h1`. `PanelReference` sets a value the user must keep (reference number, amount paid) large in tabular figures, easy to select and copy.

```tsx
import {
  Panel,
  PanelBody,
  PanelReference,
  PanelTitle,
} from "@/components/ui/panel";

export function ReliefSubmitted() {
  return (
    <Panel variant="info">
      <PanelTitle>Application submitted</PanelTitle>
      <PanelBody>
        <p>
          We will review your lifestyle relief claim within 14 working days. We
          have sent a copy to aminah@example.com.
        </p>
      </PanelBody>
      <PanelReference>MOF-2026-0412</PanelReference>
    </Panel>
  );
}
```

A failed or rejected outcome says why and what to do next:

```tsx
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelTitle } from "@/components/ui/panel";

export function PaymentFailed() {
  return (
    <Panel variant="danger">
      <PanelTitle>Your payment did not go through</PanelTitle>
      <PanelBody>
        <p>
          Your bank declined the payment of RM 1,250.00. You have not been
          charged. Try again, or pay with a different account.
        </p>
      </PanelBody>
      <Button render={<a href="/pay" />}>Try again</Button>
    </Panel>
  );
}
```

| `variant`           | Use for                                   |
| ------------------- | ----------------------------------------- |
| `success` (default) | Finished: payment received, approved      |
| `info`              | Submitted and being processed             |
| `warning`           | Needs action from the user                |
| `danger`            | Failed or rejected: say why and what next |

## Notes

- Each variant has its own icon so the outcome never relies on colour alone. Pass `icon` to replace it, or `icon={false}` to hide it.
- `PanelTitle` renders an `h1`. If the page already has one, pass `render={<h2 />}`.
- `PanelReference` takes `label` (default "Your reference number"); pass it to translate or relabel, for example `label="Amount paid"`.
- The panel is a wash of the variant's colour with no border or shadow. Don't nest it in a card.
