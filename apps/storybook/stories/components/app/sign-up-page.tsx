import React from "react";
import { AuthLayout } from "@mof-malaysia/myds-react/auth-layout";
import { Link } from "@mof-malaysia/myds-react/link";
import {
  SignUpForm,
  type SignUpFormProps,
} from "@mof-malaysia/myds-react/sign-up-form";
import {
  AccessBrand,
  AccessFooter,
  validateSignUp,
  wait,
} from "./access-brand";

const SignUpPage = () => {
  const [errors, setErrors] = React.useState<SignUpFormProps["errors"]>({});
  const [pending, setPending] = React.useState(false);

  return (
    <AuthLayout
      brand={<AccessBrand />}
      title="Create a MyFiscal account"
      description="It takes about 3 minutes. You'll need your email address. If you have MyDigital ID, you can sign in with it instead."
      footer={
        <AccessFooter>
          <span>
            Already have an account?{" "}
            <Link href="#sign-in" primary>
              Sign in
            </Link>
          </span>
        </AccessFooter>
      }
    >
      <SignUpForm
        termsHref="#terms"
        privacyHref="#privacy"
        errors={errors}
        pending={pending}
        onSubmit={async (values) => {
          const next = validateSignUp(values);
          setErrors(next);
          if (Object.keys(next).length) return;
          setPending(true);
          await wait();
          setPending(false);
        }}
      />
    </AuthLayout>
  );
};

export default SignUpPage;
