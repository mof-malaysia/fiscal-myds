---
title: Password Reset
description: The two halves of resetting a password. ForgotPasswordForm asks for the email and shows "Check your email"; ResetPasswordForm sets the new password from the emailed link.
---

## When to use

- Use `ForgotPasswordForm` on the "Forgot your password?" screen that `SignInForm` links to, and `ResetPasswordForm` on the page the emailed link opens. Put both inside `AuthLayout`, which provides the page title.
- Use `SignUpForm` to create an account; it has the same password fields and live rules.
- Use `PasswordRules` (from `@/components/blocks/sign-up-form`) on any other screen that sets a password, such as changing it in `SettingsLayout`.

## Usage

`ForgotPasswordForm` calls `onSubmit` with the email. Once you have sent the link, pass the address as `sentTo` and the form switches to "Check your email" with a resend button. The message never says whether an account exists for that address, so it can't be used to find out who has one. Send the link only if the account exists, but always show the sent state.

```tsx
import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import { ForgotPasswordForm } from "@/components/blocks/password-reset";

export function ForgotPassword({
  sendResetLink,
}: {
  sendResetLink: (email: string) => Promise<void>;
}) {
  const [sentTo, setSentTo] = useState<string>();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>();

  const send = async (email: string) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(
        "Enter an email address in the correct format, like name@example.com",
      );
      return;
    }
    setError(undefined);
    setSending(true);
    await sendResetLink(email);
    setSending(false);
    setSentTo(email);
  };

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll email you a link to choose a new one."
    >
      <ForgotPasswordForm
        sentTo={sentTo}
        error={error}
        pending={sending}
        onSubmit={send}
        onResend={() => sentTo && sendResetLink(sentTo)}
        onChangeEmail={() => setSentTo(undefined)}
      />
    </AuthLayout>
  );
}
```

`ResetPasswordForm` calls `onSubmit` with `{ password, confirmPassword }`. Check the rules and that the two match, and pass `errors` back by field:

```tsx
import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import {
  ResetPasswordForm,
  type ResetPasswordValues,
} from "@/components/blocks/password-reset";

type Errors = Partial<Record<keyof ResetPasswordValues, string>>;

export function ChooseNewPassword({
  savePassword,
}: {
  savePassword: (password: string) => Promise<void>;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  return (
    <AuthLayout title="Choose a new password">
      <ResetPasswordForm
        errors={errors}
        pending={saving}
        onSubmit={async ({ password, confirmPassword }) => {
          const found: Errors = {};
          if (password.length < 8)
            found.password = "Enter a password with at least 8 characters";
          if (password !== confirmPassword)
            found.confirmPassword = "Enter the same password in both fields";
          setErrors(found);
          if (Object.keys(found).length > 0) return;
          setSaving(true);
          await savePassword(password);
          setSaving(false);
        }}
      />
    </AuthLayout>
  );
}
```

## Notes

- Neither form validates: they hold the values and hand them to `onSubmit`. The app checks them and passes `error` (forgot) or `errors` (reset) back; each shows under its field and in an `ErrorSummary` that takes focus.
- The default sent message says the link "works for 30 minutes". Change `labels.sentBody` (it replaces `{email}`) if yours lasts a different time.
- The resend button waits `resendSeconds` (60 by default) before it can be pressed, and again after each press. "Use a different email address" shows only with `onChangeEmail`.
- `ResetPasswordForm` ticks off the password rules as the user types: at least 8 characters, a letter and a number by default. Pass `passwordRules` (each `{ id, label, test }`) to match your policy, and check the same rules on the server.
- Both forms render no heading of their own except "Check your email" (an `h2`) in the sent state; the page's `h1` comes from `AuthLayout`.
- Translate with `labels`, for example `{ email: "Alamat e-mel", submit: "Hantar pautan", sentTitle: "Semak e-mel anda" }` for `ForgotPasswordForm` and `{ password: "Kata laluan baharu", submit: "Simpan kata laluan baharu" }` for `ResetPasswordForm`.
- The installed file is yours: edit it when the props don't cover what you need.
