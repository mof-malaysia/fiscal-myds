---
title: Site Footer
description: The large multi-column footer for agency and landing sites: agency name, address and social links, then groups of site links. Pair it with Footer.
category: Government chrome
---

## When to use

- Use `SiteFooter` at the bottom of an agency or landing site that has many pages to link to.
- Use `Footer` on its own for a citizen service or a small site: copyright, the last-updated date and the required links (privacy policy, disclaimer, accessibility). Every public page needs it, so place it directly under `SiteFooter` too.

## Usage

Wrap both in one `<footer>` and render each with `render={<div />}`, so the page has a single contentinfo landmark. `SiteFooterSection` is a 12-column grid: `SiteFooterInfo` takes the first four columns on desktop, and each `SiteFooterLinkGroup` takes two.

```tsx
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
  FooterMeta,
} from "@/components/ui/footer";
import { Link } from "@/components/ui/link";
import {
  SiteFooter,
  SiteFooterInfo,
  SiteFooterLink,
  SiteFooterLinkGroup,
  SiteFooterLogo,
  SiteFooterSection,
} from "@/components/ui/site-footer";
import { FacebookIcon } from "@/components/ui/icons/facebook";
import { TwitterXIcon } from "@/components/ui/icons/twitter-x";
import { YoutubeIcon } from "@/components/ui/icons/youtube";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/MOFMalaysia",
    Icon: FacebookIcon,
  },
  {
    label: "X (Twitter)",
    href: "https://x.com/MOFMalaysia",
    Icon: TwitterXIcon,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@MOFMalaysia",
    Icon: YoutubeIcon,
  },
];

export function AgencyFooter() {
  return (
    <footer>
      <SiteFooter render={<div />}>
        <SiteFooterSection>
          <SiteFooterInfo>
            <SiteFooterLogo
              logoTitle="Kementerian Kewangan Malaysia"
              logo={<img src="/images/jata-negara.png" width={36} alt="" />}
            />
            <p>
              Kompleks Kementerian Kewangan, No. 5 Persiaran Perdana, Presint 2,
              62592 Putrajaya
            </p>
            <div className="flex gap-1">
              {socials.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  newTab
                  underline="none"
                  aria-label={label}
                  className="text-txt-black-700 hover:text-txt-black-900 flex size-11 items-center justify-center rounded-md"
                >
                  <Icon aria-hidden />
                </Link>
              ))}
            </div>
          </SiteFooterInfo>
          <SiteFooterLinkGroup groupTitle="About us">
            <SiteFooterLink href="/profile">Ministry profile</SiteFooterLink>
            <SiteFooterLink href="/organisation">
              Organisation chart
            </SiteFooterLink>
            <SiteFooterLink href="/client-charter">
              Client charter
            </SiteFooterLink>
          </SiteFooterLinkGroup>
          <SiteFooterLinkGroup groupTitle="Services">
            <SiteFooterLink href="/pay">Pay a bill</SiteFooterLink>
            <SiteFooterLink href="/suppliers">
              Supplier registration
            </SiteFooterLink>
            <SiteFooterLink href="/tax-incentives">
              Tax incentives
            </SiteFooterLink>
          </SiteFooterLinkGroup>
          <SiteFooterLinkGroup groupTitle="Resources">
            <SiteFooterLink href="/budget-2027">Budget 2027</SiteFooterLink>
            <SiteFooterLink href="/circulars">
              Treasury circulars
            </SiteFooterLink>
            <SiteFooterLink href="/open-data">Open data</SiteFooterLink>
          </SiteFooterLinkGroup>
          <SiteFooterLinkGroup groupTitle="Help">
            <SiteFooterLink href="/contact">Contact us</SiteFooterLink>
            <SiteFooterLink href="/faq">FAQ</SiteFooterLink>
            <SiteFooterLink href="/feedback">Feedback</SiteFooterLink>
          </SiteFooterLinkGroup>
        </SiteFooterSection>
      </SiteFooter>
      <Footer render={<div />} tone="well">
        <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
        <FooterMeta>Last updated: 28 October 2026</FooterMeta>
        <FooterLinks aria-label="Legal">
          <FooterLink href="/privacy">Privacy policy</FooterLink>
          <FooterLink href="/disclaimer">Disclaimer</FooterLink>
          <FooterLink href="/accessibility">Accessibility</FooterLink>
        </FooterLinks>
      </Footer>
    </footer>
  );
}
```

## Notes

- Give `Footer` `tone="well"` under a `SiteFooter`, so the two read as one band.
- A string `groupTitle` renders an `h2` and names the group's `<nav>`; with a node instead, the nav has no name, so add your own heading and `aria-labelledby`.
- `SiteFooterLinkGroup` shows every link; pass `linkCount` to show only the first few. For long lists, link to an index page instead.
- Four link groups fill the desktop row beside `SiteFooterInfo`. On mobile the groups sit two per row.
- The logo image is decorative when `logoTitle` names the agency: give it `alt=""`. A string `logoTitle` renders as a paragraph, not a heading.
- Icon-only social links need an `aria-label` naming the network.
- The footer is a Well band with no dividers between rows, and it is hidden when printing. Don't add borders or cards inside it.
