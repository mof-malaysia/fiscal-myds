---
title: FAQ
description: A frequently asked questions section: a heading and intro beside an accordion of questions and answers, with an optional "still need help" line.
---

## When to use

- Use `Faq` for the questions section of an agency or landing page, or the help page of a service.
- Use `Accordion` directly for collapsible sections that aren't questions and answers, or when you need your own layout.
- Use `Details` for a single "Help with…" hint inside a form.

## Usage

```tsx
import { Faq } from "@/components/blocks/faq";
import { Link } from "@/components/ui/link";

export function PaymentFaq() {
  return (
    <Faq
      description="Answers to the questions people ask most about paying online."
      defaultOpen="which-bills"
      items={[
        {
          value: "which-bills",
          question: "Which bills can I pay here?",
          answer:
            "Fees, fines and assessments from more than 30 federal agencies, including JPJ summonses, LHDN instalments and court fines.",
        },
        {
          value: "confirmation",
          question: "How do I know my payment went through?",
          answer:
            "You see a confirmation page with a reference number straight away, and we email you an official receipt within five minutes.",
        },
        {
          value: "wrong-amount",
          question: "What if I paid the wrong amount?",
          answer:
            "Contact the agency that issued the bill. Refunds are handled by the agency and usually take 14 working days.",
        },
      ]}
      contact={
        <>
          Still need help?{" "}
          <Link href="/help" primary underline="always">
            Contact the help centre
          </Link>
        </>
      }
    />
  );
}
```

## Notes

- `title` defaults to "Frequently asked questions" in English; pass `title` to translate it or name the section ("Paying online: your questions").
- One answer is open at a time and can be closed again. `multiple` lets several stay open.
- `defaultOpen` takes an item's `value`. Items without a `value` are `faq-0`, `faq-1` and so on by position; set `value` when you use `defaultOpen` so it doesn't break when you reorder.
- On desktop the heading takes the left third and the questions the rest; on mobile they stack.
- Write questions the way people ask them, and start the answer with the answer ("Yes.", "Fees, fines and…").
- Keep it to the questions people actually ask, about eight at most. Anything everyone needs belongs on the page itself.
