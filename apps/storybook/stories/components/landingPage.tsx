import { Button } from "@mof-malaysia/ftds-react/button";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@mof-malaysia/ftds-react/carousel";
import { CtaBand } from "@mof-malaysia/ftds-react/cta-band";
import { Faq } from "@mof-malaysia/ftds-react/faq";
import { FeatureGrid } from "@mof-malaysia/ftds-react/feature-grid";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
  FooterMeta,
} from "@mof-malaysia/ftds-react/footer";
import { Hero } from "@mof-malaysia/ftds-react/hero";
import {
  BellIcon,
  ChatBubbleIcon,
  CheckShieldIcon,
  DocumentIcon,
  FacebookIcon,
  InstagramIcon,
  Lock2Icon,
  LockFillIcon,
  MobileIcon,
  MoneyIcon,
  PutrajayaIcon,
  SearchIcon,
  TwitterXIcon,
  YoutubeIcon,
} from "@mof-malaysia/ftds-react/icon";
import { Link } from "@mof-malaysia/ftds-react/link";
import { LogoCloud } from "@mof-malaysia/ftds-react/logo-cloud";
import {
  Masthead,
  MastheadContent,
  MastheadHeader,
  MastheadSection,
  MastheadTitle,
  MastheadTrigger,
} from "@mof-malaysia/ftds-react/masthead";
import {
  Navbar,
  NavbarAction,
  NavbarLogo,
  NavbarMenu,
  NavbarMenuDropdown,
  NavbarMenuItem,
} from "@mof-malaysia/ftds-react/navbar";
import {
  SiteFooter,
  SiteFooterInfo,
  SiteFooterLink,
  SiteFooterLinkGroup,
  SiteFooterLogo,
  SiteFooterSection,
} from "@mof-malaysia/ftds-react/site-footer";
import { Skiplink } from "@mof-malaysia/ftds-react/skiplink";
import { StatsBand } from "@mof-malaysia/ftds-react/stats-band";
import { Testimonial } from "@mof-malaysia/ftds-react/testimonial";

const JATA =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png";

// Placeholder images so the example has no other external dependency.
const svg = (markup: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;

const wordmark = (text: string, color: string) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="140" height="48" viewBox="0 0 140 48"><circle cx="22" cy="24" r="14" fill="${color}"/><text x="44" y="30" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" fill="#3F3F46">${text}</text></svg>`,
  );

const avatar = (initials: string) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44"><rect width="44" height="44" fill="#E4E4E7"/><text x="22" y="27" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600" fill="#3F3F46">${initials}</text></svg>`,
  );

const DemoMasthead = () => (
  <Masthead>
    <MastheadHeader>
      <MastheadTitle>Laman web rasmi Kerajaan Malaysia</MastheadTitle>
      <MastheadTrigger>Ketahui lebih lanjut</MastheadTrigger>
    </MastheadHeader>
    <MastheadContent>
      <MastheadSection
        icon={<PutrajayaIcon />}
        title="Official government websites end with .gov.my"
      >
        If the link does not end with <b>.gov.my</b>, exit the website
        immediately even if it looks similar.
      </MastheadSection>
      <MastheadSection icon={<Lock2Icon />} title="Secure websites use HTTPS">
        Look for a lock (<LockFillIcon className="inline-block" />) or https://
        as an added precaution. If not present, do not share any sensitive
        information.
      </MastheadSection>
    </MastheadContent>
  </Masthead>
);

const DemoNavbar = () => (
  <Navbar>
    <NavbarLogo src={JATA} alt="Jata Negara">
      MyBayar
    </NavbarLogo>
    <NavbarMenu>
      <NavbarMenuItem href="#">Pay a bill</NavbarMenuItem>
      <NavbarMenuItem href="#">Track a payment</NavbarMenuItem>
      <NavbarMenuDropdown title="Agencies">
        <NavbarMenuItem href="#">Lembaga Hasil Dalam Negeri</NavbarMenuItem>
        <NavbarMenuItem href="#">Jabatan Kastam Diraja Malaysia</NavbarMenuItem>
        <NavbarMenuItem href="#">Jabatan Akauntan Negara</NavbarMenuItem>
        <NavbarMenuItem href="#">All agencies</NavbarMenuItem>
      </NavbarMenuDropdown>
      <NavbarMenuItem href="#">Help</NavbarMenuItem>
    </NavbarMenu>
    <NavbarAction>
      <Button variant="default-ghost" iconOnly aria-label="Search">
        <SearchIcon aria-hidden />
      </Button>
    </NavbarAction>
  </Navbar>
);

const updates = [
  {
    tag: "Service",
    title: "JPJ summonses can now be paid in instalments",
    text: "Split summonses above RM 300 into up to three monthly payments.",
  },
  {
    tag: "Budget 2027",
    title: "What the new budget means for your bills",
    text: "A plain-language summary of the fee changes that start in January.",
  },
  {
    tag: "Notice",
    title: "Scheduled maintenance on 2 November",
    text: "Payments are unavailable from 1 am to 4 am. Receipts are not affected.",
  },
  {
    tag: "Guide",
    title: "Paying for someone else",
    text: "How to settle a bill for a parent or employee, and whose name goes on the receipt.",
  },
];

const LatestUpdates = () => (
  <div className="bg-bg-gray-50 w-full">
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-12 md:px-6 md:py-16">
      <h2
        id="updates-title"
        className="text-txt-black-900 text-heading-xs md:text-heading-sm font-semibold tracking-[-0.015em]"
      >
        Latest updates
      </h2>
      <Carousel aria-labelledby="updates-title">
        <CarouselContent>
          {updates.map((u) => (
            <CarouselItem
              key={u.title}
              className="basis-[85%] md:basis-1/2 lg:basis-1/3"
            >
              <article className="bg-bg-white flex h-full flex-col gap-3 rounded-lg p-6">
                <p className="text-txt-primary text-body-sm font-medium">
                  {u.tag}
                </p>
                <h3 className="text-txt-black-900 text-body-lg font-semibold">
                  <Link href="#" underline="hover">
                    {u.title}
                  </Link>
                </h3>
                <p className="text-txt-black-700 text-content">{u.text}</p>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center gap-2">
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="ml-auto" />
        </div>
      </Carousel>
    </div>
  </div>
);

const socials = [
  { label: "Facebook", Icon: FacebookIcon },
  { label: "X (Twitter)", Icon: TwitterXIcon },
  { label: "Instagram", Icon: InstagramIcon },
  { label: "YouTube", Icon: YoutubeIcon },
];

const DemoFooter = () => (
  <footer>
    <SiteFooter render={<div />}>
      <SiteFooterSection>
        <SiteFooterInfo>
          <SiteFooterLogo
            logoTitle="Kementerian Kewangan Malaysia"
            logo={<img src={JATA} width={36} alt="" className="select-none" />}
          />
          <p>
            Kompleks Kementerian Kewangan, No. 5 Persiaran Perdana, Presint 2,
            62592 Putrajaya, Malaysia
          </p>
          <div className="flex gap-1">
            {socials.map(({ label, Icon }) => (
              <Link
                key={label}
                href="#"
                newTab
                aria-label={label}
                underline="none"
                className="text-txt-black-700 hover:text-txt-black-900 hover:bg-bg-dialog-active focus-visible:outline-fr-primary flex size-11 items-center justify-center rounded-md outline-none focus-visible:outline-2 focus-visible:outline-solid"
              >
                <Icon aria-hidden />
              </Link>
            ))}
          </div>
        </SiteFooterInfo>
        <SiteFooterLinkGroup groupTitle="Services">
          <SiteFooterLink href="#">Pay a bill</SiteFooterLink>
          <SiteFooterLink href="#">Track a payment</SiteFooterLink>
          <SiteFooterLink href="#">Download a receipt</SiteFooterLink>
        </SiteFooterLinkGroup>
        <SiteFooterLinkGroup groupTitle="About">
          <SiteFooterLink href="#">About MyBayar</SiteFooterLink>
          <SiteFooterLink href="#">Client charter</SiteFooterLink>
          <SiteFooterLink href="#">Media centre</SiteFooterLink>
        </SiteFooterLinkGroup>
        <SiteFooterLinkGroup groupTitle="Resources">
          <SiteFooterLink href="#">Budget 2027</SiteFooterLink>
          <SiteFooterLink href="#">Circulars</SiteFooterLink>
          <SiteFooterLink href="#">Open data</SiteFooterLink>
        </SiteFooterLinkGroup>
        <SiteFooterLinkGroup groupTitle="Help">
          <SiteFooterLink href="#">Help centre</SiteFooterLink>
          <SiteFooterLink href="#">Contact us</SiteFooterLink>
          <SiteFooterLink href="#">Feedback</SiteFooterLink>
        </SiteFooterLinkGroup>
      </SiteFooterSection>
    </SiteFooter>
    <Footer render={<div />} tone="well">
      <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
      <FooterMeta>Last updated: 28 Oct 2026</FooterMeta>
      <FooterLinks aria-label="Legal">
        <FooterLink href="#">Privacy policy</FooterLink>
        <FooterLink href="#">Disclaimer</FooterLink>
        <FooterLink href="#">Security policy</FooterLink>
        <FooterLink href="#">Accessibility</FooterLink>
      </FooterLinks>
    </Footer>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="bg-bg-gray-50 font-body min-h-screen">
      <Skiplink href="#main-content">Skip to main content</Skiplink>
      <DemoMasthead />
      <DemoNavbar />
      <main id="main-content">
        <Hero
          eyebrow="New: instalments for JPJ summonses"
          title="Pay your government bills in one place"
          description="Settle fees, fines and assessments from more than 30 agencies with one MyDigital ID. Every payment gets an official receipt."
          primaryAction={{ label: "Start a payment", href: "#" }}
          secondaryAction={{ label: "How it works", href: "#features" }}
          footnote="Takes about three minutes. Keep your bill number handy."
          media={
            <img
              src="https://d2391uizq0pg2.cloudfront.net/common/preview-2.svg"
              alt=""
              className="h-auto w-full"
            />
          }
        />
        <LogoCloud
          title="Agencies using MyBayar"
          logos={[
            {
              src: wordmark("LHDN", "#2563EB"),
              alt: "Lembaga Hasil Dalam Negeri",
            },
            {
              src: wordmark("JKDM", "#15803D"),
              alt: "Jabatan Kastam Diraja Malaysia",
            },
            {
              src: wordmark("ANM", "#B91C1C"),
              alt: "Jabatan Akauntan Negara Malaysia",
            },
            {
              src: wordmark("JPJ", "#A16207"),
              alt: "Jabatan Pengangkutan Jalan",
            },
            {
              src: wordmark("KWAP", "#1D4ED8"),
              alt: "Kumpulan Wang Persaraan",
            },
          ]}
        />
        <FeatureGrid
          id="features"
          title="Everything in one account"
          description="One MyDigital ID for every Ministry of Finance payment, from a summons to a supplier fee."
          surface="sheet"
          features={[
            {
              icon: <MoneyIcon />,
              title: "Pay online",
              description:
                "FPX, debit and credit cards, and e-wallets. No queue, no cheque.",
              href: "#",
            },
            {
              icon: <DocumentIcon />,
              title: "Official receipts",
              description:
                "Every payment gets a receipt you can download, print or share.",
              href: "#",
            },
            {
              icon: <BellIcon />,
              title: "Due-date reminders",
              description:
                "We remind you before a payment is due, by email or SMS.",
            },
            {
              icon: <CheckShieldIcon />,
              title: "Secure by default",
              description:
                "Sign in with MyDigital ID. Your data stays in Malaysia.",
            },
            {
              icon: <MobileIcon />,
              title: "Works on your phone",
              description:
                "Designed for small screens first, with large, readable text.",
            },
            {
              icon: <ChatBubbleIcon />,
              title: "Help when you need it",
              description:
                "Guidance in BM and English, and a person to talk to if you are stuck.",
              href: "#",
            },
          ]}
        />
        <StatsBand
          title="MyBayar in numbers"
          stats={[
            { value: "RM 4.2 bil", label: "Collected online in 2025" },
            {
              value: "1.8 juta",
              label: "Payments a month",
              footnote: "Average, January to September 2026",
            },
            { value: "32", label: "Agencies connected" },
            { value: "3 min", label: "Typical time to pay" },
          ]}
          source="Source: Kementerian Kewangan Malaysia, September 2026"
        />
        <LatestUpdates />
        <Testimonial
          title="What people say"
          items={[
            {
              quote:
                "I paid my company's assessment in five minutes and had the receipt before I closed the tab.",
              name: "Nurul Aina Rahman",
              role: "Business owner, Shah Alam",
              avatar: avatar("NA"),
            },
            {
              quote:
                "The reminders are the best part. I have not missed a due date since I signed up.",
              name: "Tan Wei Ming",
              role: "Retiree, Ipoh",
              avatar: avatar("TW"),
            },
            {
              quote:
                "Saya boleh semak status tuntutan tanpa perlu menelefon. Semuanya jelas.",
              name: "Muthu Krishnan",
              role: "Penjawat awam, Putrajaya",
            },
          ]}
        />
        <Faq
          description="Answers to the questions people ask most about paying online."
          items={[
            {
              question: "Which bills can I pay here?",
              answer:
                "Fees, fines and assessments from more than 30 federal agencies, including JPJ summonses, LHDN instalments and court fines.",
            },
            {
              question: "How do I know my payment went through?",
              answer:
                "You see a confirmation page with a reference number straight away, and we email you an official receipt within five minutes.",
            },
            {
              question: "Can I pay on behalf of someone else?",
              answer:
                "Yes. Enter their bill or reference number. The receipt shows their name and your payment details.",
            },
            {
              question: "What if I paid the wrong amount?",
              answer:
                "Contact the agency that issued the bill. Refunds are handled by the agency and usually take 14 working days.",
            },
          ]}
          contact={
            <>
              Still need help?{" "}
              <Link href="#" primary underline="always">
                Contact the help centre
              </Link>
            </>
          }
        />
        <CtaBand
          tone="primary"
          title="Ready to pay?"
          description="It takes about three minutes. Keep your bill or reference number handy."
          primaryAction={{ label: "Start a payment", href: "#" }}
          secondaryAction={{ label: "Contact us", href: "#" }}
        />
      </main>
      <DemoFooter />
    </div>
  );
}
