"use client";

import { Input } from "@mof-malaysia/myds-react/input";
import { Button } from "@mof-malaysia/myds-react/button";
import { Label } from "@mof-malaysia/myds-react/label";
import { Link } from "@mof-malaysia/myds-react/link";
import { CheckCircleIcon } from "@mof-malaysia/myds-react/icon";

export function ForgotPasswordTemplate() {
  return (
    <div className="bg-bg-gray-50 flex min-h-screen items-center justify-center">
      <div className="bg-bg-gray-50 w-full max-w-md p-8">
        <div className="mb-2 text-center text-2xl font-semibold">
          Forgot password?
        </div>

        <p className="text-body-md mb-6 text-center">
          Don&apos;t worry, we&apos;ll send you reset instructions.
        </p>

        <form className="space-y-6">
          <div>
            <Label className="pb-2" htmlFor="email">
              Email
            </Label>
            <Input
              size="medium"
              id="email"
              type="email"
              placeholder="yourname@example.gov.my"
            />
          </div>

          <Button type="submit" className="w-full justify-center" size="medium">
            Reset password
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="#" className="text-primary-600 text-sm hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ResetEmailTemplate() {
  return (
    <div className="bg-bg-gray-50 flex min-h-screen items-center justify-center">
      <div className="bg-bg-gray-50 w-full max-w-md p-8 text-center">
        <div className="mb-2 text-2xl font-semibold">Check your email</div>

        <p className="text-body-md mb-6">
          We sent a password reset link to{" "}
          <span className="font-medium">yourname@example.gov.my</span>
        </p>

        <Button type="button" className="w-full justify-center" size="medium">
          Open email app
        </Button>

        <p className="text-body-sm mt-4 text-gray-500">
          Didn&apos;t receive the email?{" "}
          <Link href="#" className="text-primary-600 hover:underline">
            Click to resend
          </Link>
        </p>

        <div className="mt-6">
          <Link
            href="#"
            className="text-primary-600 flex items-center justify-center gap-1 text-sm hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SetNewPasswordTemplate() {
  return (
    <div className="bg-bg-gray-50 flex min-h-screen items-center justify-center">
      <div className="bg-bg-gray-50 w-full max-w-md p-8 text-center">
        <h1 className="mb-2 text-2xl font-semibold">Set new password</h1>

        <p className="text-body-md mb-6 text-gray-600">
          Your new password must be different from previously used passwords.
        </p>

        <form className="space-y-4 text-left">
          <div>
            <label className="mb-1 block text-sm font-medium">
              New Password
            </label>
            <Input type="password" placeholder="Enter your new password" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm new password
            </label>
            <Input type="password" placeholder="Re-enter your new password" />
          </div>

          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <CheckCircleIcon className="text-gray-400" />
              Must contain both uppercase and lowercase letters.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircleIcon className="text-gray-400" />
              Must be at least 8 characters
            </p>
            <p className="flex items-center gap-2">
              <CheckCircleIcon className="text-gray-400" />
              Must contain one special character
            </p>
          </div>

          <Button type="submit" className="mt-6 w-full justify-center">
            Reset password
          </Button>
        </form>

        <div className="mt-6">
          <Link
            href="#"
            className="text-primary-600 flex items-center justify-center gap-1 text-sm hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SetNewPasswordSuccessTemplate() {
  return (
    <div className="bg-bg-gray-50 flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm p-8 text-center shadow-md">
        <CheckCircleIcon className="mx-auto mb-4 h-16 w-16 text-[#15803D]" />
        <h1 className="mb-2 text-2xl font-semibold">Password reset</h1>

        <p className="mb-6 text-gray-600">
          Your password has been successfully reset.
          <br />
          Click below to log in.
        </p>

        <Button className="w-full justify-center">Login</Button>
      </div>
    </div>
  );
}
