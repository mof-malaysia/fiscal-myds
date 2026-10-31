import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
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
  DeskTab,
  DeskTabs,
  DeskTopBar,
  type DeskShellProps,
} from "@mof-malaysia/ftds-react/desk-shell";
import {
  useCommands,
  useShortcut,
  useShortcutActions,
  useShortcutScope,
  type ShortcutGroup,
} from "@mof-malaysia/ftds-react/shortcuts";
import { SplitPane } from "@mof-malaysia/ftds-react/split-pane";
import { Kbd } from "@mof-malaysia/ftds-react/kbd";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mof-malaysia/ftds-react/breadcrumb";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@mof-malaysia/ftds-react/menu";
import { Button } from "@mof-malaysia/ftds-react/button";
import { Tag } from "@mof-malaysia/ftds-react/tag";
import {
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  MoneyIcon,
  QuestionCircleIcon,
  SettingIcon,
} from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * The dense, keyboard-first frame of an officer workstation: a 48px icon rail, a 40px
 * top bar with breadcrumbs, section tabs and ⌘K search, the page, and a status bar.
 * It always runs in the compact density and mounts the shortcut layer.
 *
 * Use `AppShell` when navigation needs labels, groups and nesting; use `DeskShell` for
 * tools officers live in all day, where every destination has a shortcut.
 *
 * ### Keyboard
 * | Keys | Action |
 * | --- | --- |
 * | <kbd>⌘K</kbd> / <kbd>Ctrl K</kbd> | Command palette: every action on the current screen |
 * | <kbd>?</kbd> | Cheat sheet: every bound shortcut |
 * | <kbd>G</kbd> then a letter | Go to a section (shown in each rail tooltip) |
 * | Screen keys | Registered by the mounted screen, e.g. <kbd>J</kbd>/<kbd>K</kbd> in a list |
 *
 * Shortcuts stand down while you type in a field or while a dialog or menu is open.
 * Click inside the story first so it has keyboard focus.
 *
 * ### Usage
 * ```tsx
 * <DeskShell>
 *   <DeskRail>
 *     <DeskRailBrand>F</DeskRailBrand>
 *     <DeskRailItem label="Cases" combo="g c" render={<Link to="/cases" />} isActive>
 *       <FolderIcon />
 *     </DeskRailItem>
 *     <DeskSpacer />
 *     <DeskRailItem label="Settings" combo="g s" render={<Link to="/settings" />}>
 *       <SettingIcon />
 *     </DeskRailItem>
 *   </DeskRail>
 *   <DeskTopBar>
 *     <DeskRailTrigger />
 *     <Breadcrumb>…</Breadcrumb>
 *     <DeskSpacer />
 *     <DeskSearchTrigger />
 *   </DeskTopBar>
 *   <DeskPage>…</DeskPage>
 *   <DeskStatusBar>
 *     <DeskStatusItem tone="success">Connected</DeskStatusItem>
 *   </DeskStatusBar>
 * </DeskShell>
 *
 * // In any screen inside it
 * useCommands([{ id: "cases.new", title: "New case", group: "Cases", combo: "c", run: openNewCase }]);
 * useShortcut("j", next, { scope: "case-list" });
 * ```
 */
const meta: Meta<typeof DeskShell> = {
  title: "App/DeskShell",
  component: DeskShell,
  parameters: { layout: "fullscreen" },
};

export default meta;

type Section = "overview" | "cases" | "payments" | "reports" | "settings";
type SettingsTab = "access" | "keys" | "webhooks";

const SECTIONS: {
  id: Section;
  label: string;
  combo: string;
  icon: React.ReactNode;
}[] = [
  { id: "overview", label: "Overview", combo: "g o", icon: <HomeIcon /> },
  { id: "cases", label: "Cases", combo: "g c", icon: <FolderIcon /> },
  { id: "payments", label: "Payments", combo: "g p", icon: <MoneyIcon /> },
  { id: "reports", label: "Reports", combo: "g r", icon: <DocumentIcon /> },
];

const SETTINGS_TABS: { id: SettingsTab; label: string; combo: string }[] = [
  { id: "access", label: "Access", combo: "g a" },
  { id: "keys", label: "API keys", combo: "g k" },
  { id: "webhooks", label: "Webhooks", combo: "g w" },
];

const LIST_KEYS: ShortcutGroup[] = [
  {
    group: "Lists",
    items: [
      { combo: "j", title: "Next row" },
      { combo: "k", title: "Previous row" },
    ],
  },
];

const CASES = [
  { id: "KK-2026-0412", name: "Refund: Syarikat Maju Jaya", status: "Pending" },
  {
    id: "KK-2026-0398",
    name: "Grant claim: Koperasi Tani",
    status: "In review",
  },
  {
    id: "KK-2026-0377",
    name: "Duty exemption: Pelabuhan Klang",
    status: "Pending",
  },
  {
    id: "KK-2026-0351",
    name: "Audit query: Majlis Daerah",
    status: "Approved",
  },
  {
    id: "KK-2026-0344",
    name: "Refund: Kedai Runcit Aminah",
    status: "Approved",
  },
  {
    id: "KK-2026-0329",
    name: "Allocation: Jabatan Kerja Raya",
    status: "Rejected",
  },
];

/** The help item needs the shortcut layer, so it lives in a component under DeskShell. */
const HelpItem = () => {
  const { openCheatSheet } = useShortcutActions();
  return (
    <DeskRailItem label="Keyboard shortcuts" onClick={openCheatSheet}>
      <QuestionCircleIcon />
    </DeskRailItem>
  );
};

/** A list | detail screen: j/k move the selection while the screen is mounted. */
const CasesScreen = ({ onAction }: { onAction: (text: string) => void }) => {
  const [selected, setSelected] = React.useState(0);
  const current = CASES[selected];
  useShortcutScope("case-list");
  useShortcut(
    "j",
    () => setSelected((i) => Math.min(CASES.length - 1, i + 1)),
    {
      scope: "case-list",
    },
  );
  useShortcut("k", () => setSelected((i) => Math.max(0, i - 1)), {
    scope: "case-list",
  });
  useCommands([
    {
      id: "cases.new",
      title: "New case",
      group: "Cases",
      combo: "c",
      run: () => onAction("New case started"),
    },
    {
      id: "cases.approve",
      title: `Approve ${current.id}`,
      group: "Cases",
      combo: "shift+a",
      run: () => onAction(`Approved ${current.id}`),
    },
    {
      id: "cases.assign",
      title: "Assign to me",
      group: "Cases",
      combo: "i",
      keywords: ["take", "claim"],
      run: () => onAction(`Assigned ${current.id} to you`),
    },
  ]);

  return (
    <SplitPane
      storageKey="storybook.desk.cases"
      defaultWidth={320}
      startLabel="Cases"
      endLabel="Case detail"
      start={
        <ul className="m-0 list-none p-0" aria-label="Cases">
          {CASES.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                aria-current={i === selected || undefined}
                onClick={() => setSelected(i)}
                className="border-otl-gray-200 hover:bg-bg-washed aria-[current]:bg-bg-primary-50 flex h-10 w-full cursor-pointer items-center gap-3 border-b px-3 text-left"
              >
                <span className="text-txt-black-500 text-label-compact font-mono">
                  {item.id}
                </span>
                <span className="text-txt-black-900 text-content min-w-0 flex-1 truncate">
                  {item.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      }
      end={
        <div className="p-surface">
          <p className="text-txt-black-500 text-label-compact font-mono">
            {current.id}
          </p>
          <h2 className="text-txt-black-900 text-heading-2xs mt-1 font-semibold">
            {current.name}
          </h2>
          <p className="text-txt-black-700 text-content mt-2">
            Status: {current.status}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="primary-fill"
              onClick={() => onAction(`Approved ${current.id}`)}
            >
              Approve <Kbd combo="shift+a" inverse />
            </Button>
            <Button
              variant="default-outline"
              onClick={() => onAction(`Assigned ${current.id} to you`)}
            >
              Assign to me <Kbd combo="i" />
            </Button>
          </div>
          <p className="text-txt-black-500 text-content mt-6 max-w-prose">
            Press <Kbd combo="j" /> and <Kbd combo="k" /> to move through the
            list, <Kbd combo="mod+k" /> to see this screen&apos;s commands, or
            drag the divider (arrow keys work on it too).
          </p>
        </div>
      }
    />
  );
};

const Placeholder = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <>
    <h1 className="text-txt-black-900 text-heading-2xs font-semibold">
      {title}
    </h1>
    <p className="text-txt-black-700 text-content mt-2 max-w-prose">
      {children ?? (
        <>
          Press <Kbd combo="g c" /> to open Cases, <Kbd combo="mod+k" /> for the
          command palette or <Kbd combo="?" /> for every shortcut.
        </>
      )}
    </p>
  </>
);

interface DemoProps extends Partial<DeskShellProps> {
  initialSection?: Section;
}

const Demo = ({ initialSection = "overview", ...props }: DemoProps) => {
  const [section, setSection] = React.useState<Section>(initialSection);
  const [tab, setTab] = React.useState<SettingsTab>("access");
  const [lastAction, setLastAction] = React.useState<string>();
  const sectionLabel =
    section === "settings"
      ? "Settings"
      : SECTIONS.find((s) => s.id === section)!.label;

  return (
    <DeskShell
      className="h-[640px]"
      shortcuts={{ extraShortcuts: LIST_KEYS }}
      {...props}
    >
      <DeskRail>
        <DeskRailBrand>F</DeskRailBrand>
        {SECTIONS.map((item) => (
          <DeskRailItem
            key={item.id}
            label={item.label}
            combo={item.combo}
            isActive={section === item.id}
            onClick={() => setSection(item.id)}
          >
            {item.icon}
          </DeskRailItem>
        ))}
        <DeskSpacer />
        <DeskRailItem
          label="Settings"
          combo="g s"
          isActive={section === "settings"}
          onClick={() => setSection("settings")}
        >
          <SettingIcon />
        </DeskRailItem>
        <HelpItem />
      </DeskRail>

      <DeskTopBar>
        <DeskRailTrigger />
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbPage>{sectionLabel}</BreadcrumbPage>
          </BreadcrumbItem>
          {section === "settings" && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {SETTINGS_TABS.find((t) => t.id === tab)!.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </Breadcrumb>
        {section === "settings" && (
          <DeskTabs aria-label="Settings">
            {SETTINGS_TABS.map((item) => (
              <DeskTab
                key={item.id}
                href={`#${item.id}`}
                combo={item.combo}
                isActive={tab === item.id}
                onClick={(event) => {
                  event.preventDefault();
                  setTab(item.id);
                }}
              >
                {item.label}
              </DeskTab>
            ))}
          </DeskTabs>
        )}
        <DeskSpacer />
        <DeskSearchTrigger />
      </DeskTopBar>

      <DeskPage className={section === "cases" ? "p-0" : undefined}>
        {section === "cases" ? (
          <CasesScreen onAction={setLastAction} />
        ) : section === "settings" ? (
          <Placeholder title={SETTINGS_TABS.find((t) => t.id === tab)!.label}>
            Settings tabs have their own shortcuts: <Kbd combo="g a" />,{" "}
            <Kbd combo="g k" /> and <Kbd combo="g w" />. They exist only while
            Settings is open.
          </Placeholder>
        ) : (
          <Placeholder title={sectionLabel} />
        )}
      </DeskPage>

      <DeskStatusBar>
        <Menu>
          <MenuTrigger
            render={
              <DeskStatusItem
                render={<button type="button" />}
                tone="success"
              />
            }
          >
            Connected to SPEKS
          </MenuTrigger>
          <MenuContent side="top" align="start">
            <MenuItem>Reconnect</MenuItem>
            <MenuItem>Sign out</MenuItem>
          </MenuContent>
        </Menu>
        <DeskStatusItem render={<button type="button" />}>
          Recording as Nur Aisyah
        </DeskStatusItem>
        {lastAction && (
          <DeskStatusItem role="status" aria-live="polite">
            {lastAction}
          </DeskStatusItem>
        )}
        <DeskSpacer />
        <DeskStatusItem>
          <Tag size="small" variant="warning">
            Staging
          </Tag>
          <span className="text-txt-black-500">v2.4.0</span>
        </DeskStatusItem>
      </DeskStatusBar>
    </DeskShell>
  );
};

/** Rail, breadcrumbs, ⌘K search and the status bar. Hover a rail icon for its shortcut. */
export const Default = createRender(() => <Demo />);

/** Section tabs in the top bar, each with its own `g`-sequence. */
export const WithTabs = createRender(() => <Demo initialSection="settings" />);

/**
 * A list | detail screen in a `SplitPane`. The screen registers its own commands
 * (`c`, `i`, `⇧A`) and scoped list keys (`j`/`k`); open the palette or the cheat sheet
 * to see them, then switch sections and watch them disappear.
 */
export const WithSplitPane = createRender(() => (
  <Demo initialSection="cases" />
));

/** Below `mobileBreakpoint` the rail becomes a drawer with labelled rows. Forced here with a large breakpoint. */
export const NarrowScreen = createRender(() => (
  <Demo mobileBreakpoint={100000} />
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Demo initialSection="cases" />
    </div>
  ),
  "dark",
);
