"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../core/alert-dialog";
import { Button } from "../core/button";
import { Checkbox } from "../core/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "../core/field";
import { Radio, RadioButton } from "../core/radio";
import { TextArea } from "../core/textarea";
import { WarningCircleIcon } from "../../icons/warning-circle";
import { useControllableState } from "../../hooks";
import { clx } from "../../utils";

/**
 * DecisionPanel records an officer's decision on a case: approve, return for
 * changes or reject. A reason is required to return or reject, the applicant can
 * be notified, and rejecting asks for confirmation first because it closes the
 * case for good (PRODUCT.md: certainty at high-stakes moments).
 *
 * The panel checks that a decision is chosen and a required reason is given, and
 * shows `errors` from the app for anything else (e.g. the save failed).
 *
 * @example
 * <DecisionPanel
 *   pending={saving}
 *   onDecide={({ decision, reason, notify }) => save(decision, reason, notify)}
 * />
 */

type CaseDecision = "approve" | "return" | "reject";

interface DecisionResult {
  decision: CaseDecision;
  reason: string;
  notify: boolean;
}

interface DecisionPanelLabels {
  title: string;
  description: string;
  approve: string;
  approveHint: string;
  return: string;
  returnHint: string;
  reject: string;
  rejectHint: string;
  reason: string;
  /** Hint when a reason is optional / required. */
  reasonOptional: string;
  reasonRequired: string;
  /** Error when no decision is chosen. */
  chooseDecision: string;
  /** Error when a required reason is empty. */
  giveReason: string;
  notify: string;
  submit: string;
  confirmTitle: string;
  confirmDescription: string;
  confirmAction: string;
  cancel: string;
}

const DEFAULT_LABELS: DecisionPanelLabels = {
  title: "Your decision",
  description: "The decision and reason are added to the case history.",
  approve: "Approve",
  approveHint: "The application meets the requirements.",
  return: "Return for changes",
  returnHint: "The applicant can correct it and submit again.",
  reject: "Reject",
  rejectHint: "Closes the case. The applicant must start a new application.",
  reason: "Reason",
  reasonOptional: "Optional. Shown to the applicant.",
  reasonRequired: "Shown to the applicant. Say what to fix or why.",
  chooseDecision: "Choose a decision",
  giveReason: "Enter a reason for the applicant",
  notify: "Email the applicant about this decision",
  submit: "Record decision",
  confirmTitle: "Reject this application?",
  confirmDescription:
    "This can't be undone. The case closes and the applicant must start a new application.",
  confirmAction: "Reject application",
  cancel: "Cancel",
};

const NEEDS_REASON: CaseDecision[] = ["return", "reject"];

// FieldError's look, for messages that don't belong to a single control
const error_class =
  "font-body text-content text-txt-danger flex items-start gap-1.5 font-medium";

interface DecisionPanelProps extends Omit<
  ComponentProps<"form">,
  "onSubmit" | "title" | "children"
> {
  /** Choices to offer, in order. @default ["approve", "return", "reject"] */
  options?: CaseDecision[];
  decision?: CaseDecision;
  defaultDecision?: CaseDecision;
  onDecisionChange?: (decision: CaseDecision) => void;
  /** Show the notify-applicant checkbox. @default true */
  showNotify?: boolean;
  defaultNotify?: boolean;
  /** Errors from the app, shown under their fields; `form` shows above the button. */
  errors?: { decision?: ReactNode; reason?: ReactNode; form?: ReactNode };
  /** Disables the panel while the decision saves. */
  pending?: boolean;
  /** Called with a valid decision (after confirmation for a rejection). */
  onDecide: (result: DecisionResult) => void;
  labels?: Partial<DecisionPanelLabels>;
}

const DecisionPanel = forwardRef<HTMLFormElement, DecisionPanelProps>(
  (
    {
      options = ["approve", "return", "reject"],
      decision: decisionProp,
      defaultDecision,
      onDecisionChange,
      showNotify = true,
      defaultNotify = true,
      errors = {},
      pending = false,
      onDecide,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const id = useId();
    const [decision, setDecision] = useControllableState<
      CaseDecision | undefined
    >({
      prop: decisionProp,
      defaultProp: defaultDecision,
      onChange: (value) => value && onDecisionChange?.(value),
    });
    const [reason, setReason] = useState("");
    const [notify, setNotify] = useState(defaultNotify);
    const [checked, setChecked] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const needsReason = !!decision && NEEDS_REASON.includes(decision);
    const decisionError =
      errors.decision ?? (checked && !decision ? labels.chooseDecision : null);
    const reasonError =
      errors.reason ??
      (checked && needsReason && !reason.trim() ? labels.giveReason : null);

    const result = (): DecisionResult => ({
      decision: decision!,
      reason: reason.trim(),
      notify: showNotify && notify,
    });

    const hints: Record<CaseDecision, [string, string]> = {
      approve: [labels.approve, labels.approveHint],
      return: [labels.return, labels.returnHint],
      reject: [labels.reject, labels.rejectHint],
    };

    return (
      <form
        ref={ref}
        noValidate
        aria-labelledby={`${id}-title`}
        className={clx("font-body flex flex-col gap-4", className)}
        onSubmit={(event) => {
          event.preventDefault();
          setChecked(true);
          if (!decision || (needsReason && !reason.trim())) return;
          if (decision === "reject") setConfirming(true);
          else onDecide(result());
        }}
        {...props}
      >
        <div>
          <h2
            id={`${id}-title`}
            className="text-txt-black-900 text-heading-2xs font-semibold"
          >
            {labels.title}
          </h2>
          <p className="text-txt-black-700 text-content mt-1">
            {labels.description}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Radio
            size="small"
            aria-labelledby={`${id}-title`}
            aria-describedby={
              decisionError ? `${id}-decision-error` : undefined
            }
            aria-invalid={!!decisionError || undefined}
            // "" selects nothing, so the group stays controlled before a choice
            value={decision ?? ""}
            onValueChange={(value) => setDecision(value as CaseDecision)}
            disabled={pending}
          >
            {options.map((option) => (
              // The whole row is the label, so the text selects the radio too.
              // It wraps RadioButton (a Base UI radio), which the rule can't see.
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              <label
                key={option}
                className="flex cursor-pointer items-start gap-3 has-[[data-disabled]]:cursor-not-allowed"
              >
                <RadioButton value={option} className="mt-0.5" />
                <span className="grid">
                  <span className="text-txt-black-900 text-content font-medium">
                    {hints[option][0]}
                  </span>
                  <span className="text-txt-black-700 text-label-compact">
                    {hints[option][1]}
                  </span>
                </span>
              </label>
            ))}
          </Radio>
          {decisionError && (
            <p id={`${id}-decision-error`} className={error_class}>
              <WarningCircleIcon
                className="mt-0.5 size-4 shrink-0"
                aria-hidden
              />
              {decisionError}
            </p>
          )}
        </div>

        <Field invalid={!!reasonError}>
          <FieldLabel>{labels.reason}</FieldLabel>
          <FieldDescription>
            {needsReason ? labels.reasonRequired : labels.reasonOptional}
          </FieldDescription>
          <TextArea
            size="small"
            value={reason}
            required={needsReason}
            disabled={pending}
            onChange={(event) => setReason(event.target.value)}
          />
          <FieldError>{reasonError}</FieldError>
        </Field>

        {showNotify && (
          <label className="text-txt-black-900 text-content flex cursor-pointer items-center gap-2">
            <Checkbox
              checked={notify}
              disabled={pending}
              onCheckedChange={(next) => setNotify(next)}
            />
            {labels.notify}
          </label>
        )}

        {errors.form && (
          <p role="alert" className={error_class}>
            <WarningCircleIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
            {errors.form}
          </p>
        )}

        <Button
          type="submit"
          variant={decision === "reject" ? "danger-fill" : "primary-fill"}
          size="medium"
          disabled={pending}
          className="self-start"
        >
          {labels.submit}
        </Button>

        <AlertDialog
          variant="danger"
          open={confirming}
          onOpenChange={setConfirming}
        >
          <AlertDialogContent>
            <AlertDialogTitle>{labels.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {labels.confirmDescription}
            </AlertDialogDescription>
            <AlertDialogAction className="mt-6">
              <AlertDialogClose render={<Button variant="default-outline" />}>
                {labels.cancel}
              </AlertDialogClose>
              <Button
                variant="danger-fill"
                onClick={() => {
                  setConfirming(false);
                  onDecide(result());
                }}
              >
                {labels.confirmAction}
              </Button>
            </AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    );
  },
);
DecisionPanel.displayName = "DecisionPanel";

export { DecisionPanel };
export type {
  DecisionPanelProps,
  DecisionPanelLabels,
  DecisionResult,
  CaseDecision,
};
