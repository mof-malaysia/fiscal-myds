import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  PaymentReceipt,
  PaymentSummary,
  type PaymentLineItem,
} from "@mof-malaysia/ftds-react/payment-summary";
import { Link } from "@mof-malaysia/ftds-react/link";

/**
 * ### Overview
 * **PaymentSummary** is the review step before paying: who is being paid, each
 * line item and the total, how to pay (FPX online banking, card or DuitNow QR by
 * default), one "Pay RM …" button and a secure-payment reassurance.
 *
 * **PaymentReceipt** is what comes back: a paid status, the amount, and the
 * details that prove it (date, transaction ID, reference, method, payer), with
 * print and download.
 *
 * Amounts are numbers in ringgit, formatted as MYR, or preformatted strings.
 *
 * ### Usage
 * ```tsx
 * <PaymentSummary
 *   payee="Jabatan Akauntan Negara Malaysia"
 *   reference="BIL-2026-008812"
 *   items={[{ label: "Application fee", amount: 50 }]}
 *   selectedMethod={method}
 *   onMethodChange={setMethod}
 *   onPay={(event) => { event.preventDefault(); startPayment(method); }}
 * />
 *
 * <PaymentReceipt amount={50} paidAt={paidAt} transactionId="FPX2026…" onPrint={print} />
 * ```
 */
const meta: Meta<typeof PaymentSummary> = {
  title: "App/Blocks/PaymentSummary",
  component: PaymentSummary,
  parameters: { layout: "padded" },
};

export default meta;

const ITEMS: PaymentLineItem[] = [
  {
    label: "Licence renewal fee",
    description: "Money lending licence, 1 year",
    amount: 1500,
  },
  { label: "Late renewal charge", amount: 50 },
  { label: "Online payment fee", amount: 1 },
];

const Interactive = () => {
  const [method, setMethod] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string>();
  return (
    <PaymentSummary
      payee="Jabatan Akauntan Negara Malaysia"
      reference="BIL-2026-008812"
      items={ITEMS}
      selectedMethod={method}
      onMethodChange={(value) => {
        setMethod(value);
        setError(undefined);
      }}
      methodError={error}
      onPay={(event) => {
        event.preventDefault();
        if (!method) setError("Choose how you want to pay");
      }}
    />
  );
};

/** Pay without choosing a method to see the error. */
export const Default = createRender(Interactive);

export const MethodError = createRender(() => (
  <PaymentSummary
    payee="Jabatan Akauntan Negara Malaysia"
    reference="BIL-2026-008812"
    items={ITEMS}
    methodError="Choose how you want to pay"
  />
));

/** Your own methods, a preformatted total and a notice above the button. */
export const CustomMethods = createRender(() => (
  <PaymentSummary
    payee="Lembaga Hasil Dalam Negeri"
    items={[{ label: "Instalment 3 of 12", amount: "RM 412.50" }]}
    total="RM 412.50"
    defaultMethod="fpx"
    methods={[
      { value: "fpx", label: "FPX online banking" },
      { value: "jompay", label: "JomPAY", description: "Biller code 0001" },
    ]}
  >
    <p className="text-txt-black-700 text-content">
      By paying you agree to the{" "}
      <Link href="#" primary>
        payment terms
      </Link>
      .
    </p>
  </PaymentSummary>
));

export const Pending = createRender(() => (
  <PaymentSummary
    payee="Jabatan Akauntan Negara Malaysia"
    items={ITEMS}
    defaultMethod="fpx"
    pending
  />
));

const Receipt = () => (
  <PaymentReceipt
    amount={1551}
    paidAt={new Date("2026-10-28T14:32:00+08:00")}
    transactionId="FPX2026102814320091"
    reference="BIL-2026-008812"
    payee="Jabatan Akauntan Negara Malaysia"
    method="FPX · Maybank2u"
    payer="Nur Aisyah binti Ahmad"
    items={ITEMS}
    onPrint={() => {}}
    onDownload={() => {}}
  />
);

/** PaymentReceipt: the page after a successful payment. */
export const ReceiptPage = createRender(Receipt);

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white flex flex-col gap-12 p-6">
      <PaymentSummary
        payee="Jabatan Akauntan Negara Malaysia"
        reference="BIL-2026-008812"
        items={ITEMS}
        defaultMethod="fpx"
      />
      <Receipt />
    </div>
  ),
  "dark",
);
