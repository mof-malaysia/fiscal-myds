import React from "react";
import {
  Stat,
  StatDelta,
  StatDescription,
  StatGroup,
  StatLabel,
  StatValue,
} from "@mof-malaysia/ftds-react/stat";
import { WorkQueue } from "@mof-malaysia/ftds-react/work-queue";
import { ActivityTimeline } from "@mof-malaysia/ftds-react/activity-timeline";
import { Button } from "@mof-malaysia/ftds-react/button";
import { ArrowForwardIcon } from "@mof-malaysia/ftds-react/icon";
import {
  CASE_COLUMNS,
  EVENTS,
  NOW,
  queryCases,
  type OfficerCase,
} from "./officer-data";

/** The officer's start page: today's numbers, the top of their queue, recent activity. */
export const OfficerDashboard = ({
  onOpen,
  onViewQueue,
}: {
  onOpen: (item: OfficerCase) => void;
  onViewQueue: () => void;
}) => {
  const mine = queryCases({ assignee: "mine" }).filter(
    (c) => c.status === "pending" || c.status === "review",
  );
  const preview = [...mine].sort((a, b) => a.dueIn - b.dueIn).slice(0, 6);

  return (
    <div className="p-surface flex flex-col gap-8">
      <div>
        <h1 className="text-txt-black-900 text-heading-2xs font-semibold">
          Selamat petang, Nur Aisyah
        </h1>
        <p className="text-txt-black-700 text-content mt-1">
          Thursday, 29 October 2026. Here is where your cases stand.
        </p>
      </div>

      <StatGroup>
        <Stat>
          <StatLabel>Open cases</StatLabel>
          <StatValue>{mine.length}</StatValue>
          <StatDelta direction="down" tone="success">
            3 fewer than last week
          </StatDelta>
        </Stat>
        <Stat>
          <StatLabel>Due today</StatLabel>
          <StatValue>{mine.filter((c) => c.dueIn === 0).length}</StatValue>
          <StatDescription>Decide before 5:00 pm</StatDescription>
        </Stat>
        <Stat>
          <StatLabel>Overdue</StatLabel>
          <StatValue>{mine.filter((c) => c.dueIn < 0).length}</StatValue>
          <StatDelta direction="up" tone="danger">
            2 more than yesterday
          </StatDelta>
        </Stat>
        <Stat>
          <StatLabel>Average time to decide</StatLabel>
          <StatValue suffix="days">4.2</StatValue>
          <StatDescription>Target: 7 days</StatDescription>
        </Stat>
      </StatGroup>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section
          aria-labelledby="dash-queue"
          className="flex min-w-0 flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="dash-queue"
              className="text-txt-black-900 text-label-md font-semibold"
            >
              Next in your queue
            </h2>
            <Button variant="default-ghost" size="small" onClick={onViewQueue}>
              View all
              <ArrowForwardIcon className="size-4" aria-hidden />
            </Button>
          </div>
          <WorkQueue<OfficerCase>
            items={preview}
            getId={(c) => c.id}
            columns={CASE_COLUMNS.filter((c) =>
              ["ref", "applicant", "status", "due"].includes(c.id),
            )}
            selectable={false}
            onOpen={onOpen}
            labels={{ table: "Next in your queue" }}
          />
        </section>

        <section
          aria-labelledby="dash-activity"
          className="flex flex-col gap-2"
        >
          <h2
            id="dash-activity"
            className="text-txt-black-900 text-label-md font-semibold"
          >
            Recent activity
          </h2>
          <ActivityTimeline events={EVENTS.slice(0, 4)} now={NOW} />
        </section>
      </div>
    </div>
  );
};
