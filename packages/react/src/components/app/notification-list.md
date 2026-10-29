---
title: Notification List
description: An inbox of updates grouped by day, with an icon per kind, unread markers, an All/Unread filter and "Mark all as read". For a citizen's or officer's notifications page.
---

## When to use

- Use `NotificationList` for a notifications page or panel: updates about applications, payments, documents and deadlines.
- Use `ApplicationList` to show the applications themselves and what to do next, and `ActivityTimeline` for the history of one case.
- Use a toast (`useToastManager`) for a message about something that just happened on the current page, and `AnnounceBar` for a site-wide announcement.

## Usage

Each item has a `kind` (`"info"` by default, or `"success"`, `"warning"`, `"payment"`, `"document"`, `"deadline"`), a `title`, an optional `body`, a `date` and `read`. The list renders what it is given: update `read` in your data when `onMarkRead` or `onMarkAllRead` is called.

```tsx
import { useState } from "react";
import {
  NotificationList,
  type NotificationItem,
} from "@/components/blocks/notification-list";

const initialItems: NotificationItem[] = [
  {
    id: "n1",
    kind: "payment",
    title: "Payment received",
    body: "We received RM 51.50 for application MOF-2026-0412.",
    date: "2026-10-28T09:14:00+08:00",
    href: "/payments/BIL-2026-008812",
  },
  {
    id: "n2",
    kind: "warning",
    title: "We need more information",
    body: "Upload your EA form for 2025 by 30 November 2026.",
    date: "2026-10-27T16:40:00+08:00",
    href: "/applications/MOF-2026-0412",
  },
  {
    id: "n3",
    kind: "deadline",
    title: "Tax return due soon",
    body: "Submit your 2025 tax return by 30 April 2026.",
    date: "2026-04-15T08:00:00+08:00",
    read: true,
  },
];

export function Notifications() {
  const [items, setItems] = useState(initialItems);
  const markRead = (id: string) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );

  return (
    <NotificationList
      items={items}
      onSelect={markRead}
      onMarkRead={markRead}
      onMarkAllRead={() =>
        setItems((current) => current.map((item) => ({ ...item, read: true })))
      }
    />
  );
}
```

A preview panel with no toolbar, `h3` day headings under the page's `h2`, and Bahasa Melayu labels:

```tsx
import {
  NotificationList,
  type NotificationItem,
} from "@/components/blocks/notification-list";

export function NotifikasiTerkini({
  items,
  open,
}: {
  items: NotificationItem[];
  open: (id: string) => void;
}) {
  return (
    <section className="gap-stack-md flex flex-col">
      <h2 className="text-title text-txt-black-900 font-semibold">
        Notifikasi
      </h2>
      <NotificationList
        items={items}
        hideToolbar
        groupHeading="h3"
        locale="ms-MY"
        onSelect={open}
        labels={{
          today: "Hari ini",
          yesterday: "Semalam",
          unreadItem: "Belum dibaca",
          emptyTitle: "Tiada notifikasi lagi",
          emptyDescription:
            "Makluman tentang permohonan, bayaran dan tarikh akhir anda akan dipaparkan di sini.",
        }}
      />
    </section>
  );
}
```

## Notes

- Items are sorted newest first and grouped under "Today", "Yesterday", then dates formatted with `locale` (default `"en-MY"`). Pass `now` for fixed grouping in tests.
- Unread items have a dot, a bold title and hidden "Unread:" text, so the state never rests on colour alone.
- Each row is one target: an `<a>` when the item has `href`, otherwise a button that calls `onSelect`. `onSelect` is called in both cases. Choosing an item doesn't mark it read; do that in `onSelect` if you want it.
- "Mark as read" appears on unread items only with `onMarkRead`; "Mark all as read" only with `onMarkAllRead`, and is disabled when nothing is unread.
- The All/Unread filter can be controlled with `filter` and `onFilterChange`. With "Unread" chosen and nothing unread, the empty state says "You're all caught up".
- The installed file is yours: edit it when the props don't cover what you need.
