"use client";

import React, { ReactNode, forwardRef } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { clx } from "@/lib/ftds/utils";

/**
 * Slider picks a value, or a range with two thumbs, by dragging along a track.
 * Use it where an approximate value is fine (a filter range, a percentage); for an
 * exact amount, pair it with or use a NumberField. Arrow keys, Page Up/Down, Home
 * and End all work. It joins a surrounding Field.
 *
 * @example
 * <Field name="share">
 *   <FieldLabel>Your share of the property</FieldLabel>
 *   <Slider defaultValue={0.5} max={1} step={0.05} showValue format={{ style: "percent" }} />
 * </Field>
 *
 * // Range
 * <Slider
 *   defaultValue={[2000, 8000]}
 *   min={0}
 *   max={10000}
 *   step={100}
 *   thumbLabels={["Minimum income", "Maximum income"]}
 *   showValue
 * />
 */

interface SliderProps<
  Value extends number | readonly number[] = number | readonly number[],
> extends Omit<SliderPrimitive.Root.Props<Value>, "className" | "children"> {
  className?: string;
  /**
   * Show the current value (or range) above the track, in tabular figures.
   * Pass a function to format it yourself.
   */
  showValue?:
    | boolean
    | ((
        formattedValues: readonly string[],
        values: readonly number[],
      ) => ReactNode);
  /** Accessible name for each thumb, e.g. `["Minimum", "Maximum"]` for a range. */
  thumbLabels?: string[];
  /** Rendered above the track, e.g. a custom `SliderValue` row. */
  children?: ReactNode;
}

const thumb_class = clx(
  // 20px visual, 28px hit area via the pseudo-element (≥ 24px target)
  "relative block size-5 rounded-full border border-otl-control bg-bg-white outline-none",
  "after:absolute after:-inset-1 after:rounded-full after:content-['']",
  "cursor-grab data-[dragging]:cursor-grabbing",
  "transition-[border-color] duration-150 ease-standard motion-reduce:transition-none",
  "hover:border-otl-control-hover",
  "has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-fr-primary",
  "data-[invalid]:border-bg-danger-600",
  "data-[disabled]:cursor-not-allowed data-[disabled]:border-otl-gray-300",
);

function SliderInner<Value extends number | readonly number[]>(
  { className, showValue, thumbLabels, children, ...props }: SliderProps<Value>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const initial = props.value ?? props.defaultValue;
  const thumbCount = Array.isArray(initial) ? initial.length : 1;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={clx(
        "flex w-full touch-none flex-col gap-2 select-none",
        className,
      )}
      {...(props as SliderPrimitive.Root.Props<Value>)}
    >
      {showValue && (
        <SliderValue className="self-end">
          {typeof showValue === "function"
            ? showValue
            : (formatted) => formatted.join(" – ")}
        </SliderValue>
      )}
      {children}
      <SliderPrimitive.Control className="flex h-6 w-full items-center data-[disabled]:cursor-not-allowed">
        {/* Well track: washed-active keeps it visible on the dark Sheet */}
        <SliderPrimitive.Track className="bg-bg-track relative h-1.5 w-full rounded-full">
          <SliderPrimitive.Indicator className="bg-bg-primary-600 data-[disabled]:bg-bg-primary-disabled rounded-full" />
          {Array.from({ length: thumbCount }, (_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              index={i}
              className={thumb_class}
              getAriaLabel={
                thumbLabels ? (index) => thumbLabels[index] ?? "" : undefined
              }
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

const Slider = forwardRef(SliderInner) as (<
  Value extends number | readonly number[] = number | readonly number[],
>(
  props: SliderProps<Value> & { ref?: React.Ref<HTMLDivElement> },
) => React.JSX.Element) & { displayName?: string };
Slider.displayName = "Slider";

/** The current value as text (`<output>`), tabular figures. Must sit inside `Slider`. */
const SliderValue = forwardRef<
  HTMLOutputElement,
  Omit<SliderPrimitive.Value.Props, "className"> & { className?: string }
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Value
    ref={ref}
    className={clx(
      "font-body text-content text-txt-black-900 font-medium tabular-nums",
      className,
    )}
    {...props}
  />
));
SliderValue.displayName = "SliderValue";

export { Slider, SliderValue };
export type { SliderProps };
