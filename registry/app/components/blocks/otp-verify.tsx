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
import { Button, type ButtonProps } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Link } from "@/components/ui/link";
import { Spinner } from "@/components/ui/spinner";
import { OTPField, OTPFieldSlot } from "@/components/ui/otp-field";
import { useCountdown } from "@/lib/ftds/hooks";
import { clx } from "@/lib/ftds/utils";

/**
 * OtpVerify asks for the one-time code just sent by SMS or email. It names where
 * the code went (masked, e.g. "••••5678"), takes the code in an OTPField (paste and
 * SMS autofill work), and offers to send a new one after a countdown.
 *
 * It verifies on the button, and also as soon as the last digit is typed when
 * `autoSubmit` is on. A wrong or expired code comes back as `error`.
 *
 * `ResendButton` is exported for other screens that send something and let the
 * user ask again (a reset link, a confirmation email).
 *
 * @example
 * <OtpVerify
 *   channel="sms"
 *   destination="••••5678"
 *   error={wrong && "That code is not right. Check the latest SMS and try again."}
 *   pending={checking}
 *   onVerify={(code) => verify(code)}
 *   onResend={() => sendCode()}
 *   otherMethodHref="/verify/email"
 * />
 */

/*========================================================================================================================*/

interface ResendButtonProps
  extends Omit<ButtonProps, "onClick" | "children" | "disabled"> {
  /** How long to wait before the first resend, and between resends. @default 60 */
  seconds?: number;
  onResend?: () => void;
  /** Disable while something else is in progress. */
  disabled?: boolean;
  /** Button text when it can be pressed. */
  label?: string;
  /** Text while waiting; `{seconds}` is replaced with the seconds left. */
  waitingLabel?: string;
}

/** A "Send a new code" button that is disabled, with a visible countdown, until it may be pressed again. */
const ResendButton = forwardRef<HTMLButtonElement, ResendButtonProps>(
  (
    {
      seconds = 60,
      onResend,
      disabled = false,
      label = "Send a new code",
      waitingLabel = "Send a new code in {seconds}s",
      variant = "default-ghost",
      ...props
    },
    ref,
  ) => {
    const [endsAt, setEndsAt] = useState(() => Date.now() + seconds * 1000);
    const remaining = useCountdown(endsAt);
    const waiting = remaining > 0;

    return (
      <Button
        ref={ref}
        type="button"
        variant={variant}
        disabled={disabled || waiting}
        onClick={() => {
          onResend?.();
          setEndsAt(Date.now() + seconds * 1000);
        }}
        {...props}
      >
        <span className="tabular-nums">
          {waiting
            ? waitingLabel.replace("{seconds}", String(remaining))
            : label}
        </span>
      </Button>
    );
  },
);
ResendButton.displayName = "ResendButton";

/*========================================================================================================================*/

interface OtpVerifyLabels {
  /** Where the code went; `{destination}` is replaced with the masked number or address. */
  sentSms: string;
  sentEmail: string;
  code: string;
  submit: string;
  pending: string;
  resend: string;
  resendWaiting: string;
  noCode: string;
  otherMethod: string;
}

const DEFAULT_LABELS: OtpVerifyLabels = {
  sentSms: "We sent a {length}-digit code by SMS to {destination}.",
  sentEmail: "We sent a {length}-digit code to {destination}.",
  code: "Verification code",
  submit: "Verify",
  pending: "Checking the code…",
  resend: "Send a new code",
  resendWaiting: "Send a new code in {seconds}s",
  noCode: "The code expires in 10 minutes. Didn't get it?",
  otherMethod: "Use another way to verify",
};

interface OtpVerifyProps
  extends Omit<ComponentProps<"form">, "onSubmit" | "children"> {
  /** Masked phone number or email address the code went to, e.g. "••••5678". */
  destination: ReactNode;
  /** How the code was sent; changes the sentence above the field. @default "sms" */
  channel?: "sms" | "email";
  /** Number of digits. @default 6 */
  length?: number;
  onVerify?: (code: string) => void;
  /** Verify as soon as the last digit is entered. @default true */
  autoSubmit?: boolean;
  onResend?: () => void;
  /** Seconds before "Send a new code" can be pressed. @default 60 */
  resendSeconds?: number;
  /** A wrong or expired code. */
  error?: ReactNode;
  /** While the code is being checked. */
  pending?: boolean;
  /** A link to another way to verify, e.g. email instead of SMS. */
  otherMethodHref?: string;
  renderLink?: (href: string, children: ReactNode) => ReactNode;
  labels?: Partial<OtpVerifyLabels>;
}

const defaultRenderLink = (href: string, children: ReactNode) => (
  <Link href={href} primary underline="hover">
    {children}
  </Link>
);

const OtpVerify = forwardRef<HTMLFormElement, OtpVerifyProps>(
  (
    {
      destination,
      channel = "sms",
      length = 6,
      onVerify,
      autoSubmit = true,
      onResend,
      resendSeconds = 60,
      error,
      pending = false,
      otherMethodHref,
      renderLink = defaultRenderLink,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const id = useId();
    const [code, setCode] = useState("");

    const sent = (channel === "sms" ? labels.sentSms : labels.sentEmail)
      .replace("{length}", String(length))
      .split("{destination}");

    const verify = (value: string) => {
      if (!pending && value.length === length) onVerify?.(value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      verify(code);
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
        <p className="text-content text-txt-black-700">
          {sent[0]}
          <span className="text-txt-black-900 font-semibold whitespace-nowrap">
            {destination}
          </span>
          {sent[1]}
        </p>

        <Field name="code" invalid={!!error} disabled={pending}>
          <FieldLabel>{labels.code}</FieldLabel>
          <OTPField
            id={`${id}-code`}
            length={length}
            value={code}
            onValueChange={setCode}
            onValueComplete={(value: string) => autoSubmit && verify(value)}
            className="flex-wrap"
          >
            {Array.from({ length }, (_, i) => (
              <OTPFieldSlot key={i} />
            ))}
          </OTPField>
          <FieldError>{error}</FieldError>
        </Field>

        <Button
          type="submit"
          variant="primary-fill"
          size="medium"
          disabled={pending || code.length < length}
          className="w-full justify-center"
        >
          {pending && <Spinner color="white" label={null} />}
          {pending ? labels.pending : labels.submit}
        </Button>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-content text-txt-black-700">{labels.noCode}</p>
          <ResendButton
            seconds={resendSeconds}
            onResend={onResend}
            disabled={pending}
            label={labels.resend}
            waitingLabel={labels.resendWaiting}
          />
          {otherMethodHref && (
            <span className="text-content mt-1">
              {renderLink(otherMethodHref, labels.otherMethod)}
            </span>
          )}
        </div>
      </form>
    );
  },
);
OtpVerify.displayName = "OtpVerify";

export { OtpVerify, ResendButton };
export type { OtpVerifyProps, OtpVerifyLabels, ResendButtonProps };
