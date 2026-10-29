---
title: Payment Summary
description: The review step before paying (payee, line items, total, payment method and one "Pay RM …" button), and PaymentReceipt, the paid receipt that comes back.
---

## When to use

- Use `PaymentSummary` on the page before the citizen goes to FPX, the card provider or DuitNow QR, after `CheckAnswers` when an application has a fee, or on its own to pay a bill.
- Use `PaymentReceipt`, from the same file, on the page the payment provider returns to after a successful payment.
- Use `ConfirmationPanel` after a submission that involved no payment, and `SummaryList` or `Table` to show amounts that aren't being paid now.

## Usage

Amounts are numbers in ringgit (formatted as "RM 51.50") or strings shown as given. `total` defaults to the sum of the numeric item amounts. The block renders a `<form>` and passes the submit event to `onPay`; check that a method is chosen and pass `methodError` back if not.

```tsx
import { useState } from "react";
import { PaymentSummary } from "@/components/blocks/payment-summary";

export function PayApplicationFee({
  startPayment,
}: {
  startPayment: (method: string) => void;
}) {
  const [method, setMethod] = useState<string | null>(null);
  const [error, setError] = useState<string>();
  const [starting, setStarting] = useState(false);

  return (
    <PaymentSummary
      payee="Jabatan Akauntan Negara Malaysia"
      reference="BIL-2026-008812"
      items={[
        {
          label: "Application fee",
          amount: 50,
          description: "Application MOF-2026-0412",
        },
        { label: "Processing fee", amount: 1.5 },
      ]}
      selectedMethod={method}
      onMethodChange={(value) => {
        setMethod(value);
        setError(undefined);
      }}
      methodError={error}
      pending={starting}
      onPay={(event) => {
        event.preventDefault();
        if (!method) {
          setError("Choose how you want to pay");
          return;
        }
        setStarting(true);
        startPayment(method);
      }}
    />
  );
}
```

The receipt after a successful payment:

```tsx
import { PaymentReceipt } from "@/components/blocks/payment-summary";
import { Link } from "@/components/ui/link";

export function PaymentDone({ download }: { download: () => void }) {
  return (
    <PaymentReceipt
      amount={51.5}
      paidAt={new Date("2026-10-28T14:32:00+08:00")}
      transactionId="FPX2026102814320091"
      reference="BIL-2026-008812"
      payee="Jabatan Akauntan Negara Malaysia"
      method="FPX · Maybank2u"
      payer="Nur Aisyah binti Ahmad"
      items={[
        { label: "Application fee", amount: 50 },
        { label: "Processing fee", amount: 1.5 },
      ]}
      onPrint={() => window.print()}
      onDownload={download}
      actions={
        <Link href="/dashboard" primary>
          Go to your dashboard
        </Link>
      }
    />
  );
}
```

Your own methods and Bahasa Melayu labels. `labels.pay` replaces `{amount}` with the formatted total:

```tsx
import type { FormEvent } from "react";
import { PaymentSummary } from "@/components/blocks/payment-summary";

export function BayarCukaiJalan({
  onPay,
}: {
  onPay: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <PaymentSummary
      payee="Jabatan Pengangkutan Jalan Malaysia"
      reference="JPJ-2026-551203"
      items={[{ label: "Cukai jalan 12 bulan", amount: 90 }]}
      methods={[
        {
          value: "fpx",
          label: "Perbankan dalam talian FPX",
          description: "Bayar dari akaun bank anda.",
        },
        {
          value: "duitnow-qr",
          label: "DuitNow QR",
          description: "Imbas kod QR dengan aplikasi bank atau e-dompet anda.",
        },
      ]}
      defaultMethod="fpx"
      onPay={onPay}
      labels={{
        title: "Semak bayaran anda",
        payTo: "Bayar kepada",
        reference: "Rujukan bil",
        total: "Jumlah perlu dibayar",
        methodTitle: "Bagaimana anda mahu membayar?",
        pay: "Bayar {amount}",
        secure:
          "Bayaran anda diproses dengan selamat. Anda akan ke bank atau penyedia kad anda untuk mengesahkannya, kemudian kembali ke sini untuk resit anda.",
        errorTitle: "Terdapat masalah",
      }}
    />
  );
}
```

## Notes

- The default methods are FPX online banking (`"fpx"`), debit or credit card (`"card"`) and DuitNow QR (`"duitnow-qr"`). `methods` replaces them; each is `{ value, label, description? }`.
- The method can be controlled (`selectedMethod`, with `null` for nothing chosen) or uncontrolled (`defaultMethod`). Either way, `onMethodChange` reports the choice; keep it in state to read it in `onPay`.
- With `methodError` set, an `ErrorSummary` appears under the title and takes focus, linking to the first method, and the same message shows under the methods.
- The title ("Review your payment", or "Payment successful" on the receipt) is the page's `h1`. Set `currency` and `locale` (default `"MYR"` and `"en-MY"`) to change the formatting.
- The pay button says the total ("Pay RM 51.50"), so people know exactly what they are confirming. `pending` disables it while you set up the payment; content in `children` sits above it (terms, a due-date notice).
- The block doesn't talk to a payment provider: `onPay` is where you redirect to FPX, the card page or a QR code.
- `PaymentReceipt` shows the date and time (a `Date` is formatted with `locale`), transaction ID and whichever of `reference`, `payee`, `method` and `payer` you pass. Print and download buttons appear only with `onPrint` and `onDownload`.
- The installed file is yours: edit it when the props don't cover what you need.
