import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender, createStory } from "../utils";
import {
  Navbar,
  NavbarLogo,
  NavbarAction,
  NavbarMenuItem,
  NavbarMenu,
  NavbarMenuDropdown,
  NavbarMenuGroup,
  NavbarMenuFeature,
  NavbarMenuFooterLink,
} from "@mof-malaysia/ftds-react/navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mof-malaysia/ftds-react/select";
import {
  BookIcon,
  CalendarIcon,
  ChatBubbleIcon,
  CheckShieldIcon,
  ClockIcon,
  DocumentIcon,
  FormsIcon,
  GlobeIcon,
  GovtOfficeIcon,
  MegaphoneIcon,
  MoneyIcon,
  OrgChartIcon,
  SearchIcon,
  UserGroupIcon,
} from "@mof-malaysia/ftds-react/icon";
import { Button, ButtonIcon } from "@mof-malaysia/ftds-react/button";
import { ThemeSwitch } from "@mof-malaysia/ftds-react/theme-switch";

/**
 * ### Overview
 * The Navbar component serves as the main navigation bar for the application, featuring a responsive design
 * with support for multi-level navigation, language switching, and mobile menu functionality.
 *
 *
 * ### Usage
 * ```tsx
 *   <Navbar>
 *      <NavbarLogo src="https://d2391uizq0pg2.cloudfront.net/common/logo.svg">FTDS</NavbarLogo>
 *         <NavbarMenu>
 *             <NavbarMenuItem href="/menu1">
 *                 MinistryProfile
 *             </NavbarMenuItem>
 *             <NavbarMenuItem href="/menu2">
 *                 Policy
 *             </NavbarMenuItem>
 *             <NavbarMenuItem href="/menu3">
 *                 Achievements
 *             </NavbarMenuItem>
 *             <NavbarMenuItem href="/menu4">
 *                 Media
 *             </NavbarMenuItem>
 *             <NavbarMenuItem href="/menu5">
 *                 Directory
 *             </NavbarMenuItem>
 *             <NavbarMenuItem href="/menu6">
 *                 Contact Us
 *             </NavbarMenuItem>
 *
 *             <NavbarMenuDropdown title="Departments & Agencies">
 *                 <NavbarMenuItem href="/submenu1">
 *                     National Digital Department
 *                 </NavbarMenuItem>
 *                 <NavbarMenuItem href="/submenu2">
 *                     Personal Data Protection Department
 *                 </NavbarMenuItem>
 *                 <NavbarMenuItem href="/submenu3">
 *                     Cybersecurity Malaysia
 *                 </NavbarMenuItem>
 *                 <NavbarMenuItem href="/submenu4">
 *                     Digital Nasional Berhad
 *                 </NavbarMenuItem>
 *                 <NavbarMenuItem href="/submenu5">
 *                     Malaysia Digital Economy Corporation (MDEC)
 *                 </NavbarMenuItem>
 *                 <NavbarMenuItem href="/submenu6">
 *                     MyDIGITAL Corporation
 *                 </NavbarMenuItem>
 *                 <NavbarMenuItem href="/submenu6">
 *                     MYNIC Berhad
 *                 </NavbarMenuItem>
 *             </NavItemsDropdown>
 *         </NavbarMenu>
 *
 *     <NavbarAction showtitle={showMenu} settitle={setMenu}>
 *         <Button variant="default-ghost" className="p-2">
 *             <SearchIcon></SearchIcon>
 *         </Button>
 *
 *         <Button
 *             variant="default-ghost"
 *             className="p-2"
 *             onClick={handleToggle}
 *         >
 *             {isDarkMode ? <SunIcon /> : <MoonIcon />}
 *         </Button>
 *
 *         <Select
 *             value={value}
 *             onValueChange={setValue}
 *             defaultValue="EN"
 *             multiple={false}
 *             variant="outline"
 *             size="medium"
 *         >
 *             <SelectTrigger>
 *                 <GlobeIcon className="h-4 w-4"></GlobeIcon>
 *                 <SelectValue>{(value) => value || "EN"}</SelectValue>
 *             </SelectTrigger>
 *             <SelectContent className="font-body rounded-[4px] py-1">
 *                 <SelectItem value="EN">EN</SelectItem>
 *                 <SelectItem value="BM">BM</SelectItem>
 *             </SelectContent>
 *         </Select>
 *     </NavbarAction>
 * </Navbar>
 * ```
 */

const meta = {
  title: "Marketing/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => {
      return (
        <div className="h-[300px]">
          <Story />
        </div>
      );
    },
  ],
  argTypes: {
    children: {
      control: false,
      description: "Content for the Navbar sections",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
  },
} satisfies Meta<typeof Navbar>;

export default meta;

export const NavbarCustomFtds = createStory(
  {
    children: (
      <>
        <NavbarLogo
          src="https://d2391uizq0pg2.cloudfront.net/common/logo.svg"
          alt="FiscalTech Design System"
        >
          FTDS
        </NavbarLogo>

        <NavbarMenu>
          <NavbarMenuItem href="/menu1">Menu 1</NavbarMenuItem>
          <NavbarMenuItem href="/menu2">Menu 2</NavbarMenuItem>
          <NavbarMenuDropdown title="Menu Dropdown">
            <NavbarMenuItem href="/submenu1">Submenu 1</NavbarMenuItem>
            <NavbarMenuItem href="/submenu2">Submenu 2</NavbarMenuItem>
            <NavbarMenuItem href="/submenu3">Submenu 3</NavbarMenuItem>
            <NavbarMenuItem href="/submenu1">Submenu 4</NavbarMenuItem>
            <NavbarMenuItem href="/submenu2">Submenu 5</NavbarMenuItem>
            <NavbarMenuItem href="/submenu3">Submenu 6</NavbarMenuItem>
            <NavbarMenuItem href="/submenu3">Submenu 7</NavbarMenuItem>
          </NavbarMenuDropdown>
          <NavbarMenuItem href="/menu3">Menu 3</NavbarMenuItem>
        </NavbarMenu>

        <NavbarAction>
          {/* Button Search  : mobile hide if needed  */}
          <Button
            variant="default-ghost"
            iconOnly
            aria-label="search-button"
            size={"small"}
          >
            <ButtonIcon>
              <SearchIcon />
            </ButtonIcon>
          </Button>

          {/* Button Light Mode Toggle  : mobile hide if needed  */}
          <ThemeSwitch as="toggle" />

          {/* Select Language Toggle  : mobile hide if needed  */}
          <div className="hidden sm:block">
            <Select defaultValue="EN" variant="ghost" size="small">
              <SelectTrigger
                aria-label="Language"
                className="w-fit"
                icon={<GlobeIcon />}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="font-body rounded-[4px] py-1"
              >
                <SelectItem value="EN">EN</SelectItem>
                <SelectItem value="BM">BM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </NavbarAction>
      </>
    ),
  },
  "light",
);

export const NavbarCustomKementerianDigital = createStory(
  {
    children: (
      <>
        <NavbarLogo
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png"
          alt="Kementerian Digital"
        >
          Ministry Of Digital
        </NavbarLogo>
        <NavbarMenu>
          <NavbarMenuItem href="/menu1">Ministry Profile</NavbarMenuItem>
          <NavbarMenuItem href="/menu2">Policy</NavbarMenuItem>
          <NavbarMenuItem href="/menu3">Achievements</NavbarMenuItem>
          <NavbarMenuItem href="/menu4">Media</NavbarMenuItem>
          <NavbarMenuItem href="/menu5">Directory</NavbarMenuItem>
          <NavbarMenuItem href="/menu6">Contact Us</NavbarMenuItem>

          <NavbarMenuDropdown title="Departments & Agencies">
            <NavbarMenuItem href="/submenu1">
              National Digital Department
            </NavbarMenuItem>
            <NavbarMenuItem href="/submenu2">
              Personal Data Protection Department
            </NavbarMenuItem>
            <NavbarMenuItem href="/submenu3">
              Cybersecurity Malaysia
            </NavbarMenuItem>
            <NavbarMenuItem href="/submenu4">
              Digital Nasional Berhad
            </NavbarMenuItem>
            <NavbarMenuItem href="/submenu5">
              Malaysia Digital Economy Coroporation (MDEC)
            </NavbarMenuItem>
            <NavbarMenuItem href="/submenu6">
              MyDIGITAL Corporation
            </NavbarMenuItem>
            <NavbarMenuItem href="/submenu6">MYNIC Berhad</NavbarMenuItem>
          </NavbarMenuDropdown>
        </NavbarMenu>
        <NavbarAction>
          {/* Button Search  : mobile hide if needed  */}
          <Button
            variant="default-ghost"
            iconOnly
            aria-label="search-button"
            size={"small"}
          >
            <ButtonIcon>
              <SearchIcon />
            </ButtonIcon>
          </Button>

          {/* Button Light Mode Toggle : mobile hide if needed  */}
          <ThemeSwitch as="toggle" />

          {/* Select Language Toggle : mobile hide if needed */}
          <div className="hidden sm:block">
            <Select defaultValue="EN" variant="ghost" size="medium">
              <SelectTrigger
                aria-label="Language"
                className="w-fit"
                icon={<GlobeIcon />}
              >
                <SelectValue>{(value) => value || "EN"}</SelectValue>
              </SelectTrigger>
              <SelectContent className="font-body rounded-[4px] py-1">
                <SelectItem value="EN">EN</SelectItem>
                <SelectItem value="BM">BM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </NavbarAction>
      </>
    ),
  },
  "light",
);

/*========================================================================================================================*/
/* Expressive submenus: described items, groups, one feature, a footer link, and one shared panel that resizes. */

const MOF_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png";

const Actions = () => (
  <NavbarAction>
    <Button variant="default-ghost" iconOnly aria-label="Search" size="small">
      <ButtonIcon>
        <SearchIcon />
      </ButtonIcon>
    </Button>
    <ThemeSwitch as="toggle" />
  </NavbarAction>
);

/** A: each link says what's behind it. Best for 3–6 links. */
const ServicesDescribed = ({ active = false }: { active?: boolean }) => (
  <NavbarMenuDropdown title="Services" active={active}>
    <NavbarMenuItem
      href="#pay"
      icon={<MoneyIcon />}
      description="Summons, fees and assessments"
      active={active}
    >
      Pay a bill
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#receipts"
      icon={<DocumentIcon />}
      description="Download or reprint an official receipt"
    >
      Get a receipt
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#track"
      icon={<ClockIcon />}
      description="See where your application is"
    >
      Track a submission
    </NavbarMenuItem>
  </NavbarMenuDropdown>
);

/** B: links sorted by audience, with a way out to the full index. Best for 10+ links. */
const ServicesGrouped = () => (
  <NavbarMenuDropdown
    title="Services"
    footer={
      <NavbarMenuFooterLink href="#all">All services</NavbarMenuFooterLink>
    }
  >
    <NavbarMenuGroup title="For citizens">
      <NavbarMenuItem href="#pay">Pay a bill</NavbarMenuItem>
      <NavbarMenuItem href="#relief">Tax relief</NavbarMenuItem>
      <NavbarMenuItem href="#refunds">Refunds</NavbarMenuItem>
      <NavbarMenuItem href="#aid">Cash aid</NavbarMenuItem>
    </NavbarMenuGroup>
    <NavbarMenuGroup title="For businesses">
      <NavbarMenuItem href="#supplier">Supplier registration</NavbarMenuItem>
      <NavbarMenuItem href="#tenders">Tenders</NavbarMenuItem>
      <NavbarMenuItem href="#einvoice">e-Invoicing</NavbarMenuItem>
    </NavbarMenuGroup>
    <NavbarMenuGroup title="For agencies">
      <NavbarMenuItem href="#budget">Budget submission</NavbarMenuItem>
      <NavbarMenuItem href="#procurement">Procurement rules</NavbarMenuItem>
      <NavbarMenuItem href="#circulars">Treasury circulars</NavbarMenuItem>
    </NavbarMenuGroup>
  </NavbarMenuDropdown>
);

/** C: plain links plus one highlighted item. */
const PublicationsWithFeature = () => (
  <NavbarMenuDropdown
    title="Publications"
    feature={
      <NavbarMenuFeature
        href="#budget-2027"
        eyebrow="New"
        title="Budget 2027 is out"
        description="What it means for households and small businesses, in plain language."
        linkLabel="Read the summary"
      />
    }
  >
    <NavbarMenuItem href="#budget">Budget documents</NavbarMenuItem>
    <NavbarMenuItem href="#outlook">Economic outlook</NavbarMenuItem>
    <NavbarMenuItem href="#stats">Fiscal statistics</NavbarMenuItem>
    <NavbarMenuItem href="#reports">Annual reports</NavbarMenuItem>
    <NavbarMenuItem href="#press">Press releases</NavbarMenuItem>
  </NavbarMenuDropdown>
);

const AboutDescribed = () => (
  <NavbarMenuDropdown title="About" columns={2}>
    <NavbarMenuItem
      href="#ministry"
      icon={<GovtOfficeIcon />}
      description="Our role, vision and history"
    >
      The ministry
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#leadership"
      icon={<UserGroupIcon />}
      description="Minister, deputies and secretary-general"
    >
      Leadership
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#org"
      icon={<OrgChartIcon />}
      description="Divisions and who does what"
    >
      Organisation chart
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#agencies"
      icon={<CheckShieldIcon />}
      description="Statutory bodies under MOF"
    >
      Agencies
    </NavbarMenuItem>
  </NavbarMenuDropdown>
);

const Shell = ({ children }: { children: React.ReactNode }) => (
  <Navbar>
    <NavbarLogo src={MOF_LOGO} alt="Kementerian Kewangan Malaysia">
      Ministry of Finance
    </NavbarLogo>
    <NavbarMenu>{children}</NavbarMenu>
    <Actions />
  </Navbar>
);

/**
 * Items with an `icon` and `description` become full-width rows: a citizen can see
 * what's behind a link before clicking. `active` marks the current page and section.
 */
export const SubmenuDescribedList = createRender(() => (
  <Shell>
    <NavbarMenuItem href="#home">Home</NavbarMenuItem>
    <ServicesDescribed active />
    <NavbarMenuItem href="#contact">Contact</NavbarMenuItem>
  </Shell>
));

/** `NavbarMenuGroup` sits groups side by side; `footer` adds a Well band with a way out. */
export const SubmenuGroupedColumns = createRender(() => (
  <Shell>
    <NavbarMenuItem href="#home">Home</NavbarMenuItem>
    <ServicesGrouped />
    <NavbarMenuItem href="#contact">Contact</NavbarMenuItem>
  </Shell>
));

/** `feature` takes one `NavbarMenuFeature`: the single highlighted item, text only. */
export const SubmenuWithFeature = createRender(() => (
  <Shell>
    <NavbarMenuItem href="#home">Home</NavbarMenuItem>
    <PublicationsWithFeature />
    <NavbarMenuItem href="#contact">Contact</NavbarMenuItem>
  </Shell>
));

/**
 * A full agency navbar mixing all three. Open "Services", then move to "Publications"
 * and "About": one panel resizes and slides instead of three dropdowns opening and closing.
 */
export const AgencySite = createRender(() => (
  <Shell>
    <ServicesGrouped />
    <PublicationsWithFeature />
    <AboutDescribed />
    <NavbarMenuItem href="#news" active>
      News
    </NavbarMenuItem>
    <NavbarMenuItem href="#contact">Contact</NavbarMenuItem>
  </Shell>
));

/** Pattern: lead with verbs for citizen services. Built from the same parts, in two columns. */
export const TaskFirstPattern = createRender(() => (
  <Shell>
    <NavbarMenuDropdown
      title="I want to"
      columns={2}
      footer={
        <NavbarMenuFooterLink href="#all">
          Browse all services
        </NavbarMenuFooterLink>
      }
    >
      <NavbarMenuItem
        href="#pay"
        icon={<MoneyIcon />}
        description="A bill, summons or fine"
      >
        Pay
      </NavbarMenuItem>
      <NavbarMenuItem
        href="#apply"
        icon={<FormsIcon />}
        description="For a licence, aid or refund"
      >
        Apply
      </NavbarMenuItem>
      <NavbarMenuItem
        href="#check"
        icon={<SearchIcon />}
        description="The status of a submission"
      >
        Check
      </NavbarMenuItem>
      <NavbarMenuItem
        href="#contact"
        icon={<ChatBubbleIcon />}
        description="Talk to an officer"
      >
        Contact
      </NavbarMenuItem>
    </NavbarMenuDropdown>
    <PublicationsWithFeature />
    <NavbarMenuItem href="#news">News</NavbarMenuItem>
  </Shell>
));

const Events = () => (
  <NavbarMenuDropdown title="Events">
    <NavbarMenuItem
      href="#calendar"
      icon={<CalendarIcon />}
      description="Briefings and public consultations"
    >
      Calendar
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#announcements"
      icon={<MegaphoneIcon />}
      description="Official notices and circulars"
    >
      Announcements
    </NavbarMenuItem>
    <NavbarMenuItem
      href="#library"
      icon={<BookIcon />}
      description="Speeches and archived material"
    >
      Library
    </NavbarMenuItem>
  </NavbarMenuDropdown>
);

/** On tablet and mobile the same parts stack: descriptions stay, the feature and footer move below the links. */
export const MobileMenu = {
  ...createRender(() => (
    <Shell>
      <ServicesGrouped />
      <PublicationsWithFeature />
      <Events />
      <NavbarMenuItem href="#contact">Contact</NavbarMenuItem>
    </Shell>
  )),
  globals: { viewport: { value: "mobile2", isRotated: false } },
  parameters: {
    layout: "fullscreen",
  },
};

export const AgencySiteDark = {
  ...createRender(
    () => (
      <div className="dark bg-bg-white">
        <Shell>
          <ServicesGrouped />
          <PublicationsWithFeature />
          <Events />
          <NavbarMenuItem href="#contact">Contact</NavbarMenuItem>
        </Shell>
      </div>
    ),
    "dark",
  ),
  parameters: {
    layout: "fullscreen",
  },
};
