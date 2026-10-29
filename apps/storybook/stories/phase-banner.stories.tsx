import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  PhaseBanner,
  PhaseBannerLink,
} from "@mof-malaysia/myds-react/phase-banner";

/**
 * ### Overview
 * `PhaseBanner` tells users the stage a service is at and asks for feedback.
 * Place it under the masthead; it scrolls away with the page.
 *
 * ### Usage
 * ```tsx
 * <PhaseBanner phase="Beta">
 *   This is a new service. Your <PhaseBannerLink href="/feedback">feedback</PhaseBannerLink> will help us improve it.
 * </PhaseBanner>
 * ```
 */
const meta: Meta<typeof PhaseBanner> = {
  title: "Core/PhaseBanner",
  component: PhaseBanner,
  parameters: { layout: "fullscreen" },
};

export default meta;

const Basic = () => (
  <PhaseBanner phase="Beta">
    This is a new service. Your{" "}
    <PhaseBannerLink href="#">feedback</PhaseBannerLink> will help us improve
    it.
  </PhaseBanner>
);
export const Default = createRender(Basic);

const Phases = () => (
  <div className="flex flex-col gap-4">
    <PhaseBanner phase="Alpha">
      This is a trial service.{" "}
      <PhaseBannerLink href="#">Tell us what you think</PhaseBannerLink>.
    </PhaseBanner>
    <PhaseBanner phase="Public beta">
      This service is open to everyone. Your{" "}
      <PhaseBannerLink href="#">feedback</PhaseBannerLink> will help us improve
      it.
    </PhaseBanner>
    <PhaseBanner phase="Maintenance" tagVariant="warning">
      Some features are unavailable until 10 pm tonight while we make updates.
    </PhaseBanner>
    <PhaseBanner phase="Retired" tagVariant="default">
      This service has closed. Use the new e-Perolehan portal instead.
    </PhaseBanner>
  </div>
);
export const AllPhases = createRender(Phases);

const Compact = () => (
  <div data-density="compact">
    <Basic />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white">
    <Basic />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
