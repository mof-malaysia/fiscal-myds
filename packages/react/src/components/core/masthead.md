---
title: Masthead
description: The "Official Malaysia Government Website" bar at the very top of every government site, with a panel that explains how to tell the site is genuine.
category: Government chrome
---

## When to use

- Put a `Masthead` at the top of every public Malaysian government site and service, directly after the `Skiplink` and before the `PhaseBanner` and the site's navigation (`Navbar` or a top bar).
- It is not the site's header: the agency logo, navigation and sign-in go in the `Navbar` below it.

## Usage

`Masthead` has no built-in text, so compose all of it: `MastheadHeader` (the flag is added for you) with a `MastheadTitle` and a `MastheadTrigger`, and a `MastheadContent` panel with one `MastheadSection` per check.

```tsx
import {
  Masthead,
  MastheadContent,
  MastheadHeader,
  MastheadSection,
  MastheadTitle,
  MastheadTrigger,
} from "@/components/ui/masthead";
import { Lock2Icon } from "@/components/ui/icons/lock-2";
import { LockFillIcon } from "@/components/ui/icons/lock-fill";
import { PutrajayaIcon } from "@/components/ui/icons/putrajaya";

export function GovMasthead() {
  return (
    <Masthead>
      <MastheadHeader>
        <MastheadTitle>Official Malaysia Government Website</MastheadTitle>
        <MastheadTrigger>Here's how you know</MastheadTrigger>
      </MastheadHeader>
      <MastheadContent>
        <MastheadSection
          icon={<PutrajayaIcon />}
          title="Official government websites end with .gov.my"
        >
          If the link does not end with <b>.gov.my</b>, leave the website
          straight away, even if it looks similar.
        </MastheadSection>
        <MastheadSection icon={<Lock2Icon />} title="Secure websites use HTTPS">
          Look for a lock (<LockFillIcon className="inline-block" />) or
          https:// as an added precaution. If it is not there, do not share any
          sensitive information.
        </MastheadSection>
      </MastheadContent>
    </Masthead>
  );
}
```

In Bahasa Melayu, translate the text and the trigger's accessible name:

```tsx
import {
  Masthead,
  MastheadContent,
  MastheadHeader,
  MastheadSection,
  MastheadTitle,
  MastheadTrigger,
} from "@/components/ui/masthead";
import { Lock2Icon } from "@/components/ui/icons/lock-2";
import { PutrajayaIcon } from "@/components/ui/icons/putrajaya";

export function MastheadBm() {
  return (
    <Masthead>
      <MastheadHeader>
        <MastheadTitle>Laman Web Rasmi Kerajaan Malaysia</MastheadTitle>
        <MastheadTrigger>Ini cara anda mengetahuinya</MastheadTrigger>
      </MastheadHeader>
      <MastheadContent>
        <MastheadSection
          icon={<PutrajayaIcon />}
          title="Laman web rasmi kerajaan berakhir dengan .gov.my"
        >
          Jika pautan tidak berakhir dengan <b>.gov.my</b>, keluar dari laman
          web itu dengan segera.
        </MastheadSection>
        <MastheadSection
          icon={<Lock2Icon />}
          title="Laman web yang selamat menggunakan HTTPS"
        >
          Cari ikon kunci atau https:// sebelum anda berkongsi maklumat
          sensitif.
        </MastheadSection>
      </MastheadContent>
    </Masthead>
  );
}
```

## Notes

- A bare `<Masthead />` renders an empty grey bar; always include the header and content.
- The trigger toggles the panel. Its text is its accessible name, so it translates with the page; on small screens the text is visually hidden and only the chevron shows.
- The panel starts closed. `Masthead` doesn't take `open` or `defaultOpen`; its props go to the outer `<div>` (which has `id="masthead"`).
- `MastheadSection` needs an `icon` and a `title`; its children are the explanation. The icon is sized and coloured for you.
- The masthead is hidden when printing and excluded from search snippets.
- Keep it the full width of the page, above everything except the `Skiplink`. Don't make it sticky.
