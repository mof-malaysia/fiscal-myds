---
title: OTP Field
description: Takes a one-time code in single-character slots. Pasting fills every slot and SMS autofill works. Use it to verify a phone number or sign-in.
category: Forms and inputs
---

## When to use

- Use `OTPField` for a short one-time code sent by SMS, email or an authenticator app.
- Use `Input` for longer codes people copy from a letter (a reference number, an activation code), and `PasswordInput` for a password or PIN that is reused.

## Usage

Set `length` and render one `OTPFieldSlot` per character. The `FieldLabel` labels the first slot; give the other slots an `aria-label` so screen readers know where they are.

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { OTPField, OTPFieldSlot } from "@/components/ui/otp-field";

export function VerificationCode({
  error,
  onComplete,
}: {
  error?: string;
  onComplete: (code: string) => void;
}) {
  return (
    <Field name="code" invalid={Boolean(error)}>
      <FieldLabel>Verification code</FieldLabel>
      <FieldDescription>
        We sent a 6-digit code to 012-345 6789
      </FieldDescription>
      <OTPField length={6} onValueComplete={onComplete}>
        {Array.from({ length: 6 }, (_, i) => (
          <OTPFieldSlot key={i} aria-label={`Digit ${i + 1} of 6`} />
        ))}
      </OTPField>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

Split the slots into groups with `OTPFieldSeparator`, and control the value with `value` and `onValueChange` (a string):

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  OTPField,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "@/components/ui/otp-field";

export function SignInCode({ onVerify }: { onVerify: (code: string) => void }) {
  const [code, setCode] = useState("");
  const slot = (i: number) => (
    <OTPFieldSlot key={i} aria-label={`Digit ${i + 1} of 6`} />
  );
  return (
    <form
      className="gap-stack-md flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        onVerify(code);
      }}
    >
      <Field name="code">
        <FieldLabel>Code from your authenticator app</FieldLabel>
        <OTPField length={6} value={code} onValueChange={setCode}>
          {[0, 1, 2].map(slot)}
          <OTPFieldSeparator />
          {[3, 4, 5].map(slot)}
        </OTPField>
      </Field>
      <Button type="submit" className="w-fit">
        Verify
      </Button>
    </form>
  );
}
```

## Notes

- It joins the surrounding `Field` for label, hint, error and invalid state.
- Base UI ignores `aria-label` on the first slot (the label names it), so passing labels to every slot, as above, is fine.
- `autoComplete` defaults to `"one-time-code"`, so phones offer the code from an SMS. Pasting a whole code fills every slot.
- Only digits are accepted by default (`validationType="numeric"`); use `"alpha"`, `"alphanumeric"` or `"none"` for other codes. `onValueInvalid` fires when typed or pasted characters are rejected.
- `onValueComplete` fires once every slot is filled; use it to verify straight away, or set `autoSubmit` to submit the surrounding form. Keep a submit button too, for people who need to check the code first.
- `mask` hides the characters, like a password. Don't mask short-lived codes unless the screen may be seen by others.
- Error messages say what to do: "That code has expired. Request a new one."
