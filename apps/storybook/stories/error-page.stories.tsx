import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { ErrorPage } from "@mof-malaysia/ftds-react/error-page";

/**
 * ### Overview
 * The whole-page message for when a service can't show what was asked for. Four
 * kinds come with plain-language defaults: `not-found` (404), `server-error`
 * (500), `access-denied` (403) and `maintenance` (503). Each says what happened,
 * what to do next, and offers the actions that help.
 *
 * The code sits small above the title: it is for support staff. A `reference`
 * shows with a Copy button so people can quote it when they get in touch.
 * Override `title`, `description` or `actions` when the defaults don't fit.
 *
 * ### Usage
 * ```tsx
 * <ErrorPage kind="not-found" homeHref="/" supportHref="/contact" />
 * <ErrorPage kind="server-error" onRetry={retry} reference={requestId} />
 * <ErrorPage kind="maintenance" backAt="10:00 pm today" />
 * ```
 */
const meta: Meta<typeof ErrorPage> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-blocks-errorpage",
  title: "App/Blocks/ErrorPage",
  component: ErrorPage,
  parameters: { layout: "fullscreen" },
  args: { homeHref: "#home", supportHref: "#contact" },
};

export default meta;

export const NotFound = { args: { kind: "not-found" } };

/** Retry is the primary action; the reference helps support find the error. */
export const ServerError = {
  args: {
    kind: "server-error",
    onRetry: () => {},
    reference: "REQ-8F2A-41C9-7D30",
  },
};

export const AccessDenied = { args: { kind: "access-denied" } };

export const Maintenance = {
  args: {
    kind: "maintenance",
    backAt: "5:00 am on Sunday, 2 November",
    homeHref: undefined,
  },
};

/** Custom copy and extra content for a specific situation. */
export const Custom = createRender(() => (
  <ErrorPage
    kind="not-found"
    title="This payment link has expired"
    description="Payment links last 24 hours. Ask for a new link, or pay from your account instead."
    code={null}
    homeHref="#home"
  >
    <ul className="text-content text-txt-black-700 m-0 list-disc pl-5">
      <li>Your bill is still due on 15 November.</li>
      <li>Nothing has been charged.</li>
    </ul>
  </ErrorPage>
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <ErrorPage kind="access-denied" homeHref="#home" supportHref="#contact" />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <ErrorPage
        kind="server-error"
        onRetry={() => {}}
        homeHref="#home"
        reference="REQ-8F2A-41C9-7D30"
      />
    </div>
  ),
  "dark",
);
