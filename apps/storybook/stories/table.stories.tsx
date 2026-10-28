import type { Meta, StoryObj } from "@storybook/react-vite";
import { createStory } from "../utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  TableTooltip,
} from "@mof-malaysia/myds-react/table";
import { Tag } from "@mof-malaysia/myds-react/tag";

/**
 * ### Overview
 * Table lays out data in rows and columns, following the Data Table rules in DESIGN.md:
 * no outer border or box, a Paper header in Label Compact and Ink Secondary, and one
 * Hairline between rows. Row height follows the density toolbar (48px comfortable,
 * 40px compact).
 *
 * - `numeric` on `TableHead` and `TableCell` right-aligns in tabular figures, so ringgit
 *   and sen line up.
 * - Status goes in a wash `Tag`, never an outlined badge.
 * - `data-selected` on a row fills it with the Blue Wash.
 * - Rows don't highlight on hover, since static tables often span rows. For sorting,
 *   selection and hover, use `DataTable`.
 *
 * ### Usage
 * ```tsx
 * import {
 *   Table,
 *   TableBody,
 *   TableCell,
 *   TableHead,
 *   TableHeader,
 *   TableRow,
 * } from "@mof-malaysia/myds-react/table";
 *
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Reference</TableHead>
 *       <TableHead numeric>Amount (RM)</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>INV-0042</TableCell>
 *       <TableCell numeric>1,250.00</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 */
const meta = {
  title: "App/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const payments = [
  {
    ref: "PAY-2025-1042",
    description: "Stamp duty, tenancy agreement",
    date: "3 Mar 2025",
    amount: "120.00",
    status: "Paid",
  },
  {
    ref: "PAY-2025-1043",
    description: "Business licence renewal",
    date: "14 Mar 2025",
    amount: "1,250.00",
    status: "Paid",
  },
  {
    ref: "PAY-2025-1051",
    description: "Late filing penalty, Form C",
    date: "28 Mar 2025",
    amount: "300.00",
    status: "Overdue",
  },
  {
    ref: "PAY-2025-1066",
    description: "Instalment 4 of 12, tax estimate",
    date: "15 Apr 2025",
    amount: "2,416.67",
    status: "Due",
  },
];

const statusTag = {
  Paid: <Tag variant="success">Paid</Tag>,
  Due: <Tag variant="warning">Due</Tag>,
  Overdue: <Tag variant="danger">Overdue</Tag>,
} as Record<string, React.ReactNode>;

const header = (
  <TableHeader>
    <TableRow>
      <TableHead>Reference</TableHead>
      <TableHead>Description</TableHead>
      <TableHead>Date</TableHead>
      <TableHead numeric>Amount (RM)</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
);

const rows = payments.map((payment) => (
  <TableRow key={payment.ref}>
    <TableCell className="font-medium">{payment.ref}</TableCell>
    <TableCell>{payment.description}</TableCell>
    <TableCell>{payment.date}</TableCell>
    <TableCell numeric>{payment.amount}</TableCell>
    <TableCell>{statusTag[payment.status]}</TableCell>
  </TableRow>
));

export const Default: Story = createStory({
  children: (
    <>
      {header}
      <TableBody>{rows}</TableBody>
    </>
  ),
});

/** Totals go in `TableFooter`, in Ink and Medium weight under the last Hairline. */
export const Footer: Story = createStory({
  children: (
    <>
      {header}
      <TableBody>{rows}</TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell numeric>4,086.67</TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </>
  ),
});

/** Rate tables span rows; every cell keeps its own Hairline. */
export const RowSpan: Story = createStory({
  children: (
    <>
      <TableCaption>
        Individual income tax rates, assessment year 2023
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Chargeable income (RM)</TableHead>
          <TableHead>Calculation (RM)</TableHead>
          <TableHead numeric>
            <span className="inline-flex items-center gap-1">
              Rate
              <TableTooltip>
                Applied to the band, not to the whole income
              </TableTooltip>
            </span>
          </TableHead>
          <TableHead numeric>Tax (RM)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>A</TableCell>
          <TableCell>0 – 5,000</TableCell>
          <TableCell>On the first 5,000</TableCell>
          <TableCell numeric>0%</TableCell>
          <TableCell numeric>0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>B</TableCell>
          <TableCell rowSpan={2}>5,001 – 20,000</TableCell>
          <TableCell>On the first 5,000</TableCell>
          <TableCell rowSpan={2} numeric>
            1%
          </TableCell>
          <TableCell numeric>0</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Next 15,000</TableCell>
          <TableCell numeric>150</TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>C</TableCell>
          <TableCell rowSpan={2}>20,001 – 35,000</TableCell>
          <TableCell>On the first 20,000</TableCell>
          <TableCell rowSpan={2} numeric>
            3%
          </TableCell>
          <TableCell numeric>150</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Next 15,000</TableCell>
          <TableCell numeric>450</TableCell>
        </TableRow>
      </TableBody>
    </>
  ),
});

/** `data-selected` fills a row with the Blue Wash. */
export const SelectedRow: Story = createStory({
  children: (
    <>
      {header}
      <TableBody>
        {payments.map((payment, i) => (
          <TableRow key={payment.ref} data-selected={i === 2 || undefined}>
            <TableCell className="font-medium">{payment.ref}</TableCell>
            <TableCell>{payment.description}</TableCell>
            <TableCell>{payment.date}</TableCell>
            <TableCell numeric>{payment.amount}</TableCell>
            <TableCell>{statusTag[payment.status]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  ),
});

/** Placeholder bars hold the layout while data loads. */
export const Loading: Story = createStory({
  "aria-busy": true,
  children: (
    <>
      {header}
      <TableBody>
        {Array.from({ length: 4 }, (_, i) => (
          <TableRow key={i}>
            {Array.from({ length: 5 }, (_, j) => (
              <TableCell key={j}>
                <TableSkeleton />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </>
  ),
});

export const Empty: Story = createStory({
  children: (
    <>
      {header}
      <TableBody>
        <TableRow>
          <TableEmpty colSpan={5}>No payments in this period.</TableEmpty>
        </TableRow>
      </TableBody>
    </>
  ),
});

export const DarkFooter: Story = createStory(
  {
    className: "dark",
    children: (
      <>
        {header}
        <TableBody>{rows}</TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell numeric>4,086.67</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </>
    ),
  },
  "dark",
);
