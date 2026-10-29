"use client";
// registry:block — composed page section, installs to components/blocks
import React, {
  ComponentProps,
  FormEvent,
  ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";
import { Button } from "../core/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "../core/field";
import { Input } from "../core/input";
import { Spinner } from "../core/spinner";
import { ErrorSummary } from "./error-summary";
import { ResendButton } from "./otp-verify";
import { NewPasswordFields, type PasswordRule } from "./sign-up-form";
import { EmailIcon } from "../../icons/email";
import { clx } from "../../utils";

/**
 * The two halves of resetting a password.
 *
 * `ForgotPasswordForm` asks for the account's email and calls `onSubmit`. Once the
 * app has sent the link, pass `sentTo` and it shows "Check your email" with a
 * resend button. The message never confirms whether an account exists for that
 * address, so it can't be used to find out who has one.
 *
 * `ResetPasswordForm` is where the emailed link lands: a new password with its
 * rules ticked off as the user types, and a confirmation.
 *
 * @example
 * <ForgotPasswordForm
 *   sentTo={sent ? email : undefined}
 *   pending={sending}
 *   onSubmit={(email) => sendResetLink(email)}
 *   onResend={() => sendResetLink(email)}
 * />
 *
 * <ResetPasswordForm
 *   errors={errors}
 *   pending={saving}
 *   onSubmit={({ password }) => setNewPassword(token, password)}
 * />
 */

/*========================================================================================================================*/

interface ForgotPasswordFormLabels {
  email: string;
  emailHint: string;
  submit: string;
  pending: string;
  sentTitle: string;
  /** `{email}` is replaced with the address. */
  sentBody: string;
  sentHint: string;
  resend: string;
  resendWaiting: string;
  differentEmail: string;
  errorTitle: string;
}

const FORGOT_LABELS: ForgotPasswordFormLabels = {
  email: "Email address",
  emailHint: "The address you used to create your account",
  submit: "Send reset link",
  pending: "Sending…",
  sentTitle: "Check your email",
  sentBody:
    "If {email} belongs to an account, we've sent a link to reset the password. The link works for 30 minutes.",
  sentHint: "Not there? Check your spam or junk folder.",
  resend: "Send the link again",
  resendWaiting: "Send again in {seconds}s",
  differentEmail: "Use a different email address",
  errorTitle: "There is a problem",
};

interface ForgotPasswordFormProps
  extends Omit<ComponentProps<"div">, "onSubmit" | "children"> {
  onSubmit?: (email: string) => void;
  /** Once the link is sent: the address it went to. Switches to the "Check your email" state. */
  sentTo?: string;
  onResend?: () => void;
  /** Back to the email field from the sent state. */
  onChangeEmail?: () => void;
  /** Seconds before the link can be sent again. @default 60 */
  resendSeconds?: number;
  error?: ReactNode;
  pending?: boolean;
  defaultEmail?: string;
  labels?: Partial<ForgotPasswordFormLabels>;
}

const ForgotPasswordForm = forwardRef<HTMLDivElement, ForgotPasswordFormProps>(
  (
    {
      onSubmit,
      sentTo,
      onResend,
      onChangeEmail,
      resendSeconds = 60,
      error,
      pending = false,
      defaultEmail = "",
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...FORGOT_LABELS, ...labelsProp };
    const id = useId();
    const [email, setEmail] = useState(defaultEmail);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!pending) onSubmit?.(email);
    };

    if (sentTo !== undefined) {
      const [before, after] = labels.sentBody.split("{email}");
      return (
        <div
          ref={ref}
          role="status"
          className={clx("gap-stack-md flex flex-col", className)}
          {...props}
        >
          <div className="bg-bg-primary-50 text-txt-primary grid size-12 place-content-center rounded-full">
            <EmailIcon aria-hidden className="size-6" />
          </div>
          <h2 className="text-title text-txt-black-900 font-semibold">
            {labels.sentTitle}
          </h2>
          <p className="text-content text-txt-black-700">
            {before}
            <span className="text-txt-black-900 font-semibold break-all">
              {sentTo}
            </span>
            {after}
          </p>
          <p className="text-content text-txt-black-700">{labels.sentHint}</p>
          <div className="flex flex-wrap gap-2">
            <ResendButton
              variant="default-outline"
              seconds={resendSeconds}
              onResend={onResend}
              label={labels.resend}
              waitingLabel={labels.resendWaiting}
            />
            {onChangeEmail && (
              <Button
                type="button"
                variant="default-ghost"
                onClick={onChangeEmail}
              >
                {labels.differentEmail}
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        <form
          noValidate
          aria-busy={pending || undefined}
          onSubmit={handleSubmit}
          className="gap-stack-lg flex flex-col"
        >
          {error && (
            <ErrorSummary
              title={labels.errorTitle}
              errors={[{ id: `${id}-email`, message: error }]}
            />
          )}
          <Field name="email" invalid={!!error} disabled={pending}>
            <FieldLabel>{labels.email}</FieldLabel>
            <FieldDescription>{labels.emailHint}</FieldDescription>
            <Input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <FieldError>{error}</FieldError>
          </Field>
          <Button
            type="submit"
            variant="primary-fill"
            size="medium"
            disabled={pending}
            className="w-full justify-center"
          >
            {pending && <Spinner color="white" />}
            {pending ? labels.pending : labels.submit}
          </Button>
        </form>
      </div>
    );
  },
);
ForgotPasswordForm.displayName = "ForgotPasswordForm";

/*========================================================================================================================*/

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormLabels {
  password: string;
  passwordHint: string;
  confirmPassword: string;
  submit: string;
  pending: string;
  errorTitle: string;
}

const RESET_LABELS: ResetPasswordFormLabels = {
  password: "New password",
  passwordHint: "Your password needs:",
  confirmPassword: "Type the new password again",
  submit: "Save new password",
  pending: "Saving…",
  errorTitle: "There is a problem",
};

interface ResetPasswordFormProps
  extends Omit<ComponentProps<"form">, "onSubmit" | "children"> {
  onSubmit?: (values: ResetPasswordValues) => void;
  errors?: Partial<Record<keyof ResetPasswordValues, ReactNode>>;
  pending?: boolean;
  /** Rules for the password checklist. */
  passwordRules?: PasswordRule[];
  labels?: Partial<ResetPasswordFormLabels>;
}

const ResetPasswordForm = forwardRef<HTMLFormElement, ResetPasswordFormProps>(
  (
    {
      onSubmit,
      errors = {},
      pending = false,
      passwordRules,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...RESET_LABELS, ...labelsProp };
    const id = useId();
    const [values, setValues] = useState<ResetPasswordValues>({
      password: "",
      confirmPassword: "",
    });

    const summary = (["password", "confirmPassword"] as const)
      .filter((field) => errors[field])
      .map((field) => ({ id: `${id}-${field}`, message: errors[field] }));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!pending) onSubmit?.(values);
    };

    return (
      <form
        ref={ref}
        noValidate
        aria-busy={pending || undefined}
        onSubmit={handleSubmit}
        className={clx("gap-stack-lg flex flex-col", className)}
        {...props}
      >
        {summary.length > 0 && (
          <ErrorSummary title={labels.errorTitle} errors={summary} />
        )}
        <NewPasswordFields
          id={(field) => `${id}-${field}`}
          values={values}
          onChange={(field, value) =>
            setValues((v) => ({ ...v, [field]: value }))
          }
          errors={errors}
          disabled={pending}
          rules={passwordRules}
          labels={labels}
        />
        <Button
          type="submit"
          variant="primary-fill"
          size="medium"
          disabled={pending}
          className="w-full justify-center"
        >
          {pending && <Spinner color="white" />}
          {pending ? labels.pending : labels.submit}
        </Button>
      </form>
    );
  },
);
ResetPasswordForm.displayName = "ResetPasswordForm";

export { ForgotPasswordForm, ResetPasswordForm };
export type {
  ForgotPasswordFormProps,
  ForgotPasswordFormLabels,
  ResetPasswordFormProps,
  ResetPasswordFormLabels,
  ResetPasswordValues,
};
