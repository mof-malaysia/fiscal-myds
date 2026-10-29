import { QuestionCircleIcon } from "@/components/ui/icons/question-circle";
import { clx } from "@/lib/ftds/utils";
import { forwardRef, ForwardRefExoticComponent, ComponentProps } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Table lays out data in rows and columns (DESIGN.md, Data Table): no outer border or
 * box, a Paper header in Label Compact and Ink Secondary, and one Hairline between
 * rows. Row height follows `data-density`: 48px comfortable, 40px compact.
 *
 * - `numeric` on `TableHead` and `TableCell` right-aligns in tabular figures, for amounts.
 * - `data-selected` on a `TableRow` fills it with the Blue Wash.
 * - Rows don't highlight on hover here, since static tables often span rows. `DataTable`
 *   and `WorkQueue` add hover; for your own, add `hover:bg-bg-washed` to body rows.
 *
 * @example
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
 */

const Table: ForwardRefExoticComponent<ComponentProps<"table">> = forwardRef(
  ({ className, ...props }, ref) => (
    <div className={clx("relative w-full overflow-auto", className)}>
      <table
        ref={ref}
        className="font-body w-full caption-bottom border-separate border-spacing-0"
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader: ForwardRefExoticComponent<ComponentProps<"thead">> =
  forwardRef(({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={clx("sticky top-0 z-10", className)}
      {...props}
    />
  ));
TableHeader.displayName = "TableHeader";

const TableBody: ForwardRefExoticComponent<ComponentProps<"tbody">> =
  forwardRef(({ className, ...props }, ref) => (
    <tbody ref={ref} className={className} {...props} />
  ));
TableBody.displayName = "TableBody";

const TableFooter: ForwardRefExoticComponent<ComponentProps<"tfoot">> =
  forwardRef(({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={clx("[&_td]:text-txt-black-900 [&_td]:font-medium", className)}
      {...props}
    />
  ));
TableFooter.displayName = "TableFooter";

const TableRow: ForwardRefExoticComponent<ComponentProps<"tr">> = forwardRef(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={clx(
        // One Hairline per row, header included (DESIGN.md, Data Table)
        "*:border-otl-gray-200 *:border-b",
        "data-[selected]:bg-bg-primary-50",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

interface TableCellProps {
  /** Right-aligns the column in tabular figures, for amounts and counts. */
  numeric?: boolean;
}

// Selection cells (a checkbox or radio) shrink to the control
const selection_cell =
  "[&:has([role=checkbox],[type=radio])]:w-10 [&:has([role=checkbox],[type=radio])]:pr-0";

const TableHead: ForwardRefExoticComponent<
  ComponentProps<"th"> & TableCellProps
> = forwardRef(({ className, numeric, ...props }, ref) => (
  <th
    ref={ref}
    className={clx(
      "bg-bg-gray-50 text-txt-black-700 text-label-compact h-10 px-3 py-1.5 text-left align-middle font-medium",
      numeric && "text-right tabular-nums",
      selection_cell,
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell: ForwardRefExoticComponent<
  ComponentProps<"td"> & TableCellProps
> = forwardRef(({ className, numeric, ...props }, ref) => (
  <td
    ref={ref}
    className={clx(
      // Row height follows data-density: 48px comfortable, 40px compact. Tags and
      // wrapped text fit inside; a row of buttons is 52px comfortable, 40px compact
      // (4px above the button, 3px below plus the Hairline).
      "text-txt-black-900 text-content h-(--row-h) px-3 py-1.5 align-middle",
      "[&:has(button)]:pt-1 [&:has(button)]:pb-[3px]",
      numeric && "text-right tabular-nums",
      selection_cell,
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption: ForwardRefExoticComponent<ComponentProps<"caption">> =
  forwardRef(({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={clx(
        "text-txt-black-700 text-label-sm mt-(--space-stack-sm) text-left",
        className,
      )}
      {...props}
    />
  ));
TableCaption.displayName = "TableCaption";

/** A help icon beside a header label; its content shows in a tooltip. */
const TableTooltip: ForwardRefExoticComponent<ComponentProps<typeof Tooltip>> =
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  forwardRef(({ children, ...props }, ref) => {
    return (
      <Tooltip {...props}>
        <TooltipTrigger
          aria-label="More information"
          className="text-txt-black-500 hover:text-txt-black-900 focus-ring inline-flex cursor-help rounded-full transition-colors"
        >
          <QuestionCircleIcon className="size-4" aria-hidden />
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {children}
        </TooltipContent>
      </Tooltip>
    );
  });
TableTooltip.displayName = "TableTooltip";

/** A loading placeholder for one cell: a Well bar the height of a line of text. */
const TableSkeleton: ForwardRefExoticComponent<ComponentProps<"div">> =
  forwardRef(({ className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      className={clx("h-3 max-w-40 rounded-full", className)}
      {...props}
    />
  ));
TableSkeleton.displayName = "TableSkeleton";

const TableEmpty: ForwardRefExoticComponent<ComponentProps<"td">> = forwardRef(
  ({ className, children, colSpan = 100, ...props }, ref) => {
    return (
      <TableCell
        ref={ref}
        colSpan={colSpan}
        className={clx("text-txt-black-700 py-12 text-center", className)}
        {...props}
      >
        {children || "No data available"}
      </TableCell>
    );
  },
);
TableEmpty.displayName = "TableEmpty";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableTooltip,
  TableSkeleton,
  TableEmpty,
};
export type { TableCellProps };
