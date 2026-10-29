"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  FormEvent,
  ReactNode,
  forwardRef,
  useId,
} from "react";
import { Button } from "@/components/ui/button";
import { Field as FieldPrimitive } from "@base-ui/react/field";
import { Field, FieldError } from "@/components/ui/field";
import {
  Radio,
  RadioButton,
  RadioHintText,
  RadioItem,
  RadioLabel,
} from "@/components/ui/radio";
import { ErrorSummary } from "@/components/ui/error-summary";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { DownloadIcon } from "@/components/ui/icons/download";
import { LockFillIcon } from "@/components/ui/icons/lock-fill";
import { PrinterIcon } from "@/components/ui/icons/printer";
import { clx } from "@/lib/ftds/utils";

/**
 * PaymentSummary is the review step before paying: who is being paid, each line
 * item and the total, how to pay (FPX online banking, card, DuitNow QR by default),
 * a secure-payment reassurance, and one "Pay RM …" button.
 *
 * PaymentReceipt is what comes back: a paid status, the amount, and the details
 * the citizen needs to prove it (date, transaction ID, reference, method, payer),
 * with print and download.
 *
 * Amounts are numbers in ringgit (formatted as MYR) or preformatted strings.
 *
 * @example
 * <PaymentSummary
 *   payee="Jabatan Akauntan Negara Malaysia"
 *   reference="BIL-2026-008812"
 *   items={[
 *     { label: "Application fee", amount: 50 },
 *     { label: "Processing fee", amount: 1.5 },
 *   ]}
 *   selectedMethod={method}
 *   onMethodChange={setMethod}
 *   onPay={(event) => { event.preventDefault(); pay(method); }}
 * />
 *
 * <PaymentReceipt
 *   amount={51.5}
 *   paidAt={new Date()}
 *   transactionId="FPX2026102814320091"
 *   reference="BIL-2026-008812"
 *   method="FPX · Maybank2u"
 *   payer="Nur Aisyah binti Ahmad"
 *   onPrint={() => window.print()}
 * />
 */

type Amount = number | string;

/** Formats ringgit as MYR ("RM 51.50"); strings pass through as given. */
function formatAmount(amount: Amount, locale: string, currency: string) {
  if (typeof amount === "string") return amount;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount,
  );
}

interface MoneyOptions {
  /** @default "MYR" */
  currency?: string;
  /** Locale for amounts and dates. @default "en-MY" */
  locale?: string;
}

/*========================================================================================================================*/

interface PaymentLineItem {
  label: ReactNode;
  amount: Amount;
  /** A second line, e.g. the period or the bill it settles. */
  description?: ReactNode;
}

interface PaymentMethod {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

interface PaymentSummaryLabels {
  title: string;
  payTo: string;
  reference: string;
  total: string;
  methodTitle: string;
  /** Button text. `{amount}` is replaced with the total. */
  pay: string;
  secure: string;
  errorTitle: string;
}

const DEFAULT_SUMMARY_LABELS: PaymentSummaryLabels = {
  title: "Review your payment",
  payTo: "Pay to",
  reference: "Bill reference",
  total: "Total to pay",
  methodTitle: "How do you want to pay?",
  pay: "Pay {amount}",
  secure:
    "Your payment is processed securely. You will go to your bank or card provider to confirm it, then come back here for your receipt.",
  errorTitle: "There is a problem",
};

const DEFAULT_METHODS: PaymentMethod[] = [
  {
    value: "fpx",
    label: "FPX online banking",
    description: "Pay from your bank account. Most Malaysian banks.",
  },
  {
    value: "card",
    label: "Debit or credit card",
    description: "Visa, Mastercard or American Express.",
  },
  {
    value: "duitnow-qr",
    label: "DuitNow QR",
    description: "Scan a QR code with your banking or e-wallet app.",
  },
];

interface PaymentSummaryProps
  extends Omit<ComponentProps<"form">, "title" | "onSubmit">,
    MoneyOptions {
  /** The agency or account being paid. */
  payee: ReactNode;
  /** Bill or application reference. */
  reference?: ReactNode;
  items: PaymentLineItem[];
  /** The amount to pay. Defaults to the sum of numeric item amounts. */
  total?: Amount;
  /** Payment methods to offer. Defaults to FPX, card and DuitNow QR. */
  methods?: PaymentMethod[];
  /** The chosen method (controlled). Pass `null` while nothing is chosen. */
  selectedMethod?: string | null;
  defaultMethod?: string;
  onMethodChange?: (method: string) => void;
  /** Shown when no method was chosen, e.g. "Choose how you want to pay". */
  methodError?: string;
  /** Called on submit. Call `event.preventDefault()` and start the payment. */
  onPay?: (event: FormEvent<HTMLFormElement>) => void;
  /** Disables the button while the payment is being set up. */
  pending?: boolean;
  /** Content above the button, e.g. terms or a due-date notice. */
  children?: ReactNode;
  labels?: Partial<PaymentSummaryLabels>;
}

const PaymentSummary = forwardRef<HTMLFormElement, PaymentSummaryProps>(
  (
    {
      payee,
      reference,
      items,
      total,
      methods = DEFAULT_METHODS,
      selectedMethod,
      defaultMethod,
      onMethodChange,
      methodError,
      onPay,
      pending = false,
      currency = "MYR",
      locale = "en-MY",
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_SUMMARY_LABELS, ...labelsProp };
    const id = useId();
    const methodTitleId = `${id}-method-title`;
    const firstMethodId = `${id}-method-0`;
    const sum = items.reduce(
      (acc, item) => acc + (typeof item.amount === "number" ? item.amount : 0),
      0,
    );
    const totalText = formatAmount(total ?? sum, locale, currency);

    return (
      <form
        ref={ref}
        noValidate
        aria-busy={pending || undefined}
        onSubmit={onPay}
        className={clx(
          "font-body text-txt-black-900 flex w-full max-w-2xl flex-col gap-8",
          className,
        )}
        {...props}
      >
        <h1 className="text-headline font-semibold text-balance">
          {labels.title}
        </h1>

        {methodError && (
          <ErrorSummary
            title={labels.errorTitle}
            errors={[{ id: firstMethodId, message: methodError }]}
          />
        )}

        <div className="bg-bg-washed p-surface flex flex-col gap-4 rounded-lg">
          <dl className="text-content m-0 grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
            <dt className="text-txt-black-700">{labels.payTo}</dt>
            <dd className="m-0 font-medium">{payee}</dd>
            {reference && (
              <>
                <dt className="text-txt-black-700">{labels.reference}</dt>
                <dd className="m-0 font-medium tabular-nums">{reference}</dd>
              </>
            )}
          </dl>

          <ul className="border-otl-gray-200 m-0 flex list-none flex-col border-t p-0">
            {items.map((item, i) => (
              <li
                key={i}
                className="border-otl-gray-200 text-content flex items-start justify-between gap-4 border-b py-3"
              >
                <div className="flex min-w-0 flex-col">
                  <span>{item.label}</span>
                  {item.description && (
                    <span className="text-txt-black-700">
                      {item.description}
                    </span>
                  )}
                </div>
                <span className="shrink-0 tabular-nums">
                  {formatAmount(item.amount, locale, currency)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between gap-4">
            <span className="text-title font-semibold">{labels.total}</span>
            <span className="text-headline font-semibold tabular-nums">
              {totalText}
            </span>
          </div>
        </div>

        <Field
          name="method"
          invalid={!!methodError}
          className="gap-3"
          render={<fieldset />}
        >
          <legend id={methodTitleId} className="text-title mb-3 font-semibold">
            {labels.methodTitle}
          </legend>
          <Radio
            aria-labelledby={methodTitleId}
            // "" keeps the group controlled with nothing selected
            value={selectedMethod === null ? "" : selectedMethod}
            defaultValue={defaultMethod}
            onValueChange={(value) => onMethodChange?.(value as string)}
            disabled={pending}
          >
            {methods.map((option, i) => {
              const optionId = i === 0 ? firstMethodId : `${id}-method-${i}`;
              return (
                // Field.Item scopes each option's label to its own radio; without it the
                // Field gives every radio the same id and only the first gets a name
                <FieldPrimitive.Item key={option.value}>
                  <RadioItem className="bg-bg-white border-otl-gray-200 has-[[data-checked]]:border-otl-primary-300 has-[[data-checked]]:bg-bg-primary-50 items-start gap-3 rounded-lg border p-4">
                    <RadioButton
                      value={option.value}
                      id={optionId}
                      className="mt-0.5"
                    />
                    <div className="grid gap-0.5">
                      <FieldPrimitive.Label
                        render={<RadioLabel className="cursor-pointer" />}
                      >
                        {option.label}
                      </FieldPrimitive.Label>
                      {option.description && (
                        <FieldPrimitive.Description render={<RadioHintText />}>
                          {option.description}
                        </FieldPrimitive.Description>
                      )}
                    </div>
                  </RadioItem>
                </FieldPrimitive.Item>
              );
            })}
          </Radio>
          <FieldError>{methodError}</FieldError>
        </Field>

        {children}

        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            size="large"
            disabled={pending}
            className="w-full justify-center sm:w-fit"
          >
            {labels.pay.replace("{amount}", totalText)}
          </Button>
          <p className="text-txt-black-700 text-content flex max-w-prose items-start gap-2">
            <LockFillIcon aria-hidden className="mt-1 size-4 shrink-0" />
            {labels.secure}
          </p>
        </div>
      </form>
    );
  },
);
PaymentSummary.displayName = "PaymentSummary";

/*========================================================================================================================*/

interface PaymentReceiptLabels {
  title: string;
  amountPaid: string;
  paidAt: string;
  transactionId: string;
  reference: string;
  method: string;
  payer: string;
  payee: string;
  print: string;
  download: string;
}

const DEFAULT_RECEIPT_LABELS: PaymentReceiptLabels = {
  title: "Payment successful",
  amountPaid: "Amount paid",
  paidAt: "Date and time",
  transactionId: "Transaction ID",
  reference: "Bill reference",
  method: "Paid with",
  payer: "Paid by",
  payee: "Paid to",
  print: "Print receipt",
  download: "Download receipt (PDF)",
};

interface PaymentReceiptProps
  extends Omit<ComponentProps<"section">, "title">,
    MoneyOptions {
  /** Overrides the "Payment successful" heading (the page's h1). */
  title?: ReactNode;
  amount: Amount;
  /** When the payment went through. A Date is formatted with `locale`. */
  paidAt: Date | ReactNode;
  transactionId: ReactNode;
  reference?: ReactNode;
  method?: ReactNode;
  payer?: ReactNode;
  payee?: ReactNode;
  /** Line items paid, shown under the details. */
  items?: PaymentLineItem[];
  onPrint?: () => void;
  onDownload?: () => void;
  /** Extra actions, e.g. a link back to the dashboard. */
  actions?: ReactNode;
  labels?: Partial<PaymentReceiptLabels>;
}

const PaymentReceipt = forwardRef<HTMLElement, PaymentReceiptProps>(
  (
    {
      title,
      amount,
      paidAt,
      transactionId,
      reference,
      method,
      payer,
      payee,
      items,
      onPrint,
      onDownload,
      actions,
      currency = "MYR",
      locale = "en-MY",
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_RECEIPT_LABELS, ...labelsProp };
    const when =
      paidAt instanceof Date
        ? new Intl.DateTimeFormat(locale, {
            dateStyle: "long",
            timeStyle: "short",
          }).format(paidAt)
        : paidAt;

    const rows: [string, ReactNode][] = [
      [labels.paidAt, when],
      [labels.transactionId, transactionId],
      ...(reference
        ? ([[labels.reference, reference]] as [string, ReactNode][])
        : []),
      ...(payee ? ([[labels.payee, payee]] as [string, ReactNode][]) : []),
      ...(method ? ([[labels.method, method]] as [string, ReactNode][]) : []),
      ...(payer ? ([[labels.payer, payer]] as [string, ReactNode][]) : []),
    ];

    return (
      <section
        ref={ref}
        className={clx(
          "font-body text-txt-black-900 flex w-full max-w-2xl flex-col gap-8",
          className,
        )}
        {...props}
      >
        <div className="bg-bg-success-50 p-surface flex flex-col gap-3 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircleIcon
              aria-hidden
              className="text-txt-success mt-1 size-7 shrink-0"
            />
            <h1 className="text-headline font-semibold text-balance">
              {title ?? labels.title}
            </h1>
          </div>
          <div className="flex flex-col gap-1 sm:pl-10">
            <p className="text-txt-black-700 text-content">
              {labels.amountPaid}
            </p>
            <p className="text-display font-semibold tabular-nums">
              {formatAmount(amount, locale, currency)}
            </p>
          </div>
        </div>

        <dl className="text-content m-0">
          {rows.map(([term, value]) => (
            <div
              key={term}
              className="border-otl-gray-200 grid gap-x-6 gap-y-0.5 border-b py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
            >
              <dt className="text-txt-black-700 font-medium">{term}</dt>
              <dd className="m-0 break-words tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        {items && items.length > 0 && (
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item, i) => (
              <li
                key={i}
                className="border-otl-gray-200 text-content flex items-start justify-between gap-4 border-b py-3"
              >
                <div className="flex min-w-0 flex-col">
                  <span>{item.label}</span>
                  {item.description && (
                    <span className="text-txt-black-700">
                      {item.description}
                    </span>
                  )}
                </div>
                <span className="shrink-0 tabular-nums">
                  {formatAmount(item.amount, locale, currency)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {children}

        {(onPrint || onDownload || actions) && (
          <div className="flex flex-wrap items-center gap-3">
            {onPrint && (
              <Button
                type="button"
                variant="default-outline"
                size="medium"
                onClick={onPrint}
              >
                <PrinterIcon aria-hidden className="size-4" />
                {labels.print}
              </Button>
            )}
            {onDownload && (
              <Button
                type="button"
                variant="default-outline"
                size="medium"
                onClick={onDownload}
              >
                <DownloadIcon aria-hidden className="size-4" />
                {labels.download}
              </Button>
            )}
            {actions}
          </div>
        )}
      </section>
    );
  },
);
PaymentReceipt.displayName = "PaymentReceipt";

export { PaymentSummary, PaymentReceipt };
export type {
  PaymentSummaryProps,
  PaymentSummaryLabels,
  PaymentReceiptProps,
  PaymentReceiptLabels,
  PaymentLineItem,
  PaymentMethod,
};
