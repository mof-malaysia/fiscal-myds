import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { StatsBand } from "@mof-malaysia/ftds-react/stats-band";

/**
 * ### Overview
 * Two to four headline figures on a Well band, in large tabular figures, each
 * with a label and optional footnote. Marked up as a description list.
 *
 * ### Usage
 * ```tsx
 * <StatsBand
 *   title="The service in numbers"
 *   stats={[{ value: "RM 4.2 bil", label: "Collected online in 2025" }]}
 * />
 * ```
 */
const meta: Meta<typeof StatsBand> = {
  title: "Marketing/Blocks/StatsBand",
  component: StatsBand,
  parameters: { layout: "fullscreen" },
};

export default meta;

const stats = [
  { value: "RM 4.2 bil", label: "Collected online in 2025" },
  {
    value: "1.8 juta",
    label: "Payments a month",
    footnote: "Average, January to September 2026",
  },
  { value: "32", label: "Agencies connected" },
  { value: "3 min", label: "Typical time to pay" },
];

const Four = () => (
  <StatsBand
    title="The service in numbers"
    stats={stats}
    source="Source: Kementerian Kewangan Malaysia, September 2026"
  />
);
export const Default = createRender(Four);

export const ThreeWithoutTitle = createRender(() => (
  <StatsBand aria-label="Key figures" stats={stats.slice(0, 3)} />
));

export const Two = createRender(() => (
  <StatsBand
    title="Bajet 2027"
    stats={[
      { value: "RM 421 bil", label: "Jumlah peruntukan" },
      { value: "RM 335 bil", label: "Perbelanjaan mengurus" },
    ]}
  />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Four />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Four />
    </div>
  ),
  "dark",
);
