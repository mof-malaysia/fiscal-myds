import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@mof-malaysia/ftds-react/empty-state";
import { Button } from "@mof-malaysia/ftds-react/button";
import { DocumentIcon, SearchIcon } from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * `EmptyState` fills the space where a table, list or search has nothing to show:
 * an optional icon, a title, a description of why or what next, and actions.
 *
 * ### Usage
 * ```tsx
 * <EmptyState>
 *   <EmptyStateIcon><DocumentIcon /></EmptyStateIcon>
 *   <EmptyStateTitle>No applications yet</EmptyStateTitle>
 *   <EmptyStateDescription>Applications you start will appear here.</EmptyStateDescription>
 *   <EmptyStateActions><Button>Start an application</Button></EmptyStateActions>
 * </EmptyState>
 * ```
 */
const meta: Meta<typeof EmptyState> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-emptystate",
  title: "App/EmptyState",
  component: EmptyState,
  parameters: { layout: "padded" },
};

export default meta;

const NoData = () => (
  <EmptyState>
    <EmptyStateIcon>
      <DocumentIcon />
    </EmptyStateIcon>
    <EmptyStateTitle>No applications yet</EmptyStateTitle>
    <EmptyStateDescription>
      Applications you start will appear here, so you can come back to them and
      track their progress.
    </EmptyStateDescription>
    <EmptyStateActions>
      <Button>Start an application</Button>
    </EmptyStateActions>
  </EmptyState>
);

const NoResults = () => (
  <EmptyState>
    <EmptyStateIcon>
      <SearchIcon />
    </EmptyStateIcon>
    <EmptyStateTitle>No results for “zakat 2019”</EmptyStateTitle>
    <EmptyStateDescription>
      Check the spelling, or clear the filters to see every record.
    </EmptyStateDescription>
    <EmptyStateActions>
      <Button variant="default-outline">Clear filters</Button>
      <Button variant="default-ghost">Search help</Button>
    </EmptyStateActions>
  </EmptyState>
);

const Both = () => (
  <div className="bg-bg-white flex flex-col gap-6 rounded-lg">
    <NoData />
    <NoResults />
  </div>
);
export const Default = createRender(Both);

const Minimal = () => (
  <div className="bg-bg-white rounded-lg">
    <EmptyState>
      <EmptyStateTitle>Nothing to review</EmptyStateTitle>
      <EmptyStateDescription>
        New submissions will appear here.
      </EmptyStateDescription>
    </EmptyState>
  </div>
);
export const TextOnly = createRender(Minimal);

const Compact = () => (
  <div data-density="compact">
    <Both />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-gray-50 p-4">
    <Both />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
