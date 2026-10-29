import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  InsetText,
  InsetTextAuthor,
} from "@mof-malaysia/myds-react/inset-text";

/**
 * ### Overview
 * `InsetText` sets an important passage apart from the text around it, in a
 * Well with no side stripe. Render it as a `<figure>` with `InsetTextAuthor`
 * for a quote.
 *
 * ### Usage
 * ```tsx
 * <InsetText>Submit your declaration by 30 April 2026 to avoid a late penalty.</InsetText>
 * ```
 */
const meta: Meta<typeof InsetText> = {
  title: "Core/InsetText",
  component: InsetText,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <InsetText>
    You must submit your declaration by 30 April 2026. If you submit after this
    date, you may have to pay a late penalty.
  </InsetText>
);
export const Default = createRender(Basic);

const Quote = () => (
  <InsetText render={<figure />} className="m-0">
    <blockquote className="m-0">
      Every ringgit of public money must be spent with care, and every citizen
      should be able to see how.
    </blockquote>
    <InsetTextAuthor>Ministry of Finance, Budget 2026</InsetTextAuthor>
  </InsetText>
);
export const BlockQuote = createRender(Quote);

const Compact = () => (
  <div data-density="compact">
    <Basic />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-4 p-4">
    <Basic />
    <Quote />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
