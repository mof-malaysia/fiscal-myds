---
title: Desk Shell
description: Dense, keyboard-first frame for an officer workstation: icon rail, top bar with tabs and ⌘K search, status bar. Always compact, with shortcuts built in.
category: Layout
---

## When to use

- Use `DeskShell` for tools officers live in all day, where every destination has a keyboard shortcut: case queues, assessment desks, payment approval.
- Use `AppShell` instead when the navigation needs visible labels, groups and nested items.
- For a list beside its detail inside the page, use `SplitPane`. For lists, use `DataTable` or `WorkQueue`.
- `DeskShell` mounts the shortcut layer (`ShortcutProvider`) for you; see the Shortcuts page for adding screen commands with `useCommands` and `useShortcut`.

## Usage

Place `DeskRail`, `DeskTopBar`, `DeskPage` and `DeskStatusBar` directly inside `DeskShell`. Give each `DeskRailItem` a `label` (its tooltip and accessible name) and a `combo`: the shortcut presses the item and is listed in the ⌘K palette and the `?` cheat sheet as "Go to {label}".

```tsx
import type { ReactNode } from "react";
import {
  DeskPage,
  DeskRail,
  DeskRailBrand,
  DeskRailItem,
  DeskRailTrigger,
  DeskSearchTrigger,
  DeskShell,
  DeskSpacer,
  DeskStatusBar,
  DeskStatusItem,
  DeskTopBar,
} from "@/components/ui/desk-shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Tag } from "@/components/ui/tag";
import { FolderIcon } from "@/components/ui/icons/folder";
import { HomeIcon } from "@/components/ui/icons/home";
import { MoneyIcon } from "@/components/ui/icons/money";
import { SettingIcon } from "@/components/ui/icons/setting";

export function CaseDesk({
  section,
  title,
  children,
}: {
  section: "dashboard" | "queue" | "payments" | "settings";
  title: string;
  children: ReactNode;
}) {
  return (
    <DeskShell>
      <DeskRail>
        <DeskRailBrand render={<a href="/" aria-label="Case desk home" />}>
          K
        </DeskRailBrand>
        <DeskRailItem
          label="Dashboard"
          combo="g d"
          isActive={section === "dashboard"}
          render={<a href="/" />}
        >
          <HomeIcon />
        </DeskRailItem>
        <DeskRailItem
          label="Case queue"
          combo="g q"
          isActive={section === "queue"}
          render={<a href="/queue" />}
        >
          <FolderIcon />
        </DeskRailItem>
        <DeskRailItem
          label="Payments"
          combo="g p"
          isActive={section === "payments"}
          render={<a href="/payments" />}
        >
          <MoneyIcon />
        </DeskRailItem>
        <DeskSpacer />
        <DeskRailItem
          label="Settings"
          combo="g s"
          isActive={section === "settings"}
          render={<a href="/settings" />}
        >
          <SettingIcon />
        </DeskRailItem>
      </DeskRail>
      <DeskTopBar>
        <DeskRailTrigger />
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <DeskSpacer />
        <DeskSearchTrigger />
      </DeskTopBar>
      <DeskPage>{children}</DeskPage>
      <DeskStatusBar>
        <DeskStatusItem tone="success">Connected to SPEKS</DeskStatusItem>
        <DeskStatusItem>Signed in as Nur Aisyah binti Rahman</DeskStatusItem>
        <DeskSpacer />
        <DeskStatusItem>
          <Tag size="small" variant="warning">
            Staging
          </Tag>
          v2.4.0
        </DeskStatusItem>
      </DeskStatusBar>
    </DeskShell>
  );
}
```

Section tabs go in the top bar after the breadcrumb. `DeskTabs` is a `<nav>` of links (not a tablist), so give it an `aria-label`. A tab with a `combo` gets a tooltip with its key caps and a palette command; the command exists only while the tab is mounted.

```tsx
import { DeskTab, DeskTabs } from "@/components/ui/desk-shell";

const tabs = [
  { href: "/settings/access", label: "Access", combo: "g a" },
  { href: "/settings/keys", label: "API keys", combo: "g k" },
  { href: "/settings/webhooks", label: "Webhooks", combo: "g w" },
];

export function SettingsTabs({ current }: { current: string }) {
  return (
    <DeskTabs aria-label="Settings">
      {tabs.map((tab) => (
        <DeskTab
          key={tab.href}
          href={tab.href}
          combo={tab.combo}
          isActive={current === tab.href}
        >
          {tab.label}
        </DeskTab>
      ))}
    </DeskTabs>
  );
}
```

A rail item can also run an action instead of navigating. Hooks such as `useShortcutActions` need the shortcut layer, so call them in a component rendered inside `DeskShell`:

```tsx
import { DeskRailItem } from "@/components/ui/desk-shell";
import { useShortcutActions } from "@/components/ui/shortcuts";
import { QuestionCircleIcon } from "@/components/ui/icons/question-circle";

export function ShortcutsRailItem() {
  const { openCheatSheet } = useShortcutActions();
  return (
    <DeskRailItem label="Keyboard shortcuts" onClick={openCheatSheet}>
      <QuestionCircleIcon />
    </DeskRailItem>
  );
}
```

## Notes

- `DeskShell` sets `data-density="compact"` on itself; don't set it again or resize controls by hand.
- The frame fills the viewport (`h-dvh`) and only `DeskPage` scrolls. For edge-to-edge content such as a `SplitPane`, pass `className="p-0"` to `DeskPage`.
- Use a `DeskSpacer` to push what follows to the far end of the rail (settings, help), top bar (search) or status bar (environment, version).
- `DeskRailItem` and `DeskRailBrand` render a `<button>` and a `<div>` by default; pass `render={<a href="..." />}` or your router's link to navigate. The command presses the element, so router links see an ordinary click.
- Don't give two items the same `combo`, and don't use a combo that starts another (`g` and `g c`): a sequence fires as soon as it matches.
- Below `mobileBreakpoint` (768px by default) the rail becomes a left drawer with labelled rows; `DeskRailTrigger` opens it and renders nothing on wide screens. Control the drawer with `railOpen` and `onRailOpenChange`.
- `DeskSearchTrigger` opens the command palette (⌘K on macOS, Ctrl K elsewhere). `DeskStatusItem` is static text; pass `render={<button type="button" />}` to make it act, or use it as a `MenuTrigger`'s `render` to open a menu. `tone` adds a status dot; `warning` and `danger` also colour the text.
- Translate the shell's text with `labels` (`rail`, `openNavigation`, `navigationGroup`, `search`, `goTo`, where `goTo` keeps the `{label}` placeholder, for example `"Pergi ke {label}"`). Translate the palette and cheat sheet with `shortcuts={{ labels: { ... } }}`.
- `useDeskShell()` reads the shell's state (`isMobile`, `railOpen`, `setRailOpen`) and throws outside `DeskShell`.
