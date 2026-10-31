import React, { ComponentProps, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clx } from "@/lib/ftds/utils";

/**
 * PageHeader opens a service or officer page: an optional breadcrumb or back link,
 * the page's one `h1`, a short description, actions on the right (they wrap below
 * the title on narrow screens) and an optional meta row (status tag, last updated).
 *
 * Keep it to one primary action; the rest are secondary or ghost buttons. No rule
 * underneath: the space before the content does the separating.
 *
 * @example
 * <PageHeader>
 *   <PageHeaderNav><Breadcrumb>...</Breadcrumb></PageHeaderNav>
 *   <PageHeaderContent>
 *     <PageHeaderTitle>Application MOF-2026-0412</PageHeaderTitle>
 *     <PageHeaderDescription>Submitted by Syarikat Maju Jaya Sdn. Bhd.</PageHeaderDescription>
 *   </PageHeaderContent>
 *   <PageHeaderActions>
 *     <Button variant="default-outline">Request changes</Button>
 *     <Button>Approve</Button>
 *   </PageHeaderActions>
 *   <PageHeaderMeta>
 *     <Tag variant="warning">Pending review</Tag>
 *     <span>Last updated 27 October 2026</span>
 *   </PageHeaderMeta>
 * </PageHeader>
 */

const PageHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "font-body flex w-full flex-wrap items-start",
        "gap-x-stack-lg gap-y-stack-md",
        className,
      )}
      {...props}
    />
  ),
);
PageHeader.displayName = "PageHeader";

/** Slot above the title for a Breadcrumb or a back link. Takes the full row. */
const PageHeaderNav = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clx("basis-full", className)} {...props} />
  ),
);
PageHeaderNav.displayName = "PageHeaderNav";

/** Holds the title and description so actions can sit beside them. */
const PageHeaderContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx("flex min-w-0 flex-[1_1_20rem] flex-col gap-2", className)}
      {...props}
    />
  ),
);
PageHeaderContent.displayName = "PageHeaderContent";

const page_header_title_cva = cva(
  "text-txt-black-900 font-semibold text-balance",
  {
    variants: {
      size: {
        display: "text-display",
        headline: "text-headline",
      },
    },
    defaultVariants: {
      size: "display",
    },
  },
);

interface PageHeaderTitleProps
  extends ComponentProps<"h1">, VariantProps<typeof page_header_title_cva> {
  /** Heading element. Keep `h1`: one per page. */
  as?: "h1" | "h2";
}

/**
 * The page's `h1`. `display` (32px) for service landing screens, `headline` (24px)
 * for working pages such as a record in an officer tool.
 */
const PageHeaderTitle = forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(
  ({ className, size, as: Comp = "h1", ...props }, ref) => (
    <Comp
      ref={ref}
      className={clx(page_header_title_cva({ size }), className)}
      {...props}
    />
  ),
);
PageHeaderTitle.displayName = "PageHeaderTitle";

/** One or two sentences under the title. Ink Secondary, capped at 70ch. */
const PageHeaderDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clx("text-content text-txt-black-700 max-w-[70ch]", className)}
    {...props}
  />
));
PageHeaderDescription.displayName = "PageHeaderDescription";

/** Buttons on the right of the title; wrap below it when space runs out. */
const PageHeaderActions = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "gap-stack-sm flex shrink-0 flex-wrap items-center",
        className,
      )}
      {...props}
    />
  ),
);
PageHeaderActions.displayName = "PageHeaderActions";

/** Row of status and facts (a Tag, "Last updated ..."). Ink Secondary. */
const PageHeaderMeta = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "text-content text-txt-black-700 flex basis-full flex-wrap items-center gap-x-4 gap-y-2",
        className,
      )}
      {...props}
    />
  ),
);
PageHeaderMeta.displayName = "PageHeaderMeta";

export {
  PageHeader,
  PageHeaderNav,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  PageHeaderMeta,
  page_header_title_cva,
};
export type { PageHeaderTitleProps };
