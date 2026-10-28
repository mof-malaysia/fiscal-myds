import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  PasswordRules,
  SignUpForm,
  type SignUpFormProps,
} from "@mof-malaysia/myds-react/sign-up-form";
import { validateSignUp, wait } from "./components/app/access-brand";

/**
 * ### Overview
 * Creates a citizen or business account: full name, email, an optional mobile
 * number, a password with its rules ticked off as the user types, a
 * confirmation, and consent to the terms and privacy notice.
 *
 * The form holds the values and hands them to `onSubmit`; the app validates and
 * passes `errors` back. Each error shows under its field and in an ErrorSummary,
 * which takes focus.
 *
 * `PasswordRules` is exported for any screen that sets a password.
 *
 * ### Usage
 * ```tsx
 * <SignUpForm
 *   termsHref="/terms"
 *   privacyHref="/privacy"
 *   errors={errors}
 *   pending={saving}
 *   onSubmit={createAccount}
 * />
 * ```
 */
const meta: Meta<typeof SignUpForm> = {
  title: "App/Blocks/SignUpForm",
  component: SignUpForm,
};

export default meta;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-bg-white max-w-[26rem] p-6">{children}</div>
);

/** Submit it empty to see the errors. */
const Live = () => {
  const [errors, setErrors] = React.useState<SignUpFormProps["errors"]>({});
  const [pending, setPending] = React.useState(false);
  return (
    <SignUpForm
      termsHref="#terms"
      privacyHref="#privacy"
      errors={errors}
      pending={pending}
      onSubmit={async (values) => {
        const next = validateSignUp(values);
        setErrors(next);
        if (Object.keys(next).length) return;
        setPending(true);
        await wait();
        setPending(false);
      }}
    />
  );
};

export const Default = createRender(() => (
  <Frame>
    <Live />
  </Frame>
));

export const WithErrors = createRender(() => (
  <Frame>
    <SignUpForm
      defaultValues={{ fullName: "Aminah binti Yusof", password: "short" }}
      errors={{
        email: "Enter an email address like name@example.com",
        password: "Choose a password that meets every rule",
        consent: "Agree to the terms of use and privacy notice to continue",
      }}
    />
  </Frame>
));

export const Pending = createRender(() => (
  <Frame>
    <SignUpForm
      pending
      defaultValues={{
        fullName: "Aminah binti Yusof",
        email: "aminah@example.com",
        password: "kopi2026",
        confirmPassword: "kopi2026",
        consent: true,
      }}
    />
  </Frame>
));

/** Without the phone number, for services that never send SMS. */
export const NoPhone = createRender(() => (
  <Frame>
    <SignUpForm showPhone={false} />
  </Frame>
));

/** The rules checklist on its own, with custom rules. */
export const Rules = createRender(() => {
  const [value, setValue] = React.useState("kopi");
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <input
        className="border-otl-control rounded-md border px-3 py-2"
        aria-label="Password"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <PasswordRules
        value={value}
        rules={[
          {
            id: "len",
            label: "At least 12 characters",
            test: (v) => v.length >= 12,
          },
          {
            id: "upper",
            label: "A capital letter",
            test: (v) => /[A-Z]/.test(v),
          },
          {
            id: "symbol",
            label: "A symbol, like ! or #",
            test: (v) => /[^\w\s]/.test(v),
          },
        ]}
      />
    </div>
  );
});

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Frame>
        <Live />
      </Frame>
    </div>
  ),
  "dark",
);
