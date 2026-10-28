import { QuestionCircleIcon } from "../../icons";
import { clx } from "../../utils";
import { forwardRef, ForwardRefExoticComponent, ComponentProps } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../core/tooltip";

const Table: ForwardRefExoticComponent<ComponentProps<"table">> = forwardRef(
  ({ className, ...props }, ref) => (
    <div className={clx("relative w-full overflow-auto", className)}>
      <table
        ref={ref}
        className="w-full caption-bottom border-separate border-spacing-0 text-sm"
        {...props}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader: ForwardRefExoticComponent<ComponentProps<"thead">> =
  forwardRef(({ className, ...props }, ref) => (
    <thead ref={ref} className={clx("sticky top-0", className)} {...props} />
  ));
TableHeader.displayName = "TableHeader";

const TableBody: ForwardRefExoticComponent<ComponentProps<"tbody">> =
  forwardRef(({ className, ...props }, ref) => (
    <tbody ref={ref} className={clx(className)} {...props} />
  ));
TableBody.displayName = "TableBody";

const TableFooter: ForwardRefExoticComponent<ComponentProps<"tfoot">> =
  forwardRef(({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={clx(
        "font-medium",
        "[&_td]:border-otl-gray-200 [&_td]:border-t",
        className,
      )}
      {...props}
    />
  ));
TableFooter.displayName = "TableFooter";

const TableRow: ForwardRefExoticComponent<ComponentProps<"tr">> = forwardRef(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={clx(
        // One hairline per row, header included (DESIGN.md, Data Table)
        "*:border-otl-gray-200 *:border-b",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead: ForwardRefExoticComponent<ComponentProps<"th">> = forwardRef(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={clx(
        "text-txt-black-700 py-(--cell-py) pr-3 text-left align-middle text-label-compact font-medium",
        "[&:has([role=checkbox])]:w-8 [&:has([role=checkbox])]:pl-1",
        "[&:has([role=radio])]:w-8 [&:has([role=radio])]:pl-1",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell: ForwardRefExoticComponent<ComponentProps<"td">> = forwardRef(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      role="gridcell"
      tabIndex={-1}
      className={clx(
        // Row height follows data-density: 48px comfortable, 40px compact
        "border-otl-gray-200 text-txt-black-900 text-content border-b py-(--cell-py) pr-3 align-middle",
        // Cells holding a control (row actions) keep rows tight: 52px comfortable, 40px compact
        "[&:has(button)]:py-1",
        "focus-visible:outline-primary-600/20 rounded-[1px] focus:z-20 focus-visible:outline-[3px] focus-visible:outline-offset-0",
        "[&:has([role=checkbox])]:w-8 [&:has([role=checkbox])]:pl-1",
        "[&:has([role=radio])]:w-8 [&:has([role=radio])]:pl-1",
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption: ForwardRefExoticComponent<ComponentProps<"caption">> =
  forwardRef(({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={clx("text-txt-black-500 mt-4 text-sm", className)}
      {...props}
    />
  ));
TableCaption.displayName = "TableCaption";

const TableTooltip: ForwardRefExoticComponent<ComponentProps<typeof Tooltip>> =
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  forwardRef(({ children, ...props }, ref) => {
    return (
      <Tooltip {...props}>
        <TooltipTrigger aria-label="Tooltip">
          <QuestionCircleIcon className="text-txt-black-500 size-4 cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          {children}
        </TooltipContent>
      </Tooltip>
    );
  });
TableTooltip.displayName = "TableTooltip";

const TableSkeleton: ForwardRefExoticComponent<ComponentProps<"div">> =
  forwardRef(({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "animate-shimmer direction-reverse from-bg-black-100 via-bg-black-300 to-bg-black-100 min-h-3 w-full rounded-full bg-gradient-to-r bg-[length:200%_50%]",
          className,
        )}
        {...props}
      />
    );
  });

TableSkeleton.displayName = "TableSkeleton";

const TableEmpty: ForwardRefExoticComponent<ComponentProps<"td">> = forwardRef(
  ({ className, children, colSpan = 100, ...props }, ref) => {
    return (
      <TableCell
        ref={ref}
        colSpan={colSpan}
        className={clx("text-txt-black-500 py-8 text-center", className)}
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
