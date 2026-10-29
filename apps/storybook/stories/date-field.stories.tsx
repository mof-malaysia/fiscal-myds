import type { Meta, StoryObj } from "@storybook/react-vite";
import { createStory } from "../utils";
import { DateField } from "@mof-malaysia/ftds-react/date-field";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";

/**
 * ### Overview
 * The Date Field component allows users to input a date in a structured format
 * using separate fields for day, month, and year.
 *
 * _Based on [HTML's date input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)_
 *
 * Like `Input`, it joins the `Field` it sits in: the label, hint, error and
 * validity are wired for you, and `Form` collects its value under the field's `name`.
 *
 * ### Usage
 * ```tsx
 * import { DateField } from "@/components/ui/date-field";
 * import { Field, FieldLabel, FieldError } from "@/components/ui/field";
 *
 * <Field name="dob">
 *   <FieldLabel>Date of birth</FieldLabel>
 *   <DateField required />
 *   <FieldError match="valueMissing">Enter your date of birth</FieldError>
 * </Field>
 * ```
 */
const meta = {
  title: "App/DateField",
  component: DateField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    size: "medium",
    invalid: false,
  },
  argTypes: {
    size: {
      table: {
        defaultValue: {
          summary: "medium",
        },
        type: {
          summary: "enum",
          detail: "small, medium, large",
        },
        category: "ftds API",
      },
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
    invalid: {
      table: { category: "ftds API" },
      type: "boolean",
      description: "Whether the DateField is invalid.",
      control: "boolean",
    },
  },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = createStory({ defaultValue: "1957-08-31" });

export const DisabledLight: Story = createStory({ disabled: true });

export const ErrorLight: Story = createStory({ invalid: true });

export const Dark: Story = createStory(
  {
    className: "dark",
    defaultValue: "1957-08-31",
  },
  "dark",
);

export const DisabledDark: Story = createStory(
  { disabled: true, className: "dark" },
  "dark",
);

export const ErrorDark: Story = createStory(
  { invalid: true, className: "dark" },
  "dark",
);

/** In a `Field`: the label, hint and error are linked to the input, and an invalid Field turns its border red. */
export const InField: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Field name="dob">
        <FieldLabel>Date of birth</FieldLabel>
        <FieldDescription>For example, 01/01/1990</FieldDescription>
        <DateField className="w-fit" />
      </Field>
      <Field name="registeredOn" invalid>
        <FieldLabel>Date the business was registered</FieldLabel>
        <DateField className="w-fit" />
        <FieldError>Enter the date the business was registered</FieldError>
      </Field>
      <Field name="renewal" disabled>
        <FieldLabel>Renewal date</FieldLabel>
        <DateField className="w-fit" />
      </Field>
    </div>
  ),
};
