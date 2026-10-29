"use client";

import React, {
  ComponentProps,
  ReactElement,
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva } from "class-variance-authority";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  ShortcutProvider,
  useCommands,
  useShortcutActions,
  useShortcutLabels,
  type ShortcutProviderProps,
} from "@/components/ui/shortcuts";
import { HamburgerMenuIcon } from "@/components/ui/icons/hamburger-menu";
import { SearchIcon } from "@/components/ui/icons/search";
import {
  useControllableState,
  useMediaQuery,
  useMergedRefs,
} from "@/lib/ftds/hooks";
import { clx } from "@/lib/ftds/utils";

/**
 * DeskShell is the dense, keyboard-first frame of an officer workstation: a 48px
 * icon rail, a 40px top bar (breadcrumbs, section tabs, ⌘K search), the page,
 * and a status bar. It runs in the compact density and mounts the shortcut layer
 * (`ShortcutProvider`), so ⌘K opens the command palette and `?` the cheat sheet.
 *
 * Give a rail item or tab a `combo` (e.g. `g c`) and it becomes a navigation
 * command: listed in the palette and cheat sheet, and the shortcut presses it.
 *
 * Below `mobileBreakpoint` the rail becomes a left drawer with labels; put a
 * `DeskRailTrigger` in the top bar to open it.
 *
 * Use `AppShell` instead when the navigation needs labels, groups and nesting.
 *
 * @example
 * <DeskShell>
 *   <DeskRail>
 *     <DeskRailBrand>F</DeskRailBrand>
 *     <DeskRailItem label="Cases" combo="g c" render={<a href="/cases" />} isActive>
 *       <FolderIcon />
 *     </DeskRailItem>
 *     <DeskSpacer />
 *     <DeskRailItem label="Settings" combo="g s" render={<a href="/settings" />}>
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
 */

interface DeskShellLabels {
  /** Accessible name of the rail landmark. */
  rail: string;
  /** Accessible name of the rail trigger (narrow screens). */
  openNavigation: string;
  /** Palette and cheat-sheet group of rail and tab commands. */
  navigationGroup: string;
  /** Search trigger text. */
  search: string;
  /** Builds the command title of a rail item or tab from its label. */
  goTo: string;
}

const DEFAULT_LABELS: DeskShellLabels = {
  rail: "Sections",
  openNavigation: "Open navigation",
  navigationGroup: "Navigation",
  search: "Search…",
  goTo: "Go to {label}",
};

interface DeskShellContextValue {
  isMobile: boolean;
  /** Narrow screens: whether the rail drawer is open. */
  railOpen: boolean;
  setRailOpen: (open: boolean) => void;
  railId: string;
  labels: DeskShellLabels;
}

const DeskShellContext = createContext<DeskShellContextValue | null>(null);

function useDeskShell() {
  const context = useContext(DeskShellContext);
  if (!context)
    throw new Error("useDeskShell must be used inside <DeskShell>.");
  return context;
}

/** How rail children render: in the rail on wide screens, as labelled rows in the drawer on narrow ones. */
type RailLayout = "rail" | "drawer";
const RailLayoutContext = createContext<RailLayout>("rail");

/*========================================================================================================================*/

interface DeskShellProps extends ComponentProps<"div"> {
  /** Narrow screens: whether the rail drawer is open (controlled). */
  railOpen?: boolean;
  onRailOpenChange?: (open: boolean) => void;
  /**
   * Below this width (px) the rail becomes a drawer.
   * @default 768
   */
  mobileBreakpoint?: number;
  /** Text for the shell's own controls and navigation commands. */
  labels?: Partial<DeskShellLabels>;
  /** Passed to the `ShortcutProvider` it mounts (ignored inside an existing one). */
  shortcuts?: Omit<ShortcutProviderProps, "children">;
}

/**
 * The frame. Fills the viewport height (`h-dvh`); pass a `className` height to embed it.
 * Place `DeskRail`, `DeskTopBar`, `DeskPage` and `DeskStatusBar` directly inside.
 */
const DeskShell = forwardRef<HTMLDivElement, DeskShellProps>(
  (
    {
      className,
      railOpen: railOpenProp,
      onRailOpenChange,
      mobileBreakpoint = 768,
      labels: labelsProp,
      shortcuts,
      ...props
    },
    ref,
  ) => {
    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 0.02}px)`);
    const railId = useId();
    const [railOpen = false, setRailOpen] = useControllableState({
      prop: railOpenProp,
      defaultProp: false,
      onChange: onRailOpenChange,
    });

    // Leaving the narrow layout closes the drawer
    useEffect(() => {
      if (!isMobile && railOpen) setRailOpen(false);
    }, [isMobile, railOpen, setRailOpen]);

    const labelsKey = JSON.stringify(labelsProp);
    const value = useMemo<DeskShellContextValue>(
      () => ({
        isMobile,
        railOpen,
        setRailOpen,
        railId,
        labels: { ...DEFAULT_LABELS, ...labelsProp },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isMobile, railOpen, setRailOpen, railId, labelsKey],
    );

    return (
      <ShortcutProvider {...shortcuts}>
        <DeskShellContext.Provider value={value}>
          <div
            ref={ref}
            data-density="compact"
            className={clx(
              // Rail spans all three rows of column 1; top bar, page and status bar stack in column 2.
              // On narrow screens the rail is a drawer, so column 1 collapses to nothing.
              "bg-bg-white text-txt-black-900 font-body grid h-dvh w-full overflow-hidden",
              "grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)_auto]",
              className,
            )}
            {...props}
          />
        </DeskShellContext.Provider>
      </ShortcutProvider>
    );
  },
);
DeskShell.displayName = "DeskShell";

/*========================================================================================================================*/

interface DeskRailProps extends ComponentProps<"nav"> {}

const desk_rail_cva = cva("flex min-h-0 flex-col overflow-y-auto", {
  variants: {
    layout: {
      rail: "bg-bg-washed border-otl-gray-200 col-start-1 row-span-3 row-start-1 h-full w-12 items-center gap-1 border-r py-2",
      drawer: "flex-1 gap-0.5 p-2",
    },
  },
});

/**
 * The icon rail on the Well, with a Hairline rule on its right. Items stack from the
 * top; put a `DeskSpacer` before the ones that belong at the bottom (settings, help).
 * On narrow screens the same children render as labelled rows in a left drawer.
 */
const DeskRail = forwardRef<HTMLElement, DeskRailProps>(
  ({ className, children, "aria-label": ariaLabel, ...props }, ref) => {
    const { isMobile, railOpen, setRailOpen, railId, labels } = useDeskShell();
    const label = ariaLabel ?? labels.rail;
    const layout: RailLayout = isMobile ? "drawer" : "rail";

    const nav = (
      <nav
        ref={ref}
        id={railId}
        aria-label={label}
        data-layout={layout}
        className={clx(desk_rail_cva({ layout }), className)}
        {...props}
      >
        <RailLayoutContext.Provider value={layout}>
          {children}
        </RailLayoutContext.Provider>
      </nav>
    );

    if (!isMobile) return nav;

    return (
      <Drawer side="left" open={railOpen} onOpenChange={setRailOpen}>
        {/* Kept mounted while closed, so the items' navigation commands stay registered */}
        <DrawerContent
          keepMounted
          aria-label={label}
          handle={false}
          hideClose
          className="bg-bg-washed w-[min(16rem,calc(100vw-3rem))]"
        >
          {nav}
        </DrawerContent>
      </Drawer>
    );
  },
);
DeskRail.displayName = "DeskRail";

interface DeskRailBrandProps extends useRender.ComponentProps<"div"> {}

/** A 28px mark at the top of the rail: an initial or a logo. Pass `render={<a href="/" />}` to link home. */
const DeskRailBrand = forwardRef<HTMLDivElement, DeskRailBrandProps>(
  ({ className, render, ...props }, ref) => {
    const layout = useContext(RailLayoutContext);
    return useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          className: clx(
            "bg-bg-primary-600 text-txt-white mb-2 grid size-7 shrink-0 place-content-center overflow-hidden rounded-md",
            "text-label-md font-semibold no-underline focus-ring",
            "[&>img]:size-full [&>img]:object-contain",
            layout === "drawer" && "mx-2 mt-1",
            className,
          ),
        },
        props,
      ),
    });
  },
);
DeskRailBrand.displayName = "DeskRailBrand";

/*========================================================================================================================*/

/**
 * Registers a navigation command that presses `target` (a link or button).
 * Router links work too: their click handler sees an ordinary click.
 */
function useNavigationCommand(
  target: React.RefObject<HTMLElement | null>,
  {
    label,
    combo,
    commandTitle,
    keywords,
  }: {
    label: string;
    combo?: string;
    commandTitle?: string;
    keywords?: string[];
  },
) {
  const { labels } = useDeskShell();
  useCommands(
    combo
      ? [
          {
            id: `desk.nav.${combo}`,
            title: commandTitle ?? labels.goTo.replace("{label}", label),
            group: labels.navigationGroup,
            combo,
            keywords,
            run: () => target.current?.click(),
          },
        ]
      : [],
  );
}

/** Wraps a rail item or tab in a tooltip with its label and the shortcut's key caps. */
const ShortcutTooltip = ({
  label,
  combo,
  side,
  children,
}: {
  label: ReactNode;
  combo?: string;
  side: "right" | "bottom";
  children: ReactElement;
}) => {
  const { sequenceThen } = useShortcutLabels();
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side} sideOffset={8}>
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          {label}
          {combo && <Kbd combo={combo} thenLabel={sequenceThen} inverse />}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};

const desk_rail_item_cva = cva(
  [
    "relative flex shrink-0 cursor-pointer select-none items-center rounded-md no-underline",
    "text-txt-black-700 text-label-md font-medium outline-none transition-colors duration-150 motion-reduce:transition-none",
    "hover:bg-bg-raised hover:text-txt-black-900 focus-ring",
    "data-[active]:bg-bg-primary-50 data-[active]:text-txt-primary",
    "[&>svg]:size-[1.125rem] [&>svg]:shrink-0",
  ],
  {
    variants: {
      layout: {
        // A 32px square; the accent bar sits on the rail's left edge
        rail: [
          "size-8 justify-center",
          "data-[active]:before:absolute data-[active]:before:inset-y-1.5 data-[active]:before:-left-2 data-[active]:before:w-0.5",
          "data-[active]:before:bg-txt-primary data-[active]:before:rounded-full data-[active]:before:content-['']",
        ],
        // A labelled row
        drawer: "h-[var(--ctl-h-sm)] w-full gap-3 px-3",
      },
    },
  },
);

interface DeskRailItemProps extends useRender.ComponentProps<"button"> {
  /** The destination's name: the tooltip, the accessible name, and the row label in the drawer. */
  label: string;
  /** Marks the current section: Blue Wash, an accent bar and `aria-current="page"`. */
  isActive?: boolean;
  /** Shortcut that presses this item, e.g. `g c`. Also lists it in the palette and cheat sheet. */
  combo?: string;
  /** Palette title of the command. Defaults to "Go to {label}". */
  commandTitle?: string;
  /** Extra palette search terms. */
  keywords?: string[];
}

/**
 * A 32px icon button in the rail. Put the icon inside; the label shows in a tooltip
 * with the shortcut. Renders a `<button>`; pass `render={<a href="…" />}` (or your
 * router's link) to navigate. On narrow screens, choosing an item closes the drawer.
 */
const DeskRailItem = forwardRef<HTMLButtonElement, DeskRailItemProps>(
  (
    {
      className,
      render,
      label,
      isActive = false,
      combo,
      commandTitle,
      keywords,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const { isMobile, setRailOpen } = useDeskShell();
    const { sequenceThen } = useShortcutLabels();
    const layout = useContext(RailLayoutContext);
    const innerRef = useRef<HTMLButtonElement>(null);
    const ref = useMergedRefs(innerRef, forwardedRef);

    useNavigationCommand(innerRef, { label, combo, commandTitle, keywords });

    const element = useRender({
      defaultTagName: "button",
      render,
      ref,
      props: mergeProps<"button">(
        {
          className: clx(desk_rail_item_cva({ layout }), className),
          ...(render ? {} : { type: "button" as const }),
          ...(layout === "rail" && { "aria-label": label }),
          ...(isActive && {
            "data-active": "",
            "aria-current": "page" as const,
          }),
          onClick: () => {
            if (isMobile) setRailOpen(false);
          },
          children: (
            <>
              {children}
              {layout === "drawer" && (
                <span className="min-w-0 flex-1 truncate text-left">
                  {label}
                </span>
              )}
              {layout === "drawer" && combo && (
                <Kbd combo={combo} thenLabel={sequenceThen} aria-hidden />
              )}
            </>
          ),
        },
        props,
      ),
    });

    if (layout === "drawer") return element;
    return (
      <ShortcutTooltip label={label} combo={combo} side="right">
        {element}
      </ShortcutTooltip>
    );
  },
);
DeskRailItem.displayName = "DeskRailItem";

/*========================================================================================================================*/

/** Pushes what follows it to the far end of a rail, top bar or status bar. */
const DeskSpacer = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const layout = useContext(RailLayoutContext);
    return (
      <div
        ref={ref}
        aria-hidden
        className={clx(
          // In the drawer, a gap with a Hairline instead of empty height
          layout === "drawer"
            ? "border-otl-gray-200 my-2 border-t"
            : "min-h-0 min-w-0 flex-1",
          className,
        )}
        {...props}
      />
    );
  },
);
DeskSpacer.displayName = "DeskSpacer";

interface DeskRailTriggerProps extends Omit<ButtonProps, "iconOnly"> {
  /** Accessible label. Defaults to the shell's `openNavigation` label. */
  label?: string;
}

/** Opens the rail drawer. Renders only on narrow screens, where the rail is hidden. */
const DeskRailTrigger = forwardRef<HTMLButtonElement, DeskRailTriggerProps>(
  (
    {
      label,
      children,
      onClick,
      variant = "default-ghost",
      size = "small",
      ...props
    },
    ref,
  ) => {
    const { isMobile, railOpen, setRailOpen, labels } = useDeskShell();
    if (!isMobile) return null;

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        iconOnly
        aria-label={label ?? labels.openNavigation}
        aria-expanded={railOpen}
        onClick={(event) => {
          onClick?.(event);
          setRailOpen(!railOpen);
        }}
        {...props}
      >
        {children ?? <HamburgerMenuIcon aria-hidden className="size-5" />}
      </Button>
    );
  },
);
DeskRailTrigger.displayName = "DeskRailTrigger";

/*========================================================================================================================*/

/**
 * The 40px top bar on Paper with one Hairline rule. Holds breadcrumbs, `DeskTabs`,
 * a `DeskSpacer` and the `DeskSearchTrigger`, in that order.
 */
const DeskTopBar = forwardRef<HTMLElement, ComponentProps<"header">>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={clx(
        "bg-bg-gray-50 border-otl-gray-200 col-start-2 row-start-1 flex h-10 min-w-0 shrink-0 items-center gap-3 border-b px-3",
        className,
      )}
      {...props}
    />
  ),
);
DeskTopBar.displayName = "DeskTopBar";

/** Section tabs in the top bar: navigation links, not a tablist. */
const DeskTabs = forwardRef<HTMLElement, ComponentProps<"nav">>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={clx(
        "-mb-px flex min-w-0 gap-1 self-stretch overflow-x-auto",
        className,
      )}
      {...props}
    />
  ),
);
DeskTabs.displayName = "DeskTabs";

interface DeskTabProps extends useRender.ComponentProps<"a"> {
  /** The tab's name for its command and tooltip. Defaults to the children when they are plain text. */
  label?: string;
  /** Marks the current page: primary text, a 2px underline and `aria-current="page"`. */
  isActive?: boolean;
  /** Shortcut that follows this tab, e.g. `g k`. Shown in a tooltip and listed in the palette. */
  combo?: string;
  /** Palette title of the command. Defaults to "Go to {label}". */
  commandTitle?: string;
  /** Extra palette search terms. */
  keywords?: string[];
}

/** One tab. Renders an `<a>`; pass `render` for your router's link. */
const DeskTab = forwardRef<HTMLAnchorElement, DeskTabProps>(
  (
    {
      className,
      render,
      label: labelProp,
      isActive = false,
      combo,
      commandTitle,
      keywords,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const innerRef = useRef<HTMLAnchorElement>(null);
    const ref = useMergedRefs(innerRef, forwardedRef);
    const label = labelProp ?? (typeof children === "string" ? children : "");

    useNavigationCommand(innerRef, { label, combo, commandTitle, keywords });

    const element = useRender({
      defaultTagName: "a",
      render,
      ref,
      props: mergeProps<"a">(
        {
          className: clx(
            "flex shrink-0 items-center border-b-2 border-transparent px-2 no-underline",
            "text-txt-black-700 text-label-md font-medium whitespace-nowrap",
            "hover:text-txt-black-900 transition-colors duration-150 motion-reduce:transition-none focus-ring",
            "data-[active]:border-txt-primary data-[active]:text-txt-primary",
            className,
          ),
          ...(isActive && {
            "data-active": "",
            "aria-current": "page" as const,
          }),
          children,
        },
        props,
      ),
    });

    if (!combo) return element;
    return (
      <ShortcutTooltip label={label || children} combo={combo} side="bottom">
        {element}
      </ShortcutTooltip>
    );
  },
);
DeskTab.displayName = "DeskTab";

interface DeskSearchTriggerProps extends ComponentProps<"button"> {}

/** A search field look-alike that opens the command palette, with its ⌘K hint. */
const DeskSearchTrigger = forwardRef<HTMLButtonElement, DeskSearchTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const { openPalette } = useShortcutActions();
    const { labels } = useDeskShell();
    const text = children ?? labels.search;

    return (
      <button
        ref={ref}
        type="button"
        aria-keyshortcuts="Meta+K Control+K"
        className={clx(
          "border-otl-gray-200 bg-bg-white text-txt-black-500 flex h-7 shrink-0 cursor-pointer items-center gap-2 rounded-md border px-2",
          "text-label-md hover:border-otl-gray-300 hover:text-txt-black-700 focus-ring transition-colors duration-150 motion-reduce:transition-none",
          "[&>svg]:size-4 [&>svg]:shrink-0",
          className,
        )}
        onClick={(event) => {
          onClick?.(event);
          openPalette();
        }}
        {...props}
      >
        <SearchIcon aria-hidden />
        <span className="min-w-24 text-left max-sm:sr-only">{text}</span>
        <Kbd combo="mod+k" aria-hidden className="hidden sm:inline-flex" />
      </button>
    );
  },
);
DeskSearchTrigger.displayName = "DeskSearchTrigger";

/*========================================================================================================================*/

/**
 * The page on Sheet. Scrolls on its own so the rail, top bar and status bar stay put.
 * Pass `className="p-0"` for edge-to-edge content such as a `SplitPane`.
 */
const DeskPage = forwardRef<HTMLElement, ComponentProps<"main">>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={clx(
        "bg-bg-white p-surface col-start-2 row-start-2 min-h-0 min-w-0 overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
);
DeskPage.displayName = "DeskPage";

/** A 28px strip on the Well with a Hairline above: connection, identity, environment, version. */
const DeskStatusBar = forwardRef<HTMLElement, ComponentProps<"footer">>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      className={clx(
        "bg-bg-washed border-otl-gray-200 text-txt-black-700 col-start-2 row-start-3 flex h-7 min-w-0 shrink-0 items-center gap-1 overflow-x-auto border-t px-1.5",
        "text-label-compact",
        className,
      )}
      {...props}
    />
  ),
);
DeskStatusBar.displayName = "DeskStatusBar";

type DeskStatusTone = "neutral" | "success" | "warning" | "danger";

interface DeskStatusItemProps extends useRender.ComponentProps<"span"> {
  /** Shows a status dot; warning and danger also colour the text. */
  tone?: DeskStatusTone;
}

const status_dot_class: Record<DeskStatusTone, string> = {
  neutral: "bg-bg-black-400",
  success: "bg-txt-success",
  warning: "bg-txt-warning",
  danger: "bg-txt-danger",
};

/**
 * One item in the status bar. Static text by default; pass `render={<button type="button" />}`
 * to make it act, or use it as a `MenuTrigger`'s `render` to open a menu.
 */
const DeskStatusItem = forwardRef<HTMLSpanElement, DeskStatusItemProps>(
  ({ className, render, tone, children, ...props }, ref) =>
    useRender({
      defaultTagName: "span",
      render,
      ref,
      props: mergeProps<"span">(
        {
          className: clx(
            "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-sm px-1.5 whitespace-nowrap",
            "[&:is(button,a)]:cursor-pointer [&:is(button,a)]:hover:bg-bg-washed-active [&:is(button,a)]:hover:text-txt-black-900 focus-ring",
            tone === "warning" && "text-txt-warning",
            tone === "danger" && "text-txt-danger",
            className,
          ),
          children: (
            <>
              {tone && (
                <span
                  aria-hidden
                  className={clx(
                    "size-2 shrink-0 rounded-full",
                    status_dot_class[tone],
                  )}
                />
              )}
              {children}
            </>
          ),
        },
        props,
      ),
    }),
);
DeskStatusItem.displayName = "DeskStatusItem";

export {
  DeskShell,
  DeskRail,
  DeskRailBrand,
  DeskRailItem,
  DeskRailTrigger,
  DeskSpacer,
  DeskTopBar,
  DeskTabs,
  DeskTab,
  DeskSearchTrigger,
  DeskPage,
  DeskStatusBar,
  DeskStatusItem,
  useDeskShell,
};
export type {
  DeskShellProps,
  DeskShellLabels,
  DeskRailProps,
  DeskRailBrandProps,
  DeskRailItemProps,
  DeskRailTriggerProps,
  DeskTabProps,
  DeskSearchTriggerProps,
  DeskStatusItemProps,
  DeskStatusTone,
};
