import React from "react";
import type { ActivityEvent } from "@mof-malaysia/ftds-react/activity-timeline";
import type {
  WorkQueueColumn,
  WorkQueueOption,
} from "@mof-malaysia/ftds-react/work-queue";
import { Tag } from "@mof-malaysia/ftds-react/tag";

/** Sample cases and history shared by the officer block stories and example pages. */

export type CaseStatus =
  | "pending"
  | "review"
  | "returned"
  | "approved"
  | "rejected";

export interface OfficerCase {
  id: string;
  ref: string;
  applicant: string;
  type: string;
  amount: string;
  status: CaseStatus;
  assignee?: string;
  due: string;
  /** Days until due; negative is overdue. */
  dueIn: number;
}

export const ME = "Nur Aisyah";

export const STATUS_LABEL: Record<CaseStatus, string> = {
  pending: "Pending",
  review: "In review",
  returned: "Returned",
  approved: "Approved",
  rejected: "Rejected",
};

const STATUS_VARIANT = {
  pending: "warning",
  review: "primary",
  returned: "default",
  approved: "success",
  rejected: "danger",
} as const;

export const StatusTag = ({ status }: { status: CaseStatus }) => (
  <Tag size="small" variant={STATUS_VARIANT[status]} dot>
    {STATUS_LABEL[status]}
  </Tag>
);

export const STATUSES: WorkQueueOption[] = [
  { value: "all", label: "All statuses" },
  ...(Object.keys(STATUS_LABEL) as CaseStatus[]).map((value) => ({
    value,
    label: STATUS_LABEL[value],
  })),
];

const APPLICANTS = [
  ["Syarikat Maju Jaya Sdn Bhd", "Refund", "RM 12,480.00"],
  ["Koperasi Tani Sungai Besar", "Grant claim", "RM 85,000.00"],
  ["Pelabuhan Klang Logistics", "Duty exemption", "RM 230,115.50"],
  ["Majlis Daerah Kuala Langat", "Allocation", "RM 1,200,000.00"],
  ["Kedai Runcit Aminah", "Refund", "RM 640.20"],
  ["Jabatan Kerja Raya Selangor", "Allocation", "RM 3,450,000.00"],
  ["Tan Brothers Trading", "Refund", "RM 7,912.00"],
  ["Persatuan Nelayan Kuantan", "Grant claim", "RM 42,300.00"],
  ["Hospital Sultanah Aminah", "Allocation", "RM 980,000.00"],
  ["Ravi & Sons Hardware", "Duty exemption", "RM 18,450.75"],
  ["Universiti Teknologi Mara", "Grant claim", "RM 150,000.00"],
  ["Syarikat Ikhlas Bina", "Refund", "RM 3,215.40"],
] as const;

const STATUS_CYCLE: CaseStatus[] = [
  "pending",
  "review",
  "pending",
  "returned",
  "review",
  "approved",
  "pending",
  "rejected",
];
const ASSIGNEES = [ME, undefined, "Lim Wei Jie", ME, undefined, "Siti Hajar"];

export const CASES: OfficerCase[] = Array.from({ length: 36 }, (_, i) => {
  const [applicant, type, amount] = APPLICANTS[i % APPLICANTS.length]!;
  const dueIn = (i % 9) - 2;
  const due = new Date(2026, 9, 29 + dueIn);
  return {
    id: `case-${i + 1}`,
    ref: `KK-2026-${String(412 - i * 3).padStart(4, "0")}`,
    applicant,
    type,
    amount,
    status: STATUS_CYCLE[i % STATUS_CYCLE.length]!,
    assignee: ASSIGNEES[i % ASSIGNEES.length],
    due: due.toLocaleDateString("en-MY", { day: "numeric", month: "short" }),
    dueIn,
  };
});

export const DueCell = ({ item }: { item: OfficerCase }) => (
  <span className={item.dueIn < 0 ? "text-txt-danger font-medium" : undefined}>
    {item.due}
    {item.dueIn < 0 && " · Overdue"}
    {item.dueIn === 0 && " · Today"}
  </span>
);

export const CASE_COLUMNS: WorkQueueColumn<OfficerCase>[] = [
  {
    id: "ref",
    header: "Reference",
    cell: (c) => <span className="font-mono">{c.ref}</span>,
    primary: true,
    className: "w-36",
  },
  { id: "applicant", header: "Applicant", cell: (c) => c.applicant },
  {
    id: "type",
    header: "Type",
    cell: (c) => c.type,
    className: "hidden lg:table-cell",
  },
  {
    id: "amount",
    header: "Amount",
    cell: (c) => <span className="tabular-nums">{c.amount}</span>,
    className: "text-right",
  },
  {
    id: "status",
    header: "Status",
    cell: (c) => <StatusTag status={c.status} />,
  },
  {
    id: "assignee",
    header: "Assigned to",
    cell: (c) =>
      c.assignee ?? <span className="text-txt-black-500">Unassigned</span>,
    className: "hidden md:table-cell",
  },
  { id: "due", header: "Due", cell: (c) => <DueCell item={c} /> },
];

/** Filters and pages the sample cases the way an API would. */
export function queryCases({
  search = "",
  status = "all",
  assignee = "all",
}: {
  search?: string;
  status?: string;
  assignee?: "mine" | "unassigned" | "all";
}) {
  const q = search.trim().toLowerCase();
  return CASES.filter(
    (c) =>
      (status === "all" || c.status === status) &&
      (assignee === "all" ||
        (assignee === "mine" ? c.assignee === ME : !c.assignee)) &&
      (!q ||
        c.ref.toLowerCase().includes(q) ||
        c.applicant.toLowerCase().includes(q)),
  );
}

/** "Now" for relative times, so stories read the same every day. */
export const NOW = new Date("2026-10-29T15:00:00+08:00");

export const EVENTS: ActivityEvent[] = [
  {
    id: "e6",
    kind: "comment",
    actor: { name: ME, role: "Reviewing officer" },
    action: "added a note",
    at: "2026-10-29T11:20:00+08:00",
    comment:
      "Bank statement for August is still missing. Called the applicant; they will upload it today.",
  },
  {
    id: "e5",
    kind: "document",
    actor: { name: "Syarikat Maju Jaya Sdn Bhd", role: "Applicant" },
    action: "uploaded a document",
    at: "2026-10-28T16:05:00+08:00",
    attachment: {
      name: "Penyata-bank-Julai-2026.pdf",
      href: "#",
      size: "312 KB",
    },
  },
  {
    id: "e4",
    kind: "status",
    actor: { name: ME, role: "Reviewing officer" },
    action: (
      <>
        changed the status from <strong className="font-medium">Pending</strong>{" "}
        to <strong className="font-medium">In review</strong>
      </>
    ),
    at: "2026-10-27T09:40:00+08:00",
  },
  {
    id: "e3",
    kind: "assigned",
    actor: { name: "Lim Wei Jie", role: "Supervisor" },
    action: (
      <>
        assigned the case to <strong className="font-medium">{ME}</strong>
      </>
    ),
    at: "2026-10-24T14:10:00+08:00",
  },
  {
    id: "e1",
    kind: "submitted",
    actor: { name: "Syarikat Maju Jaya Sdn Bhd", role: "Applicant" },
    action: "submitted a refund application",
    at: "2026-10-20T09:12:00+08:00",
  },
];
