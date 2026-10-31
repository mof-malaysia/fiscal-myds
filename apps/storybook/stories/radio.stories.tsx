import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createStory } from "../utils";
import {
  Radio,
  RadioButton,
  RadioHintText,
  RadioItem,
  RadioLabel,
  RadioProps,
} from "@mof-malaysia/ftds-react/radio";

/**
 * ### Overview
 * Radio buttons allow users to select exactly one choice from a group.
 *
 * ### Usage
 * ```tsx
 * import {
 *   Radio,
 *   RadioButton,
 *   RadioHintText,
 *   RadioItem,
 *   RadioLabel,
 * } from "@mof-malaysia/ftds-react/radio";
 *
 * <Radio>
 *   <RadioItem>
 *     <RadioButton value="apple" id="apple" aria-describedby="apple-hint" />
 *     <RadioLabel htmlFor="apple">Apple</RadioLabel>
 *   </RadioItem>
 *   <RadioItem>
 *     <RadioButton value="banana" id="banana" aria-describedby="banana-hint" />
 *     <div>
 *       <RadioLabel htmlFor="banana">Banana</RadioLabel>
 *       <RadioHelpText htmlFor="banana">Comes pre-packaged.</RadioHelpText>
 *     </div>
 *   </RadioItem>
 * </Radio>
 * ```
 */
const meta = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-radio",
  title: "Core/Radio",
  component: Radio,
  render: ({ ...props }) => {
    return (
      <Radio {...props}>
        <RadioItem>
          <RadioButton value="email" id="email" aria-describedby="email-hint" />
          <div style={{ display: "grid" }}>
            <RadioLabel htmlFor="email">Email</RadioLabel>
            <RadioHintText id="email-hint">
              We will send notifications to your registered email address.
            </RadioHintText>
          </div>
        </RadioItem>
        <RadioItem>
          <RadioButton
            value="phone_call"
            id="phone_call"
            aria-describedby="phone_call-hint"
          />
          <div style={{ display: "grid" }}>
            <RadioLabel htmlFor="phone_call">Phone Call</RadioLabel>
            <RadioHintText id="phone_call-hint">
              Our representative will call you on your provided phone number.
            </RadioHintText>
          </div>
        </RadioItem>
        <RadioItem>
          <RadioButton
            value="text_message"
            id="text_message"
            aria-describedby="text_message-hint"
          />
          <div style={{ display: "grid" }}>
            <RadioLabel htmlFor="text_message">Text Message</RadioLabel>
            <RadioHintText id="text_message-hint">
              You will receive SMS updates on your mobile phone.
            </RadioHintText>
          </div>
        </RadioItem>
        <RadioItem disabled>
          <RadioButton
            value="postal_mail"
            id="postal_mail"
            aria-describedby="postal_mail-hint"
          />
          <div style={{ display: "grid" }}>
            <RadioLabel htmlFor="postal_mail">Postal Mail</RadioLabel>
            <RadioHintText id="postal_mail-hint">
              Not available at the moment.
            </RadioHintText>
          </div>
        </RadioItem>
        <RadioItem>
          <RadioButton
            value="disable_notifications"
            id="disable_notifications"
          />
          <RadioLabel htmlFor="disable_notifications">
            Disable Notifications
          </RadioLabel>
        </RadioItem>
      </Radio>
    );
  },
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    "aria-label": "How should we contact you?",
    defaultValue: "email",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
      table: {
        type: { summary: "enum", detail: "`small`, `medium`, or `large`" },
        defaultValue: { summary: "medium" },
      },
    },
    disabled: {
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
  },
} satisfies Meta<RadioProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = createStory({});

export const Disabled: Story = createStory({
  value: "phone_call",
  disabled: true,
});

export const Dark: Story = createStory(
  {
    className: "dark",
  },
  "dark",
);

export const DisabledDark: Story = createStory(
  {
    value: "phone_call",
    disabled: true,
    className: "dark",
  },
  "dark",
);

/** `size` steps the button and text; `medium` text follows the density toolbar. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["small", "medium", "large"] as const).map((size) => (
        <Radio
          key={size}
          size={size}
          aria-label={`${size} example`}
          defaultValue="yes"
        >
          <RadioItem>
            <RadioButton
              value="yes"
              id={`${size}-yes`}
              aria-describedby={`${size}-yes-hint`}
            />
            <div className="grid">
              <RadioLabel htmlFor={`${size}-yes`}>Yes ({size})</RadioLabel>
              <RadioHintText id={`${size}-yes-hint`}>
                We'll use the address on your MyKad.
              </RadioHintText>
            </div>
          </RadioItem>
          <RadioItem>
            <RadioButton value="no" id={`${size}-no`} />
            <RadioLabel htmlFor={`${size}-no`}>No</RadioLabel>
          </RadioItem>
        </Radio>
      ))}
    </div>
  ),
};
