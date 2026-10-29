import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Skeleton } from "@mof-malaysia/ftds-react/skeleton";

/**
 * ### Overview
 * `Skeleton` holds the shape of content that is still loading. It is hidden from
 * screen readers; announce loading once on the region with `aria-busy` and
 * visually hidden text. The shimmer stops under reduced motion.
 *
 * ### Usage
 * ```tsx
 * <Skeleton className="h-4 w-1/2" />
 * ```
 */
const meta: Meta<typeof Skeleton> = {
  title: "Core/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
};

export default meta;

const Example = () => (
  <div
    aria-busy="true"
    className="bg-bg-white flex w-96 flex-col gap-6 rounded-lg p-6"
  >
    <span className="sr-only">Loading applications</span>
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);
export const Default = createRender(Example);

const Dark = () => (
  <div className="dark bg-bg-gray-50 p-4">
    <Example />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
