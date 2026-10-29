---
title: Confirmation Panel
description: The page after a successful submission. A success panel with a large, copyable reference number, where the confirmation went, what happens next, and the ways out.
---

## When to use

- Use `ConfirmationPanel` as the page after a citizen submits an application, a declaration or a change, so they can see at a glance that it went through and what happens next.
- Use `PaymentReceipt` (from `@/components/blocks/payment-summary`) after a payment instead: it shows the amount and transaction details.
- Use a toast (`useToastManager`) for small confirmations that don't need their own page (a file uploaded), and `Callout` for a success message inside a page.

## Usage

```tsx
import { ConfirmationPanel } from "@/components/blocks/confirmation-panel";

export function ApplicationSubmitted() {
  return (
    <ConfirmationPanel
      reference="MOF-2026-0412"
      description="Received on 28 October 2026 at 2:32 pm"
      emailNote="We have sent a confirmation to nur.aisyah@example.com. Keep your reference number in case you need to contact us."
      nextSteps={[
        "An officer will review your application within 14 working days.",
        "If we need more information, we will email you and show it on your dashboard.",
        "Approved relief is applied to your 2025 tax assessment.",
      ]}
      onPrint={() => window.print()}
      dashboardHref="/dashboard"
    />
  );
}
```

A different kind of submission with its own `title`, and Bahasa Melayu labels:

```tsx
import { ConfirmationPanel } from "@/components/blocks/confirmation-panel";

export function ButiranDikemas() {
  return (
    <ConfirmationPanel
      title="Butiran bank anda telah dikemas kini"
      reference="MOF-2026-11873"
      nextSteps={["Bayaran balik seterusnya akan dibuat ke akaun baharu anda."]}
      dashboardHref="/papan-pemuka"
      labels={{
        referenceLabel: "Nombor rujukan anda",
        copy: "Salin nombor rujukan",
        copied: "Disalin",
        nextStepsTitle: "Apa yang berlaku seterusnya",
        print: "Cetak halaman ini",
        dashboard: "Pergi ke papan pemuka anda",
      }}
    />
  );
}
```

## Notes

- The title ("Application submitted" by default) is the page's `h1`; set `title` when something other than an application was submitted.
- The Copy button copies `reference` and announces "Copied" through a status region. Give it the reference people quote when they contact you.
- `nextSteps` render as a numbered list under "What happens next", in the order given. Say what happens and when, in plain words.
- The Print button appears only with `onPrint`; the dashboard link only with `dashboardHref` or `dashboardRender` (your router's link). Add more with `actions`, and anything else (a survey link, contact details) as `children`, which sit after the next steps.
- The panel has no filled blue button: Print is a secondary button and the dashboard is a link.
- The installed file is yours: edit it when the props don't cover what you need.
