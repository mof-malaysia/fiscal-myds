import {
  type Table as TTable,
  type Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFacetedUniqueValues,
  RowData,
  RowSelectionState,
  createColumnHelper,
  Row,
  CellContext,
  ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
  TableTooltip,
} from "@/components/ui/table";
import {
  createContext,
  CSSProperties,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { ColumnCollapseIcon } from "@/components/ui/icons/column-collapse";
import { ColumnExpandIcon } from "@/components/ui/icons/column-expand";
import { clx, pick } from "@/lib/ftds/utils";
import { ArrowDownIcon } from "@/components/ui/icons/arrow-down";
import { ArrowUpIcon } from "@/components/ui/icons/arrow-up";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { CrossIcon } from "@/components/ui/icons/cross";
import { Checkbox } from "@/components/ui/checkbox";

/**
 * DataTable is the officer's home screen, built to be looked at all day (DESIGN.md,
 * Data Table). It renders `Table` from TanStack Table column definitions and adds:
 *
 * - Sorting (`meta.sortable`): the header label is the button; an arrow shows the
 *   direction, and the header carries `aria-sort`.
 * - Row hover in Well and selection (`selection.mode`) in the Blue Wash.
 * - Amounts (`meta.numeric`): right-aligned in tabular figures.
 * - Truncated columns (`meta.expandable`) that widen on demand, header help
 *   (`meta.tooltip`), nested rows (`nest` with `Cell.Expand`), pinned columns, a
 *   footer, and loading and empty states.
 *
 * Accessible names default to English; pass `labels` for Bahasa Melayu.
 */

/**
 * Way to define the ColumnMeta type in @tanstack/react-table
 * @see https://tanstack.com/table/v8/docs/api/core/column-def#meta
 */
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: {
      header?: string;
      cell?: string;
    };
    sortable?: boolean;
    expandable?: boolean;
    /** Right-aligns the column in tabular figures, for amounts and counts. */
    numeric?: boolean;
    tooltip?: ReactNode;
  }
}

interface DataTableLabels {
  /** Name of the selection column's header. */
  selection: string;
  /** The header checkbox. */
  selectAll: string;
  /** Each row's checkbox or radio. */
  selectRow: string;
  /** The header button that clears a radio selection. */
  clearSelection: string;
  /** The header button that shows a truncated column in full. */
  widenColumn: string;
  /** The header button that truncates a widened column again. */
  narrowColumn: string;
  /** The row button that shows nested rows. */
  expandRow: string;
  /** The row button that hides nested rows. */
  collapseRow: string;
  /** The help icon a column's `meta.tooltip` adds. */
  columnHelp: string;
}

const DEFAULT_LABELS: DataTableLabels = {
  selection: "Selection",
  selectAll: "Select all rows",
  selectRow: "Select row",
  clearSelection: "Clear selection",
  widenColumn: "Show full text",
  narrowColumn: "Truncate text",
  expandRow: "Show nested rows",
  collapseRow: "Hide nested rows",
  columnHelp: "More information",
};

interface DataTableProps<TData extends Record<string, any>> {
  className?: string;
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  selection?: {
    id_by: keyof TData;
    mode: "checkbox" | "radio";
    onSelectionChange?: (value: string[]) => void;
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
    enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean);
  };
  pin?: {
    left?: string[];
    right?: string[];
  };
  nest?: {
    id_by: keyof TData;
  };
  emptyState?: ReactNode;
  /** Accessible names for the table's controls. */
  labels?: Partial<DataTableLabels>;
}

/**
 * Pinned columns stick to their edge with an opaque fill that follows the row's hover
 * and selection, and a Hairline where they meet the scrolling columns. Each pinned cell
 * also paints 1px past its edge in its own fill, covering the sub-pixel seam left when
 * the browser rounds column widths away from the sticky offsets.
 */
const pinning = <TData extends Record<string, any>>(
  column: Column<TData>,
  body: boolean,
): { className?: string; style?: CSSProperties } => {
  const side = column.getIsPinned();
  if (!side) return {};
  const last = column.getIsLastColumn(side);
  return {
    className: clx(
      "sticky z-10",
      side === "left"
        ? "before:absolute before:inset-y-0 before:-left-px before:w-px before:bg-inherit before:content-['']"
        : "after:absolute after:inset-y-0 after:-right-px after:w-px after:bg-inherit after:content-['']",
      body &&
        "bg-bg-white group-hover/row:bg-bg-washed group-data-[selected]/row:bg-bg-primary-50",
      last &&
        (side === "left"
          ? "border-r border-r-otl-gray-200"
          : "border-l border-l-otl-gray-200"),
    ),
    style: {
      left: side === "left" ? `${column.getStart("left")}px` : undefined,
      right: side === "right" ? `${column.getAfter("right")}px` : undefined,
      width: column.getSize(),
    },
  };
};

const cell_class = clx(
  "md:whitespace-nowrap whitespace-normal break-words",
  "data-[expanded=false]:truncate data-[expanded=false]:max-w-[230px]",
);

/** Quiet icon button for header and row controls: unboxed, Well on hover. */
const icon_button =
  "text-txt-black-700 hover:text-txt-black-900 hover:bg-bg-washed-active inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 motion-reduce:transition-none focus-ring [&>svg]:size-4";

interface DataTableContextProps<TData extends Record<string, any>> {
  table: TTable<TData> | null;
  expandableColumns: Record<string, any>;
  toggleColumnWidth: (columnId: string) => void;
  loading?: DataTableProps<TData>["loading"];
  emptyState?: DataTableProps<TData>["emptyState"];
  labels: DataTableLabels;
  /** Names the radio group so arrow keys move between rows. */
  radioName: string;
}

const DataTableContext = createContext<DataTableContextProps<any>>({
  table: null,
  expandableColumns: {},
  toggleColumnWidth: () => {},
  labels: DEFAULT_LABELS,
  radioName: "",
});

interface DataTableProviderProps<
  TData extends Record<string, any>,
> extends DataTableProps<TData> {
  children: ReactNode;
}
const DataTableProvider = <TData extends Record<string, any>>({
  children,
  className,
  labels: labelsProp,
  ...props
}: DataTableProviderProps<TData>) => {
  const { columns, data, selection, pin, nest, loading } = props;
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const radioName = useId();
  const [expandableColumns, setExpandableColumns] = useState(
    pick(columns, "id", () => false),
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expandedSelection, setExpandedSelection] = useState<ExpandedState>({});

  const toggleColumnWidth = (columnId: string) => {
    setExpandableColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  const _columns = useMemo(() => {
    switch (selection?.mode) {
      case "checkbox":
        return [Column.Checkbox<TData>(), ...columns];
      case "radio":
        return [Column.Radio<TData>(), ...columns];
      default:
        return columns;
    }
  }, [columns, selection?.mode]);

  const table = useReactTable<TData>({
    data,
    columns: _columns,
    state: {
      expanded: expandedSelection,
      rowSelection: rowSelection,
      columnPinning: {
        left: pin?.left,
        right: pin?.right,
      },
    },
    enableRowSelection: selection?.enableRowSelection,
    enableSubRowSelection: selection?.enableSubRowSelection,
    enableMultiRowSelection: selection?.mode === "checkbox",
    getRowId: selection?.id_by
      ? (row) => row[selection.id_by] as string
      : undefined,
    getSubRows: nest ? (row) => row[nest.id_by] : undefined,
    onExpandedChange: setExpandedSelection,
    onRowSelectionChange: setRowSelection,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: false,
    debugHeaders: false,
  });

  // Report only when the selection changes, not when the callback's identity does
  useEffect(() => {
    selection?.onSelectionChange?.(Object.keys(rowSelection));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  return (
    <DataTableContext.Provider
      value={{
        table,
        expandableColumns,
        toggleColumnWidth,
        labels,
        radioName,
        ...props,
      }}
    >
      <Table
        containerClassName={className}
        aria-busy={loading || undefined}
        style={{
          width: props.pin ? table.getTotalSize() : undefined,
        }}
      >
        {children}
      </Table>
    </DataTableContext.Provider>
  );
};

const ariaSort = {
  asc: "ascending",
  desc: "descending",
} as const;

const DataTableHeader: FunctionComponent = () => {
  const { table, expandableColumns, toggleColumnWidth, labels } =
    useContext(DataTableContext);

  if (!table) return null;

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const { tooltip, expandable, sortable, numeric } =
                header.column.columnDef.meta || {};
              const sorted = header.column.getIsSorted();
              const isSelection =
                header.column.id === "_checkbox" ||
                header.column.id === "_radio";
              const label = flexRender(
                header.column.columnDef.header,
                header.getContext(),
              );
              const SortIcon = sorted === "desc" ? ArrowDownIcon : ArrowUpIcon;
              const pin = pinning(header.column, false);

              // A grouped header's filler above an ungrouped column: a cell, not an empty header
              if (header.isPlaceholder)
                return (
                  <td
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clx("bg-bg-gray-50", pin.className)}
                    style={pin.style}
                  />
                );

              return (
                <TableHead
                  id={header.id}
                  key={header.id}
                  colSpan={header.colSpan}
                  numeric={numeric}
                  aria-sort={
                    sortable ? (sorted ? ariaSort[sorted] : "none") : undefined
                  }
                  data-expanded={expandableColumns[header.id]}
                  data-pinned={header.column.getIsPinned()}
                  className={clx(
                    "group/head",
                    pin.className,
                    header.column.columnDef.meta?.className?.header,
                  )}
                  style={pin.style}
                >
                  {isSelection && (
                    <span className="sr-only">{labels.selection}</span>
                  )}
                  <div
                    className={clx(
                      "flex w-full items-center gap-1 whitespace-nowrap",
                      numeric && "justify-end",
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        data-sorted={sorted || undefined}
                        className={clx(
                          "-mx-1 inline-flex cursor-pointer items-center gap-1 rounded-sm px-1 font-medium",
                          "hover:text-txt-black-900 data-[sorted]:text-txt-black-900 focus-ring transition-colors duration-150 motion-reduce:transition-none",
                          numeric && "flex-row-reverse",
                        )}
                      >
                        {label}
                        <SortIcon
                          aria-hidden
                          className={clx(
                            "size-3.5 shrink-0 transition-opacity duration-150 motion-reduce:transition-none",
                            sorted
                              ? "opacity-100"
                              : "opacity-0 group-focus-within/head:opacity-60 group-hover/head:opacity-60",
                          )}
                        />
                      </button>
                    ) : (
                      label
                    )}

                    {tooltip && (
                      <TableTooltip label={labels.columnHelp}>
                        {tooltip}
                      </TableTooltip>
                    )}

                    {expandable && (
                      <button
                        type="button"
                        aria-label={
                          expandableColumns[header.id]
                            ? labels.narrowColumn
                            : labels.widenColumn
                        }
                        aria-pressed={Boolean(expandableColumns[header.id])}
                        onClick={() => toggleColumnWidth(header.id)}
                        className={clx(
                          icon_button,
                          !numeric && "ml-auto",
                          "max-lg:hidden",
                          // Shown on hover or focus; stays reachable by keyboard
                          "opacity-0 group-hover/head:opacity-100 focus-visible:opacity-100 aria-pressed:opacity-100",
                        )}
                      >
                        {expandableColumns[header.id] ? (
                          <ColumnCollapseIcon />
                        ) : (
                          <ColumnExpandIcon />
                        )}
                      </button>
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        );
      })}
    </TableHeader>
  );
};

const DataTableBody: FunctionComponent = () => {
  const { table, expandableColumns, loading, emptyState } =
    useContext(DataTableContext);

  if (!table)
    throw new Error("Table instance failed to initialize. Please check");

  return (
    <TableBody>
      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            {table.getAllLeafColumns().map((column) => (
              <TableCell key={column.id}>
                <TableSkeleton />
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : table?.getRowModel()?.rows?.length > 0 ? (
        table.getRowModel().rows.map((row) => {
          return (
            <TableRow
              key={row.id}
              data-selected={row.getIsSelected() || undefined}
              className={clx(
                "group/row hover:bg-bg-washed transition-colors duration-100 motion-reduce:transition-none",
                "data-[selected]:hover:bg-bg-primary-50",
              )}
            >
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell
                    id={cell.id}
                    key={cell.id}
                    numeric={cell.column.columnDef.meta?.numeric}
                    data-expanded={expandableColumns[cell.column.id]}
                    data-pinned={cell.column.getIsPinned()}
                    className={clx(
                      cell_class,
                      pinning(cell.column, true).className,
                      cell.column.columnDef.meta?.className?.cell,
                    )}
                    style={pinning(cell.column, true).style}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <TableRow>
          <TableEmpty colSpan={table.getAllLeafColumns().length}>
            {emptyState || "No data available"}
          </TableEmpty>
        </TableRow>
      )}
    </TableBody>
  );
};

const DataTableFooter: FunctionComponent = () => {
  const { table, expandableColumns } = useContext(DataTableContext);

  if (!table) return null;

  const footers = table
    .getFooterGroups()
    .map((group) =>
      group.headers.map((header) => header.column.columnDef.footer),
    )
    .flat()
    .filter(Boolean);

  if (footers.length === 0) return;

  return (
    <TableFooter>
      {table.getFooterGroups().map((footerGroup) => (
        <TableRow key={footerGroup.id}>
          {footerGroup.headers.map((header) => (
            <TableCell
              key={header.id}
              colSpan={header.colSpan}
              numeric={header.column.columnDef.meta?.numeric}
              data-expanded={expandableColumns[header.column.id]}
              data-pinned={header.column.getIsPinned()}
              className={clx(
                cell_class,
                pinning(header.column, true).className,
                header.column.columnDef.meta?.className?.cell,
              )}
              style={pinning(header.column, true).style}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
};

const SelectAllCheckbox = <TData extends Record<string, any>>({
  table,
}: {
  table: TTable<TData>;
}) => {
  const { labels } = useContext(DataTableContext);
  return (
    <Checkbox
      checked={
        table.getIsAllRowsSelected() ||
        (table.getIsSomeRowsSelected() && "indeterminate")
      }
      aria-label={labels.selectAll}
      onClick={table.getToggleAllRowsSelectedHandler()}
    />
  );
};

const SelectRowCheckbox = <TData extends Record<string, any>>({
  row,
}: {
  row: Row<TData>;
}) => {
  const { labels } = useContext(DataTableContext);
  return (
    <Checkbox
      checked={row.getIsSelected()}
      value={row.id}
      disabled={!row.getCanSelect()}
      aria-label={labels.selectRow}
      onClick={row.getToggleSelectedHandler()}
    />
  );
};

const ClearSelectionButton = <TData extends Record<string, any>>({
  table,
}: {
  table: TTable<TData>;
}) => {
  const { labels } = useContext(DataTableContext);
  const hasSelection = table.getIsSomeRowsSelected();
  return (
    <button
      type="button"
      aria-label={labels.clearSelection}
      onClick={() => table.resetRowSelection(false)}
      // Nothing to clear: hidden and out of the tab order
      className={clx(icon_button, !hasSelection && "invisible")}
    >
      <CrossIcon aria-hidden />
    </button>
  );
};

const SelectRowRadio = <TData extends Record<string, any>>({
  row,
}: {
  row: Row<TData>;
}) => {
  const { labels, radioName } = useContext(DataTableContext);
  return (
    <input
      type="radio"
      name={radioName}
      aria-label={labels.selectRow}
      value={row.id}
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={() => row.toggleSelected(true)}
      className={clx(
        // Matches Checkbox: Control Edge stroke, FTDS Blue when checked
        "border-otl-control hover:border-otl-control-hover bg-bg-white block size-4 shrink-0 cursor-pointer appearance-none rounded-full border-[1.5px]",
        "checked:border-bg-primary-600 checked:hover:border-bg-primary-700 checked:border-[5px]",
        "transition-[border] duration-150 motion-reduce:transition-none",
        "focus-ring",
        "disabled:bg-bg-washed disabled:cursor-not-allowed disabled:opacity-30",
      )}
    />
  );
};

const CheckboxColumn = <TData extends Record<string, any>>() => {
  const columnHelper = createColumnHelper<TData>();
  return columnHelper.display({
    id: "_checkbox",
    size: 46,
    enableResizing: true,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => <SelectRowCheckbox row={row} />,
  });
};

const RadioColumn = <TData extends Record<string, any>>() => {
  const columnHelper = createColumnHelper<TData>();
  return columnHelper.display({
    id: "_radio",
    size: 46,
    enableResizing: false,
    header: ({ table }) => <ClearSelectionButton table={table} />,
    cell: ({ row }) => <SelectRowRadio row={row} />,
  });
};

const ExpandToggle = <TData extends Record<string, any>>({
  row,
}: {
  row: Row<TData>;
}) => {
  const { labels } = useContext(DataTableContext);
  const expanded = row.getIsExpanded();
  return (
    <button
      type="button"
      aria-label={expanded ? labels.collapseRow : labels.expandRow}
      aria-expanded={expanded}
      onClick={row.getToggleExpandedHandler()}
      className={icon_button}
    >
      <ChevronRightIcon
        aria-hidden
        className={clx(
          "transition-transform duration-150 motion-reduce:transition-none",
          expanded && "rotate-90",
        )}
      />
    </button>
  );
};

const ExpandCell = <TData extends Record<string, any>>(
  { row, getValue, table }: CellContext<TData, unknown>,
  cell?: ReactNode,
) => {
  const useDefault = !cell || JSON.stringify(cell) === JSON.stringify({});
  return (
    <div
      className="flex items-center gap-1"
      style={{ paddingLeft: `${row.depth * 1.75}rem` }}
    >
      {row.getCanExpand() ? (
        <ExpandToggle row={row} />
      ) : (
        // Keeps rows without children aligned with their siblings
        table.getCanSomeRowsExpand() && (
          <span aria-hidden className="size-6 shrink-0" />
        )
      )}
      {useDefault ? (getValue() as string) : cell}
    </div>
  );
};

/**
 * Reserved columns for DataTable
 */
const Column = {
  Checkbox: CheckboxColumn,
  Radio: RadioColumn,
};

/**
 * Reserved cells for DataTable
 */
const Cell = {
  Expand: ExpandCell,
};

const DataTable = <TData extends Record<string, any>>(
  props: DataTableProps<TData>,
) => {
  return (
    <DataTableProvider<TData> {...props}>
      <DataTableHeader />
      <DataTableBody />
      <DataTableFooter />
    </DataTableProvider>
  );
};
DataTable.displayName = "DataTable";

export { DataTable, Cell, type ColumnDef, type DataTableLabels };
