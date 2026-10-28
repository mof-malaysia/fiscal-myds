import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { ScrollArea } from "@mof-malaysia/myds-react/scroll-area";

/**
 * ### Overview
 * `ScrollArea` gives a fixed-size region native scrolling with a thin scrollbar that
 * appears on hover or while scrolling. Built on Base UI ScrollArea.
 *
 * ### Usage
 * ```tsx
 * <ScrollArea className="h-72">...</ScrollArea>
 * ```
 */
const meta: Meta<typeof ScrollArea> = {
  title: "Core/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "centered" },
};

export default meta;

const agencies = Array.from(
  { length: 30 },
  (_, i) => `Agency ${String(i + 1).padStart(2, "0")}`,
);

const Vertical = () => (
  <ScrollArea
    className="bg-bg-white h-72 w-64 rounded-lg"
    viewportClassName="p-4"
  >
    <ul className="font-body text-body-sm text-txt-black-900 flex flex-col gap-3">
      {agencies.map((a) => (
        <li key={a}>{a}</li>
      ))}
    </ul>
  </ScrollArea>
);
export const Default = createRender(Vertical);

const Horizontal = () => (
  <ScrollArea
    className="bg-bg-white w-96 rounded-lg"
    viewportClassName="p-4"
    scrollbars="horizontal"
  >
    <div className="flex w-max gap-3">
      {agencies.slice(0, 12).map((a) => (
        <div
          key={a}
          className="bg-bg-washed font-body text-body-sm text-txt-black-900 flex h-20 w-32 items-center justify-center rounded-md"
        >
          {a}
        </div>
      ))}
    </div>
  </ScrollArea>
);
export const HorizontalScroll = createRender(Horizontal);

const Dark = () => (
  <div className="dark bg-bg-gray-50 p-4">
    <Vertical />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
