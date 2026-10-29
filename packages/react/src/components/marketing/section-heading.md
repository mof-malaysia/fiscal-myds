---
title: Section Heading
description: The h2 title and intro paragraph used by the marketing blocks. Use it to give your own landing page sections the same heading style.
category: Marketing
---

## When to use

- Use `SectionHeading` at the top of a custom section on an agency or landing page (latest news, a carousel, a map) so it matches the `FeatureGrid`, `StatsBand`, `Faq`, `Testimonial` and `CtaBand` blocks, which use it inside.
- Don't use it for the page title: the page's only `h1` comes from the `Hero` block or `PageHeaderTitle`.
- Use `PageHeader` for the heading of a service or officer screen, and `CardTitle` for a heading inside a `Card`.

## Usage

Give the heading an id with `titleId` and point the section's `aria-labelledby` at it, so the section is announced by its title:

```tsx
import { SectionHeading } from "@/components/ui/section-heading";
import { Link } from "@/components/ui/link";

export function MediaCentre() {
  return (
    <section
      aria-labelledby="media-title"
      className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-12 md:px-6 md:py-16"
    >
      <SectionHeading
        titleId="media-title"
        title="Media centre"
        description="Press releases, speeches and statements from the Ministry of Finance."
        className="max-w-[720px]"
      >
        <Link href="/media" primary underline="always">
          See all press releases
        </Link>
      </SectionHeading>
      <ul className="gap-stack-md flex flex-col">
        <li className="text-content text-txt-black-900">
          <Link href="/media/budget-2027-tabled" underline="hover">
            Budget 2027 tabled in the Dewan Rakyat
          </Link>
        </li>
        <li className="text-content text-txt-black-900">
          <Link href="/media/sst-review" underline="hover">
            Review of the sales and service tax
          </Link>
        </li>
      </ul>
    </section>
  );
}
```

## Notes

- `as` sets the heading level: `"h2"` (default) or `"h3"` for a subsection inside a section that already has an `h2`.
- `responsive` (on by default) steps the title up a size from the `md` breakpoint. Pass `responsive={false}` for a fixed `text-headline` title, as `StatsBand` does.
- `children` render under the description, for a link or a short contact line.
- It renders nothing when `title`, `description` and `children` are all empty, so blocks with an optional title leave no gap.
- The file also exports `renderAction`, which the blocks use to turn a `{ label, href }` action into a large `Button` link. You only need it when building your own block.
- Cap the width with `className` (for example `max-w-[720px]`) so the intro stays readable.
