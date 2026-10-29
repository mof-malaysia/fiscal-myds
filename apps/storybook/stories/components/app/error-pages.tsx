import React from "react";
import { ErrorPage } from "@mof-malaysia/ftds-react/error-page";
import { AccountChrome } from "./account-chrome";

export const NotFoundPage = () => (
  <AccountChrome>
    <ErrorPage kind="not-found" homeHref="#home" supportHref="#contact" />
  </AccountChrome>
);

export const ServerErrorPage = () => (
  <AccountChrome>
    <ErrorPage
      kind="server-error"
      onRetry={() => {}}
      homeHref="#home"
      supportHref="#contact"
      reference="REQ-8F2A-41C9-7D30"
    />
  </AccountChrome>
);

export const AccessDeniedPage = () => (
  <AccountChrome>
    <ErrorPage kind="access-denied" homeHref="#home" supportHref="#contact" />
  </AccountChrome>
);

/** Maintenance shows no account controls: nobody can be signed in. */
export const MaintenancePage = () => (
  <AccountChrome signedIn={false}>
    <ErrorPage
      kind="maintenance"
      backAt="5:00 am on Sunday, 2 November"
      supportHref="#contact"
    />
  </AccountChrome>
);
