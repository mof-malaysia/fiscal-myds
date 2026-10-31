import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  NotificationList,
  type NotificationItem,
  type NotificationListProps,
} from "@mof-malaysia/ftds-react/notification-list";
import { NOTIFICATIONS, NOW } from "./components/app/account-data";

/**
 * ### Overview
 * An inbox of updates, grouped by day. Each item shows an icon for its kind, a
 * title, a short body and the time. Unread items have a dot, a bold title and
 * "Unread" read out to screen readers, so status never depends on colour alone.
 * A segmented filter switches between all and unread; "Mark all as read" clears them.
 *
 * The list renders the `items` it is given: set `read` in your data when
 * `onMarkRead` or `onMarkAllRead` is called.
 *
 * ### Usage
 * ```tsx
 * <NotificationList
 *   items={notifications}
 *   onSelect={(id) => open(id)}
 *   onMarkRead={(id) => markRead(id)}
 *   onMarkAllRead={markAllRead}
 * />
 * ```
 */
const meta: Meta<typeof NotificationList> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-blocks-notificationlist",
  title: "App/Blocks/NotificationList",
  component: NotificationList,
};

export default meta;

const Live = (props: Partial<NotificationListProps>) => {
  const [items, setItems] = React.useState<NotificationItem[]>(
    props.items ?? NOTIFICATIONS,
  );
  return (
    <div className="max-w-2xl">
      <NotificationList
        now={NOW}
        {...props}
        items={items}
        onSelect={(id) =>
          setItems((all) =>
            all.map((n) => (n.id === id ? { ...n, read: true } : n)),
          )
        }
        onMarkRead={(id) =>
          setItems((all) =>
            all.map((n) => (n.id === id ? { ...n, read: true } : n)),
          )
        }
        onMarkAllRead={() =>
          setItems((all) => all.map((n) => ({ ...n, read: true })))
        }
      />
    </div>
  );
};

export const Default = createRender(() => <Live />);

/** Starts on the unread filter. */
export const UnreadOnly = createRender(() => <Live defaultFilter="unread" />);

/** Nothing has arrived yet. */
export const Empty = createRender(() => <Live items={[]} />);

/** Everything read, on the unread filter. */
export const AllCaughtUp = createRender(() => (
  <Live
    defaultFilter="unread"
    items={NOTIFICATIONS.map((n) => ({ ...n, read: true }))}
  />
));

/** Without the toolbar, for a short list in a dashboard panel. */
export const WithoutToolbar = createRender(() => (
  <Live hideToolbar items={NOTIFICATIONS.slice(0, 3)} />
));

/** Bahasa Melayu labels and dates. */
export const Malay = createRender(() => (
  <Live
    locale="ms-MY"
    labels={{
      today: "Hari ini",
      yesterday: "Semalam",
      filter: "Tunjuk",
      all: "Semua",
      unread: "Belum dibaca",
      markAllRead: "Tandakan semua sebagai dibaca",
      markRead: "Tandakan sebagai dibaca",
      unreadItem: "Belum dibaca",
    }}
  />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Live />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Live />
    </div>
  ),
  "dark",
);
