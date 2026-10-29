import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { AuthLayout } from "@mof-malaysia/ftds-react/auth-layout";
import { Button } from "@mof-malaysia/ftds-react/button";
import { Link } from "@mof-malaysia/ftds-react/link";
import { AccessBrand, AccessFooter } from "./components/app/access-brand";

/**
 * ### Overview
 * The frame of every sign-in, sign-up, password and verification screen: a
 * full-height page on the Well with one centred Paper panel, at most 26rem wide.
 * The panel holds the page's only h1, a short description and the form. The brand
 * sits above it; links to the other auth screens and a language switch sit below.
 *
 * ### Usage
 * ```tsx
 * <AuthLayout
 *   brand={<AgencyMark />}
 *   title="Sign in to MyFiscal"
 *   description="Use MyDigital ID or your email and password."
 *   footer={<>New here? <Link href="/sign-up" primary>Create an account</Link></>}
 * >
 *   <SignInForm onSubmit={signIn} />
 * </AuthLayout>
 * ```
 */
const meta: Meta<typeof AuthLayout> = {
  title: "App/Blocks/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" },
};

export default meta;

const Example = () => (
  <AuthLayout
    className="min-h-[640px]"
    brand={<AccessBrand />}
    title="Sign in to MyFiscal"
    description="Check your tax relief claims, pay assessments and track applications."
    footer={
      <AccessFooter>
        <span>
          New here?{" "}
          <Link href="#sign-up" primary>
            Create an account
          </Link>
        </span>
      </AccessFooter>
    }
  >
    <div className="bg-bg-washed text-txt-black-700 text-content grid h-40 place-content-center rounded-lg">
      The form goes here
    </div>
    <Button
      variant="primary-fill"
      size="medium"
      className="w-full justify-center"
    >
      Continue
    </Button>
  </AuthLayout>
);

export const Default = createRender(Example);

/** With a back link above the title, for screens reached from another step. */
export const WithEyebrow = createRender(() => (
  <AuthLayout
    className="min-h-[640px]"
    brand={<AccessBrand />}
    eyebrow={
      <Link href="#sign-in" primary underline="hover" className="text-label-md">
        ← Back to sign in
      </Link>
    }
    title="Reset your password"
    description="We'll email you a link to choose a new one."
  >
    <div className="bg-bg-washed text-txt-black-700 text-content grid h-24 place-content-center rounded-lg">
      The form goes here
    </div>
  </AuthLayout>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Example />
    </div>
  ),
  "dark",
);
