---
title: Navbar
description: The site's top navigation bar: logo, links and dropdown menus, and actions such as search, with a full-width menu panel on tablet and mobile.
category: Government chrome
---

## When to use

- Use `Navbar` as the main navigation of an agency or landing site, and of a citizen service with more than a couple of sections. It goes under the `Masthead` (and `PhaseBanner`, if any).
- Use `AppShell` with `Sidebar`, or `DeskShell`, for officer tools; use `Breadcrumb` to show where a page sits in a deep hierarchy.
- Use `SiteSearch` on a results page or in a hero; in the navbar, a search icon button that links to the search page keeps the bar uncluttered.

## Usage

`NavbarLogo` links home. `NavbarMenu` holds `NavbarMenuItem` links and `NavbarMenuDropdown` menus. `NavbarAction` holds your actions and adds the menu button for tablet and mobile, so always include it:

```tsx
import { Button, ButtonIcon } from "@/components/ui/button";
import {
  Navbar,
  NavbarAction,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuDropdown,
  NavbarMenuItem,
} from "@/components/ui/navbar";
import { SearchIcon } from "@/components/ui/icons/search";
import { ThemeSwitch } from "@/components/ui/theme-switch";

export function SiteNavbar() {
  return (
    <Navbar>
      <NavbarLogo src="/images/jata-negara.png" alt="Jata Negara">
        Ministry of Finance
      </NavbarLogo>
      <NavbarMenu>
        <NavbarMenuItem href="/about">About</NavbarMenuItem>
        <NavbarMenuItem href="/budget" active>
          Budget 2027
        </NavbarMenuItem>
        <NavbarMenuDropdown title="Agencies">
          <NavbarMenuItem href="/agencies/lhdn">
            Lembaga Hasil Dalam Negeri
          </NavbarMenuItem>
          <NavbarMenuItem href="/agencies/jkdm">
            Jabatan Kastam Diraja Malaysia
          </NavbarMenuItem>
          <NavbarMenuItem href="/agencies/anm">
            Jabatan Akauntan Negara Malaysia
          </NavbarMenuItem>
        </NavbarMenuDropdown>
        <NavbarMenuItem href="/contact">Contact us</NavbarMenuItem>
      </NavbarMenu>
      <NavbarAction>
        <Button
          variant="default-ghost"
          iconOnly
          aria-label="Search this site"
          render={<a href="/search" />}
        >
          <ButtonIcon>
            <SearchIcon />
          </ButtonIcon>
        </Button>
        <ThemeSwitch as="toggle" />
      </NavbarAction>
    </Navbar>
  );
}
```

Dropdowns can say what is behind each link (`icon` and `description` on `NavbarMenuItem`), sort links into titled columns (`NavbarMenuGroup`), highlight one item (`feature` takes a `NavbarMenuFeature`) and end with a link to the full index (`footer` takes a `NavbarMenuFooterLink`):

```tsx
import {
  Navbar,
  NavbarAction,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuDropdown,
  NavbarMenuFeature,
  NavbarMenuFooterLink,
  NavbarMenuGroup,
  NavbarMenuItem,
} from "@/components/ui/navbar";
import { ClockIcon } from "@/components/ui/icons/clock";
import { DocumentIcon } from "@/components/ui/icons/document";
import { MoneyIcon } from "@/components/ui/icons/money";

export function AgencyNavbar() {
  return (
    <Navbar>
      <NavbarLogo src="/images/jata-negara.png" alt="Jata Negara">
        Ministry of Finance
      </NavbarLogo>
      <NavbarMenu>
        <NavbarMenuDropdown title="I want to" active>
          <NavbarMenuItem
            href="/pay"
            icon={<MoneyIcon />}
            description="Summonses, fees and assessments"
            active
          >
            Pay a bill
          </NavbarMenuItem>
          <NavbarMenuItem
            href="/receipts"
            icon={<DocumentIcon />}
            description="Download or reprint an official receipt"
          >
            Get a receipt
          </NavbarMenuItem>
          <NavbarMenuItem
            href="/track"
            icon={<ClockIcon />}
            description="See where your application is"
          >
            Track an application
          </NavbarMenuItem>
        </NavbarMenuDropdown>
        <NavbarMenuDropdown
          title="Services"
          footer={
            <NavbarMenuFooterLink href="/services">
              All services
            </NavbarMenuFooterLink>
          }
        >
          <NavbarMenuGroup title="For citizens">
            <NavbarMenuItem href="/tax-relief">Tax relief</NavbarMenuItem>
            <NavbarMenuItem href="/refunds">Refunds</NavbarMenuItem>
          </NavbarMenuGroup>
          <NavbarMenuGroup title="For businesses">
            <NavbarMenuItem href="/suppliers">
              Supplier registration
            </NavbarMenuItem>
            <NavbarMenuItem href="/e-invoicing">e-Invoicing</NavbarMenuItem>
          </NavbarMenuGroup>
        </NavbarMenuDropdown>
        <NavbarMenuDropdown
          title="Publications"
          feature={
            <NavbarMenuFeature
              href="/budget-2027"
              eyebrow="New"
              title="Budget 2027 is out"
              description="What it means for households and small businesses."
              linkLabel="Read the summary"
            />
          }
        >
          <NavbarMenuItem href="/publications/budget">
            Budget documents
          </NavbarMenuItem>
          <NavbarMenuItem href="/publications/outlook">
            Economic outlook
          </NavbarMenuItem>
          <NavbarMenuItem href="/publications/circulars">
            Treasury circulars
          </NavbarMenuItem>
        </NavbarMenuDropdown>
      </NavbarMenu>
      <NavbarAction />
    </Navbar>
  );
}
```

## Notes

- The desktop menu shows from the `xl` breakpoint (1280px). Below it the links move into a full-width panel under the bar, opened by the menu button that `NavbarAction` adds; the same children render in both, so write them once.
- `active` on a `NavbarMenuItem` sets `aria-current="page"` and, at the top level, adds the blue underline. `active` on a `NavbarMenuDropdown` underlines its trigger when the visitor is somewhere in that section.
- `NavbarMenuItem`, `NavbarMenuFeature` and `NavbarMenuFooterLink` take `render` for your router's link, for example `render={<RouterLink href="/pay" />}`.
- `columns` (1, 2 or 3) lays plain dropdown items out in columns; `NavbarMenuGroup`s always sit side by side. Use described items for 3 to 6 links and groups with a footer link for 10 or more.
- `NavbarLogo` needs `src` and `alt`, and `href` defaults to `"/"`. A string title longer than `maxChars` (19 by default) is set smaller over two lines.
- The bar is sticky at the top of the page. Put the `Skiplink` and `Masthead` above it, and keep only a few actions in `NavbarAction`; hide the less important ones on small screens with `className="hidden sm:block"` on a wrapper.
- Props you pass to `NavbarAction` itself (`className`, `variant`, `aria-label`, `onClick`) go to the menu button, not to the wrapper around your actions. The button only shows below `xl`.
- The menu button is named "Menu" (`menuLabel` translates it) and says whether the menu is open with `aria-expanded`.
- `NavbarMenuFeature` is text on a Well, never an image. Use one per dropdown at most.
