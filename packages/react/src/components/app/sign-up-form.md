---
title: Sign Up Form
description: Creates a citizen or business account. Full name, email, optional phone, a password with live rules, a confirmation and consent to the terms. Put it inside AuthLayout.
---

## When to use

- Use `SignUpForm` on the "Create an account" screen, inside `AuthLayout`, which gives the page its title. Follow it with `OtpVerify` to confirm the email or phone.
- Use `SignInForm` for people who already have an account, and `ResetPasswordForm` (from `@/components/blocks/password-reset`) to set a new password.
- `PasswordRules`, exported from the same file, is the live checklist of password rules, for any other screen that sets a password. `DEFAULT_PASSWORD_RULES` holds the default rules.

## Usage

The block holds the values while the user types and hands them to `onSubmit` as `{ fullName, email, phone, password, confirmPassword, consent }`. Validate them and pass `errors` back, keyed by the same names.

```tsx
import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import {
  SignUpForm,
  type SignUpValues,
} from "@/components/blocks/sign-up-form";
import { Link } from "@/components/ui/link";

type Errors = Partial<Record<keyof SignUpValues, string>>;

function validate(values: SignUpValues): Errors {
  const errors: Errors = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name";
  if (!/^\S+@\S+\.\S+$/.test(values.email))
    errors.email =
      "Enter an email address in the correct format, like name@example.com";
  if (
    values.password.length < 8 ||
    !/\d/.test(values.password) ||
    !/[A-Za-z]/.test(values.password)
  )
    errors.password =
      "Enter a password with at least 8 characters, a letter and a number";
  if (values.password !== values.confirmPassword)
    errors.confirmPassword = "Enter the same password in both fields";
  if (!values.consent)
    errors.consent =
      "Agree to the terms of use and privacy notice to create an account";
  return errors;
}

export function CreateAccount({
  createAccount,
}: {
  createAccount: (values: SignUpValues) => Promise<void>;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  return (
    <AuthLayout
      title="Create a MyFiscal account"
      description="You need an account to apply for tax relief and track your applications."
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/sign-in" primary>
            Sign in
          </Link>
        </span>
      }
    >
      <SignUpForm
        termsHref="/terms"
        privacyHref="/privacy"
        errors={errors}
        pending={saving}
        onSubmit={async (values) => {
          const found = validate(values);
          setErrors(found);
          if (Object.keys(found).length > 0) return;
          setSaving(true);
          await createAccount(values);
          setSaving(false);
        }}
      />
    </AuthLayout>
  );
}
```

Without the phone field, with your own password rules and Bahasa Melayu labels:

```tsx
import {
  SignUpForm,
  type PasswordRule,
  type SignUpValues,
} from "@/components/blocks/sign-up-form";

const rules: PasswordRule[] = [
  {
    id: "length",
    label: "Sekurang-kurangnya 12 aksara",
    test: (v) => v.length >= 12,
  },
  {
    id: "number",
    label: "Sekurang-kurangnya satu nombor",
    test: (v) => /\d/.test(v),
  },
];

export function DaftarAkaun({
  onSubmit,
}: {
  onSubmit: (values: SignUpValues) => void;
}) {
  return (
    <SignUpForm
      showPhone={false}
      passwordRules={rules}
      termsHref="/terma"
      privacyHref="/privasi"
      onSubmit={onSubmit}
      labels={{
        fullName: "Nama penuh",
        fullNameHint: "Seperti dalam MyKad atau pasport anda",
        email: "Alamat e-mel",
        emailHint: "Kami akan menghantar kod untuk mengesahkannya",
        password: "Cipta kata laluan",
        passwordHint: "Kata laluan anda memerlukan:",
        confirmPassword: "Taip kata laluan sekali lagi",
        consentStart: "Saya bersetuju dengan",
        terms: "terma penggunaan",
        consentJoin: "dan",
        privacy: "notis privasi",
        submit: "Cipta akaun",
        pending: "Sedang mencipta akaun anda…",
        errorTitle: "Terdapat masalah",
      }}
    />
  );
}
```

## Notes

- Each error shows under its field and in an `ErrorSummary` at the top that takes focus and links to the field. The summary lists errors in the order of the keys in `errors`, so build the object in form order.
- The password checklist ticks as the user types and says "done" or "not yet" to screen readers. The default rules are at least 8 characters, one letter and one number; check the same rules on the server.
- The consent links open in a new tab by default; `renderLink` renders them with your router's link. Set `termsHref` and `privacyHref`, which default to `"#"`.
- The phone field is optional and labelled "(optional)"; hide it with `showPhone={false}`. `defaultValues` pre-fills fields, for example an email carried over from sign-in.
- `pending` disables the fields and shows a spinner in the button ("Creating your account…").
- The installed file is yours: edit it when the props don't cover what you need, such as an IC number field.
