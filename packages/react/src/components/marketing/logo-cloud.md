---
title: Logo Cloud
description: A quiet row of the agencies or partners that use a service, muted at rest and in full colour on hover or focus. Each logo needs alt text.
---

## When to use

- Use `LogoCloud` on a landing page to show which agencies a service covers or works with, usually just after the `Hero`.
- Use `FeatureGrid` to explain what the service does, and `Testimonial` for what people say about it.
- Don't use it as navigation to agencies' services; a list of links or a `NavbarMenuDropdown` is clearer.

## Usage

```tsx
import { LogoCloud } from "@/components/blocks/logo-cloud";

export function ConnectedAgencies() {
  return (
    <LogoCloud
      title="Agencies using MyBayar"
      logos={[
        {
          src: "/logos/lhdn.svg",
          alt: "Lembaga Hasil Dalam Negeri",
          href: "https://www.hasil.gov.my",
        },
        {
          src: "/logos/jkdm.svg",
          alt: "Jabatan Kastam Diraja Malaysia",
          href: "https://www.customs.gov.my",
        },
        { src: "/logos/anm.svg", alt: "Jabatan Akauntan Negara Malaysia" },
        { src: "/logos/jpj.svg", alt: "Jabatan Pengangkutan Jalan" },
      ]}
    />
  );
}
```

## Notes

- `alt` is required and must name the organisation: it is the link text when the logo has an `href`.
- Logos are greyscale and faded by default and return to full colour on hover or focus. `muted={false}` shows them in full colour all the time.
- Logos are 40px tall (48px from `md`), up to 160px wide, and load lazily. Pass `width` and `height` to avoid layout shift.
- The `title` is a small `h2` in secondary text, not a section heading; keep it to one line such as "Agencies using this service".
- Use the agencies' official logo files unchanged; don't recolour them.
