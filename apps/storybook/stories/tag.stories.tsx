import type { Meta, StoryObj } from "@storybook/react-vite";
import { createRender, createStory } from "../utils";
import { Tag } from "@mof-malaysia/ftds-react/tag";
import { CheckCircleIcon, ClockIcon } from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * Tag labels the status or category of an item: a wash background with matching
 * coloured text, pill-shaped, Medium weight and no border (DESIGN.md, Badges and Tags).
 * The words carry the meaning, so status never rests on colour alone.
 *
 * - Variants: `default` (neutral), `primary` (in progress, information), `success`,
 *   `warning` (due soon, incomplete) and `danger` (overdue, rejected).
 * - Sizes follow the density toolbar. `small` is the 13px badge for tables and dense
 *   lists. `medium` (the default) is 14px in comfortable and drops to the 13px badge in
 *   compact. `large` is 16px for citizen-facing emphasis, 14px in compact.
 * - `dot` adds a dot in the tag's colour; icons take the tag's colour at 14px.
 * - Tag renders a `<span>`, so it sits inside a sentence.
 * - For a tag people can remove, use `Pill`.
 *
 * ### Usage
 * ```tsx
 * import { Tag } from "@mof-malaysia/ftds-react/tag";
 *
 * <Tag variant="success">Paid</Tag>
 * <Tag variant="warning" dot>Due in 3 days</Tag>
 * <Tag variant="danger" size="small">Overdue</Tag>
 * ```
 */
const meta = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-tag",
  title: "Core/Tag",
  component: Tag,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
    },
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger"],
    },
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
    dot: {
      control: "boolean",
    },
  },
  args: {
    children: "In review",
    variant: "primary",
    size: "medium",
    dot: false,
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = createStory({});

const variants = (
  <div className="flex flex-wrap items-center gap-2">
    <Tag>Draft</Tag>
    <Tag variant="primary">In review</Tag>
    <Tag variant="success">Approved</Tag>
    <Tag variant="warning">Needs info</Tag>
    <Tag variant="danger">Rejected</Tag>
  </div>
);

/** One per status. Pick by meaning, not by colour. */
export const Variants: Story = createRender(() => variants);

/** Switch the density toolbar to see `medium` and `large` step down in compact. */
export const Sizes: Story = createRender(() => (
  <div className="flex flex-col gap-3">
    {(["small", "medium", "large"] as const).map((size) => (
      <div key={size} className="flex flex-wrap items-center gap-2">
        <span className="text-txt-black-700 text-label-sm w-16">{size}</span>
        <Tag size={size}>Draft</Tag>
        <Tag size={size} variant="primary">
          In review
        </Tag>
        <Tag size={size} variant="success">
          Approved
        </Tag>
        <Tag size={size} variant="warning">
          Needs info
        </Tag>
        <Tag size={size} variant="danger">
          Rejected
        </Tag>
      </div>
    ))}
  </div>
));

/** A dot or an icon adds a second signal beside the colour. */
export const DotAndIcon: Story = createRender(() => (
  <div className="flex flex-wrap items-center gap-2">
    <Tag variant="warning" dot>
      Due in 3 days
    </Tag>
    <Tag variant="danger" dot>
      Overdue
    </Tag>
    <Tag variant="success">
      <CheckCircleIcon aria-hidden />
      Paid
    </Tag>
    <Tag variant="primary">
      <ClockIcon aria-hidden />
      Processing
    </Tag>
  </div>
));

/** Tag is a `<span>`, so it can sit in running text. */
export const InSentence: Story = createRender(() => (
  <p className="text-txt-black-900 text-content max-w-md">
    Your application APP-2025-00418 is <Tag variant="primary">In review</Tag>.
    We'll email you when an officer makes a decision.
  </p>
));

export const DarkVariants: Story = createRender(
  () => <div className="dark">{variants}</div>,
  "dark",
);
