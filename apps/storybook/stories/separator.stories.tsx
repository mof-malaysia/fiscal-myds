import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Separator } from "@mof-malaysia/ftds-react/separator";

/**
 * ### Overview
 * `Separator` draws one Hairline between groups. Built on Base UI Separator.
 * Lines must earn their place: try spacing or a tonal surface first, and use a
 * Separator for the rule under a top bar or between toolbar and menu groups only.
 *
 * ### Usage
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * ```
 */
const meta: Meta<typeof Separator> = {
  title: "Core/Separator",
  component: Separator,
  parameters: { layout: "centered" },
};

export default meta;

const Example = () => (
  <div className="font-body text-txt-black-900 w-80">
    <p className="text-body-md font-medium">Payment history</p>
    <p className="text-body-sm text-txt-black-700">
      Your last 12 months of payments.
    </p>
    <Separator className="my-4" />
    <div className="text-body-sm text-txt-black-700 flex h-5 items-center gap-3">
      <span>Receipts</span>
      <Separator orientation="vertical" />
      <span>Statements</span>
      <Separator orientation="vertical" />
      <span>Refunds</span>
    </div>
  </div>
);
export const Default = createRender(Example);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Example />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
