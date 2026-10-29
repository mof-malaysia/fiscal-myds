---
title: Auth Layout
description: The frame of every sign-in, sign-up, password and verification screen. A full-height page with one centred panel holding the h1, a short description and the form.
---

## When to use

- Use `AuthLayout` for every account-access screen: sign in, create an account, forgot or reset password, verify a code.
- Put the form block inside it: `SignInForm`, `SignUpForm`, `ForgotPasswordForm`, `ResetPasswordForm` or `OtpVerify`. Those blocks render only the form, not the page or the title.
- Use `SettingsLayout` once the user is signed in and managing their account, and `ErrorPage` for whole-page errors.

## Usage

`title` is rendered as the page's only `h1`. `brand` sits above the panel, `eyebrow` above the title inside it (a back link, an icon), and `footer` below the panel (links to the other auth screens, a language switch, help).

```tsx
import { AuthLayout } from "@/components/blocks/auth-layout";
import {
  SignInForm,
  type SignInValues,
} from "@/components/blocks/sign-in-form";
import { Link } from "@/components/ui/link";

export function SignInPage({
  signIn,
  signInWithMyDigitalId,
}: {
  signIn: (values: SignInValues) => void;
  signInWithMyDigitalId: () => void;
}) {
  return (
    <AuthLayout
      brand={
        <span className="text-title text-txt-black-900 font-semibold">
          Ministry of Finance Malaysia
        </span>
      }
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
        onMyDigitalId={signInWithMyDigitalId}
        onSubmit={signIn}
      />
    </AuthLayout>
  );
}
```

A screen reached from another step, with a back link in `eyebrow`:

```tsx
import { AuthLayout } from "@/components/blocks/auth-layout";
import { ForgotPasswordForm } from "@/components/blocks/password-reset";
import { Link } from "@/components/ui/link";

export function ForgotPasswordPage({
  sentTo,
  sendLink,
}: {
  sentTo?: string;
  sendLink: (email: string) => void;
}) {
  return (
    <AuthLayout
      eyebrow={
        <Link href="/sign-in" primary underline="hover">
          Back to sign in
        </Link>
      }
      title="Reset your password"
      description="We'll email you a link to choose a new one."
    >
      <ForgotPasswordForm
        sentTo={sentTo}
        onSubmit={sendLink}
        onResend={() => sentTo && sendLink(sentTo)}
      />
    </AuthLayout>
  );
}
```

## Notes

- It renders a `<main>` that fills the viewport height on the Well tone, so use it as the whole page, not inside another `main`. Add `Skiplink` and `Masthead` above it if the screen needs the government chrome.
- The panel is at most 26rem wide; on a phone it fills the width. Pass `panelClassName` to adjust the panel and `className` for the page.
- There is no `labels` prop: every piece of text comes from your props, so translate them directly.
- The installed file is yours: edit it when the props don't cover what you need.
