import {
  FunctionComponent,
  useState,
  createContext,
  useContext,
  ReactNode,
  ComponentProps,
  useId,
} from "react";
import { clx } from "@/lib/ftds/utils";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { ArrowForwardIcon } from "@/components/ui/icons/arrow-forward";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { CrossIcon } from "@/components/ui/icons/cross";
import { HamburgerMenuIcon } from "@/components/ui/icons/hamburger-menu";
import {
  navbar_current_class,
  navbar_dropdown_columns,
  navbar_logo_cva as logo_cva,
  navbar_menu_item_cva,
  navbar_menu_rich_link_class,
} from "@/components/ui/navbar.variants";

interface NavbarProps extends ComponentProps<"header"> {}

interface NavbarContextProps {
  id: string;
  show: boolean;
  setShow: (value: boolean) => void;
}
const NavbarContext = createContext<NavbarContextProps>({
  id: "",
  show: false,
  setShow: () => {},
});

const Navbar: FunctionComponent<NavbarProps> = ({
  children,
  className,
  ...props
}) => {
  const id = useId();

  const [show, setShow] = useState(false);
  return (
    <NavbarContext.Provider value={{ id, show, setShow }}>
      <header
        id={id}
        className={clx(
          "bg-bg-white border-otl-gray-200 z-sticky sticky top-0 h-16 w-full border-b max-md:h-14 print:hidden",
          className,
        )}
        data-nosnippet
        {...props}
      >
        <div className="relative mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-4 px-4.5 max-md:h-14 md:px-6">
          {children}
        </div>
      </header>
    </NavbarContext.Provider>
  );
};

Navbar.displayName = "Navbar";

interface NavbarLogoProps extends ComponentProps<typeof Link> {
  src: string;
  alt: string;
  maxChars?: number;
}

const NavbarLogo: FunctionComponent<NavbarLogoProps> = ({
  src,
  alt,
  href = "/",
  children,
  maxChars = 19,
  className,
  ...props
}) => {
  return (
    <Link
      href={href}
      underline="none"
      className={clx("flex h-full w-auto items-center gap-2.5", className)}
      {...props}
    >
      <img
        src={src}
        width={40}
        height={32}
        className="aspect-auto h-full max-h-8 w-auto select-none"
        alt={alt}
      />
      {typeof children === "string" ? (
        <span className={logo_cva({ too_long: children.length > maxChars })}>
          {children}
        </span>
      ) : (
        children
      )}
    </Link>
  );
};

NavbarLogo.displayName = "NavbarLogo";
interface NavigationMenuProps {
  children: ReactNode;
  classNameNavDesktop?: string;
  classNameNavMobile?: string;
}

/** `true` when rendered inside the tablet / mobile menu panel. */
const NavbarMobileContext = createContext(false);

const NavbarMenu: FunctionComponent<NavigationMenuProps> = ({
  children,
  classNameNavDesktop,
  classNameNavMobile,
}) => {
  return (
    <NavigationMenuPrimitive.Root className="grow">
      {/* Desktop */}
      <NavigationMenuPrimitive.List
        className={clx(
          "hidden xl:flex xl:justify-start xl:gap-1",
          classNameNavDesktop,
        )}
      >
        {children}
      </NavigationMenuPrimitive.List>

      {/*
       * One shared panel for every dropdown. Moving between triggers resizes it
       * (--popup-width/--popup-height) and slides the content in from the side
       * of the new trigger, instead of closing one dropdown and opening another.
       */}
      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          className={clx(
            "z-popup outline-none",
            "h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)]",
            "ease-standard transition-[top,left,right,bottom] duration-200 data-[instant]:transition-none motion-reduce:transition-none",
          )}
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
        >
          <NavigationMenuPrimitive.Popup
            className={clx(
              // Floating layer: dialog surface + hairline edge, which still separates in dark mode
              "bg-bg-dialog border-otl-gray-200 shadow-context-menu relative rounded-lg border outline-none",
              "h-[var(--popup-height)] w-[var(--popup-width)] origin-[var(--transform-origin)]",
              "ease-standard transition-[width,height,opacity,scale] duration-200 motion-reduce:transition-none",
              "data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0",
            )}
          >
            <NavigationMenuPrimitive.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>

      {/* Tablet / Mobile */}
      <NavbarMobileMenu className={clx(classNameNavMobile)}>
        {children}
      </NavbarMobileMenu>
    </NavigationMenuPrimitive.Root>
  );
};

interface NavbarMobileMenuProps {
  children: ReactNode;
  className?: string;
}

const NavbarMobileMenu: FunctionComponent<NavbarMobileMenuProps> = ({
  children,
  className,
}) => {
  const { id, show, setShow } = useContext(NavbarContext);

  return (
    <PopoverPrimitive.Root
      open={show}
      modal
      onOpenChange={(open, eventDetails) => {
        // Let the header's own toggle button handle presses inside the header.
        const target = eventDetails.event?.target;
        if (
          !open &&
          eventDetails.reason === "outside-press" &&
          target instanceof Node &&
          document.getElementById(id)?.contains(target)
        )
          return;
        setShow(open);
      }}
    >
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          anchor={() => document.getElementById(id)}
          side="bottom"
          sideOffset={0}
          align="start"
          // Flush with the header: no 5px gap from the screen edges
          collisionPadding={0}
          className="z-sticky xl:hidden"
        >
          <PopoverPrimitive.Popup
            className={clx(
              "group w-[var(--anchor-width)] outline-none",
              className,
            )}
          >
            {/*
             * Scrim under the header only: the masthead and header stay as they are and
             * the page content dims. Same Ink wash as Drawer and Dialog. A tap closes.
             */}
            <div
              className={clx(
                "bg-scrim/40 absolute inset-x-0 top-0 h-dvh",
                "ease-standard transition-opacity duration-200 motion-reduce:transition-none",
                "group-data-[ending-style]:opacity-0 group-data-[starting-style]:opacity-0",
              )}
              aria-hidden
              onClick={() => setShow(false)}
            />
            {/* Full-width sheet (DESIGN.md: Navigation, Mobile) */}
            <ul
              className={clx(
                // Fills exactly the space below the header, wherever the header sits
                "relative max-h-[var(--available-height)] overflow-y-auto overscroll-contain px-2 pt-2 pb-4",
                // No shadow: the scrim already separates it, and a shadow leaves a muddy band on it
                "bg-bg-dialog text-txt-black-900",
                "ease-standard transition-[opacity,translate] duration-200 motion-reduce:transition-none",
                "group-data-[starting-style]:-translate-y-2 group-data-[starting-style]:opacity-0",
                "group-data-[ending-style]:-translate-y-2 group-data-[ending-style]:opacity-0",
              )}
            >
              <NavbarMobileContext.Provider value={true}>
                {children}
              </NavbarMobileContext.Provider>
            </ul>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

NavbarMenu.displayName = "NavbarMenu";

/*========================================================================================================================*/

interface NavbarMenuItemProps extends Omit<
  ComponentProps<"li">,
  "children" | "className"
> {
  children: ReactNode;
  href: string;
  className?: string;
  /** Inside a dropdown: an icon shown in a tile before the label. */
  icon?: ReactNode;
  /** Inside a dropdown: one line saying what's behind the link. */
  description?: ReactNode;
  /** The visitor is on this page. Sets `aria-current="page"`; top-level links also get the underline. */
  active?: boolean;
  /**
   * Replaces the rendered `<a>` element, e.g. `render={<NextLink href="/x" />}` for client-side routing.
   */
  render?: useRender.RenderProp;
}

const NavbarMenuItem: FunctionComponent<NavbarMenuItemProps> = ({
  className,
  children,
  href,
  icon,
  description,
  active,
  render,
  ...props
}) => {
  const is_from_dropdown = useContext(NavbarMenuDropdownContext);
  const is_mobile = useContext(NavbarMobileContext);
  const is_rich = is_from_dropdown && (icon != null || description != null);

  // Icon tile + label + description. The tile flips to the panel colour on the hovered row.
  const rich_content = (
    <>
      {icon != null && (
        <span
          className="bg-bg-washed-active text-txt-black-700 group-hover/item:bg-bg-dialog group-data-[active]/item:bg-bg-dialog group-data-[active]/item:text-txt-primary flex size-9 shrink-0 items-center justify-center rounded-md transition-colors motion-reduce:transition-none [&_svg]:size-5"
          aria-hidden
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5 pt-px">
        <span className="text-txt-black-900 group-data-[active]/item:text-txt-primary text-body-sm font-medium">
          {children}
        </span>
        {description != null && (
          <span className="text-txt-black-700 text-body-sm font-normal">
            {description}
          </span>
        )}
      </span>
    </>
  );

  if (is_rich) {
    const rich_link_className = clx(navbar_menu_rich_link_class, className);
    return (
      <li className="list-none" {...props}>
        {is_mobile ? (
          <Link
            href={href}
            underline="none"
            className={rich_link_className}
            render={render}
            aria-current={active ? "page" : undefined}
            data-active={active ? "" : undefined}
          >
            {rich_content}
          </Link>
        ) : (
          <NavigationMenuPrimitive.Link
            active={active}
            className={rich_link_className}
            render={<Link href={href} underline="none" render={render} />}
          >
            {rich_content}
          </NavigationMenuPrimitive.Link>
        )}
      </li>
    );
  }

  const item_className = clx(
    navbar_menu_item_cva({ is_from_dropdown }),
    active && !is_from_dropdown && navbar_current_class,
    className,
  );

  // Tablet / mobile panel: plain list item
  if (is_mobile)
    return (
      <li className={item_className} {...props}>
        <Link
          href={href}
          underline="none"
          className="w-full"
          render={render}
          aria-current={active ? "page" : undefined}
        >
          {children}
        </Link>
      </li>
    );

  const nav_link = (
    <NavigationMenuPrimitive.Link
      active={active}
      render={
        <Link href={href} underline="none" className="w-full" render={render} />
      }
    >
      {children}
    </NavigationMenuPrimitive.Link>
  );

  // Desktop dropdown content
  if (is_from_dropdown)
    return (
      <li className={item_className} {...props}>
        {nav_link}
      </li>
    );

  return (
    <NavigationMenuPrimitive.Item className={item_className} {...props}>
      {nav_link}
    </NavigationMenuPrimitive.Item>
  );
};

NavbarMenuItem.displayName = "NavbarMenuItem";

/*========================================================================================================================*/

interface NavbarMenuGroupProps {
  /** Short heading, e.g. "For citizens". */
  title: ReactNode;
  children: ReactNode;
  className?: string;
}

/** A titled column of links inside a dropdown. */
const NavbarMenuGroup: FunctionComponent<NavbarMenuGroupProps> = ({
  title,
  children,
  className,
}) => {
  const heading_id = useId();

  return (
    <li
      className={clx(
        "flex list-none flex-col gap-1",
        // Mobile: space above each group, not below, so a heading reads with its own links
        "max-xl:gap-0 max-xl:not-first:mt-3",
        className,
      )}
    >
      <span
        id={heading_id}
        className="text-txt-black-700 text-label-compact px-2.5 pt-1 font-medium max-xl:ml-3 max-xl:pt-2 max-xl:pb-0.5"
      >
        {title}
      </span>
      <ul aria-labelledby={heading_id} className="flex flex-col">
        {children}
      </ul>
    </li>
  );
};

NavbarMenuGroup.displayName = "NavbarMenuGroup";

/*========================================================================================================================*/

interface NavbarMenuFeatureProps {
  href: string;
  title: ReactNode;
  description?: ReactNode;
  /** Small label above the title, e.g. "New" or "Deadline 30 April". */
  eyebrow?: ReactNode;
  /** Call to action at the bottom. Defaults to "Read more". */
  linkLabel?: ReactNode;
  className?: string;
  render?: useRender.RenderProp;
}

/**
 * The one highlighted item in a dropdown, e.g. a new budget or an upcoming deadline.
 * Pass it to `NavbarMenuDropdown`'s `feature` prop. Text only, on a Well, never a hero image.
 */
const NavbarMenuFeature: FunctionComponent<NavbarMenuFeatureProps> = ({
  href,
  title,
  description,
  eyebrow,
  linkLabel = "Read more",
  className,
  render,
}) => {
  const is_mobile = useContext(NavbarMobileContext);
  const feature_className = clx(
    "bg-bg-washed-active flex h-full flex-col gap-2 rounded-md p-4 text-left",
    "group/feature transition-colors motion-reduce:transition-none",
    className,
  );
  const content = (
    <>
      {eyebrow != null && (
        <span className="text-txt-primary text-label-compact font-medium">
          {eyebrow}
        </span>
      )}
      <span className="text-txt-black-900 text-body-md font-semibold">
        {title}
      </span>
      {description != null && (
        <span className="text-txt-black-700 text-body-sm">{description}</span>
      )}
      <span className="text-txt-primary text-body-sm mt-auto inline-flex items-center gap-1 pt-2 font-medium">
        {linkLabel}
        <ArrowForwardIcon
          className="size-4 transition-transform group-hover/feature:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden
        />
      </span>
    </>
  );

  return is_mobile ? (
    <Link
      href={href}
      underline="none"
      className={feature_className}
      render={render}
    >
      {content}
    </Link>
  ) : (
    <NavigationMenuPrimitive.Link
      className={feature_className}
      render={<Link href={href} underline="none" render={render} />}
    >
      {content}
    </NavigationMenuPrimitive.Link>
  );
};

NavbarMenuFeature.displayName = "NavbarMenuFeature";

/*========================================================================================================================*/

interface NavbarMenuFooterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  render?: useRender.RenderProp;
}

/** "All services →": a way out to the full index. Pass it to `NavbarMenuDropdown`'s `footer` prop. */
const NavbarMenuFooterLink: FunctionComponent<NavbarMenuFooterLinkProps> = ({
  href,
  children,
  className,
  render,
}) => {
  const is_mobile = useContext(NavbarMobileContext);
  const link_className = clx(
    "text-txt-primary text-body-sm group/footer inline-flex items-center gap-1 font-medium",
    className,
  );
  const content = (
    <>
      {children}
      <ArrowForwardIcon
        className="size-4 transition-transform group-hover/footer:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
      />
    </>
  );

  return is_mobile ? (
    <Link
      href={href}
      underline="hover"
      className={link_className}
      render={render}
    >
      {content}
    </Link>
  ) : (
    <NavigationMenuPrimitive.Link
      className={link_className}
      render={<Link href={href} underline="hover" render={render} />}
    >
      {content}
    </NavigationMenuPrimitive.Link>
  );
};

NavbarMenuFooterLink.displayName = "NavbarMenuFooterLink";

/*========================================================================================================================*/

interface NavbarMenuDropdownProps {
  children: ReactNode;
  title: ReactNode;
  className?: string;
  /** Lay plain items out in columns. Groups always sit side by side. */
  columns?: 1 | 2 | 3;
  /** One `NavbarMenuFeature`, shown beside the links (below them on mobile). */
  feature?: ReactNode;
  /** A `NavbarMenuFooterLink` such as "All services", shown under the links. */
  footer?: ReactNode;
  /** The visitor is somewhere in this section: underlines the trigger. */
  active?: boolean;
}

const NavbarMenuDropdownContext = createContext(false);

const NavbarMenuDropdown: FunctionComponent<NavbarMenuDropdownProps> = ({
  children,
  title,
  className,
  columns = 1,
  feature,
  footer,
  active,
}) => {
  const is_mobile = useContext(NavbarMobileContext);

  const trigger_className = clx(
    navbar_menu_item_cva({ is_from_dropdown: false }),
    "group w-full select-none bg-transparent transition-colors xl:w-max",
    active && navbar_current_class,
  );
  const chevron_className =
    "relative top-px ml-1.5 size-4 transition motion-reduce:transition-none";

  // Tablet / mobile panel: expands inline, feature and footer stack below the links
  if (is_mobile)
    return (
      <NavbarMenuDropdownContext.Provider value={true}>
        <CollapsiblePrimitive.Root
          render={<li />}
          className="relative list-none"
        >
          <CollapsiblePrimitive.Trigger
            className={clx(
              trigger_className,
              "data-[panel-open]:bg-bg-washed-active",
            )}
          >
            {title}
            <ChevronDownIcon
              className={clx(
                chevron_className,
                "group-data-[panel-open]:rotate-180",
              )}
              aria-hidden="true"
            />
          </CollapsiblePrimitive.Trigger>
          <CollapsiblePrimitive.Panel
            className={clx("flex w-full flex-col gap-2 pb-2", className)}
          >
            <ul className="flex flex-col">{children}</ul>
            {feature != null && <div className="ml-3">{feature}</div>}
            {footer != null && (
              <div className="ml-3 flex min-h-11 items-center px-2.5">
                {footer}
              </div>
            )}
          </CollapsiblePrimitive.Panel>
        </CollapsiblePrimitive.Root>
      </NavbarMenuDropdownContext.Provider>
    );

  return (
    <NavbarMenuDropdownContext.Provider value={true}>
      <NavigationMenuPrimitive.Item className="relative list-none">
        <NavigationMenuPrimitive.Trigger
          className={clx(
            trigger_className,
            "data-[popup-open]:bg-bg-washed-active",
          )}
        >
          {title}
          <ChevronDownIcon
            className={clx(
              chevron_className,
              "group-data-[popup-open]:rotate-180",
            )}
            aria-hidden="true"
          />
        </NavigationMenuPrimitive.Trigger>
        <NavigationMenuPrimitive.Content
          className={clx(
            "w-max max-w-[min(56rem,calc(100vw-2rem))]",
            // Slide in from the side of the trigger the pointer came from
            "ease-standard transition-[opacity,translate] duration-200 motion-reduce:transition-none",
            "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            "data-[starting-style]:data-[activation-direction=left]:-translate-x-6 data-[starting-style]:data-[activation-direction=right]:translate-x-6",
            "data-[ending-style]:data-[activation-direction=left]:translate-x-6 data-[ending-style]:data-[activation-direction=right]:-translate-x-6",
            className,
          )}
        >
          <div className="flex gap-2 p-2">
            <ul
              className={clx(
                "grid content-start gap-x-2 gap-y-1",
                navbar_dropdown_columns[columns],
                // Groups are columns of their own
                "has-[>li>ul]:auto-cols-[minmax(0,15rem)] has-[>li>ul]:grid-flow-col has-[>li>ul]:grid-cols-none has-[>li>ul]:gap-x-4",
              )}
            >
              {children}
            </ul>
            {feature != null && <div className="w-64 shrink-0">{feature}</div>}
          </div>
          {footer != null && (
            // A Well band, not a divider (DESIGN.md: tone, not lines)
            <div className="bg-bg-washed-active px-4.5 py-3">{footer}</div>
          )}
        </NavigationMenuPrimitive.Content>
      </NavigationMenuPrimitive.Item>
    </NavbarMenuDropdownContext.Provider>
  );
};

NavbarMenuDropdown.displayName = "NavbarMenuDropdown";

interface NavbarActionProps extends ComponentProps<typeof Button> {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  /** Accessible name of the menu button; `aria-expanded` says whether it is open. @default "Menu" */
  menuLabel?: string;
}

const NavbarAction: FunctionComponent<NavbarActionProps> = ({
  children,
  className,
  onClick,
  menuLabel = "Menu",
  ...props
}) => {
  const { show, setShow } = useContext(NavbarContext);
  const handleToggle = () => {
    setShow(!show);
    if (onClick) onClick();
  };
  return (
    <div className="flex items-center justify-end gap-2">
      {children}
      <Button
        variant="default-ghost"
        iconOnly
        className={clx("xl:hidden", className)}
        onClick={handleToggle}
        aria-label={menuLabel}
        aria-expanded={show}
        {...props}
      >
        {show ? <CrossIcon aria-hidden /> : <HamburgerMenuIcon aria-hidden />}
      </Button>
    </div>
  );
};

NavbarAction.displayName = "NavbarAction";

export {
  Navbar,
  NavbarLogo,
  NavbarAction,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuDropdown,
  NavbarMenuGroup,
  NavbarMenuFeature,
  NavbarMenuFooterLink,
};
export type {
  NavbarMenuItemProps,
  NavbarMenuDropdownProps,
  NavbarMenuGroupProps,
  NavbarMenuFeatureProps,
  NavbarMenuFooterLinkProps,
};
