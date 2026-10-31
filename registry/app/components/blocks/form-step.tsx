"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  FormEvent,
  ReactElement,
  ReactNode,
  forwardRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ErrorSummary, type ErrorSummaryError } from "@/components/ui/error-summary";
import { Stepper, StepperItem } from "@/components/ui/stepper";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { clx } from "@/lib/ftds/utils";

/**
 * FormStep is one page of a multi-step application: a back link, progress, the
 * application's name as a caption, the page's h1, the fields, and Continue with
 * "Save and come back later". One question group per page keeps each step short.
 *
 * It renders a `<form>`; `onContinue` gets the submit event. Validate in the app
 * and pass `errors` back: they show in an ErrorSummary that takes focus, with
 * links to each field (give the control the error's `id`).
 *
 * Pass `steps` to show every step with a Stepper, or `step` for a plain "Step 2 of 5".
 *
 * @example
 * <FormStep
 *   caption="Apply for an individual tax relief"
 *   title="Your details"
 *   steps={["Your details", "Income", "Reliefs", "Check and submit"]}
 *   currentStep={0}
 *   backHref="/apply"
 *   errors={errors}
 *   onContinue={(event) => { event.preventDefault(); next(); }}
 *   onSaveForLater={save}
 * >
 *   <Field name="ic">…</Field>
 * </FormStep>
 */

interface FormStepLabels {
  back: string;
  continue: string;
  saveForLater: string;
  /** Progress text when `step` is used. `{current}` and `{total}` are replaced. */
  progress: string;
  errorTitle: string;
  /** Accessible name of the Stepper. */
  progressLabel: string;
}

const DEFAULT_LABELS: FormStepLabels = {
  back: "Back",
  continue: "Continue",
  saveForLater: "Save and come back later",
  progress: "Step {current} of {total}",
  errorTitle: "There is a problem",
  progressLabel: "Application progress",
};

interface FormStepProps extends Omit<
  ComponentProps<"form">,
  "title" | "onSubmit"
> {
  /** The page's question or topic, rendered as the only h1. */
  title: ReactNode;
  /** The application's name, shown small above the title. */
  caption?: ReactNode;
  description?: ReactNode;
  /** Every step's name, shown in a Stepper. Use with `currentStep`. */
  steps?: ReactNode[];
  /** Zero-based index of this step in `steps`. */
  currentStep?: number;
  /** Plain progress without step names: `{ current: 2, total: 5 }` (one-based). */
  step?: { current: number; total: number };
  /** Errors from the last submit. Shown in an ErrorSummary above the fields. */
  errors?: ErrorSummaryError[];
  /** Called on submit (Continue or Enter). Call `event.preventDefault()` to handle it in the app. */
  onContinue?: (event: FormEvent<HTMLFormElement>) => void;
  /** Shows "Save and come back later" when set. */
  onSaveForLater?: () => void;
  /** Back link target. */
  backHref?: string;
  /** Back link handler (with or without `backHref`). */
  onBack?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Your router's link for the back link, e.g. `<RouterLink to="/apply" />`. */
  backRender?: ReactElement;
  /** Disables the actions and shows the primary button as working. */
  pending?: boolean;
  labels?: Partial<FormStepLabels>;
}

const FormStep = forwardRef<HTMLFormElement, FormStepProps>(
  (
    {
      title,
      caption,
      description,
      steps,
      currentStep = 0,
      step,
      errors,
      onContinue,
      onSaveForLater,
      backHref,
      onBack,
      backRender,
      pending = false,
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const hasBack = backHref !== undefined || onBack || backRender;

    return (
      <form
        ref={ref}
        noValidate
        aria-busy={pending || undefined}
        onSubmit={onContinue}
        className={clx(
          "font-body text-txt-black-900 gap-stack-lg flex w-full max-w-2xl flex-col",
          className,
        )}
        {...props}
      >
        {hasBack && (
          <Link
            href={backHref ?? "#"}
            render={backRender}
            onClick={onBack}
            underline="hover"
            className="text-txt-black-700 text-label-md inline-flex w-fit items-center gap-1 font-medium"
          >
            <ChevronLeftIcon aria-hidden className="size-4" />
            {labels.back}
          </Link>
        )}

        {steps && steps.length > 0 && (
          <Stepper current={currentStep} aria-label={labels.progressLabel}>
            {steps.map((name, i) => (
              <StepperItem key={i}>{name}</StepperItem>
            ))}
          </Stepper>
        )}

        <header className="flex flex-col gap-2">
          {(caption || (step && !steps)) && (
            <p className="text-txt-black-700 text-content">
              {step && !steps && (
                <span className="text-txt-black-900 font-medium">
                  {labels.progress
                    .replace("{current}", String(step.current))
                    .replace("{total}", String(step.total))}
                </span>
              )}
              {step && !steps && caption && (
                <span aria-hidden className="text-txt-black-500 mx-2">
                  ·
                </span>
              )}
              {caption}
            </p>
          )}
          <h1 className="text-headline text-txt-black-900 font-semibold text-balance">
            {title}
          </h1>
          {description && (
            <div className="text-txt-black-700 text-content max-w-prose">
              {description}
            </div>
          )}
        </header>

        {errors && errors.length > 0 && (
          <ErrorSummary title={labels.errorTitle} errors={errors} />
        )}

        <div className="gap-stack-lg flex flex-col">{children}</div>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center">
          {onSaveForLater && (
            <Button
              type="button"
              variant="default-ghost"
              size="medium"
              disabled={pending}
              onClick={onSaveForLater}
              className="w-full justify-center sm:w-fit"
            >
              {labels.saveForLater}
            </Button>
          )}
          <Button
            type="submit"
            size="medium"
            disabled={pending}
            className="w-full justify-center sm:order-first sm:w-fit"
          >
            {labels.continue}
          </Button>
        </div>
      </form>
    );
  },
);
FormStep.displayName = "FormStep";

export { FormStep };
export type { FormStepProps, FormStepLabels };
