"use client";
// registry:block — composed page section, installs to components/blocks
import React, {
  ComponentProps,
  FormEvent,
  Fragment,
  ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";
import { Button } from "../core/button";
import { Checkbox } from "../core/checkbox";
import { Field, FieldError, FieldLabel } from "../core/field";
import { Input } from "../core/input";
import { Link } from "../core/link";
import { Spinner } from "../core/spinner";
import {
  ErrorSummary,
  ErrorSummaryDescription,
  ErrorSummaryTitle,
} from "./error-summary";
import { PasswordInput } from "./password-input";
import { clx } from "../../utils";

/**
 * SignInForm offers one or more ways in, in the order given by `methods`:
 * - `"mydigital-id"`: the national digital identity, a primary button for citizens.
 * - `"password"`: email and password, with "Keep me signed in" and a link to reset it.
 * - `"sso"`: "Sign in with your MOF account", for staff portals.
 *
 * Methods are separated by an "or" rule. The first method gets the primary button.
 *
 * A failed sign-in comes back as `error`. Keep it general ("Your email or password
 * is not right"): never say which of the two was wrong. Field `errors` are for
 * empty or malformed input only.
 *
 * @example
 * <SignInForm
 *   methods={["mydigital-id", "password"]}
 *   forgotPasswordHref="/forgot-password"
 *   error={failed && "Your email or password is not right. Check them and try again."}
 *   pending={signingIn}
 *   onMyDigitalId={() => redirectToMyDigitalId()}
 *   onSubmit={({ email, password, remember }) => signIn(email, password, remember)}
 * />
 */

type SignInMethod = "mydigital-id" | "password" | "sso";

interface SignInValues {
  email: string;
  password: string;
  remember: boolean;
}

interface SignInFormLabels {
  myDigitalId: string;
  myDigitalIdHint: string;
  sso: string;
  ssoHint: string;
  or: string;
  email: string;
  password: string;
  forgotPassword: string;
  remember: string;
  submit: string;
  pending: string;
  errorTitle: string;
}

const DEFAULT_LABELS: SignInFormLabels = {
  myDigitalId: "Sign in with MyDigital ID",
  myDigitalIdHint: "Use the MyDigital ID app on your phone.",
  sso: "Sign in with your MOF account",
  ssoHint: "The same account you use for email and the intranet.",
  or: "or",
  email: "Email address",
  password: "Password",
  forgotPassword: "Forgot your password?",
  remember: "Keep me signed in on this device",
  submit: "Sign in",
  pending: "Signing in…",
  errorTitle: "We couldn't sign you in",
};

interface SignInFormProps
  extends Omit<ComponentProps<"div">, "onSubmit" | "children"> {
  /** Which ways in to offer, in order. @default ["mydigital-id", "password"] */
  methods?: SignInMethod[];
  onSubmit?: (values: SignInValues) => void;
  onMyDigitalId?: () => void;
  onSso?: () => void;
  /** A failed sign-in, shown at the top. Don't say which field was wrong. */
  error?: ReactNode;
  /** Empty or malformed input, keyed by field. */
  errors?: Partial<Record<"email" | "password", ReactNode>>;
  /** Which method is in progress: its button shows a spinner and the others are disabled. */
  pending?: SignInMethod | boolean;
  defaultValues?: Partial<SignInValues>;
  /** Hide "Keep me signed in" (e.g. on shared computers in a counter). */
  hideRemember?: boolean;
  forgotPasswordHref?: string;
  /** Renders the forgot-password link; pass your router's link. */
  renderLink?: (href: string, children: ReactNode) => ReactNode;
  labels?: Partial<SignInFormLabels>;
}

const defaultRenderLink = (href: string, children: ReactNode) => (
  <Link href={href} primary underline="hover">
    {children}
  </Link>
);

/** The MyDigital ID mark: a simple shield, so the button needs no external asset. */
const MyDigitalIdMark = () => (
  <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0" fill="none">
    <path
      d="M10 1.75 3.5 4.25v5.1c0 4.1 2.75 7.6 6.5 8.9 3.75-1.3 6.5-4.8 6.5-8.9v-5.1L10 1.75Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="m7 10 2 2 4-4.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SignInForm = forwardRef<HTMLDivElement, SignInFormProps>(
  (
    {
      methods = ["mydigital-id", "password"],
      onSubmit,
      onMyDigitalId,
      onSso,
      error,
      errors = {},
      pending = false,
      defaultValues,
      hideRemember = false,
      forgotPasswordHref,
      renderLink = defaultRenderLink,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const id = useId();
    const [values, setValues] = useState<SignInValues>({
      email: "",
      password: "",
      remember: false,
      ...defaultValues,
    });
    const busy = pending !== false;
    const isPending = (method: SignInMethod) =>
      pending === method || (pending === true && method === "password");

    const fieldErrors = (["email", "password"] as const)
      .filter((field) => errors[field])
      .map((field) => ({ id: `${id}-${field}`, message: errors[field] }));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!busy) onSubmit?.(values);
    };

    // The first method on the screen is the primary action
    const isPrimary = (method: SignInMethod) => methods[0] === method;

    const methodButton = (
      method: "mydigital-id" | "sso",
      onClick: (() => void) | undefined,
      label: string,
      hint: string,
      icon?: ReactNode,
    ) => (
      <div className="flex flex-col gap-2">
        <Button
          type="button"
          variant={isPrimary(method) ? "primary-fill" : "default-outline"}
          size="medium"
          disabled={busy}
          onClick={onClick}
          className="w-full justify-center"
        >
          {isPending(method) ? (
            <Spinner
              color={isPrimary(method) ? "white" : "gray"}
              label={null}
            />
          ) : (
            icon
          )}
          {label}
        </Button>
        <p className="text-content text-txt-black-700 text-center">{hint}</p>
      </div>
    );

    const sections: Record<SignInMethod, ReactNode> = {
      "mydigital-id": methodButton(
        "mydigital-id",
        onMyDigitalId,
        labels.myDigitalId,
        labels.myDigitalIdHint,
        <MyDigitalIdMark />,
      ),
      sso: methodButton("sso", onSso, labels.sso, labels.ssoHint),
      password: (
        <form
          noValidate
          aria-busy={isPending("password") || undefined}
          onSubmit={handleSubmit}
          className="gap-stack-md flex flex-col"
        >
          {fieldErrors.length > 0 && !error && (
            <ErrorSummary title={labels.errorTitle} errors={fieldErrors} />
          )}
          <Field name="email" invalid={!!errors.email} disabled={busy}>
            <FieldLabel>{labels.email}</FieldLabel>
            <Input
              id={`${id}-email`}
              type="email"
              inputMode="email"
              autoComplete="username"
              spellCheck={false}
              value={values.email}
              onChange={(event) =>
                setValues((v) => ({ ...v, email: event.target.value }))
              }
            />
            <FieldError>{errors.email}</FieldError>
          </Field>
          <Field name="password" invalid={!!errors.password} disabled={busy}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <FieldLabel>{labels.password}</FieldLabel>
              {forgotPasswordHref && (
                <span className="text-label-md">
                  {renderLink(forgotPasswordHref, labels.forgotPassword)}
                </span>
              )}
            </div>
            <PasswordInput
              id={`${id}-password`}
              placeholder=""
              value={values.password}
              onChange={(event) =>
                setValues((v) => ({ ...v, password: event.target.value }))
              }
            />
            <FieldError>{errors.password}</FieldError>
          </Field>
          {!hideRemember && (
            <label className="text-content text-txt-black-900 flex cursor-pointer items-start gap-3">
              <span className="flex h-[var(--content-leading)] shrink-0 items-center">
                <Checkbox
                  size="medium"
                  checked={values.remember}
                  disabled={busy}
                  onCheckedChange={(remember) =>
                    setValues((v) => ({ ...v, remember }))
                  }
                />
              </span>
              <span>{labels.remember}</span>
            </label>
          )}
          <Button
            type="submit"
            variant={isPrimary("password") ? "primary-fill" : "default-outline"}
            size="medium"
            disabled={busy}
            className="w-full justify-center"
          >
            {isPending("password") && (
              <Spinner
                color={isPrimary("password") ? "white" : "gray"}
                label={null}
              />
            )}
            {isPending("password") ? labels.pending : labels.submit}
          </Button>
        </form>
      ),
    };

    return (
      <div
        ref={ref}
        className={clx("gap-stack-lg flex flex-col", className)}
        {...props}
      >
        {error && (
          <ErrorSummary>
            <ErrorSummaryTitle>{labels.errorTitle}</ErrorSummaryTitle>
            <ErrorSummaryDescription>{error}</ErrorSummaryDescription>
          </ErrorSummary>
        )}
        {methods.map((method, i) => (
          <Fragment key={method}>
            {i > 0 && (
              <div
                role="separator"
                aria-label={labels.or}
                className="text-txt-black-700 text-label-md flex items-center gap-3"
              >
                <span aria-hidden className="bg-otl-gray-200 h-px flex-1" />
                <span aria-hidden>{labels.or}</span>
                <span aria-hidden className="bg-otl-gray-200 h-px flex-1" />
              </div>
            )}
            {sections[method]}
          </Fragment>
        ))}
      </div>
    );
  },
);
SignInForm.displayName = "SignInForm";

export { SignInForm };
export type { SignInFormProps, SignInFormLabels, SignInValues, SignInMethod };
