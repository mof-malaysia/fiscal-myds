import React from "react";
import { AuthLayout } from "@mof-malaysia/ftds-react/auth-layout";
import { Link } from "@mof-malaysia/ftds-react/link";
import { OtpVerify } from "@mof-malaysia/ftds-react/otp-verify";
import { AccessBrand, AccessFooter, wait } from "./access-brand";

/** 123456 is the right code. */
const VerifyCodePage = () => {
  const [pending, setPending] = React.useState(false);
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
          ← Back
        </Link>
      }
      title="Check your phone"
      footer={<AccessFooter />}
    >
      <OtpVerify
        destination="••••5678"
        pending={pending}
        error={error}
        otherMethodHref="#verify-email"
        onResend={() => setError(undefined)}
        onVerify={async (code) => {
          setPending(true);
          await wait();
          setPending(false);
          setError(
            code === "123456"
              ? undefined
              : "That code is not right. Check the latest SMS and try again.",
          );
        }}
      />
    </AuthLayout>
  );
};

export default VerifyCodePage;
