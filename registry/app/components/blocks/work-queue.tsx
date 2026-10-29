"use client";
// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  ReactNode,
  forwardRef,
  useId,
  useMemo,
  useRef,
} from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, InputIcon } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from "@/components/ui/table";
import { useShortcut, useShortcutScope } from "@/components/ui/shortcuts";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { CrossIcon } from "@/components/ui/icons/cross";
import { DownloadIcon } from "@/components/ui/icons/download";
import { SearchIcon } from "@/components/ui/icons/search";
import { UserIcon } from "@/components/ui/icons/user";
import { useControllableState } from "@/lib/ftds/hooks";
import { clx } from "@/lib/ftds/utils";

/**
 * WorkQueue is an officer's list of cases to work through: search, a status and an
 * assignee filter, a selectable table, a bulk-action bar that appears once rows are
 * selected, and paging. The app owns the data: the block shows what it is given and
 * reports every change through callbacks.
 *
 * Mark one column `primary`: its cell becomes the button that opens the case.
 * Inside a `ShortcutProvider` (or `DeskShell`) the queue binds `j`/`k` to move the
 * highlight, `Enter` to open it, `x` to select it and `/` to jump to search.
 *
 * @example
 * <WorkQueue
 *   items={cases}
 *   getId={(c) => c.id}
 *   columns={[
 *     { id: "ref", header: "Reference", cell: (c) => c.ref, primary: true },
 *     { id: "applicant", header: "Applicant", cell: (c) => c.applicant },
 *     { id: "status", header: "Status", cell: (c) => <Tag>{c.status}</Tag> },
 *   ]}
 *   statuses={[{ value: "all", label: "All statuses" }, { value: "pending", label: "Pending" }]}
 *   status={status}
 *   onStatusChange={setStatus}
 *   onOpen={(c) => navigate(`/cases/${c.id}`)}
 *   onAssign={(ids) => assignToMe(ids)}
 *   page={page}
 *   pageSize={25}
 *   total={128}
 *   onPageChange={setPage}
 * />
 */

type WorkQueueAssignee = "mine" | "unassigned" | "all";

interface WorkQueueColumn<T> {
  id: string;
  header: ReactNode;
  cell: (item: T) => ReactNode;
  /** The column that names the case. Its cell opens the case (button) when `onOpen` is set. */
  primary?: boolean;
  /** Classes for this column's header and cells, e.g. a width or `text-right`. */
  className?: string;
}

interface WorkQueueOption {
  value: string;
  label: string;
}

interface WorkQueueLabels {
  /** Accessible name of the queue table. */
  table: string;
  search: string;
  searchPlaceholder: string;
  status: string;
  assignee: string;
  mine: string;
  unassigned: string;
  all: string;
  /** "{count} cases". */
  results: string;
  /** "{count} selected". */
  selected: string;
  clearSelection: string;
  selectAll: string;
  selectRow: string;
  assign: string;
  changeStatus: string;
  export: string;
  empty: string;
  emptyFiltered: string;
  /** "{from}–{to} of {total}". */
  range: string;
  /** Accessible name of the paging controls. */
  pages: string;
  previousPage: string;
  nextPage: string;
}

const DEFAULT_LABELS: WorkQueueLabels = {
  table: "Case queue",
  search: "Search cases",
  searchPlaceholder: "Search by reference or name",
  status: "Status",
  assignee: "Assigned to",
  mine: "Mine",
  unassigned: "Unassigned",
  all: "All",
  results: "{count} cases",
  selected: "{count} selected",
  clearSelection: "Clear selection",
  selectAll: "Select all cases on this page",
  selectRow: "Select {name}",
  assign: "Assign to me",
  changeStatus: "Change status",
  export: "Export",
  empty: "No cases in this queue.",
  emptyFiltered:
    "No cases match these filters. Try another status or clear the search.",
  range: "{from}–{to} of {total}",
  pages: "Queue pages",
  previousPage: "Previous page",
  nextPage: "Next page",
};

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));

interface WorkQueueProps<T> extends Omit<ComponentProps<"div">, "children"> {
  /** The cases on the current page. */
  items: T[];
  getId: (item: T) => string;
  columns: WorkQueueColumn<T>[];
  /** Shows skeleton rows. */
  loading?: boolean;

  search?: string;
  onSearchChange?: (search: string) => void;
  /** Status filter options; the first is usually "All statuses". Omit to hide the filter. */
  statuses?: WorkQueueOption[];
  status?: string;
  onStatusChange?: (status: string) => void;
  /** Omit `onAssigneeChange` to hide the assignee filter. */
  assignee?: WorkQueueAssignee;
  onAssigneeChange?: (assignee: WorkQueueAssignee) => void;
  /** Whether any filter or search is applied (changes the empty message). */
  filtered?: boolean;

  /** Show the selection checkboxes and bulk actions. @default true */
  selectable?: boolean;
  /** Selected case ids (controlled). */
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  /** Bulk actions. Each button shows only when its callback is set. */
  onAssign?: (ids: string[]) => void;
  /** Targets for "Change status"; defaults to `statuses` without "all". */
  statusTargets?: WorkQueueOption[];
  onChangeStatus?: (ids: string[], status: string) => void;
  onExport?: (ids: string[]) => void;

  /** The highlighted case, moved with `j`/`k` (controlled). */
  activeId?: string;
  onActiveChange?: (id: string) => void;
  onOpen?: (item: T) => void;

  /** 1-based. Omit `onPageChange` to hide paging. */
  page?: number;
  pageSize?: number;
  /** Cases across all pages. Defaults to `items.length`. */
  total?: number;
  onPageChange?: (page: number) => void;

  /** Replaces the empty message. */
  emptyState?: ReactNode;
  /** Bind `j`/`k`/`Enter`/`x`/`/` when inside a `ShortcutProvider`. @default true */
  keyboard?: boolean;
  labels?: Partial<WorkQueueLabels>;
}

const WorkQueueInner = <T,>(
  {
    items,
    getId,
    columns,
    loading = false,
    search,
    onSearchChange,
    statuses,
    status,
    onStatusChange,
    assignee = "all",
    onAssigneeChange,
    filtered = false,
    selectable = true,
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    onAssign,
    statusTargets,
    onChangeStatus,
    onExport,
    activeId: activeIdProp,
    onActiveChange,
    onOpen,
    page = 1,
    pageSize = items.length || 1,
    total = items.length,
    onPageChange,
    emptyState,
    keyboard = true,
    labels: labelsProp,
    className,
    ...props
  }: WorkQueueProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const searchRef = useRef<HTMLInputElement>(null);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());
  const scope = `work-queue-${useId()}`;

  const [selected = [], setSelected] = useControllableState<string[]>({
    prop: selectedProp,
    defaultProp: defaultSelected ?? [],
    onChange: onSelectedChange,
  });
  const [activeId, setActiveId] = useControllableState<string | undefined>({
    prop: activeIdProp,
    defaultProp: undefined,
    onChange: (id) => id && onActiveChange?.(id),
  });

  const ids = useMemo(() => items.map(getId), [items, getId]);
  const selectedSet = new Set(selected);
  const allOnPage = ids.length > 0 && ids.every((id) => selectedSet.has(id));
  const someOnPage = ids.some((id) => selectedSet.has(id));

  const toggle = (id: string) =>
    setSelected(
      selectedSet.has(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );

  const move = (delta: number) => {
    if (ids.length === 0) return;
    const at = activeId ? ids.indexOf(activeId) : -1;
    // With no active row, j starts at the top and k at the bottom
    const from = at === -1 ? (delta > 0 ? -1 : ids.length) : at;
    const next = Math.min(ids.length - 1, Math.max(0, from + delta));
    const id = ids[next]!;
    setActiveId(id);
    rowRefs.current.get(id)?.scrollIntoView({ block: "nearest" });
  };

  const active = activeId ? items[ids.indexOf(activeId)] : undefined;

  useShortcutScope(scope, { active: keyboard, optional: true });
  const options = { scope, enabled: keyboard, optional: true };
  useShortcut("j", () => move(1), options);
  useShortcut("k", () => move(-1), options);
  useShortcut("enter", () => active && onOpen?.(active), {
    ...options,
    when: () => !!active && !!onOpen,
  });
  useShortcut("x", () => activeId && toggle(activeId), {
    ...options,
    enabled: keyboard && selectable,
    when: () => !!activeId,
  });
  useShortcut("/", () => searchRef.current?.focus(), {
    ...options,
    enabled: keyboard && !!onSearchChange,
  });

  const targets =
    statusTargets ?? statuses?.filter((option) => option.value !== "all") ?? [];
  const showAssignee = !!onAssigneeChange;
  const hasFilters =
    !!onSearchChange || !!(statuses && onStatusChange) || showAssignee;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, (page - 1) * pageSize + items.length);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const colSpan = columns.length + (selectable ? 1 : 0);
  const primary = columns.find((column) => column.primary);

  return (
    // Not a landmark: the page around the queue owns its region and heading; the
    // table inside carries the queue's name
    <div
      ref={ref}
      className={clx("font-body flex min-w-0 flex-col gap-3", className)}
      {...props}
    >
      {/* Filters (with none, e.g. a dashboard preview, the row is left out) */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {onSearchChange && (
            <Input
              ref={searchRef}
              type="search"
              aria-label={labels.search}
              placeholder={labels.searchPlaceholder}
              value={search ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(event) => {
                // Escape leaves the field so the queue keys work again
                if (event.key === "Escape") event.currentTarget.blur();
              }}
              className="w-full sm:w-72"
            >
              <InputIcon position="left">
                <SearchIcon />
              </InputIcon>
              {keyboard && (
                <InputIcon position="right">
                  <Kbd combo="/" aria-hidden />
                </InputIcon>
              )}
            </Input>
          )}
          {statuses && onStatusChange && (
            <Select
              size="small"
              variant="outline"
              value={status}
              onValueChange={(value) => onStatusChange(value)}
              items={statuses}
            >
              <SelectTrigger aria-label={labels.status} className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {showAssignee && (
            <ToggleGroup
              size="small"
              aria-label={labels.assignee}
              value={[assignee]}
              onValueChange={(value) => {
                const next = value[0] as WorkQueueAssignee | undefined;
                // A single-choice group: pressing the current option keeps it
                if (next) onAssigneeChange(next);
              }}
            >
              <Toggle value="mine">{labels.mine}</Toggle>
              <Toggle value="unassigned">{labels.unassigned}</Toggle>
              <Toggle value="all">{labels.all}</Toggle>
            </ToggleGroup>
          )}
          <p
            className="text-txt-black-700 text-label-compact ml-auto"
            aria-live="polite"
          >
            {fill(labels.results, { count: total })}
          </p>
        </div>
      )}

      {/* Bulk actions: on the Blue Wash so the selection reads as one state */}
      {selectable && selected.length > 0 && (
        <div
          role="toolbar"
          aria-label={fill(labels.selected, { count: selected.length })}
          className="bg-bg-primary-50 flex flex-wrap items-center gap-2 rounded-md px-3 py-1.5"
        >
          <span className="text-txt-primary text-label-md font-medium">
            {fill(labels.selected, { count: selected.length })}
          </span>
          <Button
            variant="default-ghost"
            size="small"
            iconOnly
            aria-label={labels.clearSelection}
            onClick={() => setSelected([])}
          >
            <CrossIcon className="size-4" aria-hidden />
          </Button>
          <div className="ml-auto flex flex-wrap gap-2">
            {onAssign && (
              <Button
                variant="default-outline"
                size="small"
                onClick={() => onAssign(selected)}
              >
                <UserIcon className="size-4" aria-hidden />
                {labels.assign}
              </Button>
            )}
            {onChangeStatus && targets.length > 0 && (
              <Menu>
                <MenuTrigger
                  render={<Button variant="default-outline" size="small" />}
                >
                  {labels.changeStatus}
                  <ChevronDownIcon className="size-4" aria-hidden />
                </MenuTrigger>
                <MenuContent align="end">
                  {targets.map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() => onChangeStatus(selected, option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuContent>
              </Menu>
            )}
            {onExport && (
              <Button
                variant="default-outline"
                size="small"
                onClick={() => onExport(selected)}
              >
                <DownloadIcon className="size-4" aria-hidden />
                {labels.export}
              </Button>
            )}
          </div>
        </div>
      )}

      <Table aria-label={labels.table} containerClassName="min-w-0">
        <TableHeader className="bg-bg-white z-10">
          <TableRow>
            {selectable && (
              <TableHead className="w-8 pl-3">
                <Checkbox
                  aria-label={labels.selectAll}
                  checked={allOnPage || (someOnPage && "indeterminate")}
                  disabled={ids.length === 0}
                  onCheckedChange={(checked) =>
                    setSelected(
                      checked
                        ? Array.from(new Set([...selected, ...ids]))
                        : selected.filter((id) => !ids.includes(id)),
                    )
                  }
                />
              </TableHead>
            )}
            {columns.map((column, i) => (
              <TableHead
                key={column.id}
                className={clx(
                  !selectable && i === 0 && "pl-3",
                  column.className,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }, (_, i) => (
              <TableRow key={i}>
                {Array.from({ length: colSpan }, (_, j) => (
                  <TableCell key={j} className={j === 0 ? "pl-3" : undefined}>
                    <TableSkeleton />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow>
              <TableEmpty colSpan={colSpan}>
                {emptyState ?? (filtered ? labels.emptyFiltered : labels.empty)}
              </TableEmpty>
            </TableRow>
          ) : (
            items.map((item) => {
              const id = getId(item);
              const isSelected = selectedSet.has(id);
              const isActive = id === activeId;
              // The primary cell names the row (checkbox label) and is rendered once
              const name = primary ? primary.cell(item) : id;
              return (
                <TableRow
                  key={id}
                  ref={(node) => {
                    if (node) rowRefs.current.set(id, node);
                    else rowRefs.current.delete(id);
                  }}
                  data-selected={isSelected || undefined}
                  data-active={isActive || undefined}
                  aria-selected={isSelected}
                  className={clx(
                    "hover:bg-bg-washed transition-colors duration-100 motion-reduce:transition-none",
                    // DESIGN.md: selection fills the row with the Blue Wash
                    "data-[selected]:bg-bg-primary-50",
                    // The keyboard highlight: an inset accent on the first cell
                    "data-[active]:*:first:shadow-[inset_2px_0_0_var(--color-primary-600)]",
                    "data-[active]:not-data-[selected]:bg-bg-washed",
                  )}
                  onClick={() => setActiveId(id)}
                >
                  {selectable && (
                    <TableCell className="pl-3">
                      <Checkbox
                        aria-label={fill(labels.selectRow, {
                          name: typeof name === "string" ? name : id,
                        })}
                        checked={isSelected}
                        onCheckedChange={() => toggle(id)}
                        onClick={(event) => event.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, i) => (
                    <TableCell
                      key={column.id}
                      className={clx(
                        !selectable && i === 0 && "pl-3",
                        column.className,
                      )}
                    >
                      {column.primary && onOpen ? (
                        <button
                          type="button"
                          className="text-txt-primary focus-ring cursor-pointer rounded-sm text-left font-medium hover:underline"
                          onClick={(event) => {
                            event.stopPropagation();
                            setActiveId(id);
                            onOpen(item);
                          }}
                        >
                          {name}
                        </button>
                      ) : column.primary ? (
                        name
                      ) : (
                        column.cell(item)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {onPageChange && total > 0 && (
        <nav
          aria-label={labels.pages}
          className="text-txt-black-700 text-label-compact flex items-center justify-end gap-2"
        >
          <span>{fill(labels.range, { from, to, total })}</span>
          <Button
            variant="default-ghost"
            size="small"
            iconOnly
            aria-label={labels.previousPage}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon className="size-4" aria-hidden />
          </Button>
          <Button
            variant="default-ghost"
            size="small"
            iconOnly
            aria-label={labels.nextPage}
            disabled={page >= lastPage}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRightIcon className="size-4" aria-hidden />
          </Button>
        </nav>
      )}
    </div>
  );
};

/** Generic over the case type; see the module docs. */
const WorkQueue = forwardRef(WorkQueueInner) as (<T>(
  props: WorkQueueProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => ReturnType<typeof WorkQueueInner>) & { displayName?: string };
WorkQueue.displayName = "WorkQueue";

export { WorkQueue };
export type {
  WorkQueueProps,
  WorkQueueColumn,
  WorkQueueOption,
  WorkQueueAssignee,
  WorkQueueLabels,
};
