"use client";

import React, {
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  useContext,
  useId,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Tag } from "../core/tag";
import { clx } from "../../utils";

type TagProps = React.ComponentProps<typeof Tag>;

/**
 * TaskList shows every part of a multi-part application and how far along each
 * one is, so users can see what's done and what's left. Each row has a task
 * name (a link while the task can be opened), an optional hint, and a status
 * that always says its state in words. Rows are split by Hairline dividers.
 *
 * For many tasks, use several TaskLists, each under its own heading.
 *
 * @example
 * <TaskList>
 *   <TaskListItem>
 *     <TaskListItemTitle href="/apply/details">Company details</TaskListItemTitle>
 *     <TaskListItemHint>Registration number and address</TaskListItemHint>
 *     <TaskListItemStatus status="completed" />
 *   </TaskListItem>
 *   <TaskListItem>
 *     <TaskListItemTitle>Declaration</TaskListItemTitle>
 *     <TaskListItemStatus status="cannot-start" />
 *   </TaskListItem>
 * </TaskList>
 */

interface TaskListProps extends useRender.ComponentProps<"ul"> {}

const TaskList: ForwardRefExoticComponent<TaskListProps> = forwardRef(
  ({ render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "ul",
      render,
      ref,
      props: mergeProps<"ul">(
        {
          className: clx(
            "font-body border-otl-gray-200 m-0 flex w-full list-none flex-col border-t p-0",
            className,
          ),
        },
        props,
      ),
    }),
);
TaskList.displayName = "TaskList";

/*========================================================================================================================*/

/** The row's id; the hint and status derive their ids from it. */
const ItemContext = createContext<string | null>(null);

const hintId = (itemId: string) => `${itemId}-hint`;
const statusId = (itemId: string) => `${itemId}-status`;

interface TaskListItemProps extends useRender.ComponentProps<"li"> {}

const TaskListItem: ForwardRefExoticComponent<TaskListItemProps> = forwardRef(
  ({ render, className, ...props }, ref) => {
    const id = useId();

    const element = useRender({
      defaultTagName: "li",
      render,
      ref,
      props: mergeProps<"li">(
        {
          className: clx(
            "border-otl-gray-200 relative grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 border-b px-3 py-4",
            "in-data-[density=compact]:gap-x-3 in-data-[density=compact]:py-3",
            // Rows that open a task fill with Well on hover (task-list.mdx)
            "transition-colors duration-150 motion-reduce:transition-none has-[a]:hover:bg-bg-washed",
            className,
          ),
        },
        props,
      ),
    });

    return <ItemContext.Provider value={id}>{element}</ItemContext.Provider>;
  },
);
TaskListItem.displayName = "TaskListItem";

/*========================================================================================================================*/

interface TaskListItemTitleProps extends useRender.ComponentProps<"a"> {}

/**
 * The task name. With `href` (or `render` for a router link) it's a link that
 * makes the whole row clickable; without, it's plain text for a task that
 * can't be started yet.
 */
const TaskListItemTitle: ForwardRefExoticComponent<TaskListItemTitleProps> =
  forwardRef(({ render, className, href, ...props }, ref) => {
    const itemId = useContext(ItemContext);
    const isLink = href !== undefined || render !== undefined;
    // An id with no element (no hint) is skipped by assistive tech
    const describedBy = itemId
      ? `${hintId(itemId)} ${statusId(itemId)}`
      : undefined;

    return useRender({
      defaultTagName: isLink ? "a" : "span",
      render,
      ref,
      props: mergeProps<"a">(
        {
          href,
          "aria-describedby": isLink ? describedBy : undefined,
          className: clx(
            "col-start-1 row-start-1 text-content text-txt-black-900 font-medium",
            isLink && [
              "text-txt-primary rounded-xs underline decoration-1 underline-offset-[3px] outline-none",
              "hover:decoration-2 [li:hover_&]:decoration-2",
              // Stretch the hit area over the row
              "after:absolute after:inset-0 after:content-['']",
              "focus-visible:after:outline-fr-primary focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-solid",
            ],
            className,
          ),
        },
        props,
      ),
    });
  });
TaskListItemTitle.displayName = "TaskListItemTitle";

/*========================================================================================================================*/

interface TaskListItemHintProps extends useRender.ComponentProps<"div"> {}

/** One line on what the task involves. */
const TaskListItemHint: ForwardRefExoticComponent<TaskListItemHintProps> =
  forwardRef(({ render, className, ...props }, ref) => {
    const itemId = useContext(ItemContext);
    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          id: itemId ? hintId(itemId) : undefined,
          // Lets the status span the hint line; spread so TS allows a data-* key here
          // eslint-disable-next-line unicorn/no-useless-spread
          ...{ "data-slot": "task-list-item-hint" },
          className: clx(
            "text-txt-black-700 text-content col-start-1 row-start-2",
            className,
          ),
        },
        props,
      ),
    });
  });
TaskListItemHint.displayName = "TaskListItemHint";

/*========================================================================================================================*/

type TaskStatus = "completed" | "in-progress" | "not-started" | "cannot-start";

const statusStyle: Record<
  TaskStatus,
  { variant: TagProps["variant"]; label: string }
> = {
  completed: { variant: "success", label: "Completed" },
  "in-progress": { variant: "primary", label: "In progress" },
  "not-started": { variant: "warning", label: "Not started" },
  "cannot-start": { variant: "default", label: "Cannot start yet" },
};

interface TaskListItemStatusProps extends Omit<TagProps, "variant"> {
  status: TaskStatus;
  /** Override the colour. */
  variant?: TagProps["variant"];
}

/** The task's state as a wash tag. Children replace the default label (e.g. for BM). */
const TaskListItemStatus = forwardRef<HTMLDivElement, TaskListItemStatusProps>(
  ({ status, variant, className, children, ...props }, ref) => {
    const itemId = useContext(ItemContext);
    const style = statusStyle[status];
    return (
      <Tag
        ref={ref}
        id={itemId ? statusId(itemId) : undefined}
        variant={variant ?? style.variant}
        mode="pill"
        size="medium"
        className={clx(
          "in-data-[density=compact]:text-label-compact col-start-2 row-start-1 self-start in-data-[density=compact]:h-[22px]",
          // Span the hint line too, when the row has one
          "[li:has(>[data-slot=task-list-item-hint])>&]:row-span-2",
          className,
        )}
        {...props}
      >
        {children ?? style.label}
      </Tag>
    );
  },
);
TaskListItemStatus.displayName = "TaskListItemStatus";

export {
  TaskList,
  TaskListItem,
  TaskListItemTitle,
  TaskListItemHint,
  TaskListItemStatus,
};
export type {
  TaskListProps,
  TaskListItemProps,
  TaskListItemTitleProps,
  TaskListItemHintProps,
  TaskListItemStatusProps,
  TaskStatus,
};
