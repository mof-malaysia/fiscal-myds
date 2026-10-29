import React from "react";
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
} from "@mof-malaysia/myds-react/desk-shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mof-malaysia/myds-react/breadcrumb";
import { Tag } from "@mof-malaysia/myds-react/tag";
import { AutoToast } from "@mof-malaysia/myds-react/toast";
import {
  FolderIcon,
  HomeIcon,
  SettingIcon,
} from "@mof-malaysia/myds-react/icon";
import { ME } from "./officer-data";

export type OfficerPage = "dashboard" | "queue" | "case";

export interface Crumb {
  label: string;
  onClick?: () => void;
}

/** The DeskShell frame shared by the officer example pages. */
export const OfficerShell = ({
  page,
  onNavigate,
  crumbs,
  flush = false,
  children,
}: {
  page: OfficerPage;
  onNavigate: (page: OfficerPage) => void;
  crumbs: Crumb[];
  /** Edge-to-edge page content (no page padding). */
  flush?: boolean;
  children: React.ReactNode;
}) => (
  <DeskShell
    className="h-dvh"
    shortcuts={{
      extraShortcuts: [
        {
          group: "Queue",
          items: [
            { combo: "j", title: "Next case" },
            { combo: "k", title: "Previous case" },
            { combo: "enter", title: "Open the case" },
            { combo: "x", title: "Select the case" },
            { combo: "/", title: "Search the queue" },
          ],
        },
      ],
    }}
  >
    <DeskRail>
      <DeskRailBrand>K</DeskRailBrand>
      <DeskRailItem
        label="Dashboard"
        combo="g d"
        isActive={page === "dashboard"}
        onClick={() => onNavigate("dashboard")}
      >
        <HomeIcon />
      </DeskRailItem>
      <DeskRailItem
        label="Case queue"
        combo="g q"
        isActive={page === "queue" || page === "case"}
        onClick={() => onNavigate("queue")}
      >
        <FolderIcon />
      </DeskRailItem>
      <DeskSpacer />
      <DeskRailItem label="Settings" combo="g s">
        <SettingIcon />
      </DeskRailItem>
    </DeskRail>
    <DeskTopBar>
      <DeskRailTrigger />
      <Breadcrumb>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.label}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.onClick ? (
                <BreadcrumbLink
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    crumb.onClick!();
                  }}
                >
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </Breadcrumb>
      <DeskSpacer />
      <DeskSearchTrigger />
    </DeskTopBar>
    <DeskPage className={flush ? "p-0" : undefined}>{children}</DeskPage>
    <DeskStatusBar>
      <DeskStatusItem tone="success">Connected to SPEKS</DeskStatusItem>
      <DeskStatusItem>Signed in as {ME}</DeskStatusItem>
      <DeskSpacer />
      <DeskStatusItem>
        <Tag size="small" variant="warning">
          Staging
        </Tag>
        <span className="text-txt-black-500">Kewangan Kes v2.4.0</span>
      </DeskStatusItem>
    </DeskStatusBar>
    <AutoToast />
  </DeskShell>
);
