---
title: Hooks
description: React hooks shared by FTDS components: toasts, the theme, media queries, copy to clipboard, countdowns, pagination and state helpers. Imported from @/lib/ftds/hooks.
category: Utilities
---

## When to use

- `useToast` shows a toast from any component; it needs `AutoToast` mounted once.
- `ThemeProvider` and `useTheme` hold the light or dark theme; `ThemeSwitch` uses them.
- `useMediaQuery` tells whether a CSS media query matches, for layouts that change in code rather than in CSS.
- `useCopy` copies text to the clipboard and reports `copied` for a moment, for "Copy reference" buttons.
- `useCountdown` gives the whole seconds left until a time, for session timeouts and OTP resend timers.
- `usePagination` works out which page numbers to show; `Pagination` and `AutoPagination` use it.
- `useControllableState`, `useCallbackRef` and `useMergedRefs` help you build components that work controlled and uncontrolled, keep callbacks stable, and combine refs.

## Usage

### useToast

`toast()` sends a toast to the `AutoToast` mounted in the app. Pass a `variant` (`message`, `info`, `success`, `warning` or `error`), a `title` and an optional `description`. Mount `AutoToast` once near the root of the app, not in each component (see the toast component page).

```tsx
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/ftds/hooks";

export function UploadReceipt({ onUpload }: { onUpload: () => Promise<void> }) {
  const { toast } = useToast();

  async function upload() {
    await onUpload();
    toast({
      variant: "success",
      title: "Receipt uploaded",
      description: "We've added it to your lifestyle relief claim.",
    });
  }

  return (
    <Button variant="default-outline" onClick={upload}>
      Upload receipt
    </Button>
  );
}
```

`useToast` also returns `toasts`, `subscribe` and `unsubscribe`, which keep a local list of toasts sent while subscribed. You rarely need them.

### ThemeProvider and useTheme

`ThemeProvider` holds the theme and keeps the class on `<html>` in step with it. On mount it restores the theme saved in `localStorage` under `storageKey` (default `"theme"`), or applies `defaultTheme`; `setTheme` swaps the class (removing every theme in `themes`, default `["light", "dark"]`) and saves the choice. `useTheme()` returns `{ theme, setTheme, defaultTheme }`. To avoid a flash of the light theme for returning dark-mode visitors, also set the class in a blocking `<head>` script, as in the [setup guide](https://mof-malaysia.github.io/ftds/guides/setup.md) (section 5).

```tsx
import { Switch } from "@/components/ui/switch";
import { Field, FieldItem, FieldLabel } from "@/components/ui/field";
import { useTheme } from "@/lib/ftds/hooks";

export function DarkModeSetting() {
  const { theme, setTheme } = useTheme();

  return (
    <Field name="darkMode">
      <FieldItem>
        <Switch
          checked={theme === "dark"}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
        <FieldLabel>Dark mode</FieldLabel>
      </FieldItem>
    </Field>
  );
}
```

### useMediaQuery

Returns whether the query matches and updates as the viewport changes. It is `false` during server rendering, so render a sensible default for that case.

```tsx
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/ftds/hooks";

export function PayButton() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <Button className={isMobile ? "w-full" : undefined}>
      {isMobile ? "Pay" : "Pay RM 1,240.00 now"}
    </Button>
  );
}
```

Prefer Tailwind breakpoints (`sm:`, `md:`) when only styles change; use the hook when the rendered content or component differs.

### useCopy

`useCopy(text, timeout)` returns `[copied, copy]`. `copied` stays `true` for `timeout` milliseconds (default 2000) after a successful copy. If the browser blocks the clipboard, nothing happens, so keep the text visible on screen.

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons/check";
import { CopyIcon } from "@/components/ui/icons/copy";
import { useCopy } from "@/lib/ftds/hooks";

export function ApplicationReference({ reference }: { reference: string }) {
  const [copied, copy] = useCopy(reference);

  return (
    <div className="flex items-center gap-3">
      <span className="text-title text-txt-black-900 font-semibold tabular-nums">
        {reference}
      </span>
      <Button variant="default-outline" onClick={copy}>
        <ButtonIcon>{copied ? <CheckIcon /> : <CopyIcon />}</ButtonIcon>
        {copied ? "Copied" : "Copy reference"}
      </Button>
    </div>
  );
}
```

### The other hooks

- `useCountdown(endsAt)` returns the whole seconds left until `endsAt` (a timestamp in milliseconds), updating every second and stopping at 0. Pass `null` while there is nothing to count down, for example `useCountdown(open ? expiresAt : null)`.
- `usePagination({ count, limit, page, maxDisplay })` returns `{ visiblePages, max }`: the page numbers to show, with `"..."` where pages are skipped, and the last page number. `maxDisplay` defaults to 4.
- `useControllableState({ prop, defaultProp, onChange })` returns `[value, setValue]` that follows `prop` when it is defined and keeps its own state otherwise, calling `onChange` either way.
- `useCallbackRef(callback)` returns a stable function that always calls the latest `callback`, so it can go in effect dependencies without re-running them.
- `useMergedRefs(...refs)` combines several refs (an inner `useRef` and a forwarded ref) into one callback ref.

## Notes

- `ThemeContext` is exported too; use `useTheme` rather than reading it directly.
- Outside a `ThemeProvider`, `useTheme` returns the light defaults and `setTheme` does nothing.
- In Next.js, call these hooks from client components (`"use client"`).
