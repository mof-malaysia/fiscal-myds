"use client";
// registry:block — composed page section, installs to components/blocks
import React, { ComponentProps, ReactNode, forwardRef } from "react";
import { Button } from "../core/button";
import { CheckIcon } from "../../icons/check";
import { CopyIcon } from "../../icons/copy";
import { useCopy } from "../../hooks";
import { clx } from "../../utils";

/**
 * ErrorPage is the whole-page message for when a service can't show what was
 * asked for: a page that doesn't exist, an error on our side, a page the user
 * isn't allowed to see, or planned maintenance. It says what happened in plain
 * words, what to do next, and gives the one or two actions that help.
 *
 * The status code sits small above the title: it helps support staff, not the
 * reader. A `reference` (an incident or request id) shows with a Copy button
 * so people can quote it when they get in touch.
 *
 * @example
 * <ErrorPage kind="not-found" homeHref="/" supportHref="/contact" />
 * <ErrorPage kind="server-error" onRetry={() => location.reload()} reference="REQ-8F2A-41C9" />
 * <ErrorPage kind="maintenance" backAt="10:00 pm today" />
 */

type ErrorPageKind =
  | "not-found"
  | "server-error"
  | "access-denied"
  | "maintenance";

interface ErrorPageLabels {
  /** "Error 404" above the title. `{code}` is replaced. */
  code: string;
  home: string;
  retry: string;
  contactSupport: string;
  /** Heading of the reference box. */
  reference: string;
  referenceHint: string;
  copy: string;
  copied: string;
  /** Maintenance: when the service is expected back. `{time}` is replaced. */
  backAt: string;
}

const DEFAULT_LABELS: ErrorPageLabels = {
  code: "Error {code}",
  home: "Go to the home page",
  retry: "Try again",
  contactSupport: "Contact support",
  reference: "Reference",
  referenceHint: "Quote this if you contact us, so we can find what happened.",
  copy: "Copy",
  copied: "Copied",
  backAt: "We expect to be back by {time}.",
};

const KIND_DEFAULTS: Record<
  ErrorPageKind,
  { code: string; title: string; description: string }
> = {
  "not-found": {
    code: "404",
    title: "We can't find that page",
    description:
      "The link may be out of date, or the address may have a typo. Check the address, or start again from the home page.",
  },
  "server-error": {
    code: "500",
    title: "Something went wrong on our side",
    description:
      "This isn't something you did. Try again in a few minutes. If you were filling in a form, you may need to enter some details again.",
  },
  "access-denied": {
    code: "403",
    title: "You don't have access to this page",
    description:
      "Your account isn't allowed to see this. If you think you should have access, ask your administrator or contact support.",
  },
  maintenance: {
    code: "503",
    title: "This service is down for maintenance",
    description:
      "We're making improvements, so you can't use the service right now. Anything you've already submitted is safe.",
  },
};

interface ErrorPageProps extends Omit<ComponentProps<"section">, "title"> {
  kind: ErrorPageKind;
  /** Replaces the default title for the kind. Rendered as the page's h1. */
  title?: ReactNode;
  /** Replaces the default explanation for the kind. */
  description?: ReactNode;
  /** Replaces the status code shown above the title. Pass `null` to hide it. */
  code?: string | null;
  /** An incident or request id, shown with a Copy button. */
  reference?: string;
  /** Maintenance: when the service is expected back, e.g. "10:00 pm today". */
  backAt?: ReactNode;
  /** Shows "Go to the home page". */
  homeHref?: string;
  /** Shows "Try again" (the primary action when given). */
  onRetry?: () => void;
  /** Shows "Contact support". */
  supportHref?: string;
  /** Replaces the default actions. */
  actions?: ReactNode;
  /** An illustration or image above the code. Decorative unless you label it. */
  media?: ReactNode;
  labels?: Partial<ErrorPageLabels>;
}

const ErrorPage = forwardRef<HTMLElement, ErrorPageProps>(
  (
    {
      kind,
      title,
      description,
      code,
      reference,
      backAt,
      homeHref,
      onRetry,
      supportHref,
      actions,
      media,
      labels: labelsProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    const defaults = KIND_DEFAULTS[kind];
    const shownCode = code === undefined ? defaults.code : code;

    // The first action is the primary one: retry when it can help, otherwise home
    const defaultActions = [
      onRetry && (
        <Button key="retry" variant="primary-fill" onClick={onRetry}>
          {labels.retry}
        </Button>
      ),
      homeHref && (
        <Button
          key="home"
          variant={onRetry ? "default-outline" : "primary-fill"}
          render={<a href={homeHref} />}
        >
          {labels.home}
        </Button>
      ),
      supportHref && (
        <Button
          key="support"
          // Alone, a ghost button would look like stray text
          variant={onRetry || homeHref ? "default-ghost" : "default-outline"}
          render={<a href={supportHref} />}
        >
          {labels.contactSupport}
        </Button>
      ),
    ].filter(Boolean);

    return (
      <section
        ref={ref}
        className={clx(
          "font-body text-txt-black-900 px-surface mx-auto flex w-full max-w-xl flex-col py-16",
          "in-data-[density=compact]:py-10",
          className,
        )}
        {...props}
      >
        {media && <div className="mb-stack-lg">{media}</div>}
        {shownCode && (
          <p className="text-label-compact text-txt-black-700 m-0 font-medium tracking-wide">
            {labels.code.replace("{code}", shownCode)}
          </p>
        )}
        <h1 className="text-headline text-txt-black-900 mt-2 font-semibold text-balance">
          {title ?? defaults.title}
        </h1>
        <p className="text-content text-txt-black-700 mt-3 max-w-prose">
          {description ?? defaults.description}
        </p>
        {kind === "maintenance" && backAt && (
          <p className="text-content text-txt-black-900 mt-3 font-medium">
            {labels.backAt.split("{time}").map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && backAt}
                {part}
              </React.Fragment>
            ))}
          </p>
        )}
        {children && <div className="mt-stack-md">{children}</div>}
        {(actions ?? defaultActions.length > 0) && (
          <div className="mt-stack-lg gap-stack-sm flex flex-wrap items-center">
            {actions ?? defaultActions}
          </div>
        )}
        {reference && <ReferenceBox reference={reference} labels={labels} />}
      </section>
    );
  },
);
ErrorPage.displayName = "ErrorPage";

/** The reference on a Well card, with a Copy button that confirms for a moment. */
const ReferenceBox = ({
  reference,
  labels,
}: {
  reference: string;
  labels: ErrorPageLabels;
}) => {
  const [copied, copy] = useCopy(reference);

  return (
    <div className="bg-bg-washed mt-stack-lg rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label-compact text-txt-black-700 m-0 font-medium">
            {labels.reference}
          </p>
          <p className="text-content text-txt-black-900 m-0 font-mono break-all select-all">
            {reference}
          </p>
        </div>
        <Button variant="default-ghost" size="small" onClick={copy}>
          {copied ? (
            <CheckIcon aria-hidden className="size-4" />
          ) : (
            <CopyIcon aria-hidden className="size-4" />
          )}
          {copied ? labels.copied : labels.copy}
        </Button>
      </div>
      <p className="text-content text-txt-black-700 mt-2 mb-0">
        {labels.referenceHint}
      </p>
      <span role="status" className="sr-only">
        {copied ? labels.copied : ""}
      </span>
    </div>
  );
};

export { ErrorPage };
export type { ErrorPageProps, ErrorPageLabels, ErrorPageKind };
