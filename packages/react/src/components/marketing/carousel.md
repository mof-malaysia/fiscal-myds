---
title: Carousel
description: A horizontal row of slides people scroll by touch, buttons, dots or arrow keys. Built on CSS scroll-snap; no autoplay unless you turn it on.
category: Marketing
---

## When to use

- Use `Carousel` for a short row of items of equal weight on a landing page, such as latest updates or featured services, where showing a few and scrolling to the rest saves space.
- Use the `FeatureGrid` block when every item matters: a grid shows them all at once and nothing is hidden off screen.
- Use `Testimonial` for quotes, `LogoCloud` for agency logos, and `Tabs` to switch between views of one thing.
- Don't put the only route to a task, or anything a citizen must read, in a slide they may never reach.

## Usage

Put `CarouselItem`s in `CarouselContent`, then place the controls wherever you like inside `Carousel`. Slides are full width by default; set a basis on `CarouselItem` to show several at once. Name the carousel with `aria-label` or `aria-labelledby`:

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/components/ui/link";
import { SectionHeading } from "@/components/ui/section-heading";

const updates = [
  {
    title: "Budget 2027: what changes for households",
    text: "A plain-language summary of the new tax reliefs and cash aid.",
    href: "/budget-2027",
  },
  {
    title: "e-Invoicing for small businesses",
    text: "Who must issue e-invoices from July 2027, and how to start.",
    href: "/e-invoicing",
  },
  {
    title: "Scheduled maintenance on 2 November",
    text: "Payments are unavailable from 1 am to 4 am. Receipts are not affected.",
    href: "/notices/maintenance",
  },
];

export function LatestUpdates() {
  return (
    <section
      aria-labelledby="updates-title"
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-12 md:px-6"
    >
      <SectionHeading titleId="updates-title" title="Latest updates" />
      <Carousel aria-labelledby="updates-title">
        <CarouselContent>
          {updates.map((update) => (
            <CarouselItem
              key={update.href}
              className="basis-4/5 md:basis-1/2 lg:basis-1/3"
            >
              <article className="bg-bg-white p-surface flex h-full flex-col gap-3 rounded-lg">
                <h3 className="text-title text-txt-black-900 font-semibold">
                  <Link href={update.href} underline="hover">
                    {update.title}
                  </Link>
                </h3>
                <p className="text-content text-txt-black-700">{update.text}</p>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center gap-2">
          <CarouselPrevious />
          <CarouselNext />
          <CarouselDots className="ml-auto" />
        </div>
      </Carousel>
    </section>
  );
}
```

With `autoplay` (milliseconds between slides) you must render `CarouselPlayToggle` so people can stop it. `labels` translates the built-in text:

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPlayToggle,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function Pengumuman() {
  return (
    <Carousel
      aria-label="Pengumuman"
      autoplay={6000}
      labels={{
        previous: "Slaid sebelumnya",
        next: "Slaid seterusnya",
        pause: "Jeda slaid",
        play: "Main slaid",
        goTo: (index) => `Pergi ke slaid ${index + 1}`,
        slide: (index, count) => `${index + 1} daripada ${count}`,
      }}
    >
      <CarouselContent>
        <CarouselItem>
          <p className="bg-bg-washed p-surface text-content text-txt-black-900 rounded-lg">
            Permohonan Sumbangan Tunai Rahmah fasa 2 dibuka sehingga 30 April.
          </p>
        </CarouselItem>
        <CarouselItem>
          <p className="bg-bg-washed p-surface text-content text-txt-black-900 rounded-lg">
            Ringkasan Belanjawan 2027 kini boleh dimuat turun.
          </p>
        </CarouselItem>
      </CarouselContent>
      <div className="flex items-center gap-2">
        <CarouselPlayToggle />
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
```

## Notes

- The root is a region with the role description "carousel", and each slide is a group named "2 of 5" (`labels.slide`). The track is focusable, and the left and right arrow keys move one slide while focus is anywhere inside the carousel (except in form fields).
- `CarouselPrevious` and `CarouselNext` are ghost icon buttons with accessible names, disabled at the start and end. Pass children to replace their chevron icons.
- `CarouselDots` gives one button per slide and marks the current one with `aria-current`; it renders nothing when there are fewer than two slides. `CarouselPlayToggle` renders nothing unless `autoplay` is set.
- Autoplay pauses while the pointer is over the carousel or focus is inside it, stops for good once the user navigates, and never starts under `prefers-reduced-motion`. Avoid it unless there is a clear reason.
- `onIndexChange` receives the index of the slide at the start of the view.
- For custom controls, `useCarousel()` (inside `Carousel`) returns `index`, `count`, `canPrev`, `canNext`, `scrollTo`, `scrollPrev` and `scrollNext`.
- Put each slide's content on a Sheet or Well surface without borders, and keep slides the same height (`h-full` on the content).
