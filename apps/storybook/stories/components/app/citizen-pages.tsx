import React from "react";
import { FormStep } from "@mof-malaysia/myds-react/form-step";
import { CheckAnswers } from "@mof-malaysia/myds-react/check-answers";
import { ConfirmationPanel } from "@mof-malaysia/myds-react/confirmation-panel";
import {
  PaymentReceipt,
  PaymentSummary,
} from "@mof-malaysia/myds-react/payment-summary";
import { ApplicationList } from "@mof-malaysia/myds-react/application-list";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";
import { Input } from "@mof-malaysia/myds-react/input";
import {
  Radio,
  RadioButton,
  RadioItem,
  RadioLabel,
} from "@mof-malaysia/myds-react/radio";
import {
  Callout,
  CalloutAction,
  CalloutContent,
  CalloutTitle,
} from "@mof-malaysia/myds-react/callout";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@mof-malaysia/myds-react/page-header";
import { Button } from "@mof-malaysia/myds-react/button";
import { Link } from "@mof-malaysia/myds-react/link";
import { CitizenChrome } from "./citizen-chrome";

/*
 * Citizen example pages, composed from the app blocks. Each page fakes its
 * callbacks with local state so the flow can be clicked through in Storybook.
 */

const STEPS = ["Your details", "Your income", "Reliefs", "Check and submit"];
const APPLICATION = "Apply for an individual tax relief";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*========================================================================================================================*/

export function ApplicationPage() {
  const [errors, setErrors] = React.useState<{ id: string; message: string }[]>(
    [],
  );
  const [pending, setPending] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const invalid = (id: string) => errors.some((error) => error.id === id);
  const message = (id: string) =>
    errors.find((error) => error.id === id)?.message;

  return (
    <CitizenChrome>
      <FormStep
        caption={APPLICATION}
        title="Your details"
        description="We use these to find your tax records. Enter them as they appear on your MyKad."
        steps={STEPS}
        currentStep={0}
        backHref="#"
        errors={errors}
        pending={pending}
        onSaveForLater={() => setSaved(true)}
        onContinue={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const next: { id: string; message: string }[] = [];
          if (!String(data.get("name") ?? "").trim())
            next.push({ id: "name", message: "Enter your full name" });
          if (!/^\d{6}-?\d{2}-?\d{4}$/.test(String(data.get("ic") ?? "")))
            next.push({
              id: "ic",
              message: "Enter your IC number in the format 900101-14-5678",
            });
          if (!data.get("status"))
            next.push({
              id: "status-single",
              message: "Select your marital status",
            });
          setErrors(next);
          if (next.length) return;
          setPending(true);
          await wait(800);
          setPending(false);
        }}
      >
        {saved && (
          <Callout variant="success">
            <CalloutTitle>Your answers are saved</CalloutTitle>
            <CalloutContent>
              You can come back within 30 days from your dashboard.
            </CalloutContent>
          </Callout>
        )}
        <Field name="name" invalid={invalid("name")}>
          <FieldLabel>Full name</FieldLabel>
          <Input id="name" autoComplete="name" size="medium" />
          <FieldError>{message("name")}</FieldError>
        </Field>
        <Field name="ic" invalid={invalid("ic")}>
          <FieldLabel>IC number</FieldLabel>
          <FieldDescription>For example, 900101-14-5678</FieldDescription>
          <Input
            id="ic"
            inputMode="numeric"
            size="medium"
            className="max-w-64"
          />
          <FieldError>{message("ic")}</FieldError>
        </Field>
        <Field name="status" invalid={invalid("status-single")}>
          <FieldLabel render={<span />} nativeLabel={false}>
            Marital status
          </FieldLabel>
          <Radio name="status" aria-label="Marital status">
            {[
              ["single", "Single"],
              ["married", "Married"],
              ["divorced", "Divorced or widowed"],
            ].map(([value, label]) => (
              <RadioItem key={value}>
                <RadioButton value={value} id={`status-${value}`} />
                <RadioLabel htmlFor={`status-${value}`}>{label}</RadioLabel>
              </RadioItem>
            ))}
          </Radio>
          <FieldError>{message("status-single")}</FieldError>
        </Field>
      </FormStep>
    </CitizenChrome>
  );
}

/*========================================================================================================================*/

export function CheckYourAnswersPage() {
  const [error, setError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);
  return (
    <CitizenChrome>
      <CheckAnswers
        pending={pending}
        declarationError={error}
        sections={[
          {
            title: "Your details",
            rows: [
              {
                label: "Full name",
                value: "Nur Aisyah binti Ahmad",
                changeHref: "#",
              },
              { label: "IC number", value: "900101-14-5678", changeHref: "#" },
              { label: "Marital status", value: "Married", changeHref: "#" },
            ],
          },
          {
            title: "Your income",
            rows: [
              {
                label: "Annual income",
                value: "RM 68,400.00",
                changeHref: "#",
              },
              {
                label: "Employer",
                value: "Syarikat Maju Jaya Sdn. Bhd.",
                changeHref: "#",
              },
            ],
          },
          {
            title: "Reliefs",
            rows: [
              {
                label: "Reliefs claimed",
                value: (
                  <ul className="m-0 list-none p-0">
                    <li>Lifestyle: RM 2,500.00</li>
                    <li>Medical (parents): RM 1,800.00</li>
                  </ul>
                ),
                changeHref: "#",
              },
              {
                label: "Supporting documents",
                value: "2 files uploaded",
                changeHref: "#",
              },
            ],
          },
        ]}
        declaration="I confirm that the information I have given is true and complete. I understand that giving false information may lead to a penalty under the Income Tax Act 1967."
        onSubmit={async (event) => {
          event.preventDefault();
          const accepted = new FormData(event.currentTarget).get("declaration");
          if (!accepted) {
            setError("Confirm the declaration to submit your application");
            return;
          }
          setError(undefined);
          setPending(true);
          await wait(800);
          setPending(false);
        }}
      />
    </CitizenChrome>
  );
}

/*========================================================================================================================*/

export function SubmittedPage() {
  return (
    <CitizenChrome>
      <ConfirmationPanel
        reference="KK-2026-0412"
        description="Received on 28 October 2026 at 2:32 pm"
        emailNote="We have sent a confirmation to nur.aisyah@example.com. Keep your reference number in case you need to contact us."
        nextSteps={[
          "An officer will review your application within 14 working days.",
          "If we need more information, we will email you and show it on your dashboard.",
          "When a decision is made, any approved relief is applied to your assessment automatically.",
        ]}
        onPrint={() => window.print()}
        dashboardHref="#"
      />
    </CitizenChrome>
  );
}

/*========================================================================================================================*/

export function PayFeePage() {
  const [method, setMethod] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string>();
  const [pending, setPending] = React.useState(false);
  return (
    <CitizenChrome>
      <PaymentSummary
        payee="Jabatan Akauntan Negara Malaysia"
        reference="BIL-2026-008812"
        items={[
          {
            label: "Licence renewal fee",
            description: "Money lending licence, 1 year",
            amount: 1500,
          },
          { label: "Late renewal charge", amount: 50 },
          { label: "Online payment fee", amount: 1 },
        ]}
        selectedMethod={method}
        onMethodChange={(value) => {
          setMethod(value);
          setError(undefined);
        }}
        methodError={error}
        pending={pending}
        onPay={async (event) => {
          event.preventDefault();
          if (!method) {
            setError("Choose how you want to pay");
            return;
          }
          setPending(true);
          await wait(1000);
          setPending(false);
        }}
      >
        <p className="text-txt-black-700 text-content">
          By paying you agree to the{" "}
          <Link href="#" primary>
            payment terms
          </Link>
          . Pay by 30 November 2026 to avoid a further charge.
        </p>
      </PaymentSummary>
    </CitizenChrome>
  );
}

/*========================================================================================================================*/

export function ReceiptPage() {
  return (
    <CitizenChrome>
      <PaymentReceipt
        amount={1551}
        paidAt={new Date("2026-10-28T14:32:00+08:00")}
        transactionId="FPX2026102814320091"
        reference="BIL-2026-008812"
        payee="Jabatan Akauntan Negara Malaysia"
        method="FPX · Maybank2u"
        payer="Nur Aisyah binti Ahmad"
        items={[
          { label: "Licence renewal fee", amount: 1500 },
          { label: "Late renewal charge", amount: 50 },
          { label: "Online payment fee", amount: 1 },
        ]}
        onPrint={() => window.print()}
        onDownload={() => {}}
        actions={
          <Link href="#" primary className="text-label-md font-medium">
            Go to your dashboard
          </Link>
        }
      >
        <p className="text-txt-black-700 text-content max-w-prose">
          We have emailed this receipt to nur.aisyah@example.com. It can take up
          to one working day for the payment to show on your account.
        </p>
      </PaymentReceipt>
    </CitizenChrome>
  );
}

/*========================================================================================================================*/

const PAYMENTS = [
  {
    id: "1",
    what: "Licence renewal fee",
    when: "28 Oct 2026",
    amount: "RM 1,551.00",
  },
  {
    id: "2",
    what: "Stamp duty: tenancy agreement",
    when: "3 Sep 2026",
    amount: "RM 240.00",
  },
  {
    id: "3",
    what: "Application fee: SME grant",
    when: "14 Jul 2026",
    amount: "RM 50.00",
  },
];

export function DashboardPage({ empty = false }: { empty?: boolean }) {
  return (
    <CitizenChrome wide>
      <div className="flex flex-col gap-10">
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderTitle>Selamat datang, Nur Aisyah</PageHeaderTitle>
            <PageHeaderDescription>
              Your applications, payments and anything we need from you.
            </PageHeaderDescription>
          </PageHeaderContent>
          <PageHeaderActions>
            <Button size="medium">Start an application</Button>
          </PageHeaderActions>
        </PageHeader>

        {!empty && (
          <Callout variant="warning">
            <CalloutTitle>We need more information from you</CalloutTitle>
            <CalloutContent>
              Upload your parents' medical receipts for application KK-2026-0412
              by 11 November 2026, or we will decide without them.
            </CalloutContent>
            <CalloutAction>
              <Button size="small" variant="default-outline">
                Respond now
              </Button>
            </CalloutAction>
          </Callout>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ApplicationList
            items={
              empty
                ? []
                : [
                    {
                      id: "1",
                      title: "Individual tax relief",
                      reference: "KK-2026-0412",
                      date: new Date("2026-10-12"),
                      status: "action-needed",
                      href: "#",
                    },
                    {
                      id: "2",
                      title: "SME digitalisation grant",
                      date: new Date("2026-10-20"),
                      status: "draft",
                      href: "#",
                    },
                    {
                      id: "3",
                      title: "Money lending licence renewal",
                      reference: "LL-2026-1187",
                      date: new Date("2026-09-30"),
                      status: "in-review",
                      href: "#",
                    },
                    {
                      id: "4",
                      title: "Stamp duty exemption",
                      reference: "SD-2026-0093",
                      date: new Date("2026-08-02"),
                      status: "approved",
                      href: "#",
                    },
                  ]
            }
            emptyAction={<Button size="medium">Start an application</Button>}
          />

          <section
            aria-labelledby="recent-payments"
            className="flex flex-col gap-3"
          >
            <h2 id="recent-payments" className="text-title font-semibold">
              Recent payments
            </h2>
            {empty ? (
              <p className="text-txt-black-700 text-content">
                Payments you make will appear here with their receipts.
              </p>
            ) : (
              <ul className="bg-bg-washed m-0 flex list-none flex-col rounded-lg p-0">
                {PAYMENTS.map((payment) => (
                  <li
                    key={payment.id}
                    className="border-otl-gray-200 flex items-start justify-between gap-3 border-b px-4 py-3 last:border-b-0"
                  >
                    <div className="flex min-w-0 flex-col">
                      <Link
                        href="#"
                        underline="hover"
                        className="text-content font-medium"
                      >
                        {payment.what}
                      </Link>
                      <span className="text-txt-black-700 text-content">
                        {payment.when}
                      </span>
                    </div>
                    <span className="text-content shrink-0 font-medium tabular-nums">
                      {payment.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </CitizenChrome>
  );
}
