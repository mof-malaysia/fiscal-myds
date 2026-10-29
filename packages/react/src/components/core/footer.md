---
title: Footer
description: The plain government footer every service needs: one band with the copyright line, an optional "last updated" note and the required links.
category: Government chrome
---

## When to use

- Put a `Footer` at the bottom of every government service page, with the copyright line and the required links (privacy policy, disclaimer, accessibility).
- Use `SiteFooter` on agency and landing sites that need columns of links, contact details and social links. A `Footer` can sit under it for the legal row.

## Usage

```tsx
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
  FooterMeta,
} from "@/components/ui/footer";

export function ServiceFooter() {
  return (
    <Footer>
      <FooterCopyright>© 2026 Ministry of Finance Malaysia</FooterCopyright>
      <FooterMeta>Last updated: 28 Oct 2026</FooterMeta>
      <FooterLinks aria-label="Legal">
        <FooterLink href="/privacy">Privacy policy</FooterLink>
        <FooterLink href="/disclaimer">Disclaimer</FooterLink>
        <FooterLink href="/accessibility">Accessibility</FooterLink>
        <FooterLink href="/contact">Contact us</FooterLink>
      </FooterLinks>
    </Footer>
  );
}
```

Under a `SiteFooter`, render the `Footer` as a `<div>` so the page keeps one footer landmark, and use the `well` tone if it sits on a Well:

```tsx
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
} from "@/components/ui/footer";

export function LegalRow() {
  return (
    <Footer render={<div />} tone="well">
      <FooterCopyright>© 2026 Ministry of Finance Malaysia</FooterCopyright>
      <FooterLinks aria-label="Legal">
        <FooterLink href="/privacy">Privacy policy</FooterLink>
        <FooterLink href="/disclaimer">Disclaimer</FooterLink>
      </FooterLinks>
    </Footer>
  );
}
```

## Notes

- `Footer` renders a `<footer>`, the page's contentinfo landmark. Have only one per page.
- `tone` is `paper` (default, `bg-bg-gray-50`) or `well` (`bg-bg-washed`). A single hairline sits on top; don't add more borders.
- `FooterLinks` renders a `<nav>` with a list, labelled "Footer" by default; pass `aria-label` to name or translate it. Placed last, it aligns to the end of the row on wide screens.
- `FooterLink` takes `Link` props (`href`, `newTab`, `render` for your router's link) and is underlined on hover.
- `containerClassName` styles the inner row, which is centred at 1280px.
- The footer is hidden when printing.
