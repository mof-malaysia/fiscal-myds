import React from "react";
import { AuthLayout } from "@mof-malaysia/ftds-react/auth-layout";
import { Link } from "@mof-malaysia/ftds-react/link";
import {
  SignInForm,
  type SignInFormProps,
  type SignInMethod,
} from "@mof-malaysia/ftds-react/sign-in-form";
import { AccessBrand, AccessFooter, wait } from "./access-brand";

/** Citizen sign-in: MyDigital ID first, email and password as the fallback. */
const SignInPage = () => {
  const [pending, setPending] = React.useState<SignInMethod | false>(false);
  const [error, setError] = React.useState<string>();
  const [errors, setErrors] = React.useState<SignInFormProps["errors"]>({});

  return (
    <AuthLayout
      brand={<AccessBrand />}
      title="Sign in to MyFiscal"
      description="Check your tax relief claims, pay assessments and track your applications."
      footer={
        <AccessFooter>
          <span>
            New to MyFiscal?{" "}
            <Link href="#sign-up" primary>
              Create an account
            </Link>
          </span>
        </AccessFooter>
      }
    >
      <SignInForm
        methods={["mydigital-id", "password"]}
        forgotPasswordHref="#forgot-password"
        pending={pending}
        error={error}
        errors={errors}
        onMyDigitalId={async () => {
          setPending("mydigital-id");
          await wait(1200);
          setPending(false);
        }}
        onSubmit={async ({ email, password }) => {
          setError(undefined);
          const next: SignInFormProps["errors"] = {};
          if (!email) next.email = "Enter your email address";
          if (!password) next.password = "Enter your password";
          setErrors(next);
          if (next.email || next.password) return;
          setPending("password");
          await wait();
          setPending(false);
          setError(
            "Your email or password is not right. Check them and try again, or reset your password.",
          );
        }}
      />
    </AuthLayout>
  );
};

export default SignInPage;
