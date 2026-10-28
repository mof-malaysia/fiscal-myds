import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import { OtpVerify, ResendButton } from "@mof-malaysia/myds-react/otp-verify";
import { wait } from "./components/app/access-brand";

/**
 * ### Overview
 * Asks for the one-time code just sent by SMS or email. It names where the code
 * went (masked), takes the code in an OTPField (paste and SMS autofill work), and
 * offers a new code after a countdown. With `autoSubmit` (the default) it
 * verifies as soon as the last digit is typed.
 *
 * `ResendButton` is exported for any screen that sends something and lets the
 * user ask again.
 *
 * ### Usage
 * ```tsx
 * <OtpVerify
 *   channel="sms"
 *   destination="••••5678"
 *   error={wrong && "That code is not right. Check the latest SMS and try again."}
 *   pending={checking}
 *   onVerify={verify}
 *   onResend={sendCode}
 *   otherMethodHref="/verify/email"
 * />
 * ```
 */
const meta: Meta<typeof OtpVerify> = {
  title: "App/Blocks/OtpVerify",
  component: OtpVerify,
};

export default meta;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-bg-white max-w-[26rem] p-6">{children}</div>
);

/** 123456 is the right code; anything else is wrong. */
const Live = (props: Partial<React.ComponentProps<typeof OtpVerify>>) => {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const [verified, setVerified] = React.useState(false);
  if (verified)
    return (
      <p role="status" className="text-txt-success text-content font-medium">
        Verified. You can continue.
      </p>
    );
  return (
    <OtpVerify
      destination="••••5678"
      pending={pending}
      error={error}
      resendSeconds={20}
      otherMethodHref="#email"
      onResend={() => setError(undefined)}
      onVerify={async (code) => {
        setPending(true);
        await wait();
        setPending(false);
        if (code === "123456") setVerified(true);
        else
          setError(
            "That code is not right. Check the latest SMS and try again.",
          );
      }}
      {...props}
    />
  );
};

export const Default = createRender(() => (
  <Frame>
    <Live />
  </Frame>
));

export const Email = createRender(() => (
  <Frame>
    <Live channel="email" destination="am•••@example.com" />
  </Frame>
));

export const WrongCode = createRender(() => (
  <Frame>
    <OtpVerify
      destination="••••5678"
      error="That code is not right. Check the latest SMS and try again."
    />
  </Frame>
));

export const Pending = createRender(() => (
  <Frame>
    <OtpVerify destination="••••5678" pending />
  </Frame>
));

export const Resend = createRender(() => (
  <ResendButton seconds={10} variant="default-outline" />
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Frame>
        <Live />
      </Frame>
    </div>
  ),
  "dark",
);
