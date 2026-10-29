---
title: Testimonial
description: What people say about a service. One quote renders as a large centred pull quote; two or three render as a grid of Sheet panels.
---

## When to use

- Use `Testimonial` on an agency or landing page for one to three real quotes from people who used the service, with their permission.
- Use `StatsBand` to back a claim with figures, and `Callout` or `InsetText` to quote a rule or notice inside page content.

## Usage

```tsx
import { Testimonial } from "@/components/blocks/testimonial";

export function WhatPeopleSay() {
  return (
    <Testimonial
      title="What people say"
      items={[
        {
          quote:
            "I paid my company's assessment in five minutes and had the receipt before I closed the tab.",
          name: "Nurul Aina Rahman",
          role: "Business owner, Shah Alam",
          avatar: "/images/people/nurul-aina.jpg",
        },
        {
          quote:
            "The reminders are the best part. I have not missed a due date since I signed up.",
          name: "Tan Wei Ming",
          role: "Retiree, Ipoh",
        },
        {
          quote:
            "I can check the status of my claim without phoning anyone. Everything is clear.",
          name: "Muthu Krishnan",
          role: "Civil servant, Putrajaya",
        },
      ]}
    />
  );
}
```

## Notes

- `items` takes one to three quotes; extra items are dropped. One quote is centred and large, two sit side by side, three make three columns on desktop.
- Each quote is a `<figure>` with a `<blockquote>` and a `<figcaption>` holding the name and role.
- `avatar` is an image URL and is decorative (the name is beside it). Leave it out rather than using a stock photo.
- Use real people and their own words, in the language they said them. Don't write quotes for the page.
- `title` is optional and renders an `h2` that labels the section.
