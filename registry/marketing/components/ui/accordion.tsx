"use client";

import React from "react";
import { Accordion as AccordionBase } from "@base-ui/react/accordion";
import { clx } from "@/lib/ftds/utils";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";

/**
 * Props for Accordion component.
 * @typedef AccordionProps
 * @property {"single" | "multiple"} type - Whether one or many items can be open at the same time. Defaults to "single".
 * @property {boolean} collapsible - (single only) Whether the open item can be closed by clicking its trigger. Defaults to false.
 * @property {string | string[]} value - Controlled open item(s).
 * @property {string | string[]} defaultValue - Initially open item(s) (uncontrolled).
 * @property {(value: string | string[]) => void} onValueChange - Called when the open item(s) change.
 */

/**
 * Accordion stacks sections that people expand one at a time (or several, with
 * `type="multiple"`): FAQs and long explanations on agency sites. Each item's
 * trigger is a button with its expanded state announced.
 * @component
 * @example
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Title</AccordionTrigger>
 *     <AccordionContent>Content</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */

type AccordionBaseProps = Omit<
  AccordionBase.Root.Props,
  "value" | "defaultValue" | "onValueChange" | "multiple" | "className"
> & { className?: string };

interface AccordionSingleProps extends AccordionBaseProps {
  type?: "single";
  collapsible?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface AccordionMultipleProps extends AccordionBaseProps {
  type: "multiple";
  collapsible?: never;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

const toArray = (value: string | string[] | undefined) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  return value === "" ? [] : [value];
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = "single",
      collapsible = false,
      value,
      defaultValue,
      onValueChange,
      ...props
    },
    forwardedRef,
  ) => {
    const multiple = type === "multiple";

    return (
      <AccordionBase.Root
        multiple={multiple}
        value={toArray(value)}
        defaultValue={toArray(defaultValue)}
        onValueChange={(next: string[], eventDetails) => {
          if (multiple) {
            (onValueChange as AccordionMultipleProps["onValueChange"])?.(next);
            return;
          }
          // `collapsible={false}`: the open item cannot be closed by its own trigger.
          if (!collapsible && next.length === 0) {
            eventDetails.cancel();
            return;
          }
          (onValueChange as AccordionSingleProps["onValueChange"])?.(
            next[0] ?? "",
          );
        }}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionBase.Item>,
  Omit<AccordionBase.Item.Props, "className"> & { className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionBase.Item
    className={clx(
      "border-otl-gray-200 bg-bg-white group mt-px overflow-hidden border-b first:mt-0",
      "outline-none",
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AccordionBase.Item>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionBase.Trigger>,
  Omit<AccordionBase.Trigger.Props, "className"> & { className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionBase.Header className="flex">
    <AccordionBase.Trigger
      className={clx(
        "text-txt-black-700 font-body bg-bg-white hover:text-txt-black-900 data-[panel-open]:text-txt-black-900 group flex flex-1 cursor-pointer items-center justify-between py-4 text-base leading-none font-medium hover:underline",
        "focus-ring rounded-xs outline-none focus-visible:underline",
        "data-[disabled]:text-txt-black-disabled data-[disabled]:cursor-not-allowed data-[disabled]:hover:no-underline",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
      <ChevronDownIcon
        className="text-txt-black-500 group-data-[disabled]:text-txt-black-disabled transition-transform duration-300 ease-in-out group-data-[panel-open]:rotate-180"
        aria-hidden
      />
    </AccordionBase.Trigger>
  </AccordionBase.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionBase.Panel>,
  Omit<AccordionBase.Panel.Props, "className"> & { className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionBase.Panel
    className={clx(
      "text-txt-black-700 font-body text-content relative overflow-hidden font-normal",
      "h-[var(--accordion-panel-height)] transition-[height,opacity] duration-300 ease-out",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
      "data-[ending-style]:opacity-0 data-[open]:opacity-100 data-[starting-style]:opacity-0",
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className={clx("overflow-hidden pr-9 pb-4", className)}>
      {children}
    </div>
  </AccordionBase.Panel>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps };
