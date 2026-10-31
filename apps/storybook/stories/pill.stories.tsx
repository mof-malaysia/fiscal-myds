import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { createRender, createStory } from "../utils";
import { Pill } from "@mof-malaysia/ftds-react/pill";

/**
 * ### Overview
 * Pill is a removable tag: an applied filter, a chosen recipient, a selected option in a
 * multi-select. It shares Tag's neutral wash and pill shape and adds a ghost ✕ inside;
 * the pill itself stays borderless (DESIGN.md, Badges and Tags). For a status that
 * can't be removed, use `Tag`.
 *
 * - Sizes follow the density toolbar, a step taller than `Tag` so the ✕ is easy to hit.
 * - The ✕ is named "Remove {label}" for plain-text children; pass `dismissLabel`
 *   otherwise, and for Bahasa Melayu.
 * - Disabled pills hide the ✕.
 *
 * ### Usage
 * ```tsx
 * import { Pill } from "@mof-malaysia/ftds-react/pill";
 *
 * <Pill onDismiss={() => removeFilter("approved")}>Approved</Pill>
 * <Pill dismissLabel="Buang Diluluskan" onDismiss={...}>Diluluskan</Pill>
 * ```
 */
const meta = {
  title: "Core/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Approved",
    size: "medium",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
    disabled: {
      control: "boolean",
    },
    dismissLabel: {
      control: "text",
    },
    render: {
      control: false,
      description:
        'Replaces the rendered element, e.g. `render={<a href="/" />}`.',
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = createStory({});

/** `onDismiss` adds the ✕. */
export const Dismissible: Story = createStory({ onDismiss: fn() });

/** Switch the density toolbar to see `medium` and `large` step down in compact. */
export const Sizes: Story = createRender(() => (
  <div className="flex flex-col items-start gap-3">
    {(["small", "medium", "large"] as const).map((size) => (
      <div key={size} className="flex items-center gap-2">
        <Pill size={size}>Approved</Pill>
        <Pill size={size} onDismiss={() => {}}>
          Approved
        </Pill>
      </div>
    ))}
  </div>
));

const FILTERS = ["Approved", "In review", "Selangor", "March 2025"];

const AppliedFilters = () => {
  const [filters, setFilters] = useState(FILTERS);
  return (
    <div className="flex max-w-md flex-col gap-2">
      <span className="text-txt-black-700 text-label-sm">Filters</span>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Pill
            key={filter}
            onDismiss={() => setFilters((f) => f.filter((x) => x !== filter))}
          >
            {filter}
          </Pill>
        ))}
        {filters.length === 0 && (
          <button
            type="button"
            className="text-txt-primary text-label-sm cursor-pointer underline"
            onClick={() => setFilters(FILTERS)}
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
};

/** Applied filters: each ✕ removes one. */
export const Filters: Story = createRender(AppliedFilters);

export const Disabled: Story = createStory({
  disabled: true,
  onDismiss: fn(),
});

export const DarkFilters: Story = createRender(
  () => (
    <div className="dark">
      <AppliedFilters />
    </div>
  ),
  "dark",
);
