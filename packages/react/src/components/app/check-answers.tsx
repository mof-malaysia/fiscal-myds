"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  FormEvent,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";
import { Button } from "../core/button";
import { Checkbox } from "../core/checkbox";
import { Field, FieldError, FieldLabel } from "../core/field";
import { Link } from "../core/link";
import { ErrorSummary } from "./error-summary";
import { clx } from "../../utils";

/**
 * CheckAnswers is the last page before submitting an application: every answer,
 * grouped by section, with a "Change" link back to the step that asked it, then an
 * optional declaration the citizen must accept, and "Accept and submit".
 *
 * It renders a `<form>`; `onSubmit` gets the submit event. If the declaration isn't
 * ticked, pass `declarationError` back: it shows on the checkbox and in an
 * ErrorSummary that takes focus.
 *
 * @example
 * <CheckAnswers
 *   sections={[
 *     {
 *       title: "Your details",
 *       rows: [
 *         { label: "Full name", value: "Nur Aisyah binti Ahmad", changeHref: "/apply/details" },
 *         { label: "IC number", value: "900101-14-5678", changeHref: "/apply/details" },
 *       ],
 *     },
 *   ]}
 *   declaration="I confirm that the information I have given is true and complete."
 *   onSubmit={(event) => { event.preventDefault(); submit(); }}
 * />
 */

interface CheckAnswersRow {
  /** Stable key; defaults to the label when it's a string. */
  key?: string;
  label: ReactNode;
  value: ReactNode;
  /** Where "Change" goes: the step that asked this question. */
  changeHref?: string;
  /** Your router's link for "Change". */
  changeRender?: ReactElement;
  /** Hidden text after "Change" so each link says what it changes. Defaults to the label when it's a string. */
  changeHint?: string;
}

interface CheckAnswersSection {
  title?: ReactNode;
  rows: CheckAnswersRow[];
}

interface CheckAnswersLabels {
  title: string;
  description: string;
  change: string;
  declarationTitle: string;
  /** Text beside the declaration checkbox. */
  declarationAgree: string;
  submit: string;
  errorTitle: string;
}

const DEFAULT_LABELS: CheckAnswersLabels = {
  title: "Check your answers before submitting",
  description:
    "Make sure everything is correct. You can change an answer before you submit.",
  change: "Change",
  declarationTitle: "Declaration",
  declarationAgree: "I agree with this declaration",
  submit: "Accept and submit",
  errorTitle: "There is a problem",
};

interface CheckAnswersProps extends Omit<
  ComponentProps<"form">,
  "title" | "onSubmit"
> {
  sections: CheckAnswersSection[];
  /** What the citizen declares by submitting. Leave out for no declaration. */
  declaration?: ReactNode;
  /** Shown when the declaration wasn't accepted, e.g. "Confirm the declaration to submit". */
  declarationError?: string;
  /** `id` of the declaration checkbox (the ErrorSummary links to it). @default "declaration" */
  declarationId?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** Disables submit and marks the form busy. */
  pending?: boolean;
  /** Content between the answers and the declaration, e.g. a fee notice. */
  children?: ReactNode;
  labels?: Partial<CheckAnswersLabels>;
}

const CheckAnswers = forwardRef<HTMLFormElement, CheckAnswersProps>(
  (
    {
      sections,
      declaration,
      declarationError,
      declarationId = "declaration",
      onSubmit,
      pending = false,
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };

    return (
      <form
        ref={ref}
        noValidate
        aria-busy={pending || undefined}
        onSubmit={onSubmit}
        className={clx(
          "font-body text-txt-black-900 flex w-full max-w-3xl flex-col gap-10",
          className,
        )}
        {...props}
      >
        <header className="flex flex-col gap-2">
          <h1 className="text-headline font-semibold text-balance">
            {labels.title}
          </h1>
          {labels.description && (
            <p className="text-txt-black-700 text-content max-w-prose">
              {labels.description}
            </p>
          )}
        </header>

        {declarationError && (
          <ErrorSummary
            title={labels.errorTitle}
            errors={[{ id: declarationId, message: declarationError }]}
          />
        )}

        {sections.map((section, i) => (
          <section key={i} className="flex flex-col gap-2">
            {section.title && (
              <h2 className="text-title font-semibold">{section.title}</h2>
            )}
            {/* A grid rather than SummaryList's table, so long answers wrap under the label on phones */}
            <dl className="text-content m-0">
              {section.rows.map((row, j) => {
                const hint =
                  row.changeHint ??
                  (typeof row.label === "string" ? row.label : undefined);
                const hasChange = row.changeHref || row.changeRender;
                return (
                  <div
                    key={
                      row.key ?? (typeof row.label === "string" ? row.label : j)
                    }
                    className="border-otl-gray-200 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 border-b py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] sm:gap-x-6"
                  >
                    <dt className="text-txt-black-700 font-medium">
                      {row.label}
                    </dt>
                    <dd className="col-span-2 col-start-1 row-start-2 m-0 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                      {row.value}
                    </dd>
                    <dd className="col-start-2 row-start-1 m-0 text-right sm:col-start-3">
                      {hasChange && (
                        <Link
                          href={row.changeHref}
                          render={row.changeRender}
                          primary
                          underline="hover"
                          className="font-medium whitespace-nowrap"
                        >
                          {labels.change}
                          {hint && <span className="sr-only"> {hint}</span>}
                        </Link>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        ))}

        {children}

        {declaration && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title font-semibold">
              {labels.declarationTitle}
            </h2>
            <div className="text-txt-black-700 text-content max-w-prose">
              {declaration}
            </div>
            <Field
              name="declaration"
              invalid={!!declarationError}
              className="gap-2"
            >
              <FieldLabel className="text-content cursor-pointer gap-3 font-medium">
                <Checkbox id={declarationId} required />
                {labels.declarationAgree}
              </FieldLabel>
              <FieldError>{declarationError}</FieldError>
            </Field>
          </section>
        )}

        <div>
          <Button
            type="submit"
            size="medium"
            disabled={pending}
            className="w-full justify-center sm:w-fit"
          >
            {labels.submit}
          </Button>
        </div>
      </form>
    );
  },
);
CheckAnswers.displayName = "CheckAnswers";

export { CheckAnswers };
export type {
  CheckAnswersProps,
  CheckAnswersSection,
  CheckAnswersRow,
  CheckAnswersLabels,
};
