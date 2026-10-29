"use client";

import React from "react";
import { Form as FormPrimitive } from "@base-ui/react/form";
import { clx } from "@/lib/ftds/utils";

/**
 * Form collects the values of the Fields inside it and validates them together.
 * Pass server-side `errors` keyed by field `name` to show them on the right fields.
 *
 * @example
 * <Form errors={errors} onFormSubmit={(values) => submit(values)}>
 *   <Field name="email">...</Field>
 *   <Button type="submit">Continue</Button>
 * </Form>
 */

interface FormProps<Values extends Record<string, any> = Record<string, any>>
  extends Omit<FormPrimitive.Props<Values>, "className"> {
  className?: string;
  ref?: React.Ref<HTMLFormElement>;
}

function Form<Values extends Record<string, any> = Record<string, any>>({
  className,
  ...props
}: FormProps<Values>) {
  return (
    <FormPrimitive<Values>
      className={clx("gap-stack-lg flex w-full flex-col", className)}
      {...props}
    />
  );
}
Form.displayName = "Form";

export { Form };
export type { FormProps };
