import {
  Children,
  cloneElement,
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { clx } from "../../utils";
import { Link } from "../core/link";
import { footer_link_class } from "../core/footer";

/**
 * SiteFooter is the large multi-column footer for agency and landing sites:
 * agency identity, address and social links, then groups of site links.
 * It sits on a Well band and separates its rows with space, not lines.
 * Pair it with the core `Footer` (copyright and required links) below it:
 * wrap both in one `<footer>` and render each with `render={<div />}` so the
 * page keeps a single contentinfo landmark.
 *
 * @example
 * <SiteFooter>
 *   <SiteFooterSection>
 *     <SiteFooterInfo>
 *       <SiteFooterLogo logo={<img src="/jata.png" alt="" />} logoTitle="Kementerian Kewangan" />
 *       <p>No. 5 Persiaran Perdana, Presint 2, 62592 Putrajaya</p>
 *     </SiteFooterInfo>
 *     <SiteFooterLinkGroup groupTitle="About us">
 *       <SiteFooterLink href="/profile">Ministry profile</SiteFooterLink>
 *     </SiteFooterLinkGroup>
 *   </SiteFooterSection>
 * </SiteFooter>
 */

interface SiteFooterProps extends useRender.ComponentProps<"footer"> {}
const SiteFooter: ForwardRefExoticComponent<SiteFooterProps> = forwardRef(
  ({ render, className, ...props }, ref) => {
    return useRender({
      defaultTagName: "footer",
      render,
      ref,
      props: mergeProps<"footer">(
        {
          className: clx(
            "bg-bg-washed font-body text-content text-txt-black-700 flex flex-col print:hidden",
            "gap-8 px-4 py-10 md:px-6 md:py-12 lg:py-16",
            "in-data-[density=compact]:gap-6 in-data-[density=compact]:py-8",
            className,
          ),
        },
        props,
      ),
    });
  },
);

interface SiteFooterSectionProps extends ComponentProps<"div"> {}
const SiteFooterSection: ForwardRefExoticComponent<SiteFooterSectionProps> =
  forwardRef(({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "mx-auto grid w-full max-w-[1280px] grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-12",
          "in-data-[density=compact]:gap-y-6",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  });

// A <div>, not <aside>: a complementary landmark can't sit inside <footer>.
interface SiteFooterInfoProps extends ComponentProps<"div"> {}
const SiteFooterInfo: ForwardRefExoticComponent<SiteFooterInfoProps> =
  forwardRef(({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "gap-stack-md col-span-full flex flex-col lg:col-start-1 lg:col-end-5 lg:pr-8",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  });

interface SiteFooterLinkGroupProps extends ComponentProps<"div"> {
  /** A string renders an h2 that labels the group's nav. */
  groupTitle: ReactNode;
  /** Show only the first `linkCount` links. All are shown by default. */
  linkCount?: number;
}
const SiteFooterLinkGroup: ForwardRefExoticComponent<SiteFooterLinkGroupProps> =
  forwardRef(
    ({ children, className, groupTitle, linkCount, ...props }, ref) => {
      const titleId = useId();
      const hasTextTitle = typeof groupTitle === "string";
      const titleElement = hasTextTitle ? (
        <h2 id={titleId} className="text-txt-black-900 font-semibold">
          {groupTitle}
        </h2>
      ) : (
        groupTitle
      );

      const processedChildren = Children.toArray(children)
        .slice(0, linkCount)
        .map((child, index) => {
          if (!isValidElement(child)) return child;
          const childElement = child as ReactElement<{ className?: string }>;
          return cloneElement(childElement, {
            className: clx("w-fit", childElement.props.className),
            key: index,
          });
        });

      return (
        <div
          ref={ref}
          className={clx(
            "gap-stack-sm col-span-1 flex flex-col md:col-span-1 lg:col-span-2",
            className,
          )}
          {...props}
        >
          {titleElement}
          <nav
            aria-labelledby={hasTextTitle ? titleId : undefined}
            className="flex flex-col gap-2 in-data-[density=compact]:gap-1.5"
          >
            {processedChildren}
          </nav>
        </div>
      );
    },
  );

interface SiteFooterLogoProps extends ComponentProps<"div"> {
  logoTitle?: ReactNode;
  logo?: ReactNode;
}
const SiteFooterLogo: ForwardRefExoticComponent<SiteFooterLogoProps> =
  forwardRef(({ logoTitle, logo, className, ...props }, ref) => {
    const titleElement =
      typeof logoTitle === "string" ? (
        <p className="text-title font-semibold">{logoTitle}</p>
      ) : (
        logoTitle
      );
    return (
      <div
        ref={ref}
        className={clx(
          "text-txt-black-900 flex items-center gap-x-3",
          className,
        )}
        {...props}
      >
        {logo}
        {titleElement}
      </div>
    );
  });

interface SiteFooterLinkProps extends ComponentProps<typeof Link> {
  href?: string;
}
const SiteFooterLink: ForwardRefExoticComponent<SiteFooterLinkProps> =
  forwardRef(({ children, className, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        href={href}
        underline="hover"
        className={clx(footer_link_class, className)}
        {...props}
      >
        {children}
      </Link>
    );
  });

SiteFooter.displayName = "SiteFooter";
SiteFooterSection.displayName = "SiteFooterSection";
SiteFooterInfo.displayName = "SiteFooterInfo";
SiteFooterLinkGroup.displayName = "SiteFooterLinkGroup";
SiteFooterLogo.displayName = "SiteFooterLogo";
SiteFooterLink.displayName = "SiteFooterLink";

export {
  SiteFooter,
  SiteFooterSection,
  SiteFooterInfo,
  SiteFooterLinkGroup,
  SiteFooterLink,
  SiteFooterLogo,
};
export type {
  SiteFooterProps,
  SiteFooterSectionProps,
  SiteFooterInfoProps,
  SiteFooterLinkGroupProps,
  SiteFooterLinkProps,
  SiteFooterLogoProps,
};
