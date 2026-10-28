import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { SessionTimeoutDialog } from "@mof-malaysia/myds-react/session-timeout";
import { Button } from "@mof-malaysia/myds-react/button";

/**
 * ### Overview
 * Warns that the session is about to end for inactivity, with a live mm:ss
 * countdown, "Stay signed in" (primary) and "Sign out now". Clicking outside
 * doesn't close it: the user has to choose. At zero it calls `onExpire`.
 *
 * Give it `expiresAt` or `secondsRemaining`. Screen readers hear the warning when
 * it opens and again at 30 and 10 seconds, not every second.
 *
 * ### Usage
 * ```tsx
 * <SessionTimeoutDialog
 *   open={warning}
 *   onOpenChange={setWarning}
 *   secondsRemaining={120}
 *   onStay={refreshSession}
 *   onSignOut={signOut}
 *   onExpire={() => signOut({ reason: "timeout" })}
 * />
 * ```
 */
const meta: Meta<typeof SessionTimeoutDialog> = {
  title: "App/Blocks/SessionTimeoutDialog",
  component: SessionTimeoutDialog,
};

export default meta;

const Live = ({ seconds = 120 }: { seconds?: number }) => {
  const [open, setOpen] = React.useState(true);
  const [log, setLog] = React.useState("Waiting for a choice");
  return (
    <div className="flex flex-col items-start gap-3">
      <Button variant="default-outline" onClick={() => setOpen(true)}>
        Show the warning
      </Button>
      <p role="status" className="text-content text-txt-black-700">
        {log}
      </p>
      <SessionTimeoutDialog
        open={open}
        onOpenChange={setOpen}
        secondsRemaining={seconds}
        onStay={() => setLog("Stayed signed in")}
        onSignOut={() => setLog("Signed out")}
        onExpire={() => {
          setOpen(false);
          setLog("Session expired: signed out");
        }}
      />
    </div>
  );
};

export const Default = createRender(() => <Live />);

/** 15 seconds, to watch it expire. */
export const Expiring = createRender(() => <Live seconds={15} />);

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Live />
    </div>
  ),
  "dark",
);
