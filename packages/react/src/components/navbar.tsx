import {
  FunctionComponent,
  useState,
  createContext,
  useContext,
  ReactNode,
  ComponentProps,
  useId,
} from "react";
import { clx } from "../utils";
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import { Button } from "./button";
import { Link } from "./link";
import { ChevronDownIcon, CrossIcon, HamburgerMenuIcon } from "../icons";
import { cva } from "class-variance-authority";

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
          "bg-bg-white border-otl-gray-200 sticky top-0 z-50 h-16 w-full border-b max-md:h-14 print:hidden",
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

const logo_cva = cva(
  ["font-semibold max-w-[200px] font-heading text-txt-black-900"],
  {
    variants: {
      too_long: {
        false: "text-body-lg",
        true: "text-body-xs leading-[14px] line-clamp-2",
      },
    },
    defaultVariants: {
      too_long: false,
    },
  },
);
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

      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          className="z-50 outline-none"
          side="bottom"
          align="start"
          sideOffset={8}
        >
          <NavigationMenuPrimitive.Popup
            className={clx(
              "bg-bg-white shadow-context-menu min-w-[220px] rounded-md p-1.5 outline-none",
              "data-[open]:animate-in data-[open]:fade-in-0",
              "data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0",
            )}
          >
            <NavigationMenuPrimitive.Viewport className="relative" />
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
          className="z-40 xl:hidden"
        >
          <PopoverPrimitive.Popup
            className={clx(
              "group absolute top-full h-dvh outline-none",
              className,
            )}
          >
            <div
              className={clx(
                "absolute h-dvh w-[var(--anchor-width)]",
                "bg-gray-700/60",
                "group-data-[open]:animate-in group-data-[open]:fade-in-0",
                "group-data-[closed]:animate-out group-data-[closed]:fill-mode-forwards group-data-[closed]:fade-out-0",
              )}
              aria-hidden
              onClick={() => setShow(false)}
            />
            <ul
              className={clx(
                "absolute max-h-[80dvh] w-[var(--anchor-width)] overflow-y-auto p-3",
                "border-otl-gray-200 rounded-md rounded-t-none border border-t-0 outline-none",
                "bg-bg-dialog text-txt-black-900 shadow-context-menu",
                "group-data-[open]:animate-in group-data-[open]:fade-in-0 group-data-[open]:slide-in-from-top-2",
                "group-data-[closed]:animate-out group-data-[closed]:fill-mode-forwards group-data-[closed]:fade-out-0 group-data-[closed]:slide-out-to-top-2",
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

interface NavbarMenuItemProps
  extends Omit<ComponentProps<"li">, "children" | "className"> {
  children: ReactNode;
  href: string;
  className?: string;
  /**
   * Replaces the rendered `<a>` element, e.g. `render={<NextLink href="/x" />}` for client-side routing.
   */
  render?: useRender.RenderProp;
}

const navbar_menu_item_cva = cva(
  [
    "bg-transparent hover:bg-bg-washed text-txt-black-700 truncate px-2.5 py-1.5",
    "transition-colors motion-reduce:transition-none list-none",
    "w-full xl:w-fit text-body-sm flex items-center cursor-pointer",
  ],
  {
    variants: {
      is_from_dropdown: {
        true: "text-sm font-normal ml-3 mt-1 xl:ml-0 xl:w-full xl:mt-0 rounded-xs text-left",
        false: "font-medium rounded-md",
      },
    },
  },
);

const NavbarMenuItem: FunctionComponent<NavbarMenuItemProps> = ({
  className,
  children,
  href,
  render,
  ...props
}) => {
  const is_from_dropdown = useContext(NavbarMenuDropdownContext);
  const is_mobile = useContext(NavbarMobileContext);
  const item_className = clx(
    navbar_menu_item_cva({ is_from_dropdown }),
    className,
  );
  const link = (
    <Link href={href} underline="none" className="w-full" render={render}>
      {children}
    </Link>
  );

  // Tablet / mobile panel: plain list item
  if (is_mobile)
    return (
      <li className={item_className} {...props}>
        {link}
      </li>
    );

  const nav_link = (
    <NavigationMenuPrimitive.Link
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

interface NavbarMenuDropdownProps {
  children: ReactNode;
  title: ReactNode;
  className?: string;
}

const NavbarMenuDropdownContext = createContext(false);

const NavbarMenuDropdown: FunctionComponent<NavbarMenuDropdownProps> = ({
  children,
  title,
  className,
}) => {
  const is_mobile = useContext(NavbarMobileContext);

  const trigger_className = clx(
    navbar_menu_item_cva({ is_from_dropdown: false }),
    "group w-full select-none bg-transparent transition-colors xl:w-max",
  );
  const chevron_className =
    "relative top-px ml-1.5 size-4 transition motion-reduce:transition-none";

  // Tablet / mobile panel: expands inline
  if (is_mobile)
    return (
      <NavbarMenuDropdownContext.Provider value={true}>
        <CollapsiblePrimitive.Root
          render={<li />}
          className="relative list-none"
        >
          <CollapsiblePrimitive.Trigger
            className={clx(trigger_className, "data-[panel-open]:bg-bg-washed")}
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
          <CollapsiblePrimitive.Panel className={clx("w-full", className)}>
            <ul>{children}</ul>
          </CollapsiblePrimitive.Panel>
        </CollapsiblePrimitive.Root>
      </NavbarMenuDropdownContext.Provider>
    );

  return (
    <NavbarMenuDropdownContext.Provider value={true}>
      <NavigationMenuPrimitive.Item className="relative list-none">
        <NavigationMenuPrimitive.Trigger
          className={clx(trigger_className, "data-[popup-open]:bg-bg-washed")}
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
        <NavigationMenuPrimitive.Content className={clx("w-full", className)}>
          <ul>{children}</ul>
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
}

const NavbarAction: FunctionComponent<NavbarActionProps> = ({
  children,
  className,
  onClick,
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
        aria-label={`${show ? "Close" : "Open"} navigation menu`}
        {...props}
      >
        {show ? <CrossIcon /> : <HamburgerMenuIcon />}
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
};
