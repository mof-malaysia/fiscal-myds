// registry:block — composed page section, installs to components/blocks

import React, {
  ComponentProps,
  ReactElement,
  ReactNode,
  forwardRef,
  useId,
} from "react";
import { button_cva } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { DocumentIcon } from "@/components/ui/icons/document";
import { clx } from "@/lib/ftds/utils";

/**
 * ApplicationList shows a citizen's applications on their dashboard: what each one
 * is, its reference and date, where it stands in plain words, and the one thing
 * they can do next (Continue a draft, Respond to a request, View the rest).
 * Applications that need the citizen come first only if you sort them that way;
 * the list keeps your order.
 *
 * With no items it shows an empty state with an optional way to start one.
 *
 * @example
 * <ApplicationList
 *   items={[
 *     {
 *       id: "1",
 *       title: "Individual tax relief",
 *       reference: "KK-2026-0412",
 *       date: new Date("2026-10-12"),
 *       status: "action-needed",
 *       href: "/applications/KK-2026-0412",
 *     },
 *   ]}
 *   emptyAction={<Button render={<a href="/apply" />}>Start an application</Button>}
 * />
 */

type ApplicationStatus =
  | "draft"
  | "submitted"
  | "in-review"
  | "action-needed"
  | "approved"
  | "rejected";

interface ApplicationStatusText {
  /** Tag text. */
  label: string;
  /** Plain-language line beside the tag. */
  description: string;
  /** Default next action. */
  action: string;
}

const STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "primary" | "success" | "danger" | "warning"
> = {
  draft: "default",
  submitted: "primary",
  "in-review": "primary",
  "action-needed": "warning",
  approved: "success",
  rejected: "danger",
};

interface ApplicationListLabels {
  title: string;
  reference: string;
  /** Prefix for the date when an application isn't submitted yet. */
  started: string;
  submitted: string;
  emptyTitle: string;
  emptyDescription: string;
  status: Record<ApplicationStatus, ApplicationStatusText>;
}

const DEFAULT_LABELS: ApplicationListLabels = {
  title: "Your applications",
  reference: "Reference",
  started: "Started",
  submitted: "Submitted",
  emptyTitle: "No applications yet",
  emptyDescription:
    "Applications you start will appear here, so you can come back to them and see where they are.",
  status: {
    draft: {
      label: "Draft",
      description: "Not submitted yet",
      action: "Continue",
    },
    submitted: {
      label: "Submitted",
      description: "We have received it",
      action: "View",
    },
    "in-review": {
      label: "In review",
      description: "An officer is looking at it",
      action: "View",
    },
    "action-needed": {
      label: "Action needed",
      description: "We need more information from you",
      action: "Respond",
    },
    approved: {
      label: "Approved",
      description: "Your application was approved",
      action: "View",
    },
    rejected: {
      label: "Not approved",
      description: "See the reason and what you can do",
      action: "View",
    },
  },
};

interface ApplicationListItem {
  id: string;
  title: ReactNode;
  reference?: ReactNode;
  /** Submitted date, or the date a draft was started. A Date is formatted with `locale`. */
  date?: Date | ReactNode;
  status: ApplicationStatus;
  /** Overrides the plain-language status line. */
  statusText?: ReactNode;
  /** Where the next action goes. */
  href?: string;
  /** Your router's link for the action. */
  render?: ReactElement;
  /** Overrides the default action text (Continue, Respond, View). */
  actionLabel?: ReactNode;
}

interface ApplicationListProps
  extends Omit<ComponentProps<"section">, "title"> {
  items: ApplicationListItem[];
  /** Overrides the "Your applications" heading. Pass `null` to leave it out. */
  title?: ReactNode;
  /** Heading level for the title. @default "h2" */
  headingLevel?: "h2" | "h3";
  /** Shown in the empty state, e.g. a "Start an application" button. */
  emptyAction?: ReactNode;
  /** Locale for dates. @default "en-MY" */
  locale?: string;
  labels?: Partial<Omit<ApplicationListLabels, "status">> & {
    status?: Partial<Record<ApplicationStatus, Partial<ApplicationStatusText>>>;
  };
}

const ApplicationList = forwardRef<HTMLElement, ApplicationListProps>(
  (
    {
      items,
      title,
      headingLevel: Heading = "h2",
      emptyAction,
      locale = "en-MY",
      labels: labelsProp,
      className,
      ...props
    },
    ref,
  ) => {
    const titleId = useId();
    const { status: statusLabels, ...restLabels } = labelsProp ?? {};
    const labels = { ...DEFAULT_LABELS, ...restLabels };
    const statusText = (status: ApplicationStatus): ApplicationStatusText => ({
      ...DEFAULT_LABELS.status[status],
      ...statusLabels?.[status],
    });
    const formatDate = (date: Date | ReactNode) =>
      date instanceof Date
        ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date)
        : date;
    const heading = title === undefined ? labels.title : title;

    return (
      <section
        ref={ref}
        aria-labelledby={heading ? titleId : undefined}
        className={clx(
          "font-body text-txt-black-900 flex flex-col gap-3",
          className,
        )}
        {...props}
      >
        {heading && (
          <Heading id={titleId} className="text-title font-semibold">
            {heading}
          </Heading>
        )}

        {items.length === 0 ? (
          <EmptyState className="bg-bg-washed rounded-lg">
            <EmptyStateIcon className="bg-bg-white">
              <DocumentIcon />
            </EmptyStateIcon>
            <EmptyStateTitle as={Heading === "h2" ? "h3" : "h4"}>
              {labels.emptyTitle}
            </EmptyStateTitle>
            <EmptyStateDescription>
              {labels.emptyDescription}
            </EmptyStateDescription>
            {emptyAction && (
              <EmptyStateActions>{emptyAction}</EmptyStateActions>
            )}
          </EmptyState>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {items.map((item) => {
              const text = statusText(item.status);
              const needsCitizen =
                item.status === "action-needed" || item.status === "draft";
              const hasAction = item.href !== undefined || item.render;
              return (
                <li
                  key={item.id}
                  className="border-otl-gray-200 flex flex-col gap-3 border-b py-4 first:pt-0 sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p className="text-content font-semibold">{item.title}</p>
                    {(item.reference || item.date) && (
                      <p className="text-txt-black-700 text-content flex flex-wrap gap-x-4 gap-y-0.5">
                        {item.reference && (
                          <span>
                            {labels.reference}{" "}
                            <span className="text-txt-black-900 tabular-nums">
                              {item.reference}
                            </span>
                          </span>
                        )}
                        {item.date && (
                          <span>
                            {item.status === "draft"
                              ? labels.started
                              : labels.submitted}{" "}
                            {formatDate(item.date)}
                          </span>
                        )}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag size="medium" variant={STATUS_VARIANT[item.status]}>
                        {text.label}
                      </Tag>
                      <span className="text-txt-black-700 text-content">
                        {item.statusText ?? text.description}
                      </span>
                    </div>
                  </div>
                  {hasAction && (
                    <Link
                      href={item.href}
                      render={item.render}
                      underline="none"
                      className={clx(
                        button_cva({
                          variant:
                            item.status === "action-needed"
                              ? "primary-fill"
                              : needsCitizen
                                ? "default-outline"
                                : "default-ghost",
                          size: "medium",
                        }),
                        "shrink-0 justify-center max-sm:w-full",
                      )}
                    >
                      {item.actionLabel ?? text.action}
                      {/* "View", "View", "View": say which one */}
                      {typeof item.title === "string" && (
                        <span className="sr-only"> {item.title}</span>
                      )}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    );
  },
);
ApplicationList.displayName = "ApplicationList";

export { ApplicationList };
export type {
  ApplicationListProps,
  ApplicationListItem,
  ApplicationListLabels,
  ApplicationStatus,
  ApplicationStatusText,
};
