import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  SignInForm,
  type SignInFormProps,
  type SignInMethod,
} from "@mof-malaysia/ftds-react/sign-in-form";
import { wait } from "./components/app/access-brand";

/**
 * ### Overview
 * One or more ways in, in the order given by `methods`: MyDigital ID (the
 * national digital identity), email and password, and staff single sign-on.
 * The first method gets the primary button; the rest are separated by an "or"
 * rule.
 *
 * A failed sign-in comes back as `error` and never says which of email or
 * password was wrong. Field `errors` are only for empty or malformed input.
 *
 * ### Usage
 * ```tsx
 * <SignInForm
 *   methods={["mydigital-id", "password"]}
 *   forgotPasswordHref="/forgot-password"
 *   error={failed && "Your email or password is not right."}
 *   pending={signingIn}
 *   onMyDigitalId={redirectToMyDigitalId}
 *   onSubmit={({ email, password, remember }) => signIn(email, password, remember)}
 * />
 * ```
 */
const meta: Meta<typeof SignInForm> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-blocks-signinform",
  title: "App/Blocks/SignInForm",
  component: SignInForm,
};

export default meta;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-bg-white max-w-[26rem] p-6">{children}</div>
);

/** Try "wrong@example.com" to see a failed sign-in, or leave the fields empty. */
const Live = ({
  methods,
  ...props
}: Partial<SignInFormProps> & { methods?: SignInMethod[] }) => {
  const [pending, setPending] = React.useState<SignInMethod | false>(false);
  const [error, setError] = React.useState<string>();
  const [errors, setErrors] = React.useState<SignInFormProps["errors"]>({});

  return (
    <SignInForm
      methods={methods}
      forgotPasswordHref="#forgot-password"
      pending={pending}
      error={error}
      errors={errors}
      onMyDigitalId={async () => {
        setPending("mydigital-id");
        await wait();
        setPending(false);
      }}
      onSso={async () => {
        setPending("sso");
        await wait();
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
        if (email === "wrong@example.com")
          setError(
            "Your email or password is not right. Check them and try again, or reset your password.",
          );
      }}
      {...props}
    />
  );
};

/** Citizens: MyDigital ID first, email and password as the fallback. */
export const Citizen = createRender(() => (
  <Frame>
    <Live />
  </Frame>
));

/** Staff portals: single sign-on first. */
export const Staff = createRender(() => (
  <div data-density="compact">
    <Frame>
      <Live methods={["sso", "password"]} hideRemember />
    </Frame>
  </div>
));

export const PasswordOnly = createRender(() => (
  <Frame>
    <Live methods={["password"]} />
  </Frame>
));

export const AllMethods = createRender(() => (
  <Frame>
    <Live methods={["mydigital-id", "sso", "password"]} />
  </Frame>
));

/** A failed sign-in: one general message, focused when it appears. */
export const Failed = createRender(() => (
  <Frame>
    <SignInForm
      forgotPasswordHref="#forgot-password"
      defaultValues={{ email: "aminah@example.com" }}
      error="Your email or password is not right. Check them and try again, or reset your password."
    />
  </Frame>
));

export const FieldErrors = createRender(() => (
  <Frame>
    <SignInForm
      methods={["password"]}
      forgotPasswordHref="#forgot-password"
      errors={{
        email: "Enter your email address",
        password: "Enter your password",
      }}
    />
  </Frame>
));

export const Pending = createRender(() => (
  <Frame>
    <SignInForm
      forgotPasswordHref="#forgot-password"
      defaultValues={{ email: "aminah@example.com", password: "secret" }}
      pending="password"
    />
  </Frame>
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
