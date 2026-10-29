"use client";

import React, {
  ComponentProps,
  MouseEvent,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { clx } from "@/lib/ftds/utils";
import { Link } from "@/components/ui/link";

/**
 * ErrorSummary is the "There is a problem" box shown at the top of a form after a
 * failed submit. It lists every error as a link that jumps to, and focuses, the
 * field that needs fixing. It moves focus to itself when it appears so screen
 * reader and keyboard users hear the problem straight away.
 *
 * Use the same message as the field's own `FieldError`, and give each control an
 * `id` that matches the error's `id`.
 *
 * @example
 * {errors.length > 0 && (
 *   <ErrorSummary
 *     title="There is a problem"
 *     errors={[
 *       { id: "ic", message: "Enter your IC number" },
 *       { id: "income", message: "Enter your annual income" },
 *     ]}
 *   />
 * )}
 *
 * // Composable
 * <ErrorSummary>
 *   <ErrorSummaryTitle>Ada masalah</ErrorSummaryTitle>
 *   <ErrorSummaryList>
 *     <ErrorSummaryItem targetId="ic">Masukkan nombor MyKad anda</ErrorSummaryItem>
 *   </ErrorSummaryList>
 * </ErrorSummary>
 */

interface ErrorSummaryError {
  /** The `id` of the control to focus. */
  id: string;
  message: ReactNode;
}

/*========================================================================================================================*/

/** Focuses the control with `id`, or the first focusable control inside it (e.g. a fieldset). */
const focusTarget = (id: string): boolean => {
  if (typeof document === "undefined") return false;
  const target = document.getElementById(id);
  if (!target) return false;

  const focusable = target.matches(
    "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
  )
    ? target
    : target.querySelector<HTMLElement>(
        "input:not([type=hidden]), select, textarea, button, [tabindex]:not([tabindex='-1'])",
      );
  if (!focusable) return false;

  // Bring the field (and its label above it) into view, then focus without a second jump.
  const field = target.closest("fieldset, [data-field]") ?? target;
  field.scrollIntoView({ block: "center" });
  focusable.focus({ preventScroll: true });
  return true;
};

/*========================================================================================================================*/

interface ErrorSummaryProps extends Omit<ComponentProps<"div">, "title"> {
  /** Heading text. Defaults to "There is a problem". Ignored when `children` is passed. */
  title?: ReactNode;
  /** The errors to list. Ignored when `children` is passed. */
  errors?: ErrorSummaryError[];
  /**
   * Move focus to the summary when it appears.
   * @default true
   */
  autoFocus?: boolean;
}

const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  (
    {
      className,
      title = "There is a problem",
      errors,
      autoFocus = true,
      children,
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    useEffect(() => {
      if (!autoFocus) return;
      innerRef.current?.focus();
      // Only when the summary first appears
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!children && (!errors || errors.length === 0)) return null;

    return (
      <div
        ref={innerRef}
        role="alert"
        tabIndex={-1}
        className={clx(
          // Danger Wash, no border, no side stripe (DESIGN.md: Don'ts)
          "bg-bg-danger-50 p-surface flex w-full items-start gap-3 rounded-lg",
          "focus-ring outline-none",
          className,
        )}
        {...props}
      >
        <WarningCircleIcon
          className="text-txt-danger mt-0.5 size-6 shrink-0 in-data-[density=compact]:size-5"
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {children ?? (
            <>
              <ErrorSummaryTitle>{title}</ErrorSummaryTitle>
              <ErrorSummaryList>
                {errors!.map((error) => (
                  <ErrorSummaryItem key={error.id} targetId={error.id}>
                    {error.message}
                  </ErrorSummaryItem>
                ))}
              </ErrorSummaryList>
            </>
          )}
        </div>
      </div>
    );
  },
);
ErrorSummary.displayName = "ErrorSummary";

/*========================================================================================================================*/

/** Title type, Ink. Renders an `<h2>` by default; pass `as` to change the level. */
const ErrorSummaryTitle = forwardRef<
  HTMLHeadingElement,
  ComponentProps<"h2"> & { as?: "h2" | "h3" | "h4" | "p" }
>(({ className, as: Tag = "h2", ...props }, ref) => (
  <Tag
    ref={ref}
    className={clx(
      "font-heading text-txt-black-900 text-title font-semibold",
      className,
    )}
    {...props}
  />
));
ErrorSummaryTitle.displayName = "ErrorSummaryTitle";

/** Optional text between the title and the list. */
const ErrorSummaryDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={clx("font-body text-content text-txt-black-900", className)}
    {...props}
  />
));
ErrorSummaryDescription.displayName = "ErrorSummaryDescription";

const ErrorSummaryList = forwardRef<HTMLUListElement, ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={clx("flex flex-col gap-1.5", className)}
      {...props}
    />
  ),
);
ErrorSummaryList.displayName = "ErrorSummaryList";

interface ErrorSummaryItemProps extends Omit<ComponentProps<"a">, "href"> {
  /** The `id` of the control this error belongs to. */
  targetId: string;
}

/** A link that jumps to and focuses the invalid control. */
const ErrorSummaryItem = forwardRef<HTMLAnchorElement, ErrorSummaryItemProps>(
  ({ className, targetId, onClick, children, ...props }, ref) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      // Fall back to the native #hash jump when the target isn't on the page
      if (focusTarget(targetId)) event.preventDefault();
    };

    return (
      <li>
        <Link
          ref={ref}
          href={`#${targetId}`}
          onClick={handleClick}
          className={clx(
            "font-body text-content text-txt-danger font-medium",
            className,
          )}
          {...props}
        >
          {children}
        </Link>
      </li>
    );
  },
);
ErrorSummaryItem.displayName = "ErrorSummaryItem";

export {
  ErrorSummary,
  ErrorSummaryTitle,
  ErrorSummaryDescription,
  ErrorSummaryList,
  ErrorSummaryItem,
};
export type { ErrorSummaryProps, ErrorSummaryItemProps, ErrorSummaryError };
