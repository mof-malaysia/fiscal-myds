import type { Meta, StoryObj } from "@storybook/react-vite";
import { createStory } from "../utils";
import {
  Cell,
  ColumnDef,
  DataTable,
} from "@mof-malaysia/myds-react/data-table";
import type { TypeWithDeepControls } from "storybook-addon-deep-controls";
import { Button } from "@mof-malaysia/myds-react/button";
import { Tag } from "@mof-malaysia/myds-react/tag";
import { EllipsisIcon } from "@mof-malaysia/myds-react/icon";

type Application = {
  ref: string;
  applicant: string;
  scheme: string;
  submitted: string;
  amount: number;
  status: "Approved" | "In review" | "Needs info" | "Rejected";
  children?: Application[];
};

/**
 * ### Overview
 * `DataTable` is the officer's home screen, built to be looked at all day (DESIGN.md,
 * Data Table). It renders `Table` from TanStack Table column definitions: no outer box,
 * a Paper header, one Hairline between rows, Well on hover and the Blue Wash on
 * selected rows.
 *
 * Column `meta`:
 * - `sortable`: the header label becomes the sort button; an arrow shows the direction
 *   and the header carries `aria-sort`.
 * - `numeric`: right-aligned in tabular figures, for amounts.
 * - `expandable`: long text truncates; a header toggle shows it in full.
 * - `tooltip`: a help icon beside the header label.
 *
 * Also: `selection` (`checkbox` or `radio`), nested rows (`nest` with `Cell.Expand`),
 * `pin`ned columns, footers, `loading` and `emptyState`. Accessible names default to
 * English; pass `labels` for Bahasa Melayu.
 *
 * Row actions are ghost buttons or one overflow menu, never a column of outlined buttons.
 *
 * ### Usage
 * ```tsx
 * import { DataTable, type ColumnDef } from "@mof-malaysia/myds-react/data-table";
 *
 * const columns: ColumnDef<Application>[] = [
 *   { id: "ref", header: "Reference", accessorKey: "ref", meta: { sortable: true } },
 *   { id: "applicant", header: "Applicant", accessorKey: "applicant", meta: { expandable: true } },
 *   {
 *     id: "amount",
 *     header: "Amount (RM)",
 *     accessorKey: "amount",
 *     cell: ({ getValue }) => ringgit(getValue<number>()),
 *     meta: { numeric: true, sortable: true },
 *   },
 * ];
 *
 * <DataTable
 *   columns={columns}
 *   data={applications}
 *   selection={{ id_by: "ref", mode: "checkbox", onSelectionChange: setSelected }}
 * />
 * ```
 */

const ringgit = (value: number) =>
  value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusTag: Record<Application["status"], React.ReactNode> = {
  Approved: (
    <Tag variant="success" size="small">
      Approved
    </Tag>
  ),
  "In review": (
    <Tag variant="primary" size="small">
      In review
    </Tag>
  ),
  "Needs info": (
    <Tag variant="warning" size="small">
      Needs info
    </Tag>
  ),
  Rejected: (
    <Tag variant="danger" size="small">
      Rejected
    </Tag>
  ),
};

const actions = () => (
  <Button variant="default-ghost" size="small" iconOnly aria-label="Actions">
    <EllipsisIcon className="size-4" aria-hidden />
  </Button>
);

// Storybook's Meta erases DataTable's row type, so the story columns use its default row type
const columns: ColumnDef<Record<string, any>>[] = [
  {
    id: "ref",
    header: "Reference",
    accessorKey: "ref",
    meta: { sortable: true, className: { cell: "font-medium" } },
  },
  {
    id: "applicant",
    header: "Applicant",
    accessorKey: "applicant",
    meta: { expandable: true },
  },
  {
    id: "scheme",
    header: "Scheme",
    accessorKey: "scheme",
    meta: { tooltip: "The grant or relief the applicant applied for" },
  },
  {
    id: "submitted",
    header: "Submitted",
    accessorKey: "submitted",
    meta: { sortable: true },
  },
  {
    id: "amount",
    header: "Amount (RM)",
    accessorKey: "amount",
    cell: ({ getValue }) => ringgit(getValue<number>()),
    meta: { numeric: true, sortable: true },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => statusTag[getValue<Application["status"]>()],
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: actions,
    meta: { className: { cell: "w-0 text-right" } },
  },
];

const applications: Application[] = [
  {
    ref: "APP-2025-00412",
    applicant: "Kedai Runcit Seri Mawar Sdn. Bhd.",
    scheme: "SME Digitalisation Grant",
    submitted: "2025-03-03",
    amount: 5000,
    status: "Approved",
  },
  {
    ref: "APP-2025-00418",
    applicant: "Nurul Aina binti Ahmad Fauzi",
    scheme: "Disability Equipment Relief",
    submitted: "2025-03-12",
    amount: 6000,
    status: "In review",
  },
  {
    ref: "APP-2025-00421",
    applicant:
      "Syarikat Pengangkutan dan Logistik Pantai Timur Berhad (Cawangan Kuantan)",
    scheme: "SME Digitalisation Grant",
    submitted: "2025-03-14",
    amount: 4850.5,
    status: "Needs info",
  },
  {
    ref: "APP-2025-00430",
    applicant: "Tan Wei Ming",
    scheme: "Lifestyle Relief",
    submitted: "2025-03-19",
    amount: 2500,
    status: "Rejected",
  },
  {
    ref: "APP-2025-00437",
    applicant: "Rajeswari a/p Subramaniam",
    scheme: "Education Fees Relief",
    submitted: "2025-03-21",
    amount: 7000,
    status: "In review",
  },
];

const meta: Meta<typeof DataTable> = {
  title: "App/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
  },
  args: {
    columns,
    data: applications,
  },
} satisfies TypeWithDeepControls<Meta<typeof DataTable>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover a header to reveal sorting and the widen toggle; click a label to sort. */
export const Default: Story = createStory({});

/** Selected rows fill with the Blue Wash; the header checkbox selects every row. */
export const SelectionCheckbox: Story = createStory({
  selection: {
    id_by: "ref",
    mode: "checkbox",
    onSelectionChange: (rows: string[]) => console.log("selected", rows),
  },
});

/** One row at a time. Arrow keys move between rows; the header ✕ clears it. */
export const SelectionRadio: Story = createStory({
  selection: {
    id_by: "ref",
    mode: "radio",
    onSelectionChange: (rows: string[]) => console.log("selected", rows),
  },
});

export const Loading: Story = createStory({ loading: true });

export const EmptyState: Story = createStory({
  data: [],
  emptyState: "No applications match these filters.",
});

/** Totals sit under the last Hairline in Medium weight. */
export const Footer: Story = createStory({
  columns: columns.map((column) =>
    column.id === "ref"
      ? {
          ...column,
          footer: ({ table }: any) => `${table.getRowCount()} applications`,
        }
      : column.id === "amount"
        ? {
            ...column,
            footer: ({ table }: any) =>
              ringgit(
                table
                  .getRowModel()
                  .rows.reduce(
                    (sum: number, row: any) => sum + row.original.amount,
                    0,
                  ),
              ),
          }
        : column,
  ),
});

export const GroupedHeader: Story = createStory({
  columns: [
    {
      id: "application",
      header: "Application",
      columns: columns.slice(0, 3),
    },
    {
      id: "decision",
      header: "Decision",
      columns: columns.slice(3, 6),
    },
    columns[6],
  ],
});

/** The header stays put while rows scroll under it. */
export const FixedHeader: Story = createStory({
  className: "max-h-[320px]",
  data: Array.from({ length: 4 }, (_, batch) =>
    applications.map((application) => ({
      ...application,
      ref: application.ref.replace(
        /\d{2}$/,
        (n) => `${Number(n) + batch * 40}`,
      ),
    })),
  ).flat(),
});

/** `Cell.Expand` indents nested rows and keeps leaf rows aligned. */
export const NestedRows: Story = createStory({
  columns: [{ ...columns[0], cell: Cell.Expand }, ...columns.slice(1)],
  data: [
    {
      ...applications[0],
      children: [
        {
          ...applications[0],
          ref: "APP-2025-00412-A",
          scheme: "Hardware",
          amount: 3000,
        },
        {
          ...applications[0],
          ref: "APP-2025-00412-B",
          scheme: "Software subscription",
          amount: 2000,
        },
      ],
    },
    ...applications.slice(1),
  ],
  nest: { id_by: "children" },
});

/** Pinned columns stay in view; a Hairline marks where the scrolling columns start. */
export const PinnedColumns: Story = {
  ...createStory({
    columns: [
      ...columns.slice(0, 6),
      {
        id: "officer",
        header: "Officer",
        cell: () => "Hafiz Rahman",
      },
      {
        id: "branch",
        header: "Branch",
        cell: () => "Putrajaya",
      },
      {
        id: "updated",
        header: "Last updated",
        cell: () => "2025-03-24 09:14",
      },
      columns[6],
    ],
    selection: {
      id_by: "ref",
      mode: "checkbox",
    },
    pin: {
      left: ["_checkbox", "ref"],
      right: ["actions"],
    },
  }),
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export const DarkSelection: Story = createStory(
  {
    className: "dark",
    selection: {
      id_by: "ref",
      mode: "checkbox",
    },
  },
  "dark",
);
