import React from "react";
import { OfficerShell, type OfficerPage } from "./components/app/officer-shell";
import { OfficerDashboard } from "./components/app/officer-dashboard";
import { OfficerQueue } from "./components/app/officer-queue";
import { OfficerCaseDetail } from "./components/app/officer-case-detail";
import { CASES, type OfficerCase } from "./components/app/officer-data";

/**
 * Officer screens on DeskShell, composed from the WorkQueue, ActivityTimeline and
 * DecisionPanel blocks. The pages link to each other: open a case from the queue or
 * the dashboard, record a decision, go back.
 *
 * Keyboard: `g d` dashboard, `g q` queue, `j`/`k`/`Enter` in the queue, `m`/`u`
 * for my or unassigned cases, `u` back from a case, ⌘K for everything, `?` for
 * the full list.
 */
export default {
  title: "Examples/App/Officer",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};

const OfficerApp = ({ initial }: { initial: OfficerPage }) => {
  const [page, setPage] = React.useState<OfficerPage>(initial);
  const [current, setCurrent] = React.useState<OfficerCase>(CASES[0]!);

  const open = (item: OfficerCase) => {
    setCurrent(item);
    setPage("case");
  };

  const crumbs =
    page === "dashboard"
      ? [{ label: "Dashboard" }]
      : page === "queue"
        ? [{ label: "Case queue" }]
        : [
            { label: "Case queue", onClick: () => setPage("queue") },
            { label: current.ref },
          ];

  return (
    <OfficerShell page={page} onNavigate={setPage} crumbs={crumbs} flush>
      {page === "dashboard" && (
        <OfficerDashboard onOpen={open} onViewQueue={() => setPage("queue")} />
      )}
      {page === "queue" && <OfficerQueue onOpen={open} />}
      {page === "case" && (
        // Keyed so switching cases starts with a fresh decision panel
        <OfficerCaseDetail
          key={current.id}
          item={current}
          onBack={() => setPage("queue")}
        />
      )}
    </OfficerShell>
  );
};

export const Dashboard = { render: () => <OfficerApp initial="dashboard" /> };

export const Queue = { render: () => <OfficerApp initial="queue" /> };

export const CaseDetail = { render: () => <OfficerApp initial="case" /> };

export const DarkTheme = {
  render: () => (
    <div className="dark bg-bg-white">
      <OfficerApp initial="case" />
    </div>
  ),
  parameters: { backgrounds: { default: "dark" } },
};
