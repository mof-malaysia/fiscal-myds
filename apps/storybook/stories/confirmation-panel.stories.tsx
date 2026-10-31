import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { ConfirmationPanel } from "@mof-malaysia/ftds-react/confirmation-panel";

/**
 * ### Overview
 * The page after a submission: a calm success panel with the reference number
 * (large and copyable), where the confirmation was sent, what happens next, and
 * the ways out (print, back to the dashboard). It answers "did it go through?"
 * at a glance, without celebrating.
 *
 * ### Usage
 * ```tsx
 * <ConfirmationPanel
 *   reference="KK-2026-0412"
 *   emailNote="We have sent a confirmation to nur.aisyah@example.com."
 *   nextSteps={["An officer will review your application within 14 working days."]}
 *   onPrint={() => window.print()}
 *   dashboardHref="/dashboard"
 * />
 * ```
 */
const meta: Meta<typeof ConfirmationPanel> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-blocks-confirmationpanel",
  title: "App/Blocks/ConfirmationPanel",
  component: ConfirmationPanel,
  parameters: { layout: "padded" },
};

export default meta;

const Full = () => (
  <ConfirmationPanel
    reference="KK-2026-0412"
    description="Received on 28 October 2026 at 2:32 pm"
    emailNote="We have sent a confirmation to nur.aisyah@example.com. Keep your reference number in case you need to contact us."
    nextSteps={[
      "An officer will review your application within 14 working days.",
      "If we need more information, we will email you and show it on your dashboard.",
      "When a decision is made, we will email you with the outcome.",
    ]}
    onPrint={() => {}}
    dashboardHref="#"
  />
);

export const Default = createRender(Full);

/** Just the reference and a way back. */
export const Minimal = createRender(() => (
  <ConfirmationPanel
    title="Your details are updated"
    reference="PR-2026-11873"
    dashboardHref="#"
  />
));

/** Bahasa Melayu labels. */
export const Malay = createRender(() => (
  <ConfirmationPanel
    reference="KK-2026-0412"
    emailNote="Kami telah menghantar pengesahan ke nur.aisyah@example.com."
    nextSteps={[
      "Pegawai akan menyemak permohonan anda dalam tempoh 14 hari bekerja.",
      "Kami akan menghubungi anda jika maklumat lanjut diperlukan.",
    ]}
    onPrint={() => {}}
    dashboardHref="#"
    labels={{
      title: "Permohonan dihantar",
      referenceLabel: "Nombor rujukan anda",
      copy: "Salin nombor rujukan",
      copied: "Disalin",
      nextStepsTitle: "Apa yang berlaku seterusnya",
      print: "Cetak halaman ini",
      dashboard: "Pergi ke papan pemuka anda",
    }}
  />
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-6">
      <Full />
    </div>
  ),
  "dark",
);
