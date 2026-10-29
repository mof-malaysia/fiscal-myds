import type { NotificationItem } from "@mof-malaysia/ftds-react/notification-list";

/** Fixed "now" so day groups (Today, Yesterday) stay stable in stories. */
export const NOW = new Date("2026-10-28T16:30:00+08:00");

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    kind: "payment",
    title: "Payment received",
    body: "We received RM 120.00 for your road tax renewal (WXY 4821). Your receipt is ready.",
    date: "2026-10-28T14:12:00+08:00",
    href: "#receipt",
  },
  {
    id: "n2",
    kind: "deadline",
    title: "Income tax return due in 3 days",
    body: "Submit your e-BE form for assessment year 2025 by 31 October to avoid a penalty.",
    date: "2026-10-28T09:00:00+08:00",
    href: "#tax",
  },
  {
    id: "n3",
    kind: "success",
    title: "Application approved",
    body: "Your Sumbangan Tunai Rahmah application (STR-2026-118204) was approved. Payment follows within 14 days.",
    date: "2026-10-27T17:45:00+08:00",
    read: true,
  },
  {
    id: "n4",
    kind: "warning",
    title: "We need one more document",
    body: "Upload a copy of your latest payslip so we can finish reviewing your application.",
    date: "2026-10-27T10:20:00+08:00",
    href: "#upload",
  },
  {
    id: "n5",
    kind: "document",
    title: "Your EA form is available",
    body: "Download your 2025 statement of remuneration from your employer.",
    date: "2026-10-24T08:05:00+08:00",
    read: true,
  },
  {
    id: "n6",
    kind: "info",
    title: "Scheduled maintenance on Sunday",
    body: "Online services will be unavailable from 1:00 am to 5:00 am on 2 November.",
    date: "2026-10-22T12:00:00+08:00",
    read: true,
  },
];

export const SETTINGS_NAV = [
  { id: "profile", label: "Profile", href: "#profile" },
  { id: "security", label: "Sign-in and security", href: "#security" },
  { id: "preferences", label: "Preferences", href: "#preferences" },
  { id: "notifications", label: "Notifications", href: "#notifications" },
];
