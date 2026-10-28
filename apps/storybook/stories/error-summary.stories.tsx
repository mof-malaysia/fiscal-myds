import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  ErrorSummary,
  ErrorSummaryDescription,
  ErrorSummaryItem,
  ErrorSummaryList,
  ErrorSummaryTitle,
} from "@mof-malaysia/myds-react/error-summary";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";
import { Input } from "@mof-malaysia/myds-react/input";
import { Button } from "@mof-malaysia/myds-react/button";

/**
 * ### Overview
 * `ErrorSummary` is the "There is a problem" box at the top of a form after a failed
 * submit. Each error links to its field and focuses it. The summary takes focus when
 * it appears (opt out with `autoFocus={false}`).
 *
 * ### Usage
 * ```tsx
 * <ErrorSummary
 *   errors={[
 *     { id: "ic", message: "Enter your IC number" },
 *     { id: "email", message: "Enter an email address in the format name@example.com" },
 *   ]}
 * />
 * ```
 */
const meta: Meta<typeof ErrorSummary> = {
  title: "App/ErrorSummary",
  component: ErrorSummary,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-xl">
    <ErrorSummary
      autoFocus={false}
      errors={[
        { id: "es-basic-ic", message: "Enter your IC number" },
        {
          id: "es-basic-email",
          message: "Enter an email address in the format name@example.com",
        },
      ]}
    />
  </div>
);
export const Default = createRender(Basic);

const Composed = () => (
  <div className="max-w-xl">
    <ErrorSummary autoFocus={false}>
      <ErrorSummaryTitle>Ada masalah</ErrorSummaryTitle>
      <ErrorSummaryDescription>
        Betulkan perkara berikut sebelum anda meneruskan.
      </ErrorSummaryDescription>
      <ErrorSummaryList>
        <ErrorSummaryItem targetId="es-bm-ic">
          Masukkan nombor MyKad anda
        </ErrorSummaryItem>
      </ErrorSummaryList>
    </ErrorSummary>
  </div>
);
export const Composable = createRender(Composed);

type Errors = Partial<Record<"ic" | "email", string>>;

const WithForm = () => {
  const [errors, setErrors] = React.useState<Errors>({});
  const [attempt, setAttempt] = React.useState(0);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};
    if (!String(data.get("ic") ?? "").match(/^\d{6}-\d{2}-\d{4}$/))
      next.ic = "Enter your IC number in the format 900101-14-5678";
    if (!String(data.get("email") ?? "").includes("@"))
      next.email = "Enter an email address in the format name@example.com";
    setErrors(next);
    setAttempt((n) => n + 1);
  };

  const list = Object.entries(errors).map(([key, message]) => ({
    id: `es-form-${key}`,
    message,
  }));

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex max-w-md flex-col gap-6"
    >
      {/* Remount on each failed submit so focus moves back to the summary */}
      {list.length > 0 && <ErrorSummary key={attempt} errors={list} />}
      <Field name="ic" invalid={!!errors.ic}>
        <FieldLabel>IC number</FieldLabel>
        <FieldDescription>For example, 900101-14-5678</FieldDescription>
        <Input id="es-form-ic" name="ic" />
        <FieldError>{errors.ic}</FieldError>
      </Field>
      <Field name="email" invalid={!!errors.email}>
        <FieldLabel>Email address</FieldLabel>
        <Input id="es-form-email" name="email" type="email" />
        <FieldError>{errors.email}</FieldError>
      </Field>
      <Button type="submit" variant="primary-fill" size="medium">
        Continue
      </Button>
    </form>
  );
};
export const InAForm = createRender(WithForm);

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
