import React, { ComponentProps, forwardRef } from "react";
import { clx } from "../../utils";

/**
 * EmptyState fills the space where a table, list or search would show results but
 * has none. It is calm and centred: an optional icon in a Well circle, a short
 * title that says what is empty, a description that says why or what to do next,
 * and at most one or two actions.
 *
 * Write the copy for the situation: "No applications yet" with a way to start one
 * differs from "No results for 'zakat'" with a way to clear filters.
 *
 * @example
 * <EmptyState>
 *   <EmptyStateIcon><DocumentIcon /></EmptyStateIcon>
 *   <EmptyStateTitle>No applications yet</EmptyStateTitle>
 *   <EmptyStateDescription>Applications you start will appear here.</EmptyStateDescription>
 *   <EmptyStateActions><Button>Start an application</Button></EmptyStateActions>
 * </EmptyState>
 */

const EmptyState = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "font-body mx-auto flex w-full flex-col items-center text-center",
        "px-surface gap-2 py-12 in-data-[density=compact]:py-8",
        className,
      )}
      {...props}
    />
  ),
);
EmptyState.displayName = "EmptyState";

/**
 * Decorative icon in a Well circle; hidden from screen readers. On a Well surface,
 * pass `className="bg-bg-white"` so the circle still shows.
 */
const EmptyStateIcon = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={clx(
        "bg-bg-washed text-txt-black-700 mb-2 flex size-12 items-center justify-center rounded-full",
        "[&_svg]:size-6 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  ),
);
EmptyStateIcon.displayName = "EmptyStateIcon";

interface EmptyStateTitleProps extends ComponentProps<"h3"> {
  /** Heading element; pick the level that fits the page outline. */
  as?: "h2" | "h3" | "h4" | "p";
}

/** Title type: 18px, 600. Renders an `h3` by default. */
const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  ({ className, as: Comp = "h3", ...props }, ref) => (
    <Comp
      ref={ref}
      className={clx("text-title text-txt-black-900 font-semibold", className)}
      {...props}
    />
  ),
);
EmptyStateTitle.displayName = "EmptyStateTitle";

/** Why it is empty or what to do next. Ink Secondary, kept to a readable width. */
const EmptyStateDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clx("text-content text-txt-black-700 max-w-[50ch]", className)}
    {...props}
  />
));
EmptyStateDescription.displayName = "EmptyStateDescription";

/** One primary action and, if needed, one secondary. Wraps on narrow screens. */
const EmptyStateActions = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "gap-stack-sm mt-4 flex flex-wrap items-center justify-center in-data-[density=compact]:mt-3",
        className,
      )}
      {...props}
    />
  ),
);
EmptyStateActions.displayName = "EmptyStateActions";

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
};
export type { EmptyStateTitleProps };
