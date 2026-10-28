"use client";

import React, {
  ComponentProps,
  CSSProperties,
  ReactElement,
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
} from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva } from "class-variance-authority";
import { Button, type ButtonProps } from "../core/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../core/tooltip";
import { Drawer, DrawerContent } from "./drawer";
import { HamburgerMenuIcon } from "../../icons/hamburger-menu";
import { ChevronDownIcon } from "../../icons/chevron-down";
import { useControllableState, useMediaQuery } from "../../hooks";
import { clx, type WithClassName } from "../../utils";

/**
 * AppShell is the frame of an officer tool: a collapsible Sidebar on the Well
 * on the left, a top bar on Paper with one Hairline rule, and the main content
 * on Sheet (DESIGN.md: Neutral, Navigation).
 *
 * On wide screens the sidebar collapses to an icon rail (or hides, with
 * `collapsible="offcanvas"`); collapsed items show their label in a tooltip.
 * Below `mobileBreakpoint` it becomes an off-canvas drawer that traps focus,
 * closes on Esc, on the scrim and on a swipe (Base UI Drawer).
 *
 * State lives in a context: read it with `useSidebar()`. `AppShell` provides it;
 * use `AppShellProvider` directly for a custom layout.
 *
 * @example
 * <AppShell data-density="compact">
 *   <Sidebar>
 *     <SidebarHeader>Fiscal Portal</SidebarHeader>
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
 */

type SidebarCollapsible = "icon" | "offcanvas" | "none";

interface SidebarContextValue {
  /** Desktop: whether the sidebar is expanded. */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Narrow screens: whether the drawer is open. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  /** Toggles whichever applies to the current screen width. */
  toggleSidebar: () => void;
  isMobile: boolean;
  collapsible: SidebarCollapsible;
  state: "expanded" | "collapsed";
  /** Collapsed to the icon rail (wide screens, `collapsible="icon"`). */
  isRail: boolean;
  sidebarId: string;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useSidebar must be used inside <AppShell> or <AppShellProvider>.",
    );
  }
  return context;
}

/*========================================================================================================================*/

interface AppShellProviderProps {
  /** Desktop: whether the sidebar is expanded (controlled). */
  open?: boolean;
  /** Desktop: whether the sidebar starts expanded. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Narrow screens: whether the drawer is open (controlled). */
  openMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  /**
   * How the sidebar collapses on wide screens: to an icon rail, off screen, or not at all.
   * @default "icon"
   */
  collapsible?: SidebarCollapsible;
  /**
   * Below this width (px) the sidebar becomes a drawer.
   * @default 768
   */
  mobileBreakpoint?: number;
  /** When set (and `open` is uncontrolled), the expanded state is remembered in localStorage under this key. */
  storageKey?: string;
  children?: ReactNode;
}

const AppShellProvider = ({
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  openMobile: openMobileProp,
  onOpenMobileChange,
  collapsible = "icon",
  mobileBreakpoint = 768,
  storageKey,
  children,
}: AppShellProviderProps) => {
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 0.02}px)`);
  const sidebarId = useId();

  const [open = true, setOpenState] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [openMobile = false, setOpenMobile] = useControllableState({
    prop: openMobileProp,
    defaultProp: false,
    onChange: onOpenMobileChange,
  });

  // Restore the remembered state once, after hydration
  useEffect(() => {
    if (!storageKey || openProp !== undefined) return;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored !== null) setOpenState(stored === "true");
    } catch {
      // Storage unavailable (private mode, blocked): keep the default
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const setOpen = useCallback(
    (value: boolean) => {
      setOpenState(value);
      if (!storageKey) return;
      try {
        window.localStorage.setItem(storageKey, String(value));
      } catch {
        // Ignore: persistence is a convenience
      }
    },
    [setOpenState, storageKey],
  );

  // Leaving the narrow layout closes the drawer
  useEffect(() => {
    if (!isMobile && openMobile) setOpenMobile(false);
  }, [isMobile, openMobile, setOpenMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile(!openMobile);
    else setOpen(!open);
  }, [isMobile, open, openMobile, setOpen, setOpenMobile]);

  const value = useMemo<SidebarContextValue>(() => {
    const state = open || collapsible === "none" ? "expanded" : "collapsed";
    return {
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      isMobile,
      collapsible,
      state,
      isRail: state === "collapsed" && collapsible === "icon" && !isMobile,
      sidebarId,
    };
  }, [
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    toggleSidebar,
    isMobile,
    collapsible,
    sidebarId,
  ]);

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};
AppShellProvider.displayName = "AppShellProvider";

/*========================================================================================================================*/

interface AppShellProps
  extends ComponentProps<"div">,
    Omit<AppShellProviderProps, "children"> {
  /** Width of the expanded sidebar (any CSS length). Sets `--sidebar-width`. */
  sidebarWidth?: string;
  /** Width of the icon rail. Sets `--sidebar-width-icon`. Defaults to one control height plus 24px. */
  sidebarIconWidth?: string;
}

/**
 * The frame. Fills the viewport height (`h-dvh`); pass a `className` height to embed it.
 * Place `Sidebar`, `AppShellHeader` and `AppShellMain` directly inside, in any order.
 */
const AppShell = forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      className,
      style,
      sidebarWidth,
      sidebarIconWidth,
      open,
      defaultOpen,
      onOpenChange,
      openMobile,
      onOpenMobileChange,
      collapsible,
      mobileBreakpoint,
      storageKey,
      ...props
    },
    ref,
  ) => {
    const parent = useContext(SidebarContext);
    const providerProps: AppShellProviderProps = {
      open,
      defaultOpen,
      onOpenChange,
      openMobile,
      onOpenMobileChange,
      collapsible,
      mobileBreakpoint,
      storageKey,
    };

    const frame = (
      <div
        ref={ref}
        style={
          {
            ...(sidebarWidth && { "--sidebar-width": sidebarWidth }),
            ...(sidebarIconWidth && {
              "--sidebar-width-icon": sidebarIconWidth,
            }),
            ...style,
          } as CSSProperties
        }
        className={clx(
          // Sidebar spans both rows of column 1; header and main stack in column 2.
          // On narrow screens the sidebar is a drawer, so column 1 collapses to nothing.
          "bg-bg-gray-50 text-txt-black-900 font-body grid h-dvh w-full overflow-hidden",
          "grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)]",
          className,
        )}
        {...props}
      />
    );

    if (parent) return frame;

    return <AppShellProvider {...providerProps}>{frame}</AppShellProvider>;
  },
);
AppShell.displayName = "AppShell";

/** The top bar: Paper with a single Hairline rule beneath (DESIGN.md: Navigation). */
const AppShellHeader = forwardRef<HTMLElement, ComponentProps<"header">>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      className={clx(
        "bg-bg-gray-50 border-otl-gray-200 col-start-2 row-start-1 flex h-14 shrink-0 items-center gap-2 border-b px-4",
        "in-data-[density=compact]:h-12 in-data-[density=compact]:px-3",
        className,
      )}
      {...props}
    />
  ),
);
AppShellHeader.displayName = "AppShellHeader";

/** The main content on Sheet. Scrolls on its own so the sidebar and top bar stay put. */
const AppShellMain = forwardRef<HTMLElement, ComponentProps<"main">>(
  ({ className, ...props }, ref) => (
    <main
      ref={ref}
      className={clx(
        "bg-bg-white p-surface col-start-2 row-start-2 min-h-0 overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
);
AppShellMain.displayName = "AppShellMain";

/*========================================================================================================================*/

interface SidebarProps extends ComponentProps<"aside"> {
  /** Accessible name of the sidebar landmark (and of the drawer on narrow screens). */
  label?: string;
}

/**
 * The sidebar on the Well. Renders an `<aside>` in the layout on wide screens and a
 * left drawer on narrow ones; the same children work in both.
 */
const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, children, label = "Main navigation", ...props }, ref) => {
    const {
      isMobile,
      openMobile,
      setOpenMobile,
      state,
      collapsible,
      sidebarId,
    } = useSidebar();

    if (isMobile) {
      return (
        <Drawer side="left" open={openMobile} onOpenChange={setOpenMobile}>
          <DrawerContent
            aria-label={label}
            handle={false}
            hideClose
            className="bg-bg-washed w-[min(18rem,calc(100vw-3rem))]"
          >
            <aside
              ref={ref}
              aria-label={label}
              className={clx("flex min-h-0 flex-1 flex-col", className)}
              {...props}
            >
              {children}
            </aside>
          </DrawerContent>
        </Drawer>
      );
    }

    const collapsed = state === "collapsed";

    return (
      <aside
        ref={ref}
        id={sidebarId}
        aria-label={label}
        data-state={state}
        data-collapsible={collapsed ? collapsible : undefined}
        // Hidden off canvas: keep it out of the tab order and the accessibility tree
        inert={collapsed && collapsible === "offcanvas" ? true : undefined}
        className={clx(
          "group/sidebar bg-bg-washed text-txt-black-900 col-start-1 row-span-2 row-start-1 flex h-full min-h-0 flex-col overflow-hidden",
          "ease-standard transition-[width] duration-200 motion-reduce:transition-none",
          "w-[var(--sidebar-width,16rem)]",
          "data-[collapsible=icon]:w-[var(--sidebar-width-icon,calc(var(--ctl-h-sm)+1.5rem))]",
          "data-[collapsible=offcanvas]:w-0",
          className,
        )}
        {...props}
      >
        {/* Fixed-width inner column so content does not reflow while sliding off canvas */}
        <div className="flex h-full min-h-0 w-[var(--sidebar-width,16rem)] flex-col group-data-[collapsible=icon]/sidebar:w-full">
          {children}
        </div>
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

const SidebarHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "flex shrink-0 flex-col gap-2 p-3 group-data-[collapsible=icon]/sidebar:items-center",
        className,
      )}
      {...props}
    />
  ),
);
SidebarHeader.displayName = "SidebarHeader";

/** The scrolling middle. Holds one or more `SidebarGroup`s, separated by space. */
const SidebarContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "gap-stack-md flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-3 py-2",
        className,
      )}
      {...props}
    />
  ),
);
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "mt-auto flex shrink-0 flex-col gap-2 p-3 group-data-[collapsible=icon]/sidebar:items-center",
        className,
      )}
      {...props}
    />
  ),
);
SidebarFooter.displayName = "SidebarFooter";

const SidebarGroup = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={clx("flex min-w-0 flex-col gap-1", className)}
      {...props}
    />
  ),
);
SidebarGroup.displayName = "SidebarGroup";

/** Group heading in Label Compact, Ink Secondary. Visually hidden on the icon rail. */
const SidebarGroupLabel = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "text-txt-black-700 text-label-compact flex h-8 shrink-0 items-center truncate px-3 font-medium",
        "group-data-[collapsible=icon]/sidebar:sr-only",
        className,
      )}
      {...props}
    />
  ),
);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarMenu = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={clx(
        "m-0 flex min-w-0 list-none flex-col gap-0.5 p-0",
        className,
      )}
      {...props}
    />
  ),
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = forwardRef<HTMLLIElement, ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={clx("relative min-w-0", className)} {...props} />
  ),
);
SidebarMenuItem.displayName = "SidebarMenuItem";

/*========================================================================================================================*/

const sidebar_menu_button_cva = cva([
  "flex w-full min-w-0 cursor-pointer select-none items-center gap-3 rounded-md text-left no-underline",
  "h-[var(--ctl-h-sm)] px-3 font-body text-label-md font-medium",
  "text-txt-black-700 outline-none transition-colors duration-150 motion-reduce:transition-none",
  // Hover lifts off the Well
  "hover:bg-bg-raised hover:text-txt-black-900",
  "focus-ring",
  // Current page: Blue Wash with primary text (DESIGN.md: current selection)
  "data-[active]:bg-bg-primary-50 data-[active]:text-txt-primary data-[active]:hover:bg-bg-primary-50",
  "disabled:cursor-not-allowed disabled:text-txt-black-disabled aria-disabled:cursor-not-allowed aria-disabled:text-txt-black-disabled",
  "[&>svg]:size-5 [&>svg]:shrink-0 in-data-[density=compact]:[&>svg]:size-4",
  "[&>span]:min-w-0 [&>span]:truncate",
  // Icon rail: square button, label kept for screen readers
  "group-data-[collapsible=icon]/sidebar:w-[var(--ctl-h-sm)] group-data-[collapsible=icon]/sidebar:justify-center group-data-[collapsible=icon]/sidebar:gap-0 group-data-[collapsible=icon]/sidebar:px-0",
  "group-data-[collapsible=icon]/sidebar:[&>:not(svg)]:sr-only",
]);

const sidebar_menu_button_class = sidebar_menu_button_cva();

/**
 * Wraps `element` in a right-side tooltip that is only enabled on the icon rail.
 * The tooltip stays mounted either way, so items don't remount when the sidebar collapses.
 */
function useRailTooltip(element: ReactElement, tooltip: ReactNode | undefined) {
  const { isRail } = useSidebar();
  if (tooltip == null) return element;
  return (
    <Tooltip disabled={!isRail}>
      <TooltipTrigger render={element} />
      <TooltipContent side="right" sideOffset={8}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

interface SidebarMenuButtonProps extends useRender.ComponentProps<"button"> {
  /** Marks the current page: Blue Wash and `aria-current="page"`. */
  isActive?: boolean;
  /** Label shown in a tooltip on the icon rail. Usually the same text as the item. */
  tooltip?: ReactNode;
}

/**
 * A navigation item: an icon and a `<span>` label. Renders a `<button>`; pass
 * `render={<a href="…" />}` (or your router's link) for navigation.
 * On narrow screens, choosing an item closes the drawer.
 */
const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, render, isActive = false, tooltip, ...props }, ref) => {
    const { isMobile, setOpenMobile } = useSidebar();

    const element = useRender({
      defaultTagName: "button",
      render,
      ref,
      props: mergeProps<"button">(
        {
          className: clx(sidebar_menu_button_class, className),
          ...(render ? {} : { type: "button" as const }),
          ...(isActive && {
            "data-active": "",
            "aria-current": "page" as const,
          }),
          onClick: () => {
            if (isMobile) setOpenMobile(false);
          },
        },
        props,
      ),
    });

    return useRailTooltip(element, tooltip);
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

/*========================================================================================================================*/

/** A menu item with nested items that expand and collapse (Base UI Collapsible). */
const SidebarMenuCollapsible = forwardRef<
  HTMLDivElement,
  WithClassName<CollapsiblePrimitive.Root.Props>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={clx("flex min-w-0 flex-col", className)}
    {...props}
  />
));
SidebarMenuCollapsible.displayName = "SidebarMenuCollapsible";

interface SidebarMenuCollapsibleTriggerProps
  extends WithClassName<CollapsiblePrimitive.Trigger.Props> {
  /** Label shown in a tooltip on the icon rail. */
  tooltip?: ReactNode;
}

/** Looks like a SidebarMenuButton with a chevron. On the icon rail, pressing it expands the sidebar. */
const SidebarMenuCollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  SidebarMenuCollapsibleTriggerProps
>(({ className, children, tooltip, onClick, ...props }, ref) => {
  const { isRail, setOpen } = useSidebar();

  const element = (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={clx(
        sidebar_menu_button_class,
        "group/sidebar-trigger",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (isRail) setOpen(true);
      }}
      {...props}
    >
      {children}
      <ChevronDownIcon
        aria-hidden
        className={clx(
          "text-txt-black-700 ml-auto size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",
          "group-data-[collapsible=icon]/sidebar:hidden group-data-[panel-open]/sidebar-trigger:rotate-180",
        )}
      />
    </CollapsiblePrimitive.Trigger>
  );

  return useRailTooltip(element, tooltip);
});
SidebarMenuCollapsibleTrigger.displayName = "SidebarMenuCollapsibleTrigger";

/** The nested list. Put `SidebarMenuItem`s with `SidebarMenuButton`s inside. Hidden on the icon rail. */
const SidebarMenuSub = forwardRef<
  HTMLDivElement,
  WithClassName<CollapsiblePrimitive.Panel.Props>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className={clx(
      "h-[var(--collapsible-panel-height)] overflow-hidden",
      "ease-standard transition-[height] duration-200 motion-reduce:transition-none",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
      "group-data-[collapsible=icon]/sidebar:hidden",
      className,
    )}
    {...props}
  >
    {/* Indented so labels line up under the parent's label (icon + gap) */}
    <ul className="m-0 flex list-none flex-col gap-0.5 p-0 pt-0.5 pl-8 in-data-[density=compact]:pl-7">
      {children}
    </ul>
  </CollapsiblePrimitive.Panel>
));
SidebarMenuSub.displayName = "SidebarMenuSub";

/*========================================================================================================================*/

interface SidebarTriggerProps extends Omit<ButtonProps, "iconOnly"> {
  /** Accessible label. */
  label?: string;
}

/** Ghost icon button that collapses/expands the sidebar, or opens the drawer on narrow screens. */
const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  (
    {
      label = "Toggle navigation",
      children,
      onClick,
      variant = "default-ghost",
      ...props
    },
    ref,
  ) => {
    const {
      toggleSidebar,
      isMobile,
      open,
      openMobile,
      collapsible,
      sidebarId,
    } = useSidebar();

    // Nothing to toggle on wide screens when the sidebar cannot collapse
    if (!isMobile && collapsible === "none") return null;

    return (
      <Button
        ref={ref}
        variant={variant}
        iconOnly
        aria-label={label}
        aria-expanded={isMobile ? openMobile : open}
        aria-controls={isMobile ? undefined : sidebarId}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        {children ?? <HamburgerMenuIcon aria-hidden className="size-5" />}
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

export {
  AppShell,
  AppShellProvider,
  AppShellHeader,
  AppShellMain,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuCollapsible,
  SidebarMenuCollapsibleTrigger,
  SidebarMenuSub,
  SidebarTrigger,
  useSidebar,
  sidebar_menu_button_cva,
};
export type {
  AppShellProps,
  AppShellProviderProps,
  SidebarProps,
  SidebarMenuButtonProps,
  SidebarMenuCollapsibleTriggerProps,
  SidebarTriggerProps,
  SidebarCollapsible,
};
