import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "@mof-malaysia/ftds-react/checkbox";
import { createRender, createStory } from "../utils";

/**
 * ### Overview
 * The Checkbox component is a fundamental UI element that allows users to make binary choices.
 * It's commonly used in forms, settings panels, and list interfaces where users can select
 * one or multiple options from a set. This component supports various states including default,
 * checked, disabled, indeterminate, and combinations thereof, providing flexibility for different use cases.
 *
 * ### Key Features
 * - Support for checked, unchecked, and indeterminate states
 * - Disabled state for read-only scenarios
 * - Two sizes: small and medium
 * - Light and Dark Theme supported
 *
 * ### Uses Base UI's checkbox API.
 * https://base-ui.com/react/components/checkbox
 *
 * ### Usage
 * ```tsx
 * import { Checkbox } from "@mof-malaysia/ftds-react/checkbox";
 *
 * // Default checkbox (small size)
 * <Checkbox>Default Checkbox</Checkbox>
 *
 * // Medium checkbox
 * <Checkbox size="medium">Medium Checkbox</Checkbox>
 *
 * // Checked checkbox
 * <Checkbox checked>Checked Checkbox</Checkbox>
 *
 * // Indeterminate checkbox
 * <Checkbox checked="indeterminate">Indeterminate Checkbox</Checkbox>
 *
 * // Disabled checkbox
 * <Checkbox disabled>Disabled Checkbox</Checkbox>
 * ```
 */
const meta: Meta<typeof Checkbox> = {
  title: "Core/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    checked: {
      control: "inline-radio",
      options: [true, false, "indeterminate"],
      description: "Checked state of the checkbox",
      table: {
        type: { summary: "boolean | 'indeterminate'" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disabled state of the checkbox",
      table: {
        type: { summary: "boolean" },
      },
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium"],
      description: "The size of the checkbox",
      table: {
        type: { summary: "('small' | 'medium' )" },
      },
    },
    onCheckedChange: {
      action: "checked changed",
      description: "Callback function triggered when the checked state changes",
      table: {
        type: { summary: "(checked: boolean, eventDetails) => void" },
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = createStory({ "aria-label": "checkbox" });

export const DefaultDark: Story = createStory(
  { className: "dark", "aria-label": "checkbox" },
  "dark",
);

export const Medium: Story = createStory({
  size: "medium",
  "aria-label": "checkbox",
});

export const MediumDark: Story = createStory(
  { size: "medium", className: "dark", "aria-label": "checkbox" },
  "dark",
);

export const Checked: Story = createStory({
  checked: true,
  "aria-label": "checkbox",
});

export const CheckedDark: Story = createStory(
  { checked: true, className: "dark", "aria-label": "checkbox" },
  "dark",
);

export const Indeterminate: Story = createStory({
  checked: "indeterminate",
  "aria-label": "checkbox",
});

export const IndeterminateDark: Story = createStory(
  { checked: "indeterminate", className: "dark", "aria-label": "checkbox" },
  "dark",
);

export const Disabled: Story = createStory({
  disabled: true,
  "aria-label": "checkbox",
});

export const DisabledDark: Story = createStory(
  { disabled: true, className: "dark", "aria-label": "checkbox" },
  "dark",
);

export const DisabledChecked: Story = createStory({
  disabled: true,
  checked: true,
  "aria-label": "checkbox",
});

export const DisabledCheckedDark: Story = createStory(
  {
    disabled: true,
    checked: true,
    className: "dark",
    "aria-label": "checkbox",
  },
  "dark",
);

export const DisabledIndeterminate: Story = createStory({
  disabled: true,
  checked: "indeterminate",
  "aria-label": "checkbox",
});

export const DisabledIndeterminateDark: Story = createStory(
  {
    disabled: true,
    checked: "indeterminate",
    className: "dark",
    "aria-label": "checkbox",
  },
  "dark",
);

const states = (
  <div className="grid grid-cols-[auto_repeat(4,2rem)] items-center gap-x-4 gap-y-3">
    <span />
    {["Off", "On", "Mixed", ""].map((h) => (
      <span key={h} className="text-txt-black-700 text-label-compact">
        {h}
      </span>
    ))}
    {(["Enabled", "Disabled"] as const).map((row) => (
      <div key={row} className="contents">
        <span className="text-txt-black-700 text-label-sm">{row}</span>
        <Checkbox aria-label={`${row} off`} disabled={row === "Disabled"} />
        <Checkbox
          aria-label={`${row} on`}
          defaultChecked
          disabled={row === "Disabled"}
        />
        <Checkbox
          aria-label={`${row} mixed`}
          defaultChecked="indeterminate"
          disabled={row === "Disabled"}
        />
        <span />
      </div>
    ))}
  </div>
);

/** Every state side by side. Tab to a box to see the solid focus ring. */
export const States: Story = createRender(() => states);

export const StatesDark: Story = createRender(
  () => <div className="dark">{states}</div>,
  "dark",
);
