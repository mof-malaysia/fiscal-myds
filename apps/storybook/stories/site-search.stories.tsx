import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { createRender, createStory } from "../utils";
import { SiteSearch } from "@mof-malaysia/ftds-react/site-search";

/**
 * ### Overview
 * SiteSearch is the "search this site" box for agency sites and service landing pages:
 * a labelled search field and one Search button inside a `<form role="search">`. By
 * default it submits a GET request (`?q=…`) to `action`, so it works before JavaScript
 * loads; pass `onSearch` to handle it in the page.
 *
 * It replaces SearchBar and is built from Core parts only (Input, Button, Kbd), so it
 * fits the navbar, a hero or a results page.
 *
 * Which search to use:
 * - **Search this site**, with results on their own page: `SiteSearch`.
 * - **Suggestions while typing**: compose `Autocomplete`.
 * - **Filter a list already on screen**: a search `Input`, like `WorkQueue`.
 * - **Go to anything in an officer app**: the `Command` palette (⌘K, `DeskSearchTrigger`).
 *
 * ### Usage
 * ```tsx
 * import { SiteSearch } from "@mof-malaysia/ftds-react/site-search";
 *
 * <SiteSearch action="/search" placeholder="For example, road tax" />
 * ```
 */
const meta = {
  title: "Marketing/SiteSearch",
  component: SiteSearch,
  parameters: {
    layout: "padded",
  },
  args: {
    action: "#",
    placeholder: "For example, road tax",
    size: "medium",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
    },
    showLabel: { control: "boolean" },
    shortcut: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SiteSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = createStory({});

/** A hero search: large, with a visible label and "/" to focus from anywhere. */
export const Hero: Story = createRender(() => (
  <div className="bg-bg-washed flex flex-col gap-4 rounded-xl p-8">
    <h1 className="text-txt-black-900 text-display font-semibold">
      How can we help?
    </h1>
    <SiteSearch
      action="#"
      size="large"
      shortcut
      showLabel
      placeholder="For example, road tax, refund status"
    />
  </div>
));

const InPage = () => {
  const [searched, setSearched] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <SiteSearch onSearch={setSearched} placeholder="For example, refund" />
      {searched !== null && (
        <p className="text-txt-black-700 text-content">
          Showing results for{" "}
          <span className="text-txt-black-900 font-medium">
            {searched || "everything"}
          </span>
          .
        </p>
      )}
    </div>
  );
};

/** `onSearch` handles the query in the page (for example with your router). */
export const HandledInPage: Story = createRender(InPage);

/** `labels` and `placeholder` for Bahasa Melayu. */
export const BahasaMelayu: Story = createStory({
  action: "#",
  placeholder: "Contohnya, cukai jalan",
  showLabel: true,
  labels: { label: "Cari dalam laman ini", submit: "Cari" },
});

export const Dark: Story = createStory(
  { className: "dark", shortcut: true },
  "dark",
);
