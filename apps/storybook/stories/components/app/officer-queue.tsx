import React from "react";
import {
  WorkQueue,
  type WorkQueueAssignee,
} from "@mof-malaysia/ftds-react/work-queue";
import { useCommands } from "@mof-malaysia/ftds-react/shortcuts";
import { useToast } from "@mof-malaysia/ftds-react/hooks";
import { Button } from "@mof-malaysia/ftds-react/button";
import { PlusIcon } from "@mof-malaysia/ftds-react/icon";
import {
  CASE_COLUMNS,
  CASES,
  ME,
  STATUSES,
  STATUS_LABEL,
  queryCases,
  type CaseStatus,
  type OfficerCase,
} from "./officer-data";

const PAGE_SIZE = 12;

/** The queue screen: page heading and the WorkQueue on edge-to-edge Sheet. */
export const OfficerQueue = ({
  onOpen,
}: {
  onOpen: (item: OfficerCase) => void;
}) => {
  const [cases, setCases] = React.useState(CASES);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [assignee, setAssignee] = React.useState<WorkQueueAssignee>("mine");
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<string[]>([]);
  const { toast } = useToast();

  const results = queryCases({ search, status, assignee }).map((c) =>
    cases.find((x) => x.id === c.id)!,
  );
  const items = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (
    ids: string[],
    patch: Partial<OfficerCase>,
    message: string,
  ) => {
    setCases((list) =>
      list.map((c) => (ids.includes(c.id) ? { ...c, ...patch } : c)),
    );
    setSelected([]);
    toast({ variant: "success", title: message });
  };
  const reset = () => {
    setPage(1);
    setSelected([]);
  };

  useCommands([
    {
      id: "queue.mine",
      title: "Show my cases",
      group: "Queue",
      combo: "m",
      run: () => {
        setAssignee("mine");
        reset();
      },
    },
    {
      id: "queue.unassigned",
      title: "Show unassigned cases",
      group: "Queue",
      combo: "u",
      run: () => {
        setAssignee("unassigned");
        reset();
      },
    },
  ]);

  return (
    <div className="p-surface flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-txt-black-900 text-heading-2xs font-semibold">
            Case queue
          </h1>
          <p className="text-txt-black-700 text-content mt-1">
            Refunds, grants and exemptions waiting for review.
          </p>
        </div>
        <Button variant="primary-fill" size="small">
          <PlusIcon className="size-4" aria-hidden />
          New case
        </Button>
      </div>
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
        onAssign={(ids) =>
          update(ids, { assignee: ME }, `${ids.length} cases assigned to you`)
        }
        onChangeStatus={(ids, value) =>
          update(
            ids,
            { status: value as CaseStatus },
            `${ids.length} cases moved to ${STATUS_LABEL[value as CaseStatus]}`,
          )
        }
        onExport={(ids) =>
          update(ids, {}, `Exported ${ids.length} cases to CSV`)
        }
        onOpen={onOpen}
        page={page}
        pageSize={PAGE_SIZE}
        total={results.length}
        onPageChange={setPage}
      />
    </div>
  );
};
