---
title: Password Input
description: A masked text input with a button to show the password, so people can check it before submitting. Use it for every password field.
category: Forms and inputs
---

## When to use

- Use `PasswordInput` for passwords on sign-in, sign-up and password reset forms.
- Use `OTPField` for one-time codes, and `Input` for anything else that isn't secret.
- For whole screens, start from the `SignInForm`, `SignUpForm` or `ResetPasswordForm` blocks, which already use it.

## Usage

```tsx
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

export function CurrentPassword({ error }: { error?: string }) {
  return (
    <Field name="password" invalid={Boolean(error)}>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput id="password" />
      <FieldError>{error}</FieldError>
    </Field>
  );
}
```

A new password, with its rules in the hint and the show and hide state announced:

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";

export function NewPassword() {
  return (
    <Field name="newPassword">
      <FieldLabel>Create a password</FieldLabel>
      <FieldDescription>
        At least 12 characters. Use a mix of letters, numbers and symbols.
      </FieldDescription>
      <PasswordInput
        id="newPassword"
        autoComplete="new-password"
        minLength={12}
        required
        shownAnnouncement="Your password is visible"
        hiddenAnnouncement="Your password is hidden"
      />
      <FieldError match="valueMissing">Enter a password</FieldError>
      <FieldError match="tooShort">
        Enter a password that is at least 12 characters long
      </FieldError>
    </Field>
  );
}
```

## Notes

- It builds on `Input`, so it joins the surrounding `Field` for label, hint, error and invalid state.
- `autoComplete` defaults to `"current-password"`. Set `"new-password"` on sign-up and reset forms so password managers offer a strong password.
- There is no placeholder by default; the `FieldLabel` says what to enter.
- The toggle is a button with `aria-pressed`. Its accessible name is `showLabel` ("Show password") or `hideLabel` ("Hide password"); translate both.
- `shownAnnouncement` and `hiddenAnnouncement` are read politely after the user toggles. Leave them out to stay silent.
- Visibility is uncontrolled by default (`defaultVisible`, hidden); control it with `visible` and `onVisibleChange`.
- `className` goes to the wrapper around the input and toggle.
- The revealed text never autocorrects, capitalises or spellchecks.
