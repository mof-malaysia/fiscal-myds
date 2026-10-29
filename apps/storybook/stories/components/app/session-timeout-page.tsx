import React from "react";
import { Button } from "@mof-malaysia/ftds-react/button";
import { SessionTimeoutDialog } from "@mof-malaysia/ftds-react/session-timeout";
import { AccessBrand } from "./access-brand";

/** A signed-in screen with the inactivity warning open over it. */
const SessionTimeoutPage = () => {
  const [open, setOpen] = React.useState(true);
  const [status, setStatus] = React.useState<string>();

  return (
    <div className="bg-bg-washed text-txt-black-900 font-body min-h-dvh">
      <header className="bg-bg-white border-otl-gray-200 flex h-14 items-center justify-between border-b px-4 sm:px-6">
        <AccessBrand />
        <span className="text-content text-txt-black-700">
          Aminah binti Yusof
        </span>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8 sm:px-6">
        <h1 className="text-heading-2xs font-semibold">
          Tax relief claim 2025
        </h1>
        <div className="bg-bg-white shadow-card flex flex-col gap-3 rounded-xl p-6">
          <p className="text-content text-txt-black-700">
            Section 3 of 5: Medical expenses
          </p>
          <div className="bg-bg-washed h-32 rounded-lg" />
          <div className="bg-bg-washed h-10 w-2/3 rounded-lg" />
        </div>
        {status && (
          <p role="status" className="text-content text-txt-black-700">
            {status}
          </p>
        )}
        <Button
          variant="default-outline"
          className="self-start"
          onClick={() => setOpen(true)}
        >
          Show the warning again
        </Button>
      </main>
      <SessionTimeoutDialog
        open={open}
        onOpenChange={setOpen}
        secondsRemaining={120}
        onStay={() => setStatus("You're still signed in.")}
        onSignOut={() => setStatus("You signed out.")}
        onExpire={() => {
          setOpen(false);
          setStatus("You were signed out because you were inactive.");
        }}
      />
    </div>
  );
};

export default SessionTimeoutPage;
