import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Testimonial } from "@mof-malaysia/ftds-react/testimonial";

/**
 * ### Overview
 * What people say about a service. One quote renders as a large centred pull
 * quote; two or three render as a grid of Sheet panels. Each has a name,
 * optional role and optional avatar.
 *
 * ### Usage
 * ```tsx
 * <Testimonial
 *   items={[{ quote: "I paid in five minutes.", name: "Nurul Aina", role: "Business owner" }]}
 * />
 * ```
 */
const meta: Meta<typeof Testimonial> = {
  title: "Marketing/Blocks/Testimonial",
  component: Testimonial,
  parameters: { layout: "fullscreen" },
};

export default meta;

const avatar = (initials: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="44" height="44" fill="#E4E4E7"/><text x="22" y="27" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600" fill="#3F3F46">${initials}</text></svg>`,
  )}`;

const items = [
  {
    quote:
      "I paid my company's assessment in five minutes and had the receipt before I closed the tab. No more taking a day off to queue.",
    name: "Nurul Aina Rahman",
    role: "Business owner, Shah Alam",
    avatar: avatar("NA"),
  },
  {
    quote:
      "The reminders are the best part. I have not missed a due date since I signed up.",
    name: "Tan Wei Ming",
    role: "Retiree, Ipoh",
    avatar: avatar("TW"),
  },
  {
    quote:
      "Saya boleh semak status tuntutan tanpa perlu menelefon. Semuanya jelas.",
    name: "Muthu Krishnan",
    role: "Penjawat awam, Putrajaya",
  },
];

export const Single = createRender(() => <Testimonial items={[items[0]!]} />);

const Grid = () => <Testimonial title="What people say" items={items} />;
export const Default = createRender(Grid);

export const Two = createRender(() => (
  <Testimonial title="What people say" items={items.slice(0, 2)} />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Grid />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Grid />
    </div>
  ),
  "dark",
);
