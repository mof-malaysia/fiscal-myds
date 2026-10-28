import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, VariantProps } from "class-variance-authority";
import { clx } from "../../utils";
import { Link } from "./link";

/**
 * Footer is the plain government footer every MOF site and service needs:
 * one compact band with the copyright line, an optional "last updated" note
 * and the required links (privacy policy, disclaimer, accessibility...).
 * Paper or Well background, one Hairline rule on top, hidden when printing.
 *
 * It renders a `<footer>` (the page's contentinfo landmark). When it sits
 * under a marketing `SiteFooter`, pass `render={<div />}` so the page keeps a
 * single contentinfo landmark.
 *
 * @example
 * <Footer>
 *   <FooterCopyright>© 2026 Kementerian Kewangan Malaysia</FooterCopyright>
 *   <FooterMeta>Last updated: 28 Oct 2026</FooterMeta>
 *   <FooterLinks aria-label="Legal">
 *     <FooterLink href="/privacy">Privacy policy</FooterLink>
 *     <FooterLink href="/disclaimer">Disclaimer</FooterLink>
 *     <FooterLink href="/accessibility">Accessibility</FooterLink>
 *   </FooterLinks>
 * </Footer>
 */
const footer_cva = cva(
  [
    "font-body text-content text-txt-black-700 w-full border-t border-otl-gray-200 print:hidden",
  ],
  {
    variants: {
      tone: {
        paper: "bg-bg-gray-50",
        well: "bg-bg-washed",
      },
    },
    defaultVariants: { tone: "paper" },
  },
);

interface FooterProps
  extends useRender.ComponentProps<"footer">,
    VariantProps<typeof footer_cva> {
  /** Class for the inner max-width row. */
  containerClassName?: string;
}

const Footer: ForwardRefExoticComponent<FooterProps> = forwardRef(
  (
    { render, className, containerClassName, tone, children, ...props },
    ref,
  ) => {
    return useRender({
      defaultTagName: "footer",
      render,
      ref,
      props: mergeProps<"footer">(
        {
          className: clx(footer_cva({ tone }), className),
          children: (
            <div
              className={clx(
                "gap-stack-sm py-surface mx-auto flex w-full max-w-[1280px] flex-col px-4 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:px-6",
                "md:in-data-[density=compact]:gap-x-4",
                containerClassName,
              )}
            >
              {children}
            </div>
          ),
        },
        props,
      ),
    });
  },
);
Footer.displayName = "Footer";

interface FooterCopyrightProps extends ComponentProps<"p"> {}
/** The copyright line, e.g. "© 2026 Kementerian Kewangan Malaysia". */
const FooterCopyright: ForwardRefExoticComponent<
  FooterCopyrightProps & RefAttributes<HTMLParagraphElement>
> = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clx("text-txt-black-900 font-medium", className)}
    {...props}
  />
));
FooterCopyright.displayName = "FooterCopyright";

interface FooterMetaProps extends ComponentProps<"p"> {}
/** Secondary information such as "Last updated: 28 Oct 2026". */
const FooterMeta: ForwardRefExoticComponent<
  FooterMetaProps & RefAttributes<HTMLParagraphElement>
> = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clx("text-txt-black-700 tabular-nums", className)}
    {...props}
  />
));
FooterMeta.displayName = "FooterMeta";

interface FooterLinksProps extends ComponentProps<"nav"> {}
/**
 * The row of required links. Renders a labelled `<nav>` with a list;
 * override the label with `aria-label` (defaults to "Footer").
 * Placed last in the Footer, it aligns to the end of the row on desktop.
 */
const FooterLinks: ForwardRefExoticComponent<
  FooterLinksProps & RefAttributes<HTMLElement>
> = forwardRef(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="Footer"
    className={clx("md:last:ml-auto", className)}
    {...props}
  >
    <ul className="flex flex-wrap gap-x-6 gap-y-2 in-data-[density=compact]:gap-x-4">
      {children}
    </ul>
  </nav>
));
FooterLinks.displayName = "FooterLinks";

/** Ink Secondary link that darkens on hover; shared with the marketing SiteFooterLink. */
const footer_link_class = "text-txt-black-700 hover:text-txt-black-900";

interface FooterLinkProps extends ComponentProps<typeof Link> {}
/** One required link, rendered inside a list item. */
const FooterLink: ForwardRefExoticComponent<FooterLinkProps> = forwardRef(
  ({ className, ...props }, ref) => (
    <li>
      <Link
        ref={ref}
        underline="hover"
        className={clx(footer_link_class, className)}
        {...props}
      />
    </li>
  ),
);
FooterLink.displayName = "FooterLink";

export {
  Footer,
  FooterCopyright,
  FooterMeta,
  FooterLinks,
  FooterLink,
  footer_link_class,
};
export type {
  FooterProps,
  FooterCopyrightProps,
  FooterMetaProps,
  FooterLinksProps,
  FooterLinkProps,
};
