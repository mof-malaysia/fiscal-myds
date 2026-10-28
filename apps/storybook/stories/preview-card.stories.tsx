import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@mof-malaysia/myds-react/preview-card";

/**
 * ### Overview
 * Shows a short preview of what a link points to on hover or focus, such as an
 * officer's name opening their unit and contact details (Base UI PreviewCard).
 * The link still works on its own; never put the only copy of information or an
 * action in the card.
 *
 * ### Usage
 * ```tsx
 * <PreviewCard>
 *   <PreviewCardTrigger href="/officers/1024">Nur Aisyah</PreviewCardTrigger>
 *   <PreviewCardContent>…</PreviewCardContent>
 * </PreviewCard>
 * ```
 */
const meta: Meta<typeof PreviewCard> = {
  title: "App/PreviewCard",
  component: PreviewCard,
  parameters: { layout: "centered" },
};

export default meta;

const Officer = () => (
  <p className="text-txt-black-700 text-content max-w-md">
    Assigned to{" "}
    <PreviewCard>
      <PreviewCardTrigger href="#officer-1024">
        Nur Aisyah binti Rahman
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="flex gap-3">
          <span
            aria-hidden
            className="bg-bg-primary-50 text-txt-primary grid size-10 shrink-0 place-content-center rounded-full font-semibold"
          >
            NA
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-txt-black-900 font-semibold">
              Nur Aisyah binti Rahman
            </span>
            <span className="text-txt-black-700">
              Senior Assistant Director
            </span>
            <span className="text-txt-black-700">Budget Division</span>
          </div>
        </div>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt className="text-txt-black-700">Open cases</dt>
          <dd className="text-txt-black-900 font-medium tabular-nums">14</dd>
          <dt className="text-txt-black-700">Extension</dt>
          <dd className="text-txt-black-900 font-medium tabular-nums">
            03-8882 3000
          </dd>
        </dl>
      </PreviewCardContent>
    </PreviewCard>{" "}
    on 3 March 2025.
  </p>
);

export const Default = createRender(Officer);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Officer />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Officer />
    </div>
  ),
  "dark",
);
