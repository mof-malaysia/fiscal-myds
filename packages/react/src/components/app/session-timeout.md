---
title: Session Timeout
description: A dialog that warns the session is about to end for inactivity, with a live countdown, "Stay signed in" and "Sign out now". Exported as SessionTimeoutDialog.
---

## When to use

- Use `SessionTimeoutDialog` in any signed-in service that ends sessions after a period of inactivity, so people can keep working instead of losing what they typed.
- Use `AlertDialog` for other confirmations, and `ErrorPage` or a message on the sign-in screen to explain afterwards that the session ended.

## Usage

The dialog doesn't watch for inactivity itself: open it when your session is about to expire. Give it `expiresAt` (a time) or `secondsRemaining` (counted from when it opens, 120 by default). Pressing either button calls its handler and then `onOpenChange(false)`. When the countdown reaches zero it calls `onExpire`, where you sign out.

```tsx
import { useEffect, useState } from "react";
import { SessionTimeoutDialog } from "@/components/blocks/session-timeout";

export function SessionWarning({
  expiresAt,
  refreshSession,
  signOut,
}: {
  expiresAt: number;
  refreshSession: () => void;
  signOut: (reason?: "timeout") => void;
}) {
  const [open, setOpen] = useState(false);

  // Warn 2 minutes before the session ends
  useEffect(() => {
    const timer = window.setTimeout(
      () => setOpen(true),
      Math.max(0, expiresAt - Date.now() - 120_000),
    );
    return () => window.clearTimeout(timer);
  }, [expiresAt]);

  return (
    <SessionTimeoutDialog
      open={open}
      onOpenChange={setOpen}
      expiresAt={expiresAt}
      onStay={refreshSession}
      onSignOut={() => signOut()}
      onExpire={() => {
        setOpen(false);
        signOut("timeout");
      }}
    />
  );
}
```

In Bahasa Melayu. The countdown sits between `body` and `bodyEnd`; `announcement` replaces `{time}` with the spoken time, built from the unit labels:

```tsx
import { SessionTimeoutDialog } from "@/components/blocks/session-timeout";

export function AmaranSesi({
  open,
  onOpenChange,
  onStay,
  onSignOut,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStay: () => void;
  onSignOut: () => void;
}) {
  return (
    <SessionTimeoutDialog
      open={open}
      onOpenChange={onOpenChange}
      secondsRemaining={120}
      onStay={onStay}
      onSignOut={onSignOut}
      onExpire={onSignOut}
      labels={{
        title: "Anda akan dilog keluar",
        body: "Untuk keselamatan anda, kami akan melog keluar anda dalam",
        bodyEnd: "kerana anda tidak melakukan apa-apa untuk seketika.",
        unsaved: "Apa-apa yang belum disimpan akan hilang.",
        stay: "Kekal log masuk",
        signOut: "Log keluar sekarang",
        announcement: "Anda akan dilog keluar dalam {time}.",
        minutes: "minit",
        minute: "minit",
        seconds: "saat",
        second: "saat",
      }}
    />
  );
}
```

## Notes

- It is a warning `AlertDialog` that can't be dismissed by clicking outside and has no close button. "Stay signed in" is the primary button. Escape still closes it, calling `onOpenChange(false)` without `onStay` or `onSignOut`, and a closed dialog stops counting and won't call `onExpire`. Keep your own timer for the real expiry, or treat that close as "Stay signed in".
- The countdown shows as mm:ss. Screen readers hear the warning when it opens and again at 30 and 10 seconds, not every second.
- `expiresAt` takes precedence over `secondsRemaining`. With `secondsRemaining`, each opening starts a fresh countdown.
- `onExpire` fires once when the countdown reaches zero. The dialog stays open at 0:00 until you close it or leave the page, so close it there and sign out.
- Refresh the session on the server in `onStay`; the dialog only reports the choice.
- The installed file is yours: edit it when the props don't cover what you need.
