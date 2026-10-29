import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  ForgotPasswordForm,
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from "@mof-malaysia/myds-react/password-reset";
import { wait } from "./components/app/access-brand";

/**
 * ### Overview
 * The two halves of resetting a password.
 *
 * `ForgotPasswordForm` asks for the account's email. Once the app has sent the
 * link, pass `sentTo` to show "Check your email" with a resend button that waits
 * between sends. The message never confirms whether an account exists.
 *
 * `ResetPasswordForm` is where the link lands: a new password, its rules ticked
 * off as the user types, and a confirmation.
 *
 * ### Usage
 * ```tsx
 * <ForgotPasswordForm
 *   sentTo={sent ? email : undefined}
 *   pending={sending}
 *   onSubmit={sendResetLink}
 *   onResend={() => sendResetLink(email)}
 * />
 *
 * <ResetPasswordForm errors={errors} pending={saving} onSubmit={setNewPassword} />
 * ```
 */
const meta: Meta<typeof ForgotPasswordForm> = {
  title: "App/Blocks/PasswordReset",
  component: ForgotPasswordForm,
};

export default meta;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-bg-white max-w-[26rem] p-6">{children}</div>
);

const LiveForgot = () => {
  const [pending, setPending] = React.useState(false);
  const [sentTo, setSentTo] = React.useState<string>();
  const [error, setError] = React.useState<string>();
  return (
    <ForgotPasswordForm
      pending={pending}
      sentTo={sentTo}
      error={error}
      resendSeconds={15}
      onChangeEmail={() => setSentTo(undefined)}
      onSubmit={async (email) => {
        if (!/^\S+@\S+\.\S+$/.test(email)) {
          setError("Enter an email address like name@example.com");
          return;
        }
        setError(undefined);
        setPending(true);
        await wait();
        setPending(false);
        setSentTo(email);
      }}
    />
  );
};

/** Enter any email address to see the sent state. */
export const Forgot = createRender(() => (
  <Frame>
    <LiveForgot />
  </Frame>
));

export const ForgotError = createRender(() => (
  <Frame>
    <ForgotPasswordForm
      defaultEmail="aminah@"
      error="Enter an email address like name@example.com"
    />
  </Frame>
));

export const ForgotSent = createRender(() => (
  <Frame>
    <ForgotPasswordForm sentTo="aminah@example.com" onChangeEmail={() => {}} />
  </Frame>
));

const LiveReset = () => {
  const [errors, setErrors] = React.useState<ResetPasswordFormProps["errors"]>(
    {},
  );
  const [pending, setPending] = React.useState(false);
  return (
    <ResetPasswordForm
      errors={errors}
      pending={pending}
      onSubmit={async ({ password, confirmPassword }) => {
        if (password.length < 8 || !/\d/.test(password)) {
          setErrors({ password: "Choose a password that meets every rule" });
          return;
        }
        if (password !== confirmPassword) {
          setErrors({ confirmPassword: "The two passwords don't match" });
          return;
        }
        setErrors({});
        setPending(true);
        await wait();
        setPending(false);
      }}
    />
  );
};

export const Reset = createRender(() => (
  <Frame>
    <LiveReset />
  </Frame>
));

export const ResetErrors = createRender(() => (
  <Frame>
    <ResetPasswordForm
      errors={{ confirmPassword: "The two passwords don't match" }}
    />
  </Frame>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Frame>
        <ForgotPasswordForm sentTo="aminah@example.com" />
      </Frame>
      <Frame>
        <LiveReset />
      </Frame>
    </div>
  ),
  "dark",
);
