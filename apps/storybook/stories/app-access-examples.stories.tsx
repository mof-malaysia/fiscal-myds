import type { Meta } from "@storybook/react";
import SignInPage from "./components/app/sign-in-page";
import StaffSignInPage from "./components/app/staff-sign-in-page";
import SignUpPage from "./components/app/sign-up-page";
import ForgotPasswordPage from "./components/app/forgot-password-page";
import ResetPasswordPage from "./components/app/reset-password-page";
import VerifyCodePage from "./components/app/verify-code-page";
import SessionTimeoutPage from "./components/app/session-timeout-page";

/**
 * Whole access screens composed from the App blocks: AuthLayout with SignInForm,
 * SignUpForm, ForgotPasswordForm, ResetPasswordForm, OtpVerify and
 * SessionTimeoutDialog. Callbacks are simulated: a wrong code or password shows
 * the error state.
 */
const meta: Meta = {
  title: "Examples/App/Access",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

/** Citizen sign-in. Signing in with a password always fails here, to show the error. */
export const SignIn = { render: () => <SignInPage /> };

export const StaffSignIn = { render: () => <StaffSignInPage /> };

/** Submit it empty to see the errors. */
export const SignUp = { render: () => <SignUpPage /> };

export const ForgotPassword = { render: () => <ForgotPasswordPage /> };

export const ResetPassword = { render: () => <ResetPasswordPage /> };

/** 123456 is the right code. */
export const VerifyCode = { render: () => <VerifyCodePage /> };

export const SessionTimeout = { render: () => <SessionTimeoutPage /> };
