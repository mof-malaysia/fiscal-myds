import React from "react";
import {
  ApplicationPage,
  CheckYourAnswersPage,
  DashboardPage,
  PayFeePage,
  ReceiptPage,
  SubmittedPage,
} from "./components/app/citizen-pages";

/**
 * Citizen service pages composed from the app blocks: one step of an application,
 * check your answers, the confirmation, paying a fee, the receipt, and the citizen
 * dashboard. Callbacks are simulated, so you can submit with errors and see them.
 */
export default {
  title: "Examples/App/Citizen",
  tags: ["!autodocs"],
  parameters: { layout: "fullscreen" },
};

/** A FormStep page. Continue with empty fields to see the error summary. */
export const Application = { render: ApplicationPage };

/** Submit without ticking the declaration to see the error. */
export const CheckYourAnswers = { render: CheckYourAnswersPage };

export const Submitted = { render: SubmittedPage };

/** Pay without choosing a method to see the error. */
export const PayFee = { render: PayFeePage };

export const Receipt = { render: ReceiptPage };

export const Dashboard = { render: () => <DashboardPage /> };

/** A new citizen with nothing started yet. */
export const DashboardEmpty = { render: () => <DashboardPage empty /> };

export const DashboardMobile = {
  render: () => <DashboardPage />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
