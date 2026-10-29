"use client";
// registry:block — composed page section, installs to components/blocks
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/lib/ftds/hooks";

/**
 * SessionTimeoutDialog warns that the session is about to end for inactivity,
 * with a live mm:ss countdown, "Stay signed in" (primary) and "Sign out". It
 * can't be dismissed by clicking outside: the user has to choose.
 *
 * Give it either `expiresAt` (a time) or `secondsRemaining` (counted from when it
 * opens). When the countdown reaches zero it calls `onExpire`, where the app
 * signs out and explains why on the next screen.
 *
 * Screen readers hear the warning when it opens and again at 30 and 10 seconds,
 * not every second.
 *
 * @example
 * <SessionTimeoutDialog
 *   open={warning}
 *   onOpenChange={setWarning}
 *   secondsRemaining={120}
 *   onStay={() => refreshSession()}
 *   onSignOut={() => signOut()}
 *   onExpire={() => signOut({ reason: "timeout" })}
 * />
 */

interface SessionTimeoutLabels {
  title: string;
  /** Before the countdown. */
  body: string;
  /** After the countdown. */
  bodyEnd: string;
  unsaved: string;
  stay: string;
  signOut: string;
  /** Read by screen readers at the announce points; `{time}` is replaced, e.g. "2 minutes". */
  announcement: string;
  minutes: string;
  minute: string;
  seconds: string;
  second: string;
}

const DEFAULT_LABELS: SessionTimeoutLabels = {
  title: "You're about to be signed out",
  body: "For your security, we'll sign you out in",
  bodyEnd: "because you haven't done anything for a while.",
  unsaved: "Anything you haven't saved will be lost.",
  stay: "Stay signed in",
  signOut: "Sign out now",
  announcement: "You will be signed out in {time}.",
  minutes: "minutes",
  minute: "minute",
  seconds: "seconds",
  second: "second",
};

interface SessionTimeoutDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When the session ends. Takes precedence over `secondsRemaining`. */
  expiresAt?: Date | number;
  /** Seconds left when the dialog opens. @default 120 */
  secondsRemaining?: number;
  /** "Stay signed in": refresh the session. The dialog closes. */
  onStay?: () => void;
  /** "Sign out now". The dialog closes. */
  onSignOut?: () => void;
  /** The countdown reached zero. */
  onExpire?: () => void;
  labels?: Partial<SessionTimeoutLabels>;
}

const ANNOUNCE_AT = [30, 10];

const formatClock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

const SessionTimeoutDialog = ({
  open,
  onOpenChange,
  expiresAt,
  secondsRemaining = 120,
  onStay,
  onSignOut,
  onExpire,
  labels: labelsProp,
}: SessionTimeoutDialogProps) => {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const endsAt = useMemo(() => {
    if (!open) return null;
    return expiresAt !== undefined
      ? new Date(expiresAt).getTime()
      : Date.now() + secondsRemaining * 1000;
  }, [open, expiresAt, secondsRemaining]);
  const remaining = useCountdown(endsAt);
  const [announced, setAnnounced] = useState<number | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Each opening starts a fresh announcement
  useEffect(() => setAnnounced(null), [endsAt]);

  useEffect(() => {
    if (endsAt === null) return;
    // Announce once on open, then only at the announce points
    setAnnounced((last) =>
      last === null || ANNOUNCE_AT.includes(remaining) ? remaining : last,
    );
    if (remaining === 0) onExpireRef.current?.();
  }, [endsAt, remaining]);

  const spoken = (seconds: number) => {
    if (seconds >= 60) {
      const minutes = Math.ceil(seconds / 60);
      return `${minutes} ${minutes === 1 ? labels.minute : labels.minutes}`;
    }
    return `${seconds} ${seconds === 1 ? labels.second : labels.seconds}`;
  };

  const choose = (action?: () => void) => {
    action?.();
    onOpenChange?.(false);
  };

  return (
    <AlertDialog
      variant="warning"
      open={open}
      // Only the two buttons close it: ignore Esc and outside presses, so the
      // countdown keeps running until the user chooses (or it expires)
      onOpenChange={(next) => {
        if (next) onOpenChange?.(true);
      }}
    >
      <AlertDialogContent dismissible={false} hideClose>
        <AlertDialogTitle>{labels.title}</AlertDialogTitle>
        <AlertDialogDescription>
          {labels.body}{" "}
          <span
            aria-hidden
            className="text-txt-black-900 font-semibold tabular-nums"
          >
            {formatClock(remaining)}
          </span>
          <span className="sr-only">{spoken(remaining)}</span> {labels.bodyEnd}
        </AlertDialogDescription>
        <p className="text-content text-txt-black-700 pt-2">{labels.unsaved}</p>
        <span className="sr-only" aria-live="polite" aria-atomic>
          {announced !== null &&
            labels.announcement.replace("{time}", spoken(announced))}
        </span>
        <AlertDialogAction className="pt-6">
          <Button
            variant="default-outline"
            size="medium"
            onClick={() => choose(onSignOut)}
          >
            {labels.signOut}
          </Button>
          <Button
            variant="primary-fill"
            size="medium"
            onClick={() => choose(onStay)}
          >
            {labels.stay}
          </Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};
SessionTimeoutDialog.displayName = "SessionTimeoutDialog";

export { SessionTimeoutDialog };
export type { SessionTimeoutDialogProps, SessionTimeoutLabels };
