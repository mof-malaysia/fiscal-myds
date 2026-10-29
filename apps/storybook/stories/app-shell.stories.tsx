import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
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
  SidebarMenuCollapsible,
  SidebarMenuCollapsibleTrigger,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarTrigger,
  type AppShellProps,
} from "@mof-malaysia/ftds-react/app-shell";
import { Button } from "@mof-malaysia/ftds-react/button";
import {
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  MoneyIcon,
  SearchIcon,
  SettingIcon,
  UserGroupIcon,
  UserIcon,
} from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * The frame of an officer tool: a collapsible Sidebar on the Well, a top bar on Paper
 * with one Hairline rule, and the main content on Sheet. On wide screens the sidebar
 * collapses to an icon rail with tooltips; on narrow screens it becomes a left drawer
 * (Base UI Drawer: focus trap, Esc, swipe to close).
 *
 * ### Usage
 * ```tsx
 * <AppShell data-density="compact">
 *   <Sidebar>
 *     <SidebarContent>
 *       <SidebarGroup>
 *         <SidebarGroupLabel>Work</SidebarGroupLabel>
 *         <SidebarMenu>
 *           <SidebarMenuItem>
 *             <SidebarMenuButton render={<a href="/cases" />} isActive tooltip="Cases">
 *               <FolderIcon /><span>Cases</span>
 *             </SidebarMenuButton>
 *           </SidebarMenuItem>
 *         </SidebarMenu>
 *       </SidebarGroup>
 *     </SidebarContent>
 *   </Sidebar>
 *   <AppShellHeader><SidebarTrigger /></AppShellHeader>
 *   <AppShellMain>…</AppShellMain>
 * </AppShell>
 * ```
 */
const meta: Meta<typeof AppShell> = {
  title: "App/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
};

export default meta;

const Nav = () => (
  <Sidebar>
    <SidebarHeader>
      <div className="flex h-9 items-center gap-2 px-1">
        <span
          aria-hidden
          className="bg-primary-600 grid size-7 shrink-0 place-content-center rounded-md text-sm font-semibold text-white"
        >
          F
        </span>
        <span className="text-txt-black-900 truncate font-semibold group-data-[collapsible=icon]/sidebar:sr-only">
          Fiscal Portal
        </span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Work</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="#home" />} tooltip="Overview">
              <HomeIcon />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="#cases" />}
              isActive
              tooltip="Cases"
            >
              <FolderIcon />
              <span>Cases</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuCollapsible defaultOpen>
              <SidebarMenuCollapsibleTrigger tooltip="Payments">
                <MoneyIcon />
                <span>Payments</span>
              </SidebarMenuCollapsibleTrigger>
              <SidebarMenuSub>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#pending" />}>
                    <span>Pending approval</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<a href="#refunds" />}>
                    <span>Refunds</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenuSub>
            </SidebarMenuCollapsible>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="#reports" />} tooltip="Reports">
              <DocumentIcon />
              <span>Reports</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Administration</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="#officers" />}
              tooltip="Officers"
            >
              <UserGroupIcon />
              <span>Officers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="#settings" />}
              tooltip="Settings"
            >
              <SettingIcon />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Nur Aisyah">
            <UserIcon />
            <span>Nur Aisyah</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
);

const Frame = (props: AppShellProps) => (
  <AppShell className="h-[640px]" {...props}>
    <Nav />
    <AppShellHeader>
      <SidebarTrigger />
      <span className="text-txt-black-900 font-semibold">Cases</span>
      <Button variant="default-ghost" className="ml-auto">
        <SearchIcon className="size-4" aria-hidden />
        Search
      </Button>
    </AppShellHeader>
    <AppShellMain>
      <h1 className="text-txt-black-900 text-heading-2xs font-semibold">
        Cases
      </h1>
      <p className="text-txt-black-700 text-content mt-2 max-w-prose">
        128 open cases, 12 due this week. Use the button in the top bar to
        collapse the sidebar to icons; hover an icon to see its label.
      </p>
    </AppShellMain>
  </AppShell>
);

export const Default = createRender(() => <Frame />);

/** Officer tools run compact: 32px rows and tighter gaps. */
export const Compact = createRender(() => <Frame data-density="compact" />);

/** Starts on the icon rail. Labels stay available to screen readers and show in tooltips. */
export const IconRail = createRender(() => <Frame defaultOpen={false} />);

/** `collapsible="offcanvas"` hides the sidebar completely when collapsed. */
export const OffCanvas = createRender(() => <Frame collapsible="offcanvas" />);

/** Below `mobileBreakpoint` the sidebar becomes a drawer. Forced here with a large breakpoint. */
export const NarrowScreen = createRender(() => (
  <Frame mobileBreakpoint={100000} />
));

/** Controlled: the expanded state lives in the parent. */
const ControlledShell = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="flex flex-col">
      <p className="text-txt-black-700 p-3 text-sm">
        Sidebar is {open ? "expanded" : "collapsed"}.
      </p>
      <Frame open={open} onOpenChange={setOpen} />
    </div>
  );
};
export const Controlled = createRender(ControlledShell);

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Frame data-density="compact" />
    </div>
  ),
  "dark",
);
