import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import { PasswordInput } from "@mof-malaysia/myds-react/password-input";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";

/**
 * ### Overview
 * `PasswordInput` masks what the user types, with a button to show it. Builds on
 * Input, so it joins a surrounding `Field`.
 *
 * ### Usage
 * ```tsx
 * <Field>
 *   <FieldLabel>Password</FieldLabel>
 *   <PasswordInput autoComplete="current-password" />
 * </Field>
 * ```
 */
const meta: Meta<typeof PasswordInput> = {
  title: "App/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-md">
    <Field>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput />
    </Field>
  </div>
);
export const Default = createRender(Basic);

const NewPassword = () => (
  <div className="max-w-md">
    <Field>
      <FieldLabel>Create a password</FieldLabel>
      <FieldDescription>At least 12 characters</FieldDescription>
      <PasswordInput
        autoComplete="new-password"
        defaultVisible
        shownAnnouncement="Your password is visible"
        hiddenAnnouncement="Your password is hidden"
      />
    </Field>
  </div>
);
export const Visible = createRender(NewPassword);

const Invalid = () => (
  <div className="max-w-md">
    <Field invalid>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput />
      <FieldError>Enter your password</FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Disabled = () => (
  <div className="max-w-md">
    <Field disabled>
      <FieldLabel>Password</FieldLabel>
      <PasswordInput disabled defaultValue="hunter2hunter2" />
    </Field>
  </div>
);
export const DisabledState = createRender(Disabled);

const Sizes = () => (
  <div className="flex max-w-md flex-col gap-4">
    <PasswordInput size="small" aria-label="Password, small" />
    <PasswordInput size="medium" aria-label="Password, medium" />
    <PasswordInput size="large" aria-label="Password, large" />
  </div>
);
export const AllSizes = createRender(Sizes);

const Compact = () => (
  <div data-density="compact">
    <Basic />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Basic />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
