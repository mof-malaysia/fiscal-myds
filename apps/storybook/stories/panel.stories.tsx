import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Panel,
  PanelBody,
  PanelReference,
  PanelTitle,
} from "@mof-malaysia/ftds-react/panel";

/**
 * ### Overview
 * `Panel` opens a confirmation or result page: it states the outcome, pairs the
 * colour with an icon, and sets the reference number large in tabular figures.
 *
 * ### Usage
 * ```tsx
 * <Panel>
 *   <PanelTitle>Payment received</PanelTitle>
 *   <PanelBody>We have sent a receipt to aminah@example.com.</PanelBody>
 *   <PanelReference>MOF-2026-004817</PanelReference>
 * </Panel>
 * ```
 */
const meta: Meta<typeof Panel> = {
  title: "App/Panel",
  component: Panel,
  parameters: { layout: "padded" },
};

export default meta;

const Success = () => (
  <Panel>
    <PanelTitle>Payment received</PanelTitle>
    <PanelBody>
      <p className="m-0">
        You paid RM 1,250.00 for assessment year 2025. We have sent a receipt to
        aminah@example.com.
      </p>
    </PanelBody>
    <PanelReference>MOF-2026-004817</PanelReference>
  </Panel>
);
export const Default = createRender(Success);

const Info = () => (
  <Panel variant="info">
    <PanelTitle>Application submitted</PanelTitle>
    <PanelBody>
      We will review it within 14 working days and email you the outcome.
    </PanelBody>
    <PanelReference label="Date submitted">28 October 2026</PanelReference>
  </Panel>
);
export const Informational = createRender(Info);

const Warning = () => (
  <Panel variant="warning">
    <PanelTitle>Payment still due</PanelTitle>
    <PanelBody>
      Pay the remaining amount by 30 November 2026 to avoid a late penalty.
    </PanelBody>
    <PanelReference label="Amount due">RM 312.40</PanelReference>
  </Panel>
);
export const NeedsAction = createRender(Warning);

const Danger = () => (
  <Panel variant="danger">
    <PanelTitle>Application rejected</PanelTitle>
    <PanelBody>
      Your company registration number does not match our records. Check it and
      apply again.
    </PanelBody>
    <PanelReference label="Error code">E-REG-104</PanelReference>
  </Panel>
);
export const Rejected = createRender(Danger);

const Compact = () => (
  <div data-density="compact">
    <Success />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-4 p-4">
    <Success />
    <Panel variant="danger">
      {/* PanelTitle renders its children into the heading */}
      {/* eslint-disable-next-line jsx-a11y/heading-has-content */}
      <PanelTitle render={<h2 />}>Payment failed</PanelTitle>
      <PanelBody>Your bank declined the payment. No money was taken.</PanelBody>
    </Panel>
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
