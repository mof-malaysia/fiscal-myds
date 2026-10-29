import React from "react";
import { AuthLayout } from "@mof-malaysia/ftds-react/auth-layout";
import { Link } from "@mof-malaysia/ftds-react/link";
import {
  SignInForm,
  type SignInMethod,
} from "@mof-malaysia/ftds-react/sign-in-form";
import { AccessBrand, wait } from "./access-brand";

/** Officer sign-in for a staff portal: single sign-on first, compact density. */
const StaffSignInPage = () => {
  const [pending, setPending] = React.useState<SignInMethod | false>(false);
  const run = (method: SignInMethod) => async () => {
    setPending(method);
    await wait(1200);
    setPending(false);
  };

  return (
    <div data-density="compact">
      <AuthLayout
        brand={<AccessBrand name="SPEKS Officer Portal" />}
        title="Sign in to SPEKS"
        description="For Ministry of Finance staff. Your activity is recorded."
        footer={
          <span>
            Can't sign in?{" "}
            <Link href="#it-help" primary>
              Contact the IT helpdesk
            </Link>{" "}
            (ext. 4100)
          </span>
        }
      >
        <SignInForm
          methods={["sso", "password"]}
          hideRemember
          forgotPasswordHref="#forgot-password"
          pending={pending}
          onSso={run("sso")}
          onSubmit={run("password")}
          labels={{
            email: "Staff email",
            ssoHint: "Recommended. Uses your Windows sign-in.",
          }}
        />
      </AuthLayout>
    </div>
  );
};

export default StaffSignInPage;
