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
import { Checkbox } from "../core/checkbox";
import { Field, FieldDescription, FieldError, FieldLabel } from "../core/field";
import { Input } from "../core/input";
import { Link } from "../core/link";
import { Spinner } from "../core/spinner";
import { ErrorSummary } from "./error-summary";
import { PasswordInput } from "./password-input";
import { CheckCircleIcon } from "../../icons/check-circle";
import { clx } from "../../utils";

/**
 * SignUpForm creates a citizen or business account: full name, email, an optional
 * phone number, a password with its rules ticked off as the user types, a
 * confirmation, and consent to the terms and privacy notice.
 *
 * It holds the values while the user types and hands them to `onSubmit`. The app
 * validates them and passes `errors` back: each shows under its field and in an
 * ErrorSummary at the top, which takes focus so the problem is heard at once.
 *
 * `PasswordRules` is exported for other screens that set a password.
 *
 * @example
 * <SignUpForm
 *   termsHref="/terms"
 *   privacyHref="/privacy"
 *   errors={errors}
 *   pending={saving}
 *   onSubmit={(values) => createAccount(values)}
 * />
 */

/*========================================================================================================================*/

interface PasswordRule {
  id: string;
  /** What the password needs, e.g. "At least 8 characters". */
  label: ReactNode;
  test: (value: string) => boolean;
}

const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (v) => v.length >= 8,
  },
  {
    id: "letter",
    label: "At least one letter",
    test: (v) => /[A-Za-z\u00C0-\u024F]/.test(v),
  },
  {
    id: "number",
    label: "At least one number",
    test: (v) => /\d/.test(v),
  },
];

interface PasswordRulesProps extends ComponentProps<"ul"> {
  /** The password as typed. */
  value: string;
  /** What the password needs. Defaults to 8 characters, a letter and a number. */
  rules?: PasswordRule[];
  /** Screen-reader text after a rule that is met and one that isn't yet. */
  metLabel?: string;
  unmetLabel?: string;
}

/**
 * A checklist of password rules that tick as the user types. Each rule says
 * whether it is met in words, not only with the icon.
 */
const PasswordRules = forwardRef<HTMLUListElement, PasswordRulesProps>(
  (
    {
      value,
      rules = DEFAULT_PASSWORD_RULES,
      metLabel = "done",
      unmetLabel = "not yet",
      className,
      ...props
    },
    ref,
  ) => (
    <ul
      ref={ref}
      className={clx("m-0 flex list-none flex-col gap-1 p-0", className)}
      {...props}
    >
      {rules.map((rule) => {
        const met = rule.test(value);
        return (
          <li
            key={rule.id}
            data-met={met || undefined}
            className={clx(
              "text-content flex items-center gap-2",
              met ? "text-txt-success" : "text-txt-black-700",
            )}
          >
            {met ? (
              <CheckCircleIcon aria-hidden className="size-4 shrink-0" />
            ) : (
              <span
                aria-hidden
                className="border-otl-gray-300 mx-0.5 size-3 shrink-0 rounded-full border-2"
              />
            )}
            <span>
              {rule.label}
              <span className="sr-only">: {met ? metLabel : unmetLabel}</span>
            </span>
          </li>
        );
      })}
    </ul>
  ),
);
PasswordRules.displayName = "PasswordRules";

type NewPasswordField = "password" | "confirmPassword";

interface NewPasswordFieldsProps {
  /** Builds each input's id, so an ErrorSummary can link to it. */
  id: (field: NewPasswordField) => string;
  values: Record<NewPasswordField, string>;
  onChange: (field: NewPasswordField, value: string) => void;
  errors: Partial<Record<NewPasswordField, ReactNode>>;
  disabled?: boolean;
  rules?: PasswordRule[];
  labels: { password: string; passwordHint: string; confirmPassword: string };
}

/** "Create a password" with its live rules, then "Confirm password". Shared by sign-up and reset. */
const NewPasswordFields = ({
  id,
  values,
  onChange,
  errors,
  disabled,
  rules,
  labels,
}: NewPasswordFieldsProps) => (
  <>
    <Field name="password" invalid={!!errors.password} disabled={disabled}>
      <FieldLabel>{labels.password}</FieldLabel>
      <FieldDescription>{labels.passwordHint}</FieldDescription>
      <PasswordRules value={values.password} rules={rules} />
      <PasswordInput
        id={id("password")}
        autoComplete="new-password"
        placeholder=""
        value={values.password}
        onChange={(event) => onChange("password", event.target.value)}
      />
      <FieldError>{errors.password}</FieldError>
    </Field>
    <Field
      name="confirmPassword"
      invalid={!!errors.confirmPassword}
      disabled={disabled}
    >
      <FieldLabel>{labels.confirmPassword}</FieldLabel>
      <PasswordInput
        id={id("confirmPassword")}
        autoComplete="new-password"
        placeholder=""
        value={values.confirmPassword}
        onChange={(event) => onChange("confirmPassword", event.target.value)}
      />
      <FieldError>{errors.confirmPassword}</FieldError>
    </Field>
  </>
);
NewPasswordFields.displayName = "NewPasswordFields";

/*========================================================================================================================*/

interface SignUpValues {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
}

type SignUpField = keyof SignUpValues;

interface SignUpFormLabels {
  fullName: string;
  fullNameHint: string;
  email: string;
  emailHint: string;
  phone: string;
  optional: string;
  phoneHint: string;
  password: string;
  passwordHint: string;
  confirmPassword: string;
  /** Before the links in the consent sentence. */
  consentStart: string;
  terms: string;
  consentJoin: string;
  privacy: string;
  submit: string;
  pending: string;
  errorTitle: string;
}

const DEFAULT_LABELS: SignUpFormLabels = {
  fullName: "Full name",
  fullNameHint: "As shown on your MyKad or passport",
  email: "Email address",
  emailHint: "We'll send a code to confirm it",
  phone: "Mobile number",
  optional: "(optional)",
  phoneHint: "For SMS reminders about your applications",
  password: "Create a password",
  passwordHint: "Your password needs:",
  confirmPassword: "Type the password again",
  consentStart: "I agree to the",
  terms: "terms of use",
  consentJoin: "and the",
  privacy: "privacy notice",
  submit: "Create account",
  pending: "Creating your account…",
  errorTitle: "There is a problem",
};

interface SignUpFormProps extends Omit<
  ComponentProps<"form">,
  "onSubmit" | "children"
> {
  onSubmit?: (values: SignUpValues) => void;
  /** Messages from the app's validation, keyed by field. Each shows under its field and in the summary. */
  errors?: Partial<Record<SignUpField, ReactNode>>;
  /** While the account is being created: the button shows a spinner and the form is read-only. */
  pending?: boolean;
  /** Values to start with, e.g. an email carried over from sign-in. */
  defaultValues?: Partial<SignUpValues>;
  /** Ask for a phone number. @default true */
  showPhone?: boolean;
  termsHref?: string;
  privacyHref?: string;
  /** Renders the consent links; pass your router's link. Defaults to a ftds Link that opens in a new tab. */
  renderLink?: (href: string, children: ReactNode) => ReactNode;
  /** Rules for the password checklist. */
  passwordRules?: PasswordRule[];
  labels?: Partial<SignUpFormLabels>;
}

const defaultRenderLink = (href: string, children: ReactNode) => (
  <Link href={href} newTab primary>
    {children}
  </Link>
);

const SignUpForm = forwardRef<HTMLFormElement, SignUpFormProps>(
  (
    {
      onSubmit,
      errors = {},
      pending = false,
      defaultValues,
      showPhone = true,
      termsHref = "#",
      privacyHref = "#",
      renderLink = defaultRenderLink,
      passwordRules,
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const id = useId();
    const fieldId = (field: SignUpField) => `${id}-${field}`;
    const [values, setValues] = useState<SignUpValues>({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      consent: false,
      ...defaultValues,
    });
    const set =
      <K extends SignUpField>(field: K) =>
      (value: SignUpValues[K]) =>
        setValues((current) => ({ ...current, [field]: value }));

    const summary = (Object.keys(errors) as SignUpField[])
      .filter((field) => errors[field])
      .map((field) => ({ id: fieldId(field), message: errors[field] }));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!pending) onSubmit?.(values);
    };

    const textField = (
      field: "fullName" | "email" | "phone",
      label: ReactNode,
      hint: ReactNode,
      inputProps: ComponentProps<typeof Input>,
    ) => (
      <Field name={field} invalid={!!errors[field]} disabled={pending}>
        <FieldLabel>{label}</FieldLabel>
        <FieldDescription>{hint}</FieldDescription>
        <Input
          id={fieldId(field)}
          value={values[field]}
          onChange={(event) => set(field)(event.target.value)}
          {...inputProps}
        />
        <FieldError>{errors[field]}</FieldError>
      </Field>
    );

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

        {textField("fullName", labels.fullName, labels.fullNameHint, {
          autoComplete: "name",
        })}
        {textField("email", labels.email, labels.emailHint, {
          type: "email",
          autoComplete: "email",
          inputMode: "email",
          spellCheck: false,
        })}
        {showPhone &&
          textField(
            "phone",
            <>
              {labels.phone}{" "}
              <span className="text-txt-black-700 font-normal">
                {labels.optional}
              </span>
            </>,
            labels.phoneHint,
            { type: "tel", autoComplete: "tel", inputMode: "tel" },
          )}

        <NewPasswordFields
          id={fieldId}
          values={values}
          onChange={(field, value) => set(field)(value)}
          errors={errors}
          disabled={pending}
          rules={passwordRules}
          labels={labels}
        />

        <Field name="consent" invalid={!!errors.consent} disabled={pending}>
          <FieldLabel className="text-content flex cursor-pointer items-start gap-3 font-normal">
            <span className="flex h-[var(--content-leading)] shrink-0 items-center">
              <Checkbox
                id={fieldId("consent")}
                size="medium"
                checked={values.consent}
                onCheckedChange={(checked) => set("consent")(checked)}
              />
            </span>
            <span>
              {labels.consentStart} {renderLink(termsHref, labels.terms)}{" "}
              {labels.consentJoin} {renderLink(privacyHref, labels.privacy)}
            </span>
          </FieldLabel>
          <FieldError>{errors.consent}</FieldError>
        </Field>

        <Button
          type="submit"
          variant="primary-fill"
          size="medium"
          disabled={pending}
          className="w-full justify-center"
        >
          {pending && <Spinner color="white" label={null} />}
          {pending ? labels.pending : labels.submit}
        </Button>
      </form>
    );
  },
);
SignUpForm.displayName = "SignUpForm";

export { SignUpForm, PasswordRules, NewPasswordFields, DEFAULT_PASSWORD_RULES };
export type {
  SignUpFormProps,
  SignUpFormLabels,
  SignUpValues,
  PasswordRulesProps,
  PasswordRule,
};
