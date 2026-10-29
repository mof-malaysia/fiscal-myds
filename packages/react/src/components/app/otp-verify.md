---
title: OTP Verify
description: Asks for the one-time code just sent by SMS or email. Names where it went, takes the code, verifies on the last digit, and offers a new code after a countdown.
---

## When to use

- Use `OtpVerify` inside `AuthLayout` for a verification step: confirming a phone number or email after `SignUpForm`, or a second step after `SignInForm`.
- Use `OTPField` on its own when the code is one field in a larger form you lay out yourself.
- `ResendButton`, exported from the same file, is a "Send a new code" button with a countdown, for other screens that send something the user can ask for again. `ForgotPasswordForm` uses it for the reset link.

## Usage

`destination` is the masked number or address the code went to; mask it yourself. `onVerify` gets the code when the button is pressed and, with `autoSubmit` (the default), as soon as the last digit is typed. Pass a wrong or expired code back as `error`.

```tsx
import { useState } from "react";
import { AuthLayout } from "@/components/blocks/auth-layout";
import { OtpVerify } from "@/components/blocks/otp-verify";

export function VerifyPhone({
  checkCode,
  sendCode,
}: {
  checkCode: (code: string) => Promise<boolean>;
  sendCode: () => void;
}) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <AuthLayout
      title="Check your phone"
      description="Enter the code to confirm your mobile number."
    >
      <OtpVerify
        channel="sms"
        destination="••••5678"
        error={error}
        pending={checking}
        otherMethodHref="/verify/email"
        onResend={() => {
          setError(undefined);
          sendCode();
        }}
        onVerify={async (code) => {
          setChecking(true);
          const ok = await checkCode(code);
          setChecking(false);
          setError(
            ok
              ? undefined
              : "That code is not right. Check the latest SMS and try again.",
          );
        }}
      />
    </AuthLayout>
  );
}
```

An email code in Bahasa Melayu. The sentence labels replace `{length}` and `{destination}`; `resendWaiting` replaces `{seconds}`:

```tsx
import { OtpVerify } from "@/components/blocks/otp-verify";

export function SahkanEmel({
  onVerify,
  onResend,
}: {
  onVerify: (code: string) => void;
  onResend: () => void;
}) {
  return (
    <OtpVerify
      expiresInMinutes={10}
      channel="email"
      destination="nur•••@example.com"
      onVerify={onVerify}
      onResend={onResend}
      labels={{
        sentEmail: "Kami telah menghantar kod {length} digit ke {destination}.",
        code: "Kod pengesahan",
        submit: "Sahkan",
        pending: "Menyemak kod…",
        resend: "Hantar kod baharu",
        resendWaiting: "Hantar kod baharu dalam {seconds}s",
        noCode: "Tidak menerima kod?",
        expiry: "Kod tamat tempoh dalam {minutes} minit.",
        otherMethod: "Gunakan cara lain untuk mengesahkan",
      }}
    />
  );
}
```

## Notes

- The code goes in an `OTPField`, so pasting and SMS autofill work. The Verify button stays disabled until every digit is entered, and nothing is verified while `pending`.
- `length` sets the number of digits (6 by default) and fills `{length}` in the sentence above the field.
- "Send a new code" is disabled with a visible countdown for `resendSeconds` (60 by default), starting when the block first renders and again after each press.
- Pass `expiresInMinutes` to tell people how long the code works ("The code expires in 10 minutes."); without it, no duration is stated.
- The block keeps the typed code after an `error`; the error shows under the field. It has no `ErrorSummary`, since there is only one field.
- `renderLink` renders the "Use another way to verify" link; pass your router's link.
- `ResendButton` takes `seconds`, `onResend`, `label` and `waitingLabel` (with `{seconds}`) plus `Button` props such as `variant` (`"default-ghost"` by default).
- The installed file is yours: edit it when the props don't cover what you need.
