---
title: Sign In Form
description: The sign-in form with one or more ways in (MyDigital ID, email and password, or staff SSO) separated by an "or" rule. Put it inside AuthLayout.
---

## When to use

- Use `SignInForm` on the sign-in screen of a citizen service or staff portal, inside `AuthLayout`, which gives the page its title.
- Link to `ForgotPasswordForm` with `forgotPasswordHref`, and from the `AuthLayout` footer to the `SignUpForm` screen.
- Use `OtpVerify` for a second step after a password sign-in, and `SessionTimeoutDialog` once people are signed in.

## Usage

`methods` sets the ways in and their order: `"mydigital-id"`, `"password"` and `"sso"`. The default is `["mydigital-id", "password"]`. The first method gets the primary button; the rest are secondary. `onSubmit` gets `{ email, password, remember }` from the password form.

```tsx
import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import {
  SignInForm,
  type SignInValues,
} from "@/components/blocks/sign-in-form";
import { Link } from "@/components/ui/link";

type FieldErrors = Partial<Record<"email" | "password", string>>;

export function CitizenSignIn({
  signIn,
  redirectToMyDigitalId,
}: {
  signIn: (values: SignInValues) => Promise<boolean>;
  redirectToMyDigitalId: () => void;
}) {
  const [pending, setPending] = useState<"mydigital-id" | "password" | false>(
    false,
  );
  const [failed, setFailed] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  return (
    <AuthLayout
      title="Sign in to MyFiscal"
      description="Check your tax relief claims, pay assessments and track applications."
      footer={
        <span>
          New here?{" "}
          <Link href="/sign-up" primary>
            Create an account
          </Link>
        </span>
      }
    >
      <SignInForm
        forgotPasswordHref="/forgot-password"
        pending={pending}
        errors={errors}
        error={
          failed &&
          "Your email or password is not right. Check them and try again."
        }
        onMyDigitalId={() => {
          setPending("mydigital-id");
          redirectToMyDigitalId();
        }}
        onSubmit={async (values) => {
          const found: FieldErrors = {};
          if (!values.email) found.email = "Enter your email address";
          if (!values.password) found.password = "Enter your password";
          setErrors(found);
          setFailed(false);
          if (Object.keys(found).length > 0) return;
          setPending("password");
          const ok = await signIn(values);
          setPending(false);
          setFailed(!ok);
        }}
      />
    </AuthLayout>
  );
}
```

A staff portal with SSO first, no "Keep me signed in" on shared counter computers, and Bahasa Melayu labels:

```tsx
import {
  SignInForm,
  type SignInValues,
} from "@/components/blocks/sign-in-form";

export function LogMasukPegawai({
  onSso,
  onSubmit,
}: {
  onSso: () => void;
  onSubmit: (values: SignInValues) => void;
}) {
  return (
    <SignInForm
      methods={["sso", "password"]}
      hideRemember
      onSso={onSso}
      onSubmit={onSubmit}
      forgotPasswordHref="/lupa-kata-laluan"
      labels={{
        sso: "Log masuk dengan akaun MOF anda",
        ssoHint: "Akaun yang sama untuk e-mel dan intranet.",
        or: "atau",
        email: "Alamat e-mel",
        password: "Kata laluan",
        forgotPassword: "Lupa kata laluan?",
        submit: "Log masuk",
        pending: "Sedang log masuk…",
        errorTitle: "Kami tidak dapat log masuk anda",
      }}
    />
  );
}
```

## Notes

- The block doesn't validate or sign in: it holds the values and calls your handlers. MyDigital ID and SSO buttons call `onMyDigitalId` and `onSso`; redirect to the identity provider there.
- A failed sign-in goes in `error`, shown in an `ErrorSummary` at the top ("We couldn't sign you in") that takes focus. Keep it general and never say which of email or password was wrong.
- `errors` is for empty or malformed input only, keyed `email` and `password`. Each shows under its field and, when there is no `error`, in a summary that links to the field.
- `pending` takes the method in progress (`"mydigital-id"`, `"password"` or `"sso"`): its button shows a spinner and every button and field is disabled. `pending={true}` means the password form.
- The email field uses `autoComplete="username"` so password managers fill it.
- "Forgot your password?" appears beside the password label only with `forgotPasswordHref`. `renderLink` renders it with your router's link.
- `defaultValues` pre-fills the email (and `remember`), for example after "Use a different account".
- The installed file is yours: edit it when the props don't cover what you need, such as another identity provider.
