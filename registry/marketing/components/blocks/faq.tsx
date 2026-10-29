"use client";
// registry:block — composed page section, installs to components/blocks

import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useId,
} from "react";
import { clx } from "@/lib/ftds/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Faq answers common questions: a section heading and intro beside (desktop)
 * or above (mobile) an accordion of question / answer items, with an optional
 * "still need help" contact line.
 *
 * @example
 * <Faq
 *   title="Frequently asked questions"
 *   items={[{ question: "Who can apply?", answer: "Any Malaysian citizen aged 18 and above." }]}
 *   contact={<>Still need help? <Link href="/contact" primary>Contact us</Link></>}
 * />
 */

interface FaqItem {
  question: ReactNode;
  answer: ReactNode;
  /** Stable id for the item. Defaults to its position. */
  value?: string;
}

interface FaqProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  items: FaqItem[];
  /** "Still need help?" line under the intro. */
  contact?: ReactNode;
  /** Allow several answers open at once. Defaults to false. */
  multiple?: boolean;
  /** Item open on first render. */
  defaultOpen?: string;
}

const Faq: ForwardRefExoticComponent<FaqProps & RefAttributes<HTMLElement>> =
  forwardRef(
    (
      {
        title = "Frequently asked questions",
        description,
        items,
        contact,
        multiple = false,
        defaultOpen,
        className,
        ...props
      },
      ref,
    ) => {
      const titleId = useId();
      const itemList = items.map((item, i) => (
        <AccordionItem
          key={item.value ?? i}
          value={item.value ?? `faq-${i}`}
          className="bg-transparent"
        >
          <AccordionTrigger className="text-body-lg gap-4 bg-transparent py-5 text-left leading-snug">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pr-0 pb-5 md:pr-9">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ));

      return (
        <section
          ref={ref}
          aria-labelledby={titleId}
          className={clx("bg-bg-gray-50 font-body w-full", className)}
          {...props}
        >
          <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-12 md:px-6 md:py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
            <SectionHeading
              titleId={titleId}
              title={title}
              description={description}
              className="lg:col-span-4"
            >
              {contact && (
                <p className="text-txt-black-700 text-body-md mt-3">
                  {contact}
                </p>
              )}
            </SectionHeading>
            <div className="lg:col-span-8">
              {multiple ? (
                <Accordion
                  type="multiple"
                  defaultValue={defaultOpen ? [defaultOpen] : undefined}
                >
                  {itemList}
                </Accordion>
              ) : (
                <Accordion type="single" collapsible defaultValue={defaultOpen}>
                  {itemList}
                </Accordion>
              )}
            </div>
          </div>
        </section>
      );
    },
  );
Faq.displayName = "Faq";

export { Faq };
export type { FaqProps, FaqItem };
