"use client";

import React, { ComponentRef, ReactNode, forwardRef } from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import { clx, type WithClassName } from "../../utils";

/**
 * Progress shows how far a task has got: an upload, a multi-step submission, a
 * batch being processed. For a measured quantity that is not a task (storage used,
 * budget spent), use Meter instead.
 *
 * Pass `value={null}` while the amount is unknown; the bar then sweeps (a still,
 * faded bar under reduced motion). Always pair it with a label so the state is
 * never carried by the bar alone.
 *
 * With `label` and no children it lays itself out (label left, value right, bar
 * below). Compose the parts for anything else.
 *
 * @example
 * <Progress value={45} label="Uploading documents" />
 *
 * <Progress value={step} max={4} format={{ style: "decimal" }}>
 *   <ProgressLabel>Application</ProgressLabel>
 *   <ProgressValue>{(_, v) => `Step ${v} of 4`}</ProgressValue>
 *   <ProgressTrack />
 * </Progress>
 */

interface ProgressProps extends WithClassName<ProgressPrimitive.Root.Props> {
  /** Label shown above the bar when no children are passed. */
  label?: ReactNode;
  /** Turn the bar Success green once it reaches `max`. */
  successOnComplete?: boolean;
  /** Bar thickness. */
  size?: VariantProps<typeof progress_track_cva>["size"];
}

const Progress = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, children, label, successOnComplete = false, size, ...props },
    ref,
  ) => (
    <ProgressPrimitive.Root
      ref={ref}
      data-success-on-complete={successOnComplete ? "" : undefined}
      className={clx(
        "group/progress font-body grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          {label != null && <ProgressLabel>{label}</ProgressLabel>}
          <ProgressValue />
          <ProgressTrack size={size} />
        </>
      )}
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = "Progress";

const progress_track_cva = cva(
  "bg-bg-track relative col-span-full block w-full overflow-hidden rounded-full",
  {
    variants: {
      size: {
        small: "h-1.5",
        medium: "h-2",
        large: "h-3",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

interface ProgressTrackProps
  extends WithClassName<ProgressPrimitive.Track.Props>,
    VariantProps<typeof progress_track_cva> {}

/** Shared with Meter. */
const progress_indicator_base_class = clx(
  "block h-full rounded-full",
  "transition-[width,background-color] duration-200 ease-standard motion-reduce:transition-none",
);
const progress_label_class =
  "text-label-md text-txt-black-900 col-start-1 font-medium";
const progress_value_class =
  "text-label-md col-start-2 justify-self-end font-medium tabular-nums";

/** The unfilled rail.  Renders a ProgressIndicator when it has no children. */
const ProgressTrack = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Track>,
  ProgressTrackProps
>(({ className, size, children, ...props }, ref) => (
  <ProgressPrimitive.Track
    ref={ref}
    className={clx(progress_track_cva({ size }), className)}
    {...props}
  >
    {children ?? <ProgressIndicator />}
  </ProgressPrimitive.Track>
));
ProgressTrack.displayName = "ProgressTrack";

const ProgressIndicator = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Indicator>,
  WithClassName<ProgressPrimitive.Indicator.Props>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    className={clx(
      progress_indicator_base_class,
      "bg-bg-primary-600",
      "group-data-[success-on-complete]/progress:data-[complete]:bg-bg-success-600",
      // Unknown amount: a soft sweep across the full rail
      "data-[indeterminate]:animate-shimmer data-[indeterminate]:w-full data-[indeterminate]:bg-transparent",
      "data-[indeterminate]:via-bg-primary-600 data-[indeterminate]:bg-gradient-to-r data-[indeterminate]:from-transparent data-[indeterminate]:to-transparent data-[indeterminate]:bg-[length:200%_100%]",
      "motion-reduce:data-[indeterminate]:bg-bg-primary-600/40 motion-reduce:data-[indeterminate]:animate-none motion-reduce:data-[indeterminate]:bg-none",
      className,
    )}
    {...props}
  />
));
ProgressIndicator.displayName = "ProgressIndicator";

/** What is progressing, in Label type and Ink. */
const ProgressLabel = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Label>,
  WithClassName<ProgressPrimitive.Label.Props>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Label
    ref={ref}
    className={clx(progress_label_class, className)}
    {...props}
  />
));
ProgressLabel.displayName = "ProgressLabel";

/**
 * The current value in tabular figures, formatted by `format`/`locale` on the root
 * (a percentage by default). Pass a function child to write your own text.
 */
const ProgressValue = forwardRef<
  ComponentRef<typeof ProgressPrimitive.Value>,
  WithClassName<ProgressPrimitive.Value.Props>
>(({ className, ...props }, ref) => (
  <ProgressPrimitive.Value
    ref={ref}
    className={clx(progress_value_class, "text-txt-black-700", className)}
    {...props}
  />
));
ProgressValue.displayName = "ProgressValue";

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
  progress_track_cva,
  progress_indicator_base_class,
  progress_label_class,
  progress_value_class,
};
export type { ProgressProps, ProgressTrackProps };
