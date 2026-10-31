import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  TaskList,
  TaskListItem,
  TaskListItemHint,
  TaskListItemStatus,
  TaskListItemTitle,
} from "@mof-malaysia/ftds-react/task-list";

/**
 * ### Overview
 * `TaskList` shows each part of a multi-part application and its status, so
 * users can see what's done and what's left. Statuses are wash tags with words.
 *
 * ### Usage
 * ```tsx
 * <TaskList>
 *   <TaskListItem>
 *     <TaskListItemTitle href="/apply/details">Company details</TaskListItemTitle>
 *     <TaskListItemHint>Registration number and address</TaskListItemHint>
 *     <TaskListItemStatus status="completed" />
 *   </TaskListItem>
 * </TaskList>
 * ```
 */
const meta: Meta<typeof TaskList> = {
  title: "App/TaskList",
  component: TaskList,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = () => (
  <div className="max-w-2xl">
    <TaskList>
      <TaskListItem>
        <TaskListItemTitle href="#">Company details</TaskListItemTitle>
        <TaskListItemHint>
          Registration number, address and directors
        </TaskListItemHint>
        <TaskListItemStatus status="completed" />
      </TaskListItem>
      <TaskListItem>
        <TaskListItemTitle href="#">Financial statements</TaskListItemTitle>
        <TaskListItemHint>
          Audited accounts for the last 2 years
        </TaskListItemHint>
        <TaskListItemStatus status="in-progress" />
      </TaskListItem>
      <TaskListItem>
        <TaskListItemTitle href="#">Bank details</TaskListItemTitle>
        <TaskListItemStatus status="not-started" />
      </TaskListItem>
      <TaskListItem>
        <TaskListItemTitle>Check and submit</TaskListItemTitle>
        <TaskListItemHint>
          Available once every section is complete
        </TaskListItemHint>
        <TaskListItemStatus status="cannot-start" />
      </TaskListItem>
    </TaskList>
  </div>
);
export const Default = createRender(Basic);

const Grouped = () => (
  <div className="flex max-w-2xl flex-col gap-8">
    <section className="flex flex-col gap-3">
      <h2 className="text-txt-black-900 m-0 text-lg font-semibold">
        1. About your company
      </h2>
      <TaskList>
        <TaskListItem>
          <TaskListItemTitle href="#">Company details</TaskListItemTitle>
          <TaskListItemStatus status="completed" />
        </TaskListItem>
        <TaskListItem>
          <TaskListItemTitle href="#">Contact person</TaskListItemTitle>
          <TaskListItemStatus status="completed" />
        </TaskListItem>
      </TaskList>
    </section>
    <section className="flex flex-col gap-3">
      <h2 className="text-txt-black-900 m-0 text-lg font-semibold">2. Apply</h2>
      <TaskList>
        <TaskListItem>
          <TaskListItemTitle href="#">Supporting documents</TaskListItemTitle>
          <TaskListItemStatus status="not-started">
            Belum mula
          </TaskListItemStatus>
        </TaskListItem>
        <TaskListItem>
          <TaskListItemTitle>Declaration</TaskListItemTitle>
          <TaskListItemStatus status="cannot-start" />
        </TaskListItem>
      </TaskList>
    </section>
  </div>
);
export const GroupedTasks = createRender(Grouped);

const Compact = () => (
  <div data-density="compact">
    <Basic />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Basic />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
