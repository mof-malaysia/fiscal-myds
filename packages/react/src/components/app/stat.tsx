import React, { ComponentProps, ReactNode, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpIcon } from "../../icons/arrow-up";
import { ArrowDownIcon } from "../../icons/arrow-down";
import { clx } from "../../utils";

/**
 * Stat is a KPI tile for officer dashboards: a label, one big figure in tabular
 * numerals, an optional change since the last period, and an optional footnote.
 * It sits on a Sheet surface like a Card (no border, no shadow); use `surface="well"`
 * for grouped secondary figures or `surface="none"` inside another container.
 *
 * The delta's colour is the consumer's call: a rise in collections is good, a rise
 * in overdue cases is not. Set `direction` for the arrow and `tone` for the colour
 * separately. The arrow is always paired with text, so the change is never
 * carried by colour alone.
 *
 * `StatGroup` lays tiles out in a responsive grid that fills the row.
 *
 * @example
 * <StatGroup>
 *   <Stat>
 *     <StatLabel>Tax collected this month</StatLabel>
 *     <StatValue prefix="RM">1,284,500.00</StatValue>
 *     <StatDelta direction="up" tone="success">8.2% from September</StatDelta>
 *   </Stat>
 *   <Stat>
 *     <StatLabel>Overdue cases</StatLabel>
 *     <StatValue>312</StatValue>
 *     <StatDelta direction="up" tone="danger">24 more than last week</StatDelta>
 *   </Stat>
 * </StatGroup>
 */

const stat_cva = cva(
  ["font-body text-txt-black-900 flex min-w-0 flex-col gap-1.5 rounded-lg"],
  {
    variants: {
      surface: {
        sheet: "bg-bg-white p-surface",
        well: "bg-bg-washed p-surface",
        none: "",
      },
    },
    defaultVariants: {
      surface: "sheet",
    },
  },
);

interface StatProps
  extends ComponentProps<"div">, VariantProps<typeof stat_cva> {}

const Stat = forwardRef<HTMLDivElement, StatProps>(
  ({ className, surface, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(stat_cva({ surface }), className)}
      {...props}
    />
  ),
);
Stat.displayName = "Stat";

/** What the figure measures, in Label type and Ink Secondary. */
const StatLabel = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clx("text-label-md text-txt-black-700 font-medium", className)}
      {...props}
    />
  ),
);
StatLabel.displayName = "StatLabel";

interface StatValueProps extends Omit<ComponentProps<"p">, "prefix"> {
  /** Unit before the figure, e.g. "RM". Set smaller so the number leads. */
  prefix?: ReactNode;
  /** Unit after the figure, e.g. "%" or "cases". */
  suffix?: ReactNode;
}

/** The figure: Headline size, 600, tabular numerals. */
const StatValue = forwardRef<HTMLParagraphElement, StatValueProps>(
  ({ className, prefix, suffix, children, ...props }, ref) => (
    <p
      ref={ref}
      className={clx(
        "text-headline text-txt-black-900 flex flex-wrap items-baseline gap-x-1.5 font-semibold tabular-nums",
        className,
      )}
      {...props}
    >
      {prefix != null && (
        <span className="text-body-lg text-txt-black-700 font-medium tracking-normal">
          {prefix}
        </span>
      )}
      <span>{children}</span>
      {suffix != null && (
        <span className="text-body-lg text-txt-black-700 font-medium tracking-normal">
          {suffix}
        </span>
      )}
    </p>
  ),
);
StatValue.displayName = "StatValue";

const stat_delta_cva = cva(
  "text-label-md inline-flex items-center gap-1 font-medium tabular-nums",
  {
    variants: {
      tone: {
        success: "text-txt-success",
        danger: "text-txt-danger",
        neutral: "text-txt-black-700",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

interface StatDeltaProps
  extends ComponentProps<"p">, VariantProps<typeof stat_delta_cva> {
  /** Which way the figure moved; picks the arrow. `none` shows no arrow. */
  direction?: "up" | "down" | "none";
  /**
   * Screen-reader words for the arrow, so the direction is announced (BM/EN).
   * Defaults to "Increased" / "Decreased".
   */
  directionLabels?: { up?: string; down?: string };
}

/**
 * Change since the last period. `tone` is required in spirit: choose `success` or
 * `danger` by what the change means for this measure, or leave it `neutral`.
 */
const StatDelta = forwardRef<HTMLParagraphElement, StatDeltaProps>(
  (
    {
      className,
      tone,
      direction = "none",
      directionLabels = { up: "Increased", down: "Decreased" },
      children,
      ...props
    },
    ref,
  ) => {
    const Icon =
      direction === "up"
        ? ArrowUpIcon
        : direction === "down"
          ? ArrowDownIcon
          : null;
    const label = direction === "none" ? undefined : directionLabels[direction];
    return (
      <p
        ref={ref}
        className={clx(stat_delta_cva({ tone }), className)}
        {...props}
      >
        {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
        {label && <span className="sr-only">{label}:</span>}
        <span>{children}</span>
      </p>
    );
  },
);
StatDelta.displayName = "StatDelta";

/** Footnote: period, source or definition. Ink Secondary. */
const StatDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clx("text-content text-txt-black-700", className)}
      {...props}
    />
  ),
);
StatDescription.displayName = "StatDescription";

interface StatGroupProps extends ComponentProps<"div"> {
  /** Narrowest a tile may get before the row wraps. Defaults to 14rem. */
  minItemWidth?: string;
}

/** Responsive grid of Stat tiles: as many per row as fit, each at least `minItemWidth`. */
const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(
  ({ className, style, minItemWidth = "14rem", ...props }, ref) => (
    <div
      ref={ref}
      style={{ "--stat-min": minItemWidth, ...style } as React.CSSProperties}
      className={clx(
        "grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--stat-min)),1fr))]",
        "gap-stack-md",
        className,
      )}
      {...props}
    />
  ),
);
StatGroup.displayName = "StatGroup";

export {
  Stat,
  StatLabel,
  StatValue,
  StatDelta,
  StatDescription,
  StatGroup,
  stat_cva,
  stat_delta_cva,
};
export type { StatProps, StatValueProps, StatDeltaProps, StatGroupProps };
