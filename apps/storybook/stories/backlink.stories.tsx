import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Backlink } from "@mof-malaysia/myds-react/backlink";

/**
 * ### Overview
 * `Backlink` returns the user to the previous step of a multi-page flow. Put it
 * above the page heading. Pass `render` to use a router link.
 *
 * ### Usage
 * ```tsx
 * <Backlink href="/apply/details" />
 * <Backlink render={<NextLink href="/payments" />}>Back to Payments</Backlink>
 * ```
 */
const meta: Meta<typeof Backlink> = {
  title: "Core/Backlink",
  component: Backlink,
  parameters: { layout: "padded" },
};

export default meta;

export const Default = createRender(() => <Backlink href="#" />);

export const Contextual = createRender(() => (
  <Backlink href="#">Back to Payment details</Backlink>
));

const Compact = () => (
  <div data-density="compact">
    <Backlink href="#">Back to Applications</Backlink>
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Backlink href="#">Back to Payment details</Backlink>
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
