import React from "react";
import {
  ActivityTimeline,
  type ActivityEvent,
} from "@mof-malaysia/myds-react/activity-timeline";
import {
  DecisionPanel,
  type CaseDecision,
} from "@mof-malaysia/myds-react/decision-panel";
import {
  SummaryList,
  SummaryListBody,
  SummaryListDetail,
  SummaryListRow,
  SummaryListTerm,
} from "@mof-malaysia/myds-react/summary-list";
import { Button } from "@mof-malaysia/myds-react/button";
import { useCommands } from "@mof-malaysia/myds-react/shortcuts";
import { useToast } from "@mof-malaysia/myds-react/hooks";
import {
  ArrowBackIcon,
  AttachmentIcon,
  DownloadIcon,
} from "@mof-malaysia/myds-react/icon";
import {
  EVENTS,
  ME,
  NOW,
  StatusTag,
  type CaseStatus,
  type OfficerCase,
} from "./officer-data";

const DOCUMENTS = [
  { name: "Borang-permohonan-bayaran-balik.pdf", size: "184 KB" },
  { name: "Invois-INV-2026-0981.pdf", size: "96 KB" },
  { name: "Penyata-bank-Julai-2026.pdf", size: "312 KB" },
];

const OUTCOME: Record<CaseDecision, { status: CaseStatus; verb: string }> = {
  approve: { status: "approved", verb: "approved the application" },
  return: { status: "returned", verb: "returned the application for changes" },
  reject: { status: "rejected", verb: "rejected the application" },
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section aria-label={title} className="flex flex-col gap-2">
    <h2 className="text-txt-black-900 text-label-md font-semibold">{title}</h2>
    {children}
  </section>
);

/** One case: details, documents and history, with the decision panel alongside. */
export const OfficerCaseDetail = ({
  item,
  onBack,
}: {
  item: OfficerCase;
  onBack: () => void;
}) => {
  const [status, setStatus] = React.useState<CaseStatus>(item.status);
  const [events, setEvents] = React.useState<ActivityEvent[]>(EVENTS);
  const [pending, setPending] = React.useState(false);
  const { toast } = useToast();
  const closed = status === "approved" || status === "rejected";

  const log = (event: Omit<ActivityEvent, "id" | "at" | "actor">) =>
    setEvents((list) => [
      {
        ...event,
        id: String(Date.now()),
        at: NOW,
        actor: { name: ME, role: "Reviewing officer" },
      },
      ...list,
    ]);

  useCommands([
    {
      id: "case.back",
      title: "Back to the queue",
      group: "Case",
      combo: "u",
      run: onBack,
    },
  ]);

  return (
    <div className="p-surface flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Button
          variant="default-ghost"
          size="small"
          className="-ml-2 self-start"
          onClick={onBack}
        >
          <ArrowBackIcon className="size-4" aria-hidden />
          Case queue
        </Button>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-txt-black-900 text-heading-2xs font-semibold">
            {item.applicant}
          </h1>
          <StatusTag status={status} />
        </div>
        <p className="text-txt-black-700 text-content">
          <span className="font-mono">{item.ref}</span> · {item.type} ·{" "}
          {item.amount} · Assigned to {item.assignee ?? "nobody"}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex min-w-0 flex-col gap-8">
          <Section title="Application">
            <SummaryList>
              <SummaryListBody>
                <SummaryListRow>
                  <SummaryListTerm>Applicant</SummaryListTerm>
                  <SummaryListDetail>{item.applicant}</SummaryListDetail>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListTerm>Registration no.</SummaryListTerm>
                  <SummaryListDetail className="font-mono">
                    201901023456 (1334567-X)
                  </SummaryListDetail>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListTerm>Application type</SummaryListTerm>
                  <SummaryListDetail>{item.type}</SummaryListDetail>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListTerm>Amount claimed</SummaryListTerm>
                  <SummaryListDetail className="tabular-nums">
                    {item.amount}
                  </SummaryListDetail>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListTerm>Bank account</SummaryListTerm>
                  <SummaryListDetail>Maybank · ending 4417</SummaryListDetail>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListTerm>Submitted</SummaryListTerm>
                  <SummaryListDetail>20 Oct 2026, 9:12 am</SummaryListDetail>
                </SummaryListRow>
                <SummaryListRow>
                  <SummaryListTerm>Decision due</SummaryListTerm>
                  <SummaryListDetail>{item.due} 2026</SummaryListDetail>
                </SummaryListRow>
              </SummaryListBody>
            </SummaryList>
          </Section>

          <Section title="Documents">
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {DOCUMENTS.map((doc) => (
                <li
                  key={doc.name}
                  className="bg-bg-washed flex items-center gap-2 rounded-md px-3 py-1.5"
                >
                  <AttachmentIcon
                    aria-hidden
                    className="text-txt-black-700 size-4 shrink-0"
                  />
                  <span className="text-txt-black-900 text-content min-w-0 flex-1 truncate">
                    {doc.name}
                  </span>
                  <span className="text-txt-black-500 text-label-compact">
                    {doc.size}
                  </span>
                  <Button
                    variant="default-ghost"
                    size="small"
                    iconOnly
                    aria-label={`Download ${doc.name}`}
                  >
                    <DownloadIcon className="size-4" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Activity">
            <ActivityTimeline
              events={events}
              now={NOW}
              onAddNote={(text) =>
                log({ kind: "comment", action: "added a note", comment: text })
              }
            />
          </Section>
        </div>

        <aside className="lg:sticky lg:top-0 lg:self-start">
          <div className="bg-bg-washed rounded-lg p-4">
            {closed ? (
              <div className="flex flex-col gap-1">
                <h2 className="text-txt-black-900 text-heading-2xs font-semibold">
                  Decision recorded
                </h2>
                <p className="text-txt-black-700 text-content">
                  This case is closed. The decision is in the activity history.
                </p>
              </div>
            ) : (
              <DecisionPanel
                pending={pending}
                onDecide={({ decision, reason, notify }) => {
                  setPending(true);
                  setTimeout(() => {
                    setPending(false);
                    setStatus(OUTCOME[decision].status);
                    log({
                      kind: "decision",
                      action: OUTCOME[decision].verb,
                      comment: reason || undefined,
                    });
                    toast({
                      variant: "success",
                      title: "Decision recorded",
                      description: notify
                        ? "The applicant has been emailed."
                        : undefined,
                    });
                  }, 800);
                }}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
