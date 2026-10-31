import {
  DateRangePicker,
  type DateRange,
} from "@mof-malaysia/ftds-react/daterange-picker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { createRender, createStory } from "../utils";

/**
 * ### Overview
 * DateRangePicker picks a start and an end date from one control. A single trigger opens
 * two months side by side (one on phones): click the start date, then the end date, and
 * the range is set and the popup closes. While choosing, the days up to the pointer are
 * previewed, and the footer shows the range and its length, with Clear.
 *
 * - `presets`: quick ranges beside the calendar. `true` gives Today, Last 7 days, Last 30
 *   days, This month, Last month and This year; or pass your own list.
 * - `disabled` with `excludeDisabled` restarts a range that would span a disabled day.
 * - Day cells follow the density toolbar (40px comfortable, 32px compact).
 * - `locale="ms"` switches dates and labels to Bahasa Melayu; `labels` overrides any text.
 *
 * ### Usage
 * ```tsx
 * import { DateRangePicker, type DateRange } from "@mof-malaysia/ftds-react/daterange-picker";
 *
 * const [range, setRange] = useState<DateRange | undefined>();
 * <DateRangePicker presets value={range} onValueChange={setRange} />
 * ```
 */
const meta = {
  title: "App/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
  args: { onValueChange: fn() },
  argTypes: {
    presets: { control: "boolean" },
    locale: { control: "inline-radio", options: ["en", "ms"] },
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    excludeDisabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[420px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = createStory({});

/** Quick ranges beside the two months. The active one is highlighted. */
export const WithPresets: Story = createStory({ presets: true });

/** A starting range: the popup opens on its first month. */
export const WithValue: Story = createStory({
  presets: true,
  defaultValue: { from: new Date(2025, 2, 12), to: new Date(2025, 3, 18) },
});

const ReportFilter = () => {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <div className="flex flex-col gap-2">
      <DateRangePicker presets value={range} onValueChange={setRange} />
      <p className="text-txt-black-700 text-label-sm">
        {range?.from && range.to
          ? `Showing payments from ${range.from.toDateString()} to ${range.to.toDateString()}.`
          : "Showing all payments."}
      </p>
    </div>
  );
};

/** Controlled, as a report filter. */
export const Controlled: Story = createRender(ReportFilter);

/** Weekends can't be chosen, and a range can't span one. */
export const DisabledDays: Story = createStory({
  disabled: { dayOfWeek: [0, 6] },
  excludeDisabled: true,
});

export const BahasaMelayu: Story = createStory({ locale: "ms", presets: true });

export const DarkWithPresets: Story = createStory(
  {
    presets: true,
    className: "dark",
    defaultValue: { from: new Date(2025, 2, 12), to: new Date(2025, 3, 18) },
  },
  "dark",
);
