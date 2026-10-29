---
title: Accordion
description: A stack of sections that open and close under their headings. Use it when a page has several sections people need one at a time.
category: Marketing
---

## When to use

- Use `Accordion` for several related sections a reader opens one at a time: eligibility rules by category, the steps of a long guide, sections of a policy page.
- Use `Details` for one short piece of help only some people need, such as "Help with your IC number".
- Use the `Faq` block for a whole frequently asked questions section; it builds the accordion, heading and contact line for you.
- Use `Tabs` when the sections are alternative views of the same thing and only one should be on screen.

## Usage

`type="single"` (the default) keeps one section open at a time. Add `collapsible` so the open section can be closed again by its own trigger:

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ReliefCategories() {
  return (
    <Accordion type="single" collapsible defaultValue="lifestyle">
      <AccordionItem value="lifestyle">
        <AccordionTrigger>Lifestyle relief, up to RM 2,500</AccordionTrigger>
        <AccordionContent>
          Books, a personal computer, a smartphone or tablet, internet
          subscription and fees for skills courses you paid for yourself.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="medical">
        <AccordionTrigger>Medical relief, up to RM 10,000</AccordionTrigger>
        <AccordionContent>
          Treatment for serious diseases, fertility treatment and vaccinations
          for you, your spouse or your child.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="education">
        <AccordionTrigger>Education fees, up to RM 7,000</AccordionTrigger>
        <AccordionContent>
          Fees for a recognised course at diploma level or above, at a
          university or college in Malaysia.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

`type="multiple"` lets several sections stay open; `value`, `defaultValue` and `onValueChange` then use an array of item values:

```tsx
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ApplicationGuide() {
  const [open, setOpen] = useState<string[]>(["before"]);
  return (
    <Accordion type="multiple" value={open} onValueChange={setOpen}>
      <AccordionItem value="before">
        <AccordionTrigger>Before you start</AccordionTrigger>
        <AccordionContent>
          Have your MyKad, your latest EA form and your bank account details
          ready.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="after">
        <AccordionTrigger>After you apply</AccordionTrigger>
        <AccordionContent>
          We email you a reference number straight away. A decision usually
          takes 14 working days.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

## Notes

- Without `collapsible`, a single accordion's open section can't be closed by clicking it; another section has to be opened instead. Add `collapsible` unless one section must always be open.
- In single mode `onValueChange` receives the open item's value, or `""` when `collapsible` lets the last one close.
- Give every `AccordionItem` a stable `value`; `defaultValue` and `value` refer to it.
- The trigger is a button inside a heading element and the panel is linked to it, so screen readers announce it as expanded or collapsed. Keep trigger text short and specific.
- Items sit on a Sheet (`bg-bg-white`) with a Hairline divider under each one. Don't wrap the accordion in a bordered box.
- Don't hide information everyone needs to complete a task inside a closed section.
