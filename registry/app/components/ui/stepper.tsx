import React, {
  Children,
  ComponentProps,
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
} from "react";
import { cva } from "class-variance-authority";
import { CheckIcon } from "@/components/ui/icons/check";
import { clx } from "@/lib/ftds/utils";
import { progress_indicator_base_class, progress_track_cva } from "@/components/ui/progress";

/**
 * Stepper shows where someone is in a multi-step form: "Step 2 of 4: Your income".
 * On wide containers it lists every step with a number (or a check once complete);
 * on narrow ones it collapses to the "Step 2 of 4" line and a progress bar.
 *
 * Steps before `current` are complete, and can link back with `href`; the current
 * step carries `aria-current="step"`. Override a step's state with `state`.
 *
 * @example
 * <Stepper current={1} aria-label="Application progress">
 *   <StepperItem href="#details">Your details</StepperItem>
 *   <StepperItem>Your income</StepperItem>
 *   <StepperItem>Reliefs</StepperItem>
 *   <StepperItem>Check and submit</StepperItem>
 * </Stepper>
 */

type StepState = "complete" | "current" | "upcoming";

interface StepperContextValue {
  current: number;
  completeLabel: string;
}

const StepperContext = createContext<StepperContextValue>({
  current: 0,
  completeLabel: "Completed",
});

const StepperIndexContext = createContext(0);

/*========================================================================================================================*/

interface StepperProps extends ComponentProps<"nav"> {
  /** Zero-based index of the current step. */
  current: number;
  /**
   * The narrow-screen summary before the step name.
   * @default (step, total) => `Step ${step} of ${total}`
   */
  formatStep?: (step: number, total: number) => ReactNode;
  /**
   * Hidden text announced with each completed step.
   * @default "Completed"
   */
  completeLabel?: string;
}

const Stepper = forwardRef<HTMLElement, StepperProps>(
  (
    {
      className,
      current,
      formatStep = (step, total) => `Step ${step} of ${total}`,
      completeLabel = "Completed",
      "aria-label": ariaLabel = "Progress",
      children,
      ...props
    },
    ref,
  ) => {
    const items = Children.toArray(children).filter(isValidElement);
    const total = items.length;
    const index = Math.min(Math.max(current, 0), Math.max(total - 1, 0));
    // The narrow summary follows a step marked `state="current"`, like the wide list
    const overridden = items.findIndex(
      (item) => (item.props as { state?: StepState }).state === "current",
    );
    const summaryIndex = overridden === -1 ? index : overridden;
    const currentItem = items[summaryIndex] as
      | React.ReactElement<{ children?: ReactNode }>
      | undefined;

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={clx("@container w-full", className)}
        {...props}
      >
        {/* Narrow: "Step 2 of 4: Your income" and a progress line */}
        <div className="flex flex-col gap-2 @xl:hidden">
          <p className="font-body text-content text-txt-black-700">
            <span className="text-txt-black-900 font-medium">
              {formatStep(summaryIndex + 1, total)}
            </span>
            {currentItem?.props.children ? (
              <>: {currentItem.props.children}</>
            ) : null}
          </p>
          <div aria-hidden className={clx(progress_track_cva(), "h-1")}>
            <div
              className={clx(
                progress_indicator_base_class,
                "bg-bg-primary-600",
              )}
              style={{
                width: total ? `${((summaryIndex + 1) / total) * 100}%` : 0,
              }}
            />
          </div>
        </div>

        {/* Wide: every step */}
        <StepperContext.Provider value={{ current: index, completeLabel }}>
          <ol className="hidden items-center gap-3 @xl:flex">
            {items.map((child, i) => (
              <StepperIndexContext.Provider key={child.key ?? i} value={i}>
                {child}
              </StepperIndexContext.Provider>
            ))}
          </ol>
        </StepperContext.Provider>
      </nav>
    );
  },
);
Stepper.displayName = "Stepper";

/*========================================================================================================================*/

const stepper_circle_cva = cva(
  [
    "flex size-8 shrink-0 items-center justify-center rounded-full tabular-nums",
    "font-body text-label-md font-semibold in-data-[density=compact]:size-6 in-data-[density=compact]:text-label-compact",
    "transition-colors duration-150 ease-standard motion-reduce:transition-none",
  ],
  {
    variants: {
      state: {
        complete: "bg-bg-primary-600 text-txt-white",
        // Ring of FTDS Blue on its wash: selected, not filled (DESIGN.md: One Blue Rule)
        current:
          "bg-bg-primary-50 text-txt-primary ring-2 ring-inset ring-bg-primary-600",
        upcoming: "bg-bg-washed-active text-txt-black-700",
      },
    },
  },
);

interface StepperItemProps extends Omit<ComponentProps<"li">, "children"> {
  /** The step name. */
  children: ReactNode;
  /** Overrides the state derived from `Stepper current`. */
  state?: StepState;
  /** Makes a completed step a link back to it. Ignored on current and upcoming steps. */
  href?: string;
  /** Click handler for the link (e.g. client-side routing). */
  onLinkClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StepperItem = forwardRef<HTMLLIElement, StepperItemProps>(
  (
    { className, children, state: stateProp, href, onLinkClick, ...props },
    ref,
  ) => {
    const { current, completeLabel } = useContext(StepperContext);
    const index = useContext(StepperIndexContext);
    const state: StepState =
      stateProp ??
      (index < current
        ? "complete"
        : index === current
          ? "current"
          : "upcoming");

    const content = (
      <>
        <span className={stepper_circle_cva({ state })} aria-hidden>
          {state === "complete" ? <CheckIcon className="size-4" /> : index + 1}
        </span>
        <span
          className={clx(
            "font-body text-label-md min-w-0",
            state === "current"
              ? "text-txt-black-900 font-medium"
              : "text-txt-black-700 font-normal",
          )}
        >
          {state === "complete" && (
            <span className="sr-only">{completeLabel}: </span>
          )}
          {children}
        </span>
      </>
    );

    return (
      <li
        ref={ref}
        aria-current={state === "current" ? "step" : undefined}
        className={clx(
          // The last step has no connector, so it takes only its own width
          "group/step flex min-w-0 flex-1 items-center gap-3 last:flex-initial",
          className,
        )}
        {...props}
      >
        {state === "complete" && href ? (
          <a
            href={href}
            onClick={onLinkClick}
            className={clx(
              "flex min-w-0 items-center gap-2 rounded-md outline-none",
              "hover:[&>span:last-child]:text-txt-black-900 [&>span:last-child]:underline-offset-[3px] hover:[&>span:last-child]:underline",
              "focus-ring",
            )}
          >
            {content}
          </a>
        ) : (
          <span className="flex min-w-0 items-center gap-2">{content}</span>
        )}
        <span
          aria-hidden
          className={clx(
            "h-0.5 min-w-4 flex-1 rounded-full group-last/step:hidden",
            state === "complete" ? "bg-bg-primary-600" : "bg-bg-track",
          )}
        />
      </li>
    );
  },
);
StepperItem.displayName = "StepperItem";

export { Stepper, StepperItem };
export type { StepperProps, StepperItemProps, StepState };
