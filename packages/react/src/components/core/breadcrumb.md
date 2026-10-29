---
title: Breadcrumb
description: A trail of links showing where the current page sits in the site's hierarchy, with the current page last. Quiet navigation at the top of content pages.
category: Navigation
---

## When to use

- Use `Breadcrumb` on content and record pages that sit in a hierarchy two or more levels deep: Home, Services, Tax relief; or Cases, CASE-2026-0118, Documents.
- Use `Backlink` in transactional flows (apply, declare, pay), where people go back one step rather than up a level. Don't show both on the same page.
- Use `Tabs` to switch between views of the same page, and `Stepper` to show progress through a flow.

## Usage

Put a `BreadcrumbSeparator` between items. Parents are `BreadcrumbLink`s; the current page is a `BreadcrumbPage`, which isn't a link:

```tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function TaxReliefBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/services">Services</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Tax relief for individuals</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
```

For deep trails, keep the first level and the last two, and collapse the middle into `BreadcrumbEllipsis`. The ellipsis is decorative, so to let people reach the hidden levels, make it a `Menu` trigger:

```tsx
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Menu,
  MenuContent,
  MenuLinkItem,
  MenuTrigger,
} from "@/components/ui/menu";

export function CaseDocumentBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/cases">Cases</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <Menu>
          <MenuTrigger
            render={
              <Button
                variant="default-ghost"
                iconOnly
                aria-label="Show hidden levels"
              />
            }
          >
            <BreadcrumbEllipsis />
          </MenuTrigger>
          <MenuContent>
            <MenuLinkItem href="/cases/selangor">Selangor</MenuLinkItem>
            <MenuLinkItem href="/cases/selangor/petaling">
              Petaling
            </MenuLinkItem>
          </MenuContent>
        </Menu>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/cases/CASE-2026-0118">
          CASE-2026-0118
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Documents</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
```

## Notes

- `Breadcrumb` renders a `<nav>` labelled "Breadcrumb" around an ordered list. Pass `aria-label` to translate the label. `className` goes on the list, not the `<nav>`.
- `BreadcrumbPage` sets `aria-current="page"`.
- Names longer than 200px truncate; the full name stays in the `title` tooltip when the children are plain text (or pass `title`).
- `BreadcrumbLink` renders an `<a>`; pass `render` to use your router's link.
- `BreadcrumbSeparator` is a chevron by default and hidden from screen readers. Pass children to use a different icon.
- No container, border or background around the trail.
