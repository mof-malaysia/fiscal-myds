import {
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { clx } from "@/lib/ftds/utils";
import { cva } from "class-variance-authority";

interface TooltipProps extends Omit<TooltipPrimitive.Root.Props, "children"> {
  children?: ReactNode;
  /** How long to wait before opening the tooltip on hover, in milliseconds. */
  delayDuration?: number;
}

const Tooltip: FunctionComponent<TooltipProps> = ({
  delayDuration = 200,
  ...props
}) => {
  return (
    <TooltipPrimitive.Provider delay={delayDuration}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  );
};
Tooltip.displayName = "Tooltip";

const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipPositionerProps = Pick<
  TooltipPrimitive.Positioner.Props,
  | "side"
  | "align"
  | "sideOffset"
  | "alignOffset"
  | "anchor"
  | "collisionAvoidance"
  | "collisionPadding"
  | "sticky"
  | "positionMethod"
  | "arrowPadding"
>;

interface TooltipContentProps
  extends
    Omit<TooltipPrimitive.Popup.Props, "className">,
    TooltipPositionerProps,
    Pick<TooltipPrimitive.Portal.Props, "container" | "keepMounted"> {
  className?: string;
}

const tooltip_content_cva = cva([
  "bg-bg-black-900 border-bg-black-900 shadow-context-menu text-txt-white min-w-[50px] max-w-[250px] rounded-sm border px-3 py-2 text-label-compact",
  "animate-in fade-in duration-200 origin-[var(--transform-origin)]",
  "data-[side=top]:-mb-1 data-[side=top]:-translate-y-1",
  "data-[side=bottom]:-mt-1 data-[side=bottom]:translate-y-1",
  "data-[side=right]:-ml-1 data-[side=right]:translate-x-1",
  "data-[side=left]:-mr-1 data-[side=left]:-translate-x-1",
]);

/**
 * Renders `Portal` → `Positioner` → `Popup` (with an arrow). Positioning props (`side`, `align`, `sideOffset`,
 * `alignOffset`, ...) are forwarded to the Positioner.
 */
const TooltipContent: ForwardRefExoticComponent<
  TooltipContentProps & RefAttributes<HTMLDivElement>
> = forwardRef(
  (
    {
      className,
      children,
      container,
      keepMounted,
      side,
      align,
      sideOffset,
      alignOffset,
      anchor,
      collisionAvoidance,
      collisionPadding,
      sticky,
      positionMethod,
      arrowPadding,
      ...props
    },
    ref,
  ) => (
    <TooltipPrimitive.Portal container={container} keepMounted={keepMounted}>
      <TooltipPrimitive.Positioner
        className="z-popup"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionAvoidance={collisionAvoidance}
        collisionPadding={collisionPadding}
        sticky={sticky}
        positionMethod={positionMethod}
        arrowPadding={arrowPadding}
      >
        <TooltipPrimitive.Popup
          ref={ref}
          className={clx(tooltip_content_cva(), className)}
          {...props}
        >
          {children}
          <TooltipArrow />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  ),
);

TooltipContent.displayName = "TooltipContent";

const TooltipArrow: ForwardRefExoticComponent<
  Omit<TooltipPrimitive.Arrow.Props, "className"> & {
    className?: string;
  } & RefAttributes<HTMLDivElement>
> = forwardRef(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={clx(
      "bg-bg-black-900 size-2.5 rotate-45",
      "data-[side=bottom]:-top-[5px] data-[side=top]:-bottom-[5px]",
      "data-[side=left]:-right-[5px] data-[side=right]:-left-[5px]",
      className,
    )}
    {...props}
  />
));
TooltipArrow.displayName = "TooltipArrow";

export { Tooltip, TooltipContent, TooltipTrigger };
