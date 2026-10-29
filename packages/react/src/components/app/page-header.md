---
title: Page Header
description: Opens a page with an optional breadcrumb, the page's one h1, a short description, actions on the right and a meta row for status. Every page starts with one.
category: Layout
---

## When to use

- Start every page with a `PageHeader` holding the page's only `h1` (`PageHeaderTitle`), unless a block already provides the title.
- Use it on citizen service pages and inside `AppShellMain` or `DeskPage` in officer tools.
- For the outcome at the top of a confirmation or result page ("Payment received" with a reference number), use `Panel` instead. For a step of a multi-page form, `FormStep` renders its own title.

## Usage

`PageHeaderContent` holds the title and description so `PageHeaderActions` can sit beside them; the actions wrap below the title when space runs out. `PageHeaderNav` and `PageHeaderMeta` take a full row each.

```tsx
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderNav,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";

export function ApplicationHeader() {
  return (
    <PageHeader>
      <PageHeaderNav>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/applications">Applications</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>MOF-2026-0412</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
      </PageHeaderNav>
      <PageHeaderContent>
        <PageHeaderTitle size="headline">
          Application MOF-2026-0412
        </PageHeaderTitle>
        <PageHeaderDescription>
          Lifestyle relief claim of RM 2,500.00 from Syarikat Maju Jaya Sdn.
          Bhd.
        </PageHeaderDescription>
      </PageHeaderContent>
      <PageHeaderActions>
        <Button variant="default-outline">Request changes</Button>
        <Button>Approve</Button>
      </PageHeaderActions>
      <PageHeaderMeta>
        <Tag variant="warning">Pending review</Tag>
        <span>Last updated 27 October 2026</span>
      </PageHeaderMeta>
    </PageHeader>
  );
}
```

A citizen service landing page uses the default `display` size:

```tsx
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";

export function ReliefStartHeader() {
  return (
    <PageHeader>
      <PageHeaderContent>
        <PageHeaderTitle>Apply for a tax relief</PageHeaderTitle>
        <PageHeaderDescription>
          It takes about 10 minutes. You need your IC number and your EA form.
        </PageHeaderDescription>
      </PageHeaderContent>
    </PageHeader>
  );
}
```

## Notes

- `PageHeaderTitle` `size` is `display` (32px, default) for service landing screens and `headline` (24px) for working pages such as a record in an officer tool.
- Keep the `h1`. `as="h2"` exists for a header inside a page section, but each page needs exactly one `h1`.
- One primary action at most; the others are `default-outline` or ghost buttons.
- There is no rule under the header: the space before the content separates it. Don't add a border.
- `PageHeaderDescription` is capped at about 70 characters per line. Keep it to one or two sentences.
