import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  SiteFooter,
  SiteFooterInfo,
  SiteFooterLink,
  SiteFooterLinkGroup,
  SiteFooterLogo,
  SiteFooterSection,
} from "@mof-malaysia/ftds-react/site-footer";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
  FooterMeta,
} from "@mof-malaysia/ftds-react/footer";
import { Link } from "@mof-malaysia/ftds-react/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterXIcon,
  YoutubeIcon,
} from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * `SiteFooter` is the large multi-column footer for agency and landing sites:
 * agency identity, address, social links and groups of site links, on a Well
 * band. Place the core `Footer` (copyright and required links) directly under
 * it; wrap both in one `<footer>` and render each with `render={<div />}` so
 * the page has one contentinfo landmark.
 *
 * ### Usage
 * ```tsx
 * import {
 *   SiteFooter,
 *   SiteFooterSection,
 *   SiteFooterInfo,
 *   SiteFooterLogo,
 *   SiteFooterLinkGroup,
 *   SiteFooterLink,
 * } from "@mof-malaysia/ftds-react/site-footer";
 *
 * <SiteFooter>
 *   <SiteFooterSection>
 *     <SiteFooterInfo>
 *       <SiteFooterLogo logo={<img src="/jata.png" alt="" />} logoTitle="Kementerian Kewangan" />
 *     </SiteFooterInfo>
 *     <SiteFooterLinkGroup groupTitle="About us">
 *       <SiteFooterLink href="/profile">Ministry profile</SiteFooterLink>
 *     </SiteFooterLinkGroup>
 *   </SiteFooterSection>
 * </SiteFooter>
 * ```
 */
const meta: Meta<typeof SiteFooter> = {
  title: "Marketing/SiteFooter",
  component: SiteFooter,
  parameters: { layout: "fullscreen" },
};

export default meta;

const socials = [
  { label: "Facebook", Icon: FacebookIcon },
  { label: "X (Twitter)", Icon: TwitterXIcon },
  { label: "Instagram", Icon: InstagramIcon },
  { label: "YouTube", Icon: YoutubeIcon },
];

const Full = () => (
  <footer>
    <SiteFooter render={<div />}>
      <SiteFooterSection>
        <SiteFooterInfo>
          <SiteFooterLogo
            logoTitle="Kementerian Kewangan Malaysia"
            logo={
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png"
                width={36}
                alt=""
                className="select-none"
              />
            }
          />
          <p>
            Kompleks Kementerian Kewangan, No. 5 Persiaran Perdana, Presint 2,
            62592 Putrajaya, Malaysia
          </p>
          <p className="text-txt-black-900 font-semibold">Follow us</p>
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
        <SiteFooterLinkGroup groupTitle="About us">
          <SiteFooterLink href="#">Ministry profile</SiteFooterLink>
          <SiteFooterLink href="#">Organisation chart</SiteFooterLink>
          <SiteFooterLink href="#">Client charter</SiteFooterLink>
          <SiteFooterLink href="#">Careers</SiteFooterLink>
        </SiteFooterLinkGroup>
        <SiteFooterLinkGroup groupTitle="Services">
          <SiteFooterLink href="#">Pay a bill</SiteFooterLink>
          <SiteFooterLink href="#">Government procurement</SiteFooterLink>
          <SiteFooterLink href="#">Supplier registration</SiteFooterLink>
          <SiteFooterLink href="#">Tax incentives</SiteFooterLink>
        </SiteFooterLinkGroup>
        <SiteFooterLinkGroup groupTitle="Resources">
          <SiteFooterLink href="#">Budget 2027</SiteFooterLink>
          <SiteFooterLink href="#">Economic outlook</SiteFooterLink>
          <SiteFooterLink href="#">Circulars</SiteFooterLink>
          <SiteFooterLink href="#">Open data</SiteFooterLink>
        </SiteFooterLinkGroup>
        <SiteFooterLinkGroup groupTitle="Help">
          <SiteFooterLink href="#">Contact us</SiteFooterLink>
          <SiteFooterLink href="#">FAQ</SiteFooterLink>
          <SiteFooterLink href="#">Feedback</SiteFooterLink>
          <SiteFooterLink href="#">Media centre</SiteFooterLink>
        </SiteFooterLinkGroup>
      </SiteFooterSection>
    </SiteFooter>
    <Footer render={<div />} tone="well">
      <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
      <FooterMeta>Last updated: 28 Oct 2026</FooterMeta>
      <FooterLinks aria-label="Legal">
        <FooterLink href="#">Privacy policy</FooterLink>
        <FooterLink href="#">Disclaimer</FooterLink>
        <FooterLink href="#">Accessibility</FooterLink>
      </FooterLinks>
    </Footer>
  </footer>
);

export const Default = createRender(Full);

const LongLabels = () => (
  <SiteFooter>
    <SiteFooterSection>
      <SiteFooterInfo>
        <SiteFooterLogo logoTitle="Jabatan Akauntan Negara Malaysia" />
        <p>Aras 1–8, Kompleks Kementerian Kewangan, 62594 Putrajaya</p>
      </SiteFooterInfo>
      <SiteFooterLinkGroup groupTitle="Perkhidmatan dalam talian">
        <SiteFooterLink href="#">Semakan status bayaran balik</SiteFooterLink>
        <SiteFooterLink href="#">Penyata gaji elektronik</SiteFooterLink>
        <SiteFooterLink href="#">Sistem perakaunan akruan</SiteFooterLink>
      </SiteFooterLinkGroup>
      <SiteFooterLinkGroup groupTitle="Maklumat korporat">
        <SiteFooterLink href="#">Latar belakang</SiteFooterLink>
        <SiteFooterLink href="#">Visi dan misi</SiteFooterLink>
        <SiteFooterLink href="#">Piagam pelanggan</SiteFooterLink>
      </SiteFooterLinkGroup>
    </SiteFooterSection>
  </SiteFooter>
);
export const BahasaMelayu = createRender(LongLabels);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Full />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Full />
    </div>
  ),
  "dark",
);
