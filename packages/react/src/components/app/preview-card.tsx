"use client";

import React, { forwardRef } from "react";
import { PreviewCard as PreviewCardPrimitive } from "@base-ui/react/preview-card";
import { floating_popup_class } from "../core/popover";
import {
  clx,
  splitPositionerProps,
  type PositionerProps,
  type WithClassName,
} from "../../utils";

/**
 * PreviewCard shows a short preview of what a link points to when it is
 * hovered or focused, such as an officer's name opening a card with their
 * unit and contact details. The link must still work on its own: the card is
 * a convenience and never holds the only copy of information or an action.
 *
 * @example
 * <PreviewCard>
 *   <PreviewCardTrigger href="/officers/1024">Nur Aisyah binti Rahman</PreviewCardTrigger>
 *   <PreviewCardContent>
 *     <p className="font-semibold">Nur Aisyah binti Rahman</p>
 *     <p>Senior Assistant Director, Budget Division</p>
 *   </PreviewCardContent>
 * </PreviewCard>
 */

const PreviewCard = PreviewCardPrimitive.Root;

type PreviewCardTriggerProps = WithClassName<PreviewCardPrimitive.Trigger.Props>;

/** The link. Renders an `<a>`, styled as an inline link. */
const PreviewCardTrigger = forwardRef<HTMLAnchorElement, PreviewCardTriggerProps>(
  ({ className, ...props }, ref) => (
    <PreviewCardPrimitive.Trigger
      ref={ref}
      className={clx(
        "text-txt-primary font-medium underline decoration-1 underline-offset-2 rounded-xs",
        "hover:text-primary-700 data-[popup-open]:text-primary-700",
        "outline-none focus-ring",
        className,
      )}
      {...props}
    />
  ),
);
PreviewCardTrigger.displayName = "PreviewCardTrigger";

interface PreviewCardContentProps
  extends WithClassName<PreviewCardPrimitive.Popup.Props>,
    PositionerProps<PreviewCardPrimitive.Positioner.Props> {
  /** A parent element to render the portal into. */
  container?: PreviewCardPrimitive.Portal.Props["container"];
}

/**
 * Renders `Portal` → `Positioner` → `Popup`, styled like PopoverContent (Sheet with the Float shadow).
 * Positioning props are forwarded to the Positioner.
 */
const PreviewCardContent = forwardRef<HTMLDivElement, PreviewCardContentProps>(
  ({ className, container, ...props }, ref) => {
    const [positionerProps, popupProps] = splitPositionerProps(props, {
      align: "center",
      sideOffset: 8,
    });
    return (
      <PreviewCardPrimitive.Portal container={container}>
        <PreviewCardPrimitive.Positioner className="z-50" {...positionerProps}>
          <PreviewCardPrimitive.Popup
            ref={ref}
            className={clx(
              floating_popup_class,
              "text-txt-black-900 font-body text-content z-50 w-72 p-4",
              className,
            )}
            {...popupProps}
          />
        </PreviewCardPrimitive.Positioner>
      </PreviewCardPrimitive.Portal>
    );
  },
);
PreviewCardContent.displayName = "PreviewCardContent";

export { PreviewCard, PreviewCardTrigger, PreviewCardContent };
export type { PreviewCardTriggerProps, PreviewCardContentProps };
