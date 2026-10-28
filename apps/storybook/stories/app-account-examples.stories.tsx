import React from "react";
import {
  NotificationsPage,
  PreferencesPage,
  ProfilePage,
  SecurityPage,
} from "./components/app/account-pages";
import {
  AccessDeniedPage,
  MaintenancePage,
  NotFoundPage,
  ServerErrorPage,
} from "./components/app/error-pages";

/**
 * Full account and system-state pages composed from the SettingsLayout,
 * NotificationList and ErrorPage blocks, in the citizen-facing frame
 * (Masthead, service header, footer).
 */
export default {
  title: "Examples/App/Account",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};

export const Profile = { render: () => <ProfilePage /> };
export const Security = { render: () => <SecurityPage /> };
export const Preferences = { render: () => <PreferencesPage /> };
export const Notifications = { render: () => <NotificationsPage /> };
export const NotFound = { render: () => <NotFoundPage /> };
export const ServerError = { render: () => <ServerErrorPage /> };
export const AccessDenied = { render: () => <AccessDeniedPage /> };
export const Maintenance = { render: () => <MaintenancePage /> };

/** The Profile page at phone width. */
export const ProfileMobile = {
  render: () => <ProfilePage />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
