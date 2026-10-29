import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  WorkQueue,
  type WorkQueueAssignee,
  type WorkQueueProps,
} from "@mof-malaysia/ftds-react/work-queue";
import { ShortcutProvider } from "@mof-malaysia/ftds-react/shortcuts";
import {
  CASE_COLUMNS,
  STATUSES,
  queryCases,
  type OfficerCase,
} from "./components/app/officer-data";

/**
 * ### Overview
 * An officer's case queue: search, a status and an assignee filter, a selectable
 * table, a bulk-action bar once rows are selected, and paging. The app owns the
 * data; the block shows what it is given and reports changes through callbacks.
 *
 * One column is `primary`: its cell is the button that opens the case.
 *
 * ### Keyboard (inside `ShortcutProvider` or `DeskShell`)
 * | Keys | Action |
 * | --- | --- |
 * | <kbd>J</kbd> / <kbd>K</kbd> | Move the highlight down / up |
 * | <kbd>Enter</kbd> | Open the highlighted case |
 * | <kbd>X</kbd> | Select the highlighted case |
 * | <kbd>/</kbd> | Jump to search (<kbd>Esc</kbd> leaves it) |
 *
 * Without a provider the queue works the same, minus the shortcuts.
 *
 * ### Usage
 * ```tsx
 * <WorkQueue
 *   items={cases}
 *   getId={(c) => c.id}
 *   columns={[
 *     { id: "ref", header: "Reference", cell: (c) => c.ref, primary: true },
 *     { id: "applicant", header: "Applicant", cell: (c) => c.applicant },
 *     { id: "status", header: "Status", cell: (c) => <StatusTag status={c.status} /> },
 *   ]}
 *   search={search} onSearchChange={setSearch}
 *   statuses={statuses} status={status} onStatusChange={setStatus}
 *   assignee={assignee} onAssigneeChange={setAssignee}
 *   onOpen={(c) => navigate(`/cases/${c.id}`)}
 *   onAssign={assignToMe} onChangeStatus={changeStatus} onExport={exportCsv}
 *   page={page} pageSize={10} total={total} onPageChange={setPage}
 * />
 * ```
 */
const meta: Meta<typeof WorkQueue> = {
  title: "App/Blocks/WorkQueue",
  component: WorkQueue,
  parameters: { layout: "padded" },
};

export default meta;

const PAGE_SIZE = 10;

type DemoProps = Partial<WorkQueueProps<OfficerCase>> & {
  initialStatus?: string;
  initialSearch?: string;
};

/** Simulates an API: filters and pages the sample cases from local state. */
const Demo = ({
  initialStatus = "all",
  initialSearch = "",
  ...props
}: DemoProps) => {
  const [search, setSearch] = React.useState(initialSearch);
  const [status, setStatus] = React.useState(initialStatus);
  const [assignee, setAssignee] = React.useState<WorkQueueAssignee>("all");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [opened, setOpened] = React.useState<string>();

  const results = queryCases({ search, status, assignee });
  const items = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset = () => {
    setPage(1);
    setSelected([]);
  };

  return (
    <div className="flex flex-col gap-3">
      <WorkQueue<OfficerCase>
        items={items}
        getId={(c) => c.id}
        columns={CASE_COLUMNS}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          reset();
        }}
        statuses={STATUSES}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          reset();
        }}
        assignee={assignee}
        onAssigneeChange={(value) => {
          setAssignee(value);
          reset();
        }}
        filtered={!!search || status !== "all" || assignee !== "all"}
        selected={selected}
        onSelectedChange={setSelected}
        onAssign={() => setSelected([])}
        onChangeStatus={() => setSelected([])}
        onExport={() => setSelected([])}
        onOpen={(c) => setOpened(c.ref)}
        page={page}
        pageSize={PAGE_SIZE}
        total={results.length}
        onPageChange={setPage}
        {...props}
      />
      <p className="text-txt-black-500 text-label-compact" aria-live="polite">
        {opened
          ? `Opened ${opened}`
          : "Open a case with its reference, or J/K then Enter."}
      </p>
    </div>
  );
};

const Frame = ({ children }: { children: React.ReactNode }) => (
  <ShortcutProvider>
    <div data-density="compact" className="bg-bg-white font-body">
      {children}
    </div>
  </ShortcutProvider>
);

/** Click inside the story, then try J, K, X, Enter and /. */
export const Default = createRender(() => (
  <Frame>
    <Demo />
  </Frame>
));

/** Rows already selected: the bulk-action bar sits above the table. */
const SelectedDemo = () => {
  const [selected, setSelected] = React.useState([
    "case-1",
    "case-2",
    "case-4",
  ]);
  return <Demo selected={selected} onSelectedChange={setSelected} />;
};
export const WithSelection = createRender(() => (
  <Frame>
    <SelectedDemo />
  </Frame>
));

export const Loading = createRender(() => (
  <Frame>
    <Demo loading items={[]} />
  </Frame>
));

/** Filters that match nothing say so, and suggest what to change. */
export const NoResults = createRender(() => (
  <Frame>
    <Demo initialSearch="no such applicant" />
  </Frame>
));

/** An empty queue with no filters applied. */
export const Empty = createRender(() => (
  <Frame>
    <WorkQueue<OfficerCase>
      items={[]}
      getId={(c) => c.id}
      columns={CASE_COLUMNS}
      onSearchChange={() => {}}
      statuses={STATUSES}
      status="all"
      onStatusChange={() => {}}
      onAssigneeChange={() => {}}
    />
  </Frame>
));

/** Outside a `ShortcutProvider` the queue works without shortcuts. */
export const WithoutShortcuts = createRender(() => (
  <div data-density="compact" className="bg-bg-white">
    <Demo keyboard={false} />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Frame>
        <Demo />
      </Frame>
    </div>
  ),
  "dark",
);
