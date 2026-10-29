---
title: App Shell
description: Frame of an officer tool with a labelled, grouped Sidebar that collapses to an icon rail and becomes a drawer on narrow screens, a top bar and a scrolling main area.
category: Layout
---

## When to use

- Use `AppShell` for an officer tool whose navigation needs labels, groups and nested items (Payments > Pending approval, Refunds).
- Use `DeskShell` instead for a dense, keyboard-first workstation that officers keep open all day: an icon rail, section tabs, ⌘K and a status bar.
- Citizen services don't use a shell: they use `Masthead`, a top bar or `Navbar`, a centred column and `Footer` (see the layouts guide).
- Inside the main area, open the page with a `PageHeader`, and use `SplitPane` for a list beside its detail.

## Usage

Place `Sidebar`, `AppShellHeader` and `AppShellMain` directly inside `AppShell`. Each navigation item is a `SidebarMenuButton` holding an icon and a `<span>` label; pass `render={<a href="..." />}` (or your router's link) so it navigates, and `tooltip` so the label shows when the sidebar is collapsed to the icon rail.

```tsx
import type { ReactNode } from "react";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/app-shell";
import { FolderIcon } from "@/components/ui/icons/folder";
import { HomeIcon } from "@/components/ui/icons/home";
import { MoneyIcon } from "@/components/ui/icons/money";
import { SettingIcon } from "@/components/ui/icons/setting";

export function ReliefOfficerApp({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <AppShell data-density="compact" storageKey="relief-portal.sidebar">
      <Sidebar>
        <SidebarHeader>
          <span className="text-txt-black-900 truncate px-1 font-semibold group-data-[collapsible=icon]/sidebar:sr-only">
            Tax Relief Portal
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Work</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<a href="/" />}
                  isActive={current === "overview"}
                  tooltip="Overview"
                >
                  <HomeIcon />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<a href="/applications" />}
                  isActive={current === "applications"}
                  tooltip="Applications"
                >
                  <FolderIcon />
                  <span>Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<a href="/payments" />}
                  isActive={current === "payments"}
                  tooltip="Payments"
                >
                  <MoneyIcon />
                  <span>Payments</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/settings" />}
                isActive={current === "settings"}
                tooltip="Settings"
              >
                <SettingIcon />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <AppShellHeader>
        <SidebarTrigger />
        <span className="text-txt-black-700 text-content">
          Nur Aisyah binti Rahman, Relief Assessment Unit
        </span>
      </AppShellHeader>
      <AppShellMain>{children}</AppShellMain>
    </AppShell>
  );
}
```

Nested items expand and collapse with `SidebarMenuCollapsible`. The nested list (`SidebarMenuSub`) is hidden on the icon rail; pressing the trigger there expands the sidebar first.

```tsx
import {
  SidebarMenuButton,
  SidebarMenuCollapsible,
  SidebarMenuCollapsibleTrigger,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/app-shell";
import { MoneyIcon } from "@/components/ui/icons/money";

export function PaymentsNavItem({ current }: { current: string }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuCollapsible defaultOpen>
        <SidebarMenuCollapsibleTrigger tooltip="Payments">
          <MoneyIcon />
          <span>Payments</span>
        </SidebarMenuCollapsibleTrigger>
        <SidebarMenuSub>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="/payments/pending" />}
              isActive={current === "pending"}
            >
              <span>Pending approval</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="/payments/refunds" />}
              isActive={current === "refunds"}
            >
              <span>Refunds</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenuSub>
      </SidebarMenuCollapsible>
    </SidebarMenuItem>
  );
}
```

`collapsible` sets what happens on wide screens: `"icon"` (default) shrinks to the icon rail, `"offcanvas"` hides the sidebar completely, `"none"` keeps it open (and `SidebarTrigger` renders nothing there). Below `mobileBreakpoint` (768px by default) the sidebar is always a left drawer.

## Notes

- `AppShell` does not set the density. Officer tools set `data-density="compact"` on it themselves.
- The frame fills the viewport (`h-dvh`) and only `AppShellMain` scrolls. To embed it in a page, pass a height in `className`.
- Put each item's label in a `<span>`: on the icon rail every child that isn't an `svg` is visually hidden but stays readable by screen readers. Text you add to `SidebarHeader` yourself needs `group-data-[collapsible=icon]/sidebar:sr-only` to hide on the rail.
- `isActive` gives the current page the Blue Wash and `aria-current="page"`. Set it on exactly one item.
- On narrow screens the drawer traps focus and closes on Esc, the scrim, a swipe or choosing an item.
- Open state is controlled with `open` and `onOpenChange` (wide screens) and `openMobile` and `onOpenMobileChange` (the drawer), or uncontrolled with `defaultOpen`. `storageKey` remembers the expanded state in localStorage when `open` is uncontrolled.
- Read or change the state from any child with `useSidebar()` (`state`, `isMobile`, `toggleSidebar`, ...). It throws outside `AppShell` or `AppShellProvider`; use `AppShellProvider` directly to build a custom layout around the sidebar parts.
- Built-in text is English: pass `label` to `Sidebar` (landmark name, default "Main navigation") and to `SidebarTrigger` (default "Toggle navigation") to translate it.
