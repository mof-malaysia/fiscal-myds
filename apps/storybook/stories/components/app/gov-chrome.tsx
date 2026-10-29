import React from "react";
import {
  Masthead,
  MastheadContent,
  MastheadHeader,
  MastheadSection,
  MastheadTitle,
  MastheadTrigger,
} from "@mof-malaysia/ftds-react/masthead";
import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
} from "@mof-malaysia/ftds-react/footer";
import {
  Lock2Icon,
  LockFillIcon,
  PutrajayaIcon,
} from "@mof-malaysia/ftds-react/icon";

/** The one service name every citizen-facing example uses. */
export const SERVICE_NAME = "MyFiscal";

/** The government Masthead every citizen-facing example opens with. */
export const GovMasthead = () => (
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
        as an added precaution.
      </MastheadSection>
    </MastheadContent>
  </Masthead>
);

/** The legal footer on the Well. */
export const GovFooter = ({
  links = ["Privacy policy", "Disclaimer", "Accessibility", "Contact us"],
}: {
  links?: string[];
}) => (
  // The page's footer landmark; Footer renders a div inside it
  <footer>
    <Footer render={<div />} tone="well">
      <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
      <FooterLinks aria-label="Legal">
        {links.map((link) => (
          <FooterLink key={link} href="#">
            {link}
          </FooterLink>
        ))}
      </FooterLinks>
    </Footer>
  </footer>
);
