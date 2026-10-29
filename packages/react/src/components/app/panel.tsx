"use client";

import React, { forwardRef, ForwardRefExoticComponent, ReactNode } from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva } from "class-variance-authority";
import { CheckCircleIcon } from "../../icons/check-circle";
import { InfoIcon } from "../../icons/info";
import { WarningCircleIcon } from "../../icons/warning-circle";
import { CrossCircleIcon } from "../../icons/cross-circle";
import { clx } from "../../utils";

/**
 * Panel is the first thing on a confirmation or result page: "Payment received",
 * with the reference number the user should keep. It is the moment the user
 * learns whether it worked, so it states the outcome in plain words, pairs the
 * colour with an icon, and sets the reference large in tabular figures.
 *
 * Variants: `success` (finished), `info` (submitted, being processed),
 * `warning` (needs action), `danger` (failed or rejected: say why and what next).
 *
 * @example
 * <Panel>
 *   <PanelTitle>Payment received</PanelTitle>
 *   <PanelBody>We have sent a receipt to aminah@example.com.</PanelBody>
 *   <PanelReference label="Your reference number">MOF-2026-004817</PanelReference>
 * </Panel>
 */

type PanelVariant = "success" | "info" | "warning" | "danger";

const panel_cva = cva(
  [
    "group/panel font-body flex w-full flex-col items-start gap-stack-md rounded-lg p-6 md:p-8",
    "in-data-[density=compact]:p-4 md:in-data-[density=compact]:p-6",
  ],
  {
    variants: {
      variant: {
        success: "bg-bg-success-50",
        info: "bg-bg-primary-50",
        warning: "bg-bg-warning-50",
        danger: "bg-bg-danger-50",
      },
    },
    defaultVariants: { variant: "success" },
  },
);

const accent: Record<PanelVariant, string> = {
  success: "text-txt-success",
  info: "text-txt-primary",
  warning: "text-txt-warning",
  danger: "text-txt-danger",
};

const icons: Record<PanelVariant, React.FC<React.SVGProps<SVGSVGElement>>> = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningCircleIcon,
  danger: CrossCircleIcon,
};

interface PanelProps extends useRender.ComponentProps<"div"> {
  variant?: PanelVariant;
  /** Replace the status icon, or pass `false` to hide it. */
  icon?: ReactNode | false;
}

const Panel: ForwardRefExoticComponent<PanelProps> = forwardRef(
  (
    { render, className, variant = "success", icon, children, ...props },
    ref,
  ) => {
    const Icon = icons[variant];
    return useRender({
      defaultTagName: "div",
      render,
      ref,
      // Sets data-variant, which colours PanelTitle
      state: { variant },
      props: mergeProps<"div">(
        {
          className: clx(panel_cva({ variant }), className),
          children: (
            <>
              {icon !== false &&
                (icon ?? (
                  <Icon
                    aria-hidden
                    className={clx(
                      "size-10 shrink-0 in-data-[density=compact]:size-8",
                      accent[variant],
                    )}
                  />
                ))}
              {children}
            </>
          ),
        },
        props,
      ),
    });
  },
);
Panel.displayName = "Panel";

interface PanelTitleProps extends useRender.ComponentProps<"h1"> {}

/** States the outcome: "Payment received", "Application rejected". An `<h1>` by default. */
const PanelTitle: ForwardRefExoticComponent<PanelTitleProps> = forwardRef(
  ({ render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "h1",
      render,
      ref,
      props: mergeProps<"h1">(
        {
          className: clx(
            // Headline type: the consequence, in plain words (DESIGN.md: Typography)
            "text-headline md:text-display md:in-data-[density=compact]:text-headline m-0 font-semibold",
            // Outcome colour from the Panel's variant
            "text-txt-success group-data-[variant=info]/panel:text-txt-primary group-data-[variant=warning]/panel:text-txt-warning group-data-[variant=danger]/panel:text-txt-danger",
            className,
          ),
        },
        props,
      ),
    }),
);
PanelTitle.displayName = "PanelTitle";

interface PanelBodyProps extends useRender.ComponentProps<"div"> {}

/** Supporting text: what happens next, where the receipt went, why it failed. */
const PanelBody: ForwardRefExoticComponent<PanelBodyProps> = forwardRef(
  ({ render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          className: clx(
            "text-txt-black-900 text-content flex max-w-[70ch] flex-col gap-2",
            className,
          ),
        },
        props,
      ),
    }),
);
PanelBody.displayName = "PanelBody";

interface PanelReferenceProps extends useRender.ComponentProps<"div"> {
  /** Label above the value. */
  label?: ReactNode;
}

/**
 * A value the user must keep: reference number, amount paid, date submitted.
 * Large, tabular figures, and easy to select and copy.
 */
const PanelReference: ForwardRefExoticComponent<PanelReferenceProps> =
  forwardRef(
    (
      {
        render,
        className,
        label = "Your reference number",
        children,
        ...props
      },
      ref,
    ) =>
      useRender({
        defaultTagName: "div",
        render,
        ref,
        props: mergeProps<"div">(
          {
            className: clx("flex flex-col gap-1", className),
            children: (
              <>
                <span className="text-txt-black-700 text-content">{label}</span>
                <span
                  className={clx(
                    "text-txt-black-900 font-semibold tabular-nums select-all [font-feature-settings:'tnum'_1,'cv11'_1]",
                    "text-[1.75rem] leading-[1.25] tracking-[-0.01em] break-all md:text-[2.25rem]",
                    "in-data-[density=compact]:text-[1.5rem]",
                  )}
                >
                  {children}
                </span>
              </>
            ),
          },
          props,
        ),
      }),
  );
PanelReference.displayName = "PanelReference";

export { Panel, PanelTitle, PanelBody, PanelReference };
export type {
  PanelProps,
  PanelVariant,
  PanelTitleProps,
  PanelBodyProps,
  PanelReferenceProps,
};
