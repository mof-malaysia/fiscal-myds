import React from "react";
import { AuthLayout } from "@mof-malaysia/myds-react/auth-layout";
import { Button } from "@mof-malaysia/myds-react/button";
import {
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from "@mof-malaysia/myds-react/password-reset";
import { CheckCircleIcon } from "@mof-malaysia/myds-react/icon";
import { AccessBrand, AccessFooter, wait } from "./access-brand";

const ResetPasswordPage = () => {
  const [errors, setErrors] = React.useState<ResetPasswordFormProps["errors"]>(
    {},
  );
  const [pending, setPending] = React.useState(false);
  const [done, setDone] = React.useState(false);

  if (done)
    return (
      <AuthLayout
        brand={<AccessBrand />}
        eyebrow={
          <CheckCircleIcon aria-hidden className="text-txt-success size-10" />
        }
        title="Your password has been changed"
        description="Use your new password the next time you sign in. We've also signed you out on other devices."
        footer={<AccessFooter />}
      >
        <Button
          variant="primary-fill"
          size="medium"
          className="w-full justify-center"
          onClick={() => setDone(false)}
        >
          Sign in
        </Button>
      </AuthLayout>
    );

  return (
    <AuthLayout
      brand={<AccessBrand />}
      title="Choose a new password"
      description="For aminah@example.com. Choose one you don't use anywhere else."
      footer={<AccessFooter />}
    >
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
          setDone(true);
        }}
      />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
