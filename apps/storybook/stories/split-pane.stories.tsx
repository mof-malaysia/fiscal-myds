import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { SplitPane } from "@mof-malaysia/myds-react/split-pane";

/**
 * ### Overview
 * A list beside its detail. Drag the divider, or focus it and use the arrow keys
 * (<kbd>Shift</kbd> for bigger steps, <kbd>Home</kbd>/<kbd>End</kbd> for the limits).
 * Double-click it to reset. With `storageKey`, the width is remembered in this browser.
 *
 * ### Usage
 * ```tsx
 * <SplitPane storageKey="cases.split" start={<CaseList />} end={<CaseDetail />} />
 * ```
 */
const meta: Meta<typeof SplitPane> = {
  title: "App/SplitPane",
  component: SplitPane,
  parameters: { layout: "fullscreen" },
};

export default meta;

const Rows = () => (
  <ul className="m-0 list-none p-0">
    {Array.from({ length: 12 }, (_, i) => (
      <li
        key={i}
        className="border-otl-gray-200 text-txt-black-900 text-content flex h-10 items-center border-b px-3"
      >
        Case KK-2026-{String(400 - i * 7).padStart(4, "0")}
      </li>
    ))}
  </ul>
);

const Detail = () => (
  <div className="p-surface">
    <h2 className="text-txt-black-900 text-heading-2xs font-semibold">
      Case detail
    </h2>
    <p className="text-txt-black-700 text-content mt-2 max-w-prose">
      The detail pane takes the remaining width and scrolls on its own.
    </p>
  </div>
);

export const Default = createRender(() => (
  <div data-density="compact" className="bg-bg-white h-[480px]">
    <SplitPane
      start={<Rows />}
      end={<Detail />}
      startLabel="Cases"
      endLabel="Detail"
    />
  </div>
));

/** Narrower limits and a remembered width. */
export const Remembered = createRender(() => (
  <div data-density="compact" className="bg-bg-white h-[480px]">
    <SplitPane
      storageKey="storybook.split-pane"
      defaultWidth={280}
      minWidth={200}
      maxWidth={480}
      start={<Rows />}
      end={<Detail />}
    />
  </div>
));
