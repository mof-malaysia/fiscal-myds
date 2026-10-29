import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { ComponentProps, ForwardRefExoticComponent, forwardRef } from "react";
import { clx } from "../../utils";
import { ChevronRightIcon } from "../../icons/chevron-right";
import { EllipsisIcon } from "../../icons/ellipsis";

/**
 * Breadcrumb shows where the current page sits and links back up the trail. It is
 * quiet navigation: Label type, parents in Ink Secondary, the current page in Ink,
 * small chevrons between them, and no container around the trail.
 *
 * Long names truncate (the full name stays in the tooltip). For deep trails, keep the
 * first and last two levels and collapse the middle into `BreadcrumbEllipsis`.
 *
 * @example
 * <Breadcrumb>
 *   <BreadcrumbItem>
 *     <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *   </BreadcrumbItem>
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem>
 *     <BreadcrumbPage>Applications</BreadcrumbPage>
 *   </BreadcrumbItem>
 * </Breadcrumb>
 */

/** The full name for the tooltip: an explicit `title`, else plain-text children. */
const titleOf = (title: string | undefined, children: unknown) =>
  title ?? (typeof children === "string" ? children : undefined);

const Breadcrumb: ForwardRefExoticComponent<ComponentProps<"nav">> = forwardRef(
  ({ className, children, "aria-label": ariaLabel, ...props }, ref) => (
    <nav ref={ref} aria-label={ariaLabel ?? "Breadcrumb"} {...props}>
      <ol
        className={clx(
          "font-body text-label-sm flex min-w-0 flex-wrap items-center gap-1",
          className,
        )}
      >
        {children}
      </ol>
    </nav>
  ),
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbItem: ForwardRefExoticComponent<ComponentProps<"li">> =
  forwardRef(({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={clx(
        "inline-flex max-w-[200px] min-w-0 items-center",
        className,
      )}
      {...props}
    />
  ));
BreadcrumbItem.displayName = "BreadcrumbItem";

/** A parent level. Renders an `<a>`; pass `render` for your router's link. */
const BreadcrumbLink: ForwardRefExoticComponent<useRender.ComponentProps<"a">> =
  forwardRef(({ render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "a",
      render,
      ref,
      props: mergeProps<"a">(
        {
          className: clx(
            "text-txt-black-700 hover:text-txt-black-900 truncate rounded-sm font-medium",
            "underline-offset-4 decoration-from-font hover:underline",
            "transition-colors duration-150 motion-reduce:transition-none focus-ring",
            className,
          ),
          title: titleOf(props.title, props.children),
        },
        props,
      ),
    }),
  );
BreadcrumbLink.displayName = "BreadcrumbLink";

/** The current page: Ink, not a link. */
const BreadcrumbPage: ForwardRefExoticComponent<ComponentProps<"span">> =
  forwardRef(({ className, title, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      title={titleOf(title, props.children)}
      className={clx("text-txt-black-900 truncate font-medium", className)}
      {...props}
    />
  ));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={clx(
      "text-txt-black-500 inline-flex shrink-0 items-center [&>svg]:size-4",
      className,
    )}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

/**
 * Stands in for collapsed middle levels. Decorative on its own; to let people expand
 * the trail, wrap it in a button or a `Menu` trigger that lists the hidden levels.
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={clx(
      "text-txt-black-700 inline-flex size-6 items-center justify-center [&>svg]:size-4",
      className,
    )}
    {...props}
  >
    <EllipsisIcon />
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
