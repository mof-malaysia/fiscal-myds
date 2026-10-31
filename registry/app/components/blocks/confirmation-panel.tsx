"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { CheckCircleIcon } from "@/components/ui/icons/check-circle";
import { CopyIcon } from "@/components/ui/icons/copy";
import { CheckIcon } from "@/components/ui/icons/check";
import { PrinterIcon } from "@/components/ui/icons/printer";
import { useCopy } from "@/lib/ftds/hooks";
import { clx } from "@/lib/ftds/utils";

/**
 * ConfirmationPanel ends a submission: a calm success panel with the reference
 * number (large, copyable), what happens next, where the confirmation was sent,
 * and the ways out (print, back to the dashboard). It answers "did it go through?"
 * at a glance.
 *
 * @example
 * <ConfirmationPanel
 *   reference="KK-2026-0412"
 *   emailNote="We have sent a confirmation to nur.aisyah@example.com."
 *   nextSteps={[
 *     "An officer will review your application within 14 working days.",
 *     "We will email you if we need more information.",
 *   ]}
 *   onPrint={() => window.print()}
 *   dashboardHref="/dashboard"
 * />
 */

interface ConfirmationPanelLabels {
  title: string;
  referenceLabel: string;
  copy: string;
  copied: string;
  nextStepsTitle: string;
  print: string;
  dashboard: string;
}

const DEFAULT_LABELS: ConfirmationPanelLabels = {
  title: "Application submitted",
  referenceLabel: "Your reference number",
  copy: "Copy reference number",
  copied: "Copied",
  nextStepsTitle: "What happens next",
  print: "Print this page",
  dashboard: "Go to your dashboard",
};

interface ConfirmationPanelProps extends Omit<
  ComponentProps<"section">,
  "title"
> {
  /** Overrides the "Application submitted" heading (the page's h1). */
  title?: ReactNode;
  /** The reference the citizen quotes if they contact you. */
  reference: string;
  /** One line under the reference, e.g. the date and time it was received. */
  description?: ReactNode;
  /** Where the confirmation was sent, e.g. "We have sent a confirmation to …". */
  emailNote?: ReactNode;
  /** What happens next, in order. */
  nextSteps?: ReactNode[];
  /** Shows a Print button. */
  onPrint?: () => void;
  dashboardHref?: string;
  /** Your router's link for the dashboard. */
  dashboardRender?: ReactElement;
  /** Extra actions after Print and the dashboard link. */
  actions?: ReactNode;
  /** Anything else after the next steps (a survey link, contact details). */
  children?: ReactNode;
  labels?: Partial<ConfirmationPanelLabels>;
}

const ConfirmationPanel = forwardRef<HTMLElement, ConfirmationPanelProps>(
  (
    {
      title,
      reference,
      description,
      emailNote,
      nextSteps,
      onPrint,
      dashboardHref,
      dashboardRender,
      actions,
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const [copied, copy] = useCopy(reference);

    const hasDashboard = dashboardHref !== undefined || dashboardRender;

    return (
      <section
        ref={ref}
        className={clx(
          "font-body text-txt-black-900 flex w-full max-w-2xl flex-col gap-8",
          className,
        )}
        {...props}
      >
        <div className="bg-bg-success-50 p-surface flex flex-col gap-4 rounded-lg">
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
              {labels.referenceLabel}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-headline font-semibold tracking-wide tabular-nums">
                {reference}
              </p>
              <Button
                type="button"
                variant="default-ghost"
                size="small"
                iconOnly
                aria-label={labels.copy}
                onClick={copy}
              >
                {copied ? (
                  <CheckIcon aria-hidden className="text-txt-success size-4" />
                ) : (
                  <CopyIcon aria-hidden className="size-4" />
                )}
              </Button>
              <span role="status" className="text-txt-success text-content">
                {copied ? labels.copied : ""}
              </span>
            </div>
            {description && (
              <div className="text-txt-black-700 text-content">
                {description}
              </div>
            )}
          </div>
        </div>

        {emailNote && (
          <p className="text-txt-black-700 text-content max-w-prose">
            {emailNote}
          </p>
        )}

        {nextSteps && nextSteps.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title font-semibold">
              {labels.nextStepsTitle}
            </h2>
            <ol className="text-txt-black-700 text-content m-0 flex max-w-prose list-decimal flex-col gap-2 pl-5">
              {nextSteps.map((item, i) => (
                <li key={i} className="pl-1">
                  {item}
                </li>
              ))}
            </ol>
          </section>
        )}

        {children}

        {(onPrint || hasDashboard || actions) && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
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
            {hasDashboard && (
              <Link
                href={dashboardHref}
                render={dashboardRender}
                primary
                className="text-label-md font-medium"
              >
                {labels.dashboard}
              </Link>
            )}
            {actions}
          </div>
        )}
      </section>
    );
  },
);
ConfirmationPanel.displayName = "ConfirmationPanel";

export { ConfirmationPanel };
export type { ConfirmationPanelProps, ConfirmationPanelLabels };
