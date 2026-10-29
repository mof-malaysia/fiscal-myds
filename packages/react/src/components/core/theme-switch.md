---
title: Theme Switch
description: A button or select that switches between light and dark themes through ThemeProvider. Put it in the top bar or a settings page.
category: Actions
---

## When to use

- Use `ThemeSwitch` to let people choose between the light and dark themes. Put the icon toggle in a top bar or `Navbar`, or the select in a settings page (`SettingsRow`).
- It must sit inside a `ThemeProvider` from `@/lib/ftds/hooks`, which applies the `dark` class to `<html>` and saves the choice in `localStorage`.

## Usage

The default is an icon button (sun or moon) that cycles through the themes:

```tsx
import type { ReactNode } from "react";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { ThemeProvider } from "@/lib/ftds/hooks";

function savedTheme(): string {
  return typeof window === "undefined"
    ? "light"
    : (localStorage.getItem("theme") ?? "light");
}

export function TopBar({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme={savedTheme()}>
      <header className="flex items-center justify-between gap-4 px-4 py-2">
        {children}
        <ThemeSwitch />
      </header>
    </ThemeProvider>
  );
}
```

`as="select"` shows a select with the theme names. Pass `themes` to translate the labels, and `label` for the select's accessible name:

```tsx
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { MoonIcon } from "@/components/ui/icons/moon";
import { SunIcon } from "@/components/ui/icons/sun";

export function TemaPaparan() {
  return (
    <ThemeSwitch
      as="select"
      label="Tema"
      themes={[
        { label: "Cerah", value: "light", icon: <SunIcon /> },
        { label: "Gelap", value: "dark", icon: <MoonIcon /> },
      ]}
    />
  );
}
```

## Notes

- `ThemeProvider` doesn't restore the saved theme on load. Apply it before the first paint and start the provider from the same value, as in the [setup guide](https://mof-malaysia.github.io/ftds/guides/setup.md) (section 5). Otherwise the page flashes light and the switch shows the wrong theme.
- Theme `value`s are class names added to `<html>`: FTDS styles `light` and `dark` only.
- `onChange` receives the new theme value after it is applied, for example to save it to the user's profile.
- In toggle mode, the button's accessible name is the current theme's `label` ("Light" or "Dark"); `label` only names the select.
- Don't write `dark:` overrides for FTDS tokens; they already switch with the theme.
