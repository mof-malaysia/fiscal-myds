import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  DecisionPanel,
  type DecisionResult,
} from "@mof-malaysia/myds-react/decision-panel";

/**
 * ### Overview
 * Records an officer's decision on a case: approve, return for changes or reject.
 * Returning or rejecting needs a reason (shown to the applicant). Rejecting closes
 * the case for good, so it asks for confirmation first.
 *
 * The panel checks that a decision is chosen and that a required reason is given;
 * anything else (a failed save, a server rule) comes back through `errors`.
 *
 * ### Usage
 * ```tsx
 * <DecisionPanel
 *   pending={saving}
 *   errors={{ form: saveError }}
 *   onDecide={({ decision, reason, notify }) => save(decision, reason, notify)}
 * />
 * ```
 */
const meta: Meta<typeof DecisionPanel> = {
  title: "App/Blocks/DecisionPanel",
  component: DecisionPanel,
  parameters: { layout: "padded" },
};

export default meta;

/** Simulates a save that takes a second. */
const Demo = (props: Partial<React.ComponentProps<typeof DecisionPanel>>) => {
  const [pending, setPending] = React.useState(false);
  const [recorded, setRecorded] = React.useState<DecisionResult>();
  return (
    <div className="flex flex-col gap-4">
      <DecisionPanel
        pending={pending}
        onDecide={(result) => {
          setPending(true);
          setTimeout(() => {
            setPending(false);
            setRecorded(result);
          }, 1000);
        }}
        {...props}
      />
      <p className="text-txt-black-500 text-label-compact" aria-live="polite">
        {recorded &&
          `Recorded: ${recorded.decision}${recorded.reason ? ` (“${recorded.reason}”)` : ""}${
            recorded.notify ? ", applicant notified" : ""
          }`}
      </p>
    </div>
  );
};

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div data-density="compact" className="bg-bg-white max-w-md">
    {children}
  </div>
);

/** Choose Reject and submit to see the confirmation; submit with nothing chosen to see the checks. */
export const Default = createRender(() => (
  <Frame>
    <Demo />
  </Frame>
));

export const ReturnSelected = createRender(() => (
  <Frame>
    <Demo defaultDecision="return" />
  </Frame>
));

/** Errors from the app: a failed save. */
export const SaveFailed = createRender(() => (
  <Frame>
    <Demo
      defaultDecision="approve"
      errors={{
        form: "The decision wasn't saved. Someone else updated this case; reload it and try again.",
      }}
    />
  </Frame>
));

/** Fewer choices, no notification (e.g. an internal review step). */
export const ApproveOrReturn = createRender(() => (
  <Frame>
    <Demo
      options={["approve", "return"]}
      showNotify={false}
      labels={{ title: "Supervisor review", submit: "Save review" }}
    />
  </Frame>
));

export const Pending = createRender(() => (
  <Frame>
    <DecisionPanel defaultDecision="approve" pending onDecide={() => {}} />
  </Frame>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Frame>
        <Demo />
      </Frame>
    </div>
  ),
  "dark",
);
