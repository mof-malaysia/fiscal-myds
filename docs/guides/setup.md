---
title: Setup
description: Add FTDS to a React project: shadcn init, the @ftds registry namespace, styles, fonts, dark mode and density.
order: 1
---

FTDS needs a React 18 or 19 project with Tailwind CSS v4, TypeScript and the `@/` import alias, set up by the shadcn CLI with its default Base UI library. It works with Next.js, Vite and any other React framework shadcn supports.

## 1. Initialise shadcn

```bash
npx shadcn@latest init
```

Keep the default `base` component library (Base UI). FTDS components don't work with a Radix setup (`--base radix`).

## 2. Add the `@ftds` namespace

Add the registry to `components.json`. The URL picks the version: `v2` follows the newest 2.x release (recommended), `v2.1.0` pins an exact release, `latest` follows every release including majors.

```json
{
  "registries": {
    "@ftds": "https://mof-malaysia.github.io/ftds/r/v2/{name}.json"
  }
}
```

Then install by name. Dependencies (other FTDS items such as `utils`, `hooks` and icons, and npm packages) come along automatically, from the same version.

```bash
npx shadcn@latest add @ftds/ftds-init
npx shadcn@latest add @ftds/button @ftds/field @ftds/input --overwrite
```

`--overwrite` replaces files shadcn's `init` created with the same name (such as `button.tsx`).

Installing straight from GitHub also works and needs no namespace, but always pin a release tag, and sign in with `gh auth login` because GitHub limits anonymous API requests to 60 an hour: `npx shadcn@latest add mof-malaysia/ftds/button#v2.1.0`.

## 3. Import the styles

`ftds-init` writes `styles/ftds.css` (colour tokens, light and dark themes, the Tailwind theme and base styles) and installs `tw-animate-css`. Import them in the global CSS file, in this order, and load the Inter font:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/ftds.css";
```

Adjust the relative path to wherever `styles/ftds.css` was written.

## 4. Where files go

| Item                                    | Installed to                     | Import from                    |
| --------------------------------------- | -------------------------------- | ------------------------------ |
| Components                              | `components/ui/<name>.tsx`       | `@/components/ui/<name>`       |
| Blocks (service screens, page sections) | `components/blocks/<name>.tsx`   | `@/components/blocks/<name>`   |
| Icons                                   | `components/ui/icons/<name>.tsx` | `@/components/ui/icons/<name>` |
| `utils` (`clx` and helpers)             | `lib/ftds/utils/`                | `@/lib/ftds/utils`             |
| `hooks`                                 | `lib/ftds/hooks/`                | `@/lib/ftds/hooks`             |
| Styles                                  | `styles/ftds.css`                | your global CSS                |

FTDS leaves shadcn's own `lib/utils.ts` (`cn`) alone; FTDS components use `clx` from `@/lib/ftds/utils`.

## 5. Dark mode

The dark theme switches on the `dark` class, on `<html>` for the whole page or on any element for a dark island. `ThemeProvider` holds the current theme, and `ThemeSwitch` lets people change it; the choice is saved in `localStorage` under `theme`.

Wrap the app in `ThemeProvider`. On mount it restores the theme saved under `storageKey` (default `"theme"`), or applies `defaultTheme`; `setTheme` (and `ThemeSwitch`) changes the class and saves the choice.

```tsx
import type { ReactNode } from "react";
import { ThemeProvider } from "@/lib/ftds/hooks";

export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="light">{children}</ThemeProvider>;
}
```

The provider reads the saved theme after the page has rendered, so a returning dark-mode visitor briefly sees the light theme. To avoid that flash, also apply the saved class in a blocking script in `<head>`:

```html
<script>
  document.documentElement.classList.add(
    localStorage.getItem("theme") ?? "light",
  );
</script>
```

In a server-rendered app, render the provider in a client component (`"use client"` in Next.js).

## 6. Density

Citizen-facing services use the default comfortable density (16px text, 44px controls). Officer tools use compact (14px text, 32px controls): set `data-density="compact"` on the container, or use `DeskShell`, which sets it. Everything inside follows, including control heights, text sizes and spacing.

```tsx
import type { ReactNode } from "react";

export function OfficerArea({ children }: { children: ReactNode }) {
  return <div data-density="compact">{children}</div>;
}
```

## 7. Check the install

Install `@ftds/button`, render `<Button>Continue</Button>`, and check it is a blue, 44px tall button with rounded corners in the Inter font. If it is unstyled, the CSS imports are missing or out of order; if imports fail, check the `@/` alias in `tsconfig.json` and `components.json`.
