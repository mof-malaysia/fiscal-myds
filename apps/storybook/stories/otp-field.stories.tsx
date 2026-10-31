import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  OTPField,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "@mof-malaysia/ftds-react/otp-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";

/**
 * ### Overview
 * OTPField takes a one-time code across single-character slots. Paste and SMS autofill work.
 * Built on Base UI OTP Field; it joins a surrounding `Field`.
 *
 * ### Usage
 * ```tsx
 * <OTPField length={6} onValueComplete={verify}>
 *   {Array.from({ length: 6 }, (_, i) => <OTPFieldSlot key={i} />)}
 * </OTPField>
 * ```
 */
const meta: Meta<typeof OTPField> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-otpfield",
  title: "App/OTPField",
  component: OTPField,
  parameters: { layout: "centered" },
};

export default meta;

const slots = (n: number) =>
  Array.from({ length: n }, (_, i) => (
    <OTPFieldSlot key={i} aria-label={`Digit ${i + 1} of ${n}`} />
  ));

const Basic = () => (
  <Field>
    <FieldLabel>Verification code</FieldLabel>
    <FieldDescription>We sent a 6-digit code to 012-345 6789.</FieldDescription>
    <OTPField length={6}>{slots(6)}</OTPField>
  </Field>
);
export const Default = createRender(Basic);

// Label it with a Field: Base UI points the label at the first slot
const Grouped = () => (
  <Field>
    <FieldLabel>Verification code</FieldLabel>
    <OTPField length={6}>
      {slots(6).slice(0, 3)}
      <OTPFieldSeparator />
      {slots(6).slice(3)}
    </OTPField>
  </Field>
);
export const WithSeparator = createRender(Grouped);

const Invalid = () => (
  <Field invalid>
    <FieldLabel>Verification code</FieldLabel>
    <OTPField length={6} defaultValue="123456">
      {slots(6)}
    </OTPField>
    <FieldError>That code has expired. Request a new one.</FieldError>
  </Field>
);
export const WithError = createRender(Invalid);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Basic />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
