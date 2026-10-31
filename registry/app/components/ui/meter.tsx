"use client";

import React, { ComponentRef, ReactNode, forwardRef } from "react";
import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cva, type VariantProps } from "class-variance-authority";
import { WarningCircleIcon } from "@/components/ui/icons/warning-circle";
import { clx, type WithClassName } from "@/lib/ftds/utils";
import {
  progress_indicator_base_class,
  progress_label_class,
  progress_track_cva,
  progress_value_class,
} from "@/components/ui/progress";

/**
 * Meter shows a measured quantity within a known range: storage used, budget spent,
 * quota remaining. For a task that is moving towards done, use Progress instead.
 *
 * Tones come from thresholds: set `warningAt` and/or `dangerAt` (in the same units as
 * `value`) and the bar turns Warning or Danger once the value reaches them. Pass
 * `tone` to decide it yourself (for example when a low value is the bad one). The
 * value text is always shown and, past a threshold, gains an icon (and `toneLabels`
 * text in the accessible value), so the state is never carried by colour alone.
 *
 * @example
 * <Meter value={72} warningAt={70} dangerAt={90} label="Storage used" />
 *
 * <Meter value={41_250} max={50_000} warningAt={40_000} format={{ style: "currency", currency: "MYR" }}>
 *   <MeterLabel>Budget spent</MeterLabel>
 *   <MeterValue />
 *   <MeterTrack />
 * </Meter>
 */

type MeterTone = "default" | "warning" | "danger";

interface MeterToneLabels {
  warning?: string;
  danger?: string;
}

interface MeterProps extends WithClassName<MeterPrimitive.Root.Props> {
  /** Label shown above the bar when no children are passed. */
  label?: ReactNode;
  /** Value at or above which the meter shows the Warning tone. */
  warningAt?: number;
  /** Value at or above which the meter shows the Danger tone. */
  dangerAt?: number;
  /** Set the tone directly; overrides the thresholds. */
  tone?: MeterTone;
  /** Screen-reader text announced with the value past a threshold (BM/EN). */
  toneLabels?: MeterToneLabels;
  /** Bar thickness. */
  size?: VariantProps<typeof meter_track_cva>["size"];
}

const resolveTone = (
  value: number,
  warningAt?: number,
  dangerAt?: number,
): MeterTone => {
  if (dangerAt != null && value >= dangerAt) return "danger";
  if (warningAt != null && value >= warningAt) return "warning";
  return "default";
};

const Meter = forwardRef<ComponentRef<typeof MeterPrimitive.Root>, MeterProps>(
  (
    {
      className,
      children,
      label,
      warningAt,
      dangerAt,
      tone: toneProp,
      toneLabels = {
        warning: "Nearing the limit",
        danger: "At or over the limit",
      },
      size,
      value,
      getAriaValueText,
      ...props
    },
    ref,
  ) => {
    const tone = toneProp ?? resolveTone(value, warningAt, dangerAt);
    const toneLabel = tone === "default" ? undefined : toneLabels[tone];
    return (
      <MeterPrimitive.Root
        ref={ref}
        value={value}
        data-tone={tone}
        getAriaValueText={
          getAriaValueText ??
          (toneLabel ? (formatted) => `${formatted}, ${toneLabel}` : undefined)
        }
        className={clx(
          "group/meter font-body grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2",
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            {label != null && <MeterLabel>{label}</MeterLabel>}
            <MeterValue />
            <MeterTrack size={size} />
          </>
        )}
      </MeterPrimitive.Root>
    );
  },
);
Meter.displayName = "Meter";

/** Same rail as Progress. */
const meter_track_cva = progress_track_cva;

interface MeterTrackProps
  extends
    WithClassName<MeterPrimitive.Track.Props>,
    VariantProps<typeof meter_track_cva> {}

/** The unfilled rail. Renders a MeterIndicator when it has no children. */
const MeterTrack = forwardRef<
  ComponentRef<typeof MeterPrimitive.Track>,
  MeterTrackProps
>(({ className, size, children, ...props }, ref) => (
  <MeterPrimitive.Track
    ref={ref}
    className={clx(meter_track_cva({ size }), className)}
    {...props}
  >
    {children ?? <MeterIndicator />}
  </MeterPrimitive.Track>
));
MeterTrack.displayName = "MeterTrack";

/** Fill colour follows the root's `data-tone`. */
const meter_indicator_cva = cva([
  progress_indicator_base_class,
  "bg-bg-primary-600",
  "group-data-[tone=warning]/meter:bg-bg-warning-600",
  "group-data-[tone=danger]/meter:bg-bg-danger-600",
]);

const MeterIndicator = forwardRef<
  ComponentRef<typeof MeterPrimitive.Indicator>,
  WithClassName<MeterPrimitive.Indicator.Props>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Indicator
    ref={ref}
    className={clx(meter_indicator_cva(), className)}
    {...props}
  />
));
MeterIndicator.displayName = "MeterIndicator";

/** What is being measured, in Label type and Ink. */
const MeterLabel = forwardRef<
  ComponentRef<typeof MeterPrimitive.Label>,
  WithClassName<MeterPrimitive.Label.Props>
>(({ className, ...props }, ref) => (
  <MeterPrimitive.Label
    ref={ref}
    className={clx(progress_label_class, className)}
    {...props}
  />
));
MeterLabel.displayName = "MeterLabel";

/**
 * The value in tabular figures, formatted by `format`/`locale` on the root (a
 * percentage by default). Past a threshold it takes the tone's text colour and a
 * warning icon; screen readers hear the tone label through the meter's
 * `aria-valuetext`. `className` styles the wrapper that holds icon and value.
 */
const MeterValue = forwardRef<
  ComponentRef<typeof MeterPrimitive.Value>,
  WithClassName<MeterPrimitive.Value.Props>
>(({ className, children, ...props }, ref) => (
  <span
    className={clx(
      progress_value_class,
      "text-txt-black-700 inline-flex items-center gap-1.5",
      "group-data-[tone=warning]/meter:text-txt-warning group-data-[tone=danger]/meter:text-txt-danger",
      className,
    )}
  >
    <WarningCircleIcon
      className="hidden size-4 shrink-0 group-data-[tone=danger]/meter:block group-data-[tone=warning]/meter:block"
      aria-hidden
    />
    <MeterPrimitive.Value ref={ref} {...props}>
      {children}
    </MeterPrimitive.Value>
  </span>
));
MeterValue.displayName = "MeterValue";

export {
  Meter,
  MeterTrack,
  MeterIndicator,
  MeterLabel,
  MeterValue,
  meter_track_cva,
  meter_indicator_cva,
};
export type { MeterProps, MeterTrackProps, MeterTone, MeterToneLabels };
