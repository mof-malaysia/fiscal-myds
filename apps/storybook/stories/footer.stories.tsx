import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
  FooterMeta,
} from "@mof-malaysia/ftds-react/footer";

/**
 * ### Overview
 * The plain government footer every MOF site and service needs: one compact
 * band with the copyright line, an optional "last updated" note and the
 * required links. Paper (default) or Well background, a single Hairline rule
 * on top, hidden when printing.
 *
 * For agency and landing sites, put the marketing `SiteFooter` above it and
 * render this one with `render={<div />}` so the page keeps one contentinfo
 * landmark.
 *
 * ### Usage
 * ```tsx
 * import {
 *   Footer,
 *   FooterCopyright,
 *   FooterMeta,
 *   FooterLinks,
 *   FooterLink,
 * } from "@mof-malaysia/ftds-react/footer";
 *
 * <Footer>
 *   <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
 *   <FooterMeta>Last updated: 28 Oct 2026</FooterMeta>
 *   <FooterLinks aria-label="Legal">
 *     <FooterLink href="/privacy">Privacy policy</FooterLink>
 *     <FooterLink href="/disclaimer">Disclaimer</FooterLink>
 *   </FooterLinks>
 * </Footer>
 * ```
 */
const meta: Meta<typeof Footer> = {
  title: "Core/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
};

export default meta;

const Links = () => (
  <FooterLinks aria-label="Legal">
    <FooterLink href="#">Privacy policy</FooterLink>
    <FooterLink href="#">Disclaimer</FooterLink>
    <FooterLink href="#">Security policy</FooterLink>
    <FooterLink href="#">Accessibility</FooterLink>
    <FooterLink href="#">Sitemap</FooterLink>
  </FooterLinks>
);

const Standard = ({ tone }: { tone?: "paper" | "well" }) => (
  <Footer tone={tone}>
    <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
    <FooterMeta>Last updated: 28 Oct 2026</FooterMeta>
    <Links />
  </Footer>
);

export const Default = createRender(() => <Standard />);

export const Well = createRender(() => <Standard tone="well" />);

const Malay = () => (
  <Footer>
    <FooterCopyright>
      Hak Cipta Terpelihara © 2026 Kementerian Kewangan Malaysia
    </FooterCopyright>
    <FooterMeta>Kemas kini terakhir: 28 Okt 2026</FooterMeta>
    <FooterLinks aria-label="Pautan wajib">
      <FooterLink href="#">Dasar privasi</FooterLink>
      <FooterLink href="#">Penafian</FooterLink>
      <FooterLink href="#">Dasar keselamatan</FooterLink>
      <FooterLink href="#">Kebolehcapaian</FooterLink>
    </FooterLinks>
  </Footer>
);
export const BahasaMelayu = createRender(Malay);

const CopyrightOnly = () => (
  <Footer>
    <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
    <Links />
  </Footer>
);
export const WithoutLastUpdated = createRender(CopyrightOnly);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Standard />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Standard />
    </div>
  ),
  "dark",
);
