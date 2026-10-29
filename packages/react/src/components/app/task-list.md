---
title: Task List
description: Lists every part of a multi-part application with its status in words, so users can see what's done and what's left and open each part in any order.
category: Data display
---

## When to use

- Use `TaskList` on the overview page of a long application whose parts can be done in any order: company details, directors, financial statements, declaration.
- Use `Stepper` instead when the steps must be done in a fixed order, one page after another.
- Use `ApplicationList` for the list of a user's separate applications, and `SummaryList` to show the answers given.

## Usage

`TaskListItemTitle` with `href` (or `render` for a router link) is a link that makes the whole row clickable. Without either, it is plain text for a task that can't be started yet.

```tsx
import {
  TaskList,
  TaskListItem,
  TaskListItemHint,
  TaskListItemStatus,
  TaskListItemTitle,
} from "@/components/ui/task-list";

export function GrantApplicationTasks() {
  return (
    <section className="gap-stack-sm flex flex-col">
      <h2 className="text-title text-txt-black-900 font-semibold">
        Prepare your application
      </h2>
      <TaskList>
        <TaskListItem>
          <TaskListItemTitle href="/apply/company">
            Company details
          </TaskListItemTitle>
          <TaskListItemHint>Registration number and address</TaskListItemHint>
          <TaskListItemStatus status="completed" />
        </TaskListItem>
        <TaskListItem>
          <TaskListItemTitle href="/apply/financials">
            Financial statements
          </TaskListItemTitle>
          <TaskListItemHint>
            Audited accounts for 2024 and 2025
          </TaskListItemHint>
          <TaskListItemStatus status="in-progress" />
        </TaskListItem>
        <TaskListItem>
          <TaskListItemTitle href="/apply/bank">Bank account</TaskListItemTitle>
          <TaskListItemStatus status="not-started" />
        </TaskListItem>
        <TaskListItem>
          <TaskListItemTitle>Declaration</TaskListItemTitle>
          <TaskListItemHint>
            Available when every other task is complete
          </TaskListItemHint>
          <TaskListItemStatus status="cannot-start" />
        </TaskListItem>
      </TaskList>
    </section>
  );
}
```

| `status`       | Tag colour | Default text     |
| -------------- | ---------- | ---------------- |
| `completed`    | success    | Completed        |
| `in-progress`  | primary    | In progress      |
| `not-started`  | warning    | Not started      |
| `cannot-start` | default    | Cannot start yet |

## Notes

- Children of `TaskListItemStatus` replace the default text, for example `<TaskListItemStatus status="completed">Selesai</TaskListItemStatus>` in Bahasa Melayu. `variant` overrides the colour.
- The link is described by the row's hint and status, so screen readers hear "Financial statements, Audited accounts for 2024 and 2025, In progress".
- A task that can't be started has no `href` and says why in its hint.
- For many tasks, use several task lists, each under its own heading.
- Rows are split by Hairline dividers; don't wrap the list in a card or add borders.
