"use client";

import React, { forwardRef } from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { clx, type WithClassName } from "@/lib/ftds/utils";
import { link_cva } from "@/components/ui/link";

/**
 * Details hides a short piece of help behind a link-like trigger, such as
 * "Help with your IC number". Use it for information only some users need;
 * for several sections that open and close, use an Accordion instead.
 *
 * @example
 * <Details>
 *   <DetailsTrigger>I cannot find my reference number</DetailsTrigger>
 *   <DetailsContent>
 *     Your reference number is on the letter we sent you, under your name.
 *   </DetailsContent>
 * </Details>
 */

const Details = forwardRef<
  HTMLDivElement,
  WithClassName<CollapsiblePrimitive.Root.Props>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Root
    ref={ref}
    className={clx("font-body flex w-full flex-col", className)}
    {...props}
  />
));
Details.displayName = "Details";

/** The summary text. Reads as a link so it stays quiet until it's needed. */
const DetailsTrigger = forwardRef<
  HTMLButtonElement,
  WithClassName<CollapsiblePrimitive.Trigger.Props>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={clx(
      "group text-txt-primary inline-flex w-fit cursor-pointer items-start gap-1.5 rounded-xs text-left font-medium",
      "text-content outline-none",
      "focus-ring",
      "data-[disabled]:text-txt-black-disabled data-[disabled]:cursor-not-allowed",
      className,
    )}
    {...props}
  >
    <ChevronRightIcon
      aria-hidden
      className={clx(
        // Optical alignment with the first line of text
        "ease-standard mt-[0.2em] size-4 shrink-0 transition-transform duration-200",
        "group-data-[panel-open]:rotate-90 motion-reduce:transition-none",
      )}
    />
    <span
      className={link_cva({
        underline: "always",
        className:
          "group-hover:decoration-2 group-data-[disabled]:no-underline",
      })}
    >
      {children}
    </span>
  </CollapsiblePrimitive.Trigger>
));
DetailsTrigger.displayName = "DetailsTrigger";

/**
 * The revealed help. Set apart with a Well, not a side stripe
 * (DESIGN.md: no coloured side-stripes).
 */
const DetailsContent = forwardRef<
  HTMLDivElement,
  WithClassName<CollapsiblePrimitive.Panel.Props>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Panel
    ref={ref}
    className={clx(
      "overflow-hidden",
      "ease-standard h-[var(--collapsible-panel-height)] transition-[height,opacity] duration-200",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
      "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      "motion-reduce:transition-none",
    )}
    {...props}
  >
    <div
      className={clx(
        "bg-bg-washed text-txt-black-700 text-content mt-3 max-w-[70ch] rounded-lg p-4",
        "in-data-[density=compact]:mt-2 in-data-[density=compact]:p-3",
        className,
      )}
    >
      {children}
    </div>
  </CollapsiblePrimitive.Panel>
));
DetailsContent.displayName = "DetailsContent";

export { Details, DetailsTrigger, DetailsContent };
