"use client";
// registry:block — composed page section, installs to components/blocks
import React, {
  ComponentProps,
  ComponentType,
  ReactNode,
  SVGProps,
  forwardRef,
} from "react";
import { Button } from "../core/button";
import { Toggle } from "../core/toggle";
import { ToggleGroup } from "../core/toggle-group";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "./empty-state";
import { BellIcon } from "../../icons/bell";
import { CalendarIcon } from "../../icons/calendar";
import { CheckCircleIcon } from "../../icons/check-circle";
import { DocumentIcon } from "../../icons/document";
import { InfoIcon } from "../../icons/info";
import { MoneyIcon } from "../../icons/money";
import { WarningCircleIcon } from "../../icons/warning-circle";
import { useControllableState } from "../../hooks";
import { clx } from "../../utils";

/**
 * NotificationList is an inbox of updates: grouped by day (Today, Yesterday,
 * then dates), each with an icon for its kind, a title, a short body and the
 * time. Unread items carry a dot, a bold title and the words "Unread" for
 * screen readers, so status never rests on colour alone.
 *
 * A filter switches between all and unread items; "Mark all as read" clears
 * them. The list renders what it is given: update `read` in your data when
 * `onMarkRead` or `onMarkAllRead` is called.
 *
 * @example
 * <NotificationList
 *   items={[
 *     { id: "1", kind: "payment", title: "Payment received", body: "RM 120.00 for road tax.", date: "2026-10-28T09:14:00+08:00" },
 *   ]}
 *   onSelect={(id) => open(id)}
 *   onMarkRead={(id) => markRead(id)}
 *   onMarkAllRead={markAllRead}
 * />
 */

type NotificationKind =
  | "info"
  | "success"
  | "warning"
  | "payment"
  | "document"
  | "deadline";

interface NotificationItem {
  id: string;
  /** Picks the icon. @default "info" */
  kind?: NotificationKind;
  title: ReactNode;
  body?: ReactNode;
  /** When it arrived. A `Date` or an ISO string. */
  date: Date | string;
  read?: boolean;
  /** Where choosing the item goes. Without it, choosing calls `onSelect` only. */
  href?: string;
}

type NotificationFilter = "all" | "unread";

interface NotificationListLabels {
  today: string;
  yesterday: string;
  /** Accessible name of the filter. */
  filter: string;
  all: string;
  unread: string;
  markAllRead: string;
  markRead: string;
  /** Read out before an unread item's title. */
  unreadItem: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyUnreadTitle: string;
  emptyUnreadDescription: string;
}

const DEFAULT_LABELS: NotificationListLabels = {
  today: "Today",
  yesterday: "Yesterday",
  filter: "Show",
  all: "All",
  unread: "Unread",
  markAllRead: "Mark all as read",
  markRead: "Mark as read",
  unreadItem: "Unread",
  emptyTitle: "No notifications yet",
  emptyDescription:
    "Updates about your applications, payments and deadlines will appear here.",
  emptyUnreadTitle: "You're all caught up",
  emptyUnreadDescription: "You have read every notification.",
};

const KIND_ICONS: Record<
  NotificationKind,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningCircleIcon,
  payment: MoneyIcon,
  document: DocumentIcon,
  deadline: CalendarIcon,
};

const KIND_TONE: Record<NotificationKind, string> = {
  info: "text-txt-black-700",
  success: "text-txt-success",
  warning: "text-txt-warning",
  payment: "text-txt-primary",
  document: "text-txt-black-700",
  deadline: "text-txt-warning",
};

interface NotificationListProps extends Omit<
  ComponentProps<"div">,
  "onSelect"
> {
  items: NotificationItem[];
  /** The filter (controlled). */
  filter?: NotificationFilter;
  /** @default "all" */
  defaultFilter?: NotificationFilter;
  onFilterChange?: (filter: NotificationFilter) => void;
  /** Called when an item is chosen. */
  onSelect?: (id: string) => void;
  /** Shows a "Mark as read" button on unread items. */
  onMarkRead?: (id: string) => void;
  /** Shows "Mark all as read" above the list. */
  onMarkAllRead?: () => void;
  /** Hides the filter and "Mark all as read" row. */
  hideToolbar?: boolean;
  /** "Today" for grouping. Pass a fixed date in tests and stories. */
  now?: Date;
  /** Locale for dates and times. @default "en-MY" */
  locale?: string;
  /** Heading level of the day groups, to fit the page outline. @default "h2" */
  groupHeading?: "h2" | "h3" | "h4";
  labels?: Partial<NotificationListLabels>;
}

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const NotificationList = forwardRef<HTMLDivElement, NotificationListProps>(
  (
    {
      items,
      filter: filterProp,
      defaultFilter = "all",
      onFilterChange,
      onSelect,
      onMarkRead,
      onMarkAllRead,
      hideToolbar = false,
      now: nowProp,
      locale = "en-MY",
      groupHeading: GroupHeading = "h2",
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const [filter = "all", setFilter] = useControllableState({
      prop: filterProp,
      defaultProp: defaultFilter,
      onChange: onFilterChange,
    });

    const unreadCount = items.filter((item) => !item.read).length;
    const visible =
      filter === "unread" ? items.filter((item) => !item.read) : items;

    const now = nowProp ?? new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const dayFormat = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const olderDayFormat = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const groups: {
      key: string;
      label: string;
      entries: { item: NotificationItem; date: Date }[];
    }[] = [];
    visible
      .map((item) => ({ item, date: new Date(item.date) }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .forEach((entry) => {
        const key = dayKey(entry.date);
        let group = groups.find((g) => g.key === key);
        if (!group) {
          const label =
            key === dayKey(now)
              ? labels.today
              : key === dayKey(yesterday)
                ? labels.yesterday
                : entry.date.getFullYear() === now.getFullYear()
                  ? dayFormat.format(entry.date)
                  : olderDayFormat.format(entry.date);
          group = { key, label, entries: [] };
          groups.push(group);
        }
        group.entries.push(entry);
      });

    const timeFormat = new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <div
        ref={ref}
        className={clx("font-body text-txt-black-900 w-full", className)}
        {...props}
      >
        {!hideToolbar && (
          <div className="mb-stack-md gap-stack-sm flex flex-wrap items-center justify-between">
            <ToggleGroup
              aria-label={labels.filter}
              value={[filter]}
              onValueChange={(value) => {
                // A segmented control keeps one segment pressed
                if (value[0]) setFilter(value[0] as NotificationFilter);
              }}
            >
              <Toggle value="all">{labels.all}</Toggle>
              <Toggle value="unread">
                {labels.unread}
                {unreadCount > 0 && (
                  <span className="text-txt-black-700 tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </Toggle>
            </ToggleGroup>
            {onMarkAllRead && (
              <Button
                variant="default-ghost"
                size="small"
                disabled={unreadCount === 0}
                onClick={onMarkAllRead}
              >
                {labels.markAllRead}
              </Button>
            )}
          </div>
        )}

        {groups.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <BellIcon />
            </EmptyStateIcon>
            <EmptyStateTitle as="p">
              {filter === "unread" && items.length > 0
                ? labels.emptyUnreadTitle
                : labels.emptyTitle}
            </EmptyStateTitle>
            <EmptyStateDescription>
              {filter === "unread" && items.length > 0
                ? labels.emptyUnreadDescription
                : labels.emptyDescription}
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <div className="gap-stack-lg flex flex-col">
            {groups.map((group) => (
              <section key={group.key} aria-label={group.label}>
                <GroupHeading className="text-label-compact text-txt-black-700 mb-1 px-3 font-medium">
                  {group.label}
                </GroupHeading>
                <ul className="m-0 flex list-none flex-col p-0">
                  {group.entries.map(({ item, date }) => {
                    const kind = item.kind ?? "info";
                    const Icon = KIND_ICONS[kind];
                    const unread = !item.read;
                    const Title = item.href ? "a" : "button";
                    return (
                      <li
                        key={item.id}
                        className={clx(
                          "group/notification relative flex gap-3 rounded-md px-3 py-3",
                          "hover:bg-bg-washed transition-colors duration-150 motion-reduce:transition-none",
                          "has-[[data-notification-title]:focus-visible]:bg-bg-washed",
                        )}
                      >
                        <span
                          aria-hidden
                          className={clx(
                            "bg-bg-washed group-hover/notification:bg-bg-white mt-0.5 grid size-8 shrink-0 place-content-center rounded-full",
                            "[&>svg]:size-4",
                            KIND_TONE[kind],
                          )}
                        >
                          <Icon />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <div className="flex items-start justify-between gap-3">
                            <Title
                              data-notification-title=""
                              {...(item.href
                                ? { href: item.href }
                                : { type: "button" as const })}
                              onClick={() => onSelect?.(item.id)}
                              className={clx(
                                "text-content text-txt-black-900 min-w-0 cursor-pointer bg-transparent p-0 text-left no-underline outline-none",
                                // The whole row is the target; the stretched pseudo-element keeps one tab stop
                                "after:absolute after:inset-0 after:rounded-md after:content-['']",
                                "focus-visible:after:outline-2 focus-visible:after:outline-offset-[-2px] focus-visible:after:outline-[rgb(var(--fr-primary))] focus-visible:after:outline-solid",
                                unread ? "font-semibold" : "font-normal",
                              )}
                            >
                              {unread && (
                                <span className="sr-only">
                                  {labels.unreadItem}:{" "}
                                </span>
                              )}
                              {item.title}
                            </Title>
                            <span className="flex shrink-0 items-center gap-2 pt-0.5">
                              <time
                                dateTime={date.toISOString()}
                                className="text-label-compact text-txt-black-700 tabular-nums"
                              >
                                {timeFormat.format(date)}
                              </time>
                              {unread && (
                                <span
                                  aria-hidden
                                  className="bg-txt-primary size-2 rounded-full"
                                />
                              )}
                            </span>
                          </div>
                          {item.body && (
                            <p className="text-content text-txt-black-700 m-0">
                              {item.body}
                            </p>
                          )}
                          {unread && onMarkRead && (
                            <div className="relative z-10 mt-1">
                              <Button
                                variant="default-ghost"
                                size="small"
                                className="-ml-3"
                                onClick={() => onMarkRead(item.id)}
                              >
                                {labels.markRead}
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    );
  },
);
NotificationList.displayName = "NotificationList";

export { NotificationList };
export type {
  NotificationListProps,
  NotificationListLabels,
  NotificationItem,
  NotificationKind,
  NotificationFilter,
};
