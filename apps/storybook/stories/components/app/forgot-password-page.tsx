import React from "react";
import { AuthLayout } from "@mof-malaysia/ftds-react/auth-layout";
import { Link } from "@mof-malaysia/ftds-react/link";
import { ForgotPasswordForm } from "@mof-malaysia/ftds-react/password-reset";
import { AccessBrand, AccessFooter, wait } from "./access-brand";

const ForgotPasswordPage = () => {
  const [pending, setPending] = React.useState(false);
  const [sentTo, setSentTo] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  return (
    <AuthLayout
      brand={<AccessBrand />}
      eyebrow={
        <Link
          href="#sign-in"
          primary
          underline="hover"
          className="text-label-md"
        >
          ← Back to sign in
        </Link>
      }
      title={sentTo ? "Reset link sent" : "Reset your password"}
      description={
        sentTo ? undefined : "We'll email you a link to choose a new password."
      }
      footer={<AccessFooter />}
    >
      <ForgotPasswordForm
        pending={pending}
        sentTo={sentTo}
        error={error}
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
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
