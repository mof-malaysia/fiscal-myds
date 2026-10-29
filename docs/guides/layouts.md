---
title: Page layouts
description: Which frame to use for citizen services, officer tools, sign-in screens, settings and marketing pages, and the government chrome every page needs.
order: 5
---

Pick the frame by who the page is for, then fill it with components and blocks.

| Page                                           | Frame                                                                                                              | Density                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| Citizen service (apply, pay, declare)          | `Masthead`, a top bar or `Navbar`, a centred content column, `Footer`                                              | comfortable (default)        |
| Sign in, sign up, password, verification       | `AuthLayout` (or the `SignInForm`, `SignUpForm`, `ForgotPasswordForm`, `ResetPasswordForm` and `OtpVerify` blocks) | comfortable                  |
| Account or settings area                       | `SettingsLayout` with `SettingsSection` and `SettingsRow`                                                          | comfortable                  |
| Officer tool with labelled, grouped navigation | `AppShell` with `Sidebar`                                                                                          | set `data-density="compact"` |
| Dense officer workstation, keyboard-first      | `DeskShell` (rail, top bar with tabs and ⌘K, status bar)                                                           | compact, set for you         |
| List beside detail (cases, applications)       | `SplitPane`, inside either shell                                                                                   | inherits                     |
| Agency or landing site                         | `Navbar`, marketing blocks (`Hero`, `FeatureGrid`, `Faq`, `CtaBand`), `SiteFooter`                                 | comfortable                  |

Every page opens with a `PageHeader` holding the page's only `h1` (`PageHeaderTitle`), unless a block already provides the title.

## Government chrome

Public Malaysian government sites show, top to bottom:

1. `Skiplink` to the main content (first focusable element).
2. `Masthead`: the "official Malaysian government website" banner that explains how to verify the site. It has no built-in text: compose the title, trigger and the panel of checks (see its page; the example below shows only the header).
3. `PhaseBanner` while a service is in alpha or beta, with a feedback link.
4. The site's own navigation (`Navbar` or a top bar).
5. `Footer` at the bottom, with copyright and the mandatory links. Agency sites with many links use `SiteFooter`.

`CookieBanner` appears when the site uses non-essential cookies.

## A citizen service page

```tsx
import type { ReactNode } from "react";
import {
  Masthead,
  MastheadHeader,
  MastheadTitle,
  MastheadTrigger,
} from "@/components/ui/masthead";
import { Skiplink } from "@/components/ui/skiplink";
import { PhaseBanner, PhaseBannerLink } from "@/components/ui/phase-banner";
import {
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-header";
import { Footer, FooterCopyright } from "@/components/ui/footer";

export function ServicePage({ children }: { children: ReactNode }) {
  return (
    <div className="bg-bg-gray-50 flex min-h-screen flex-col">
      <Skiplink href="#main">Skip to main content</Skiplink>
      <Masthead>
        <MastheadHeader>
          <MastheadTitle>Official Malaysia Government Website</MastheadTitle>
          <MastheadTrigger>Here's how you know</MastheadTrigger>
        </MastheadHeader>
      </Masthead>
      <PhaseBanner phase="Beta">
        This is a new service.{" "}
        <PhaseBannerLink href="/feedback">Give feedback</PhaseBannerLink> to
        help us improve it.
      </PhaseBanner>
      <main
        id="main"
        className="gap-stack-lg mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10"
      >
        <PageHeader>
          <PageHeaderContent>
            <PageHeaderTitle>Apply for a tax relief</PageHeaderTitle>
            <PageHeaderDescription>
              It takes about 10 minutes. You need your IC number and your EA
              form.
            </PageHeaderDescription>
          </PageHeaderContent>
        </PageHeader>
        {children}
      </main>
      <Footer>
        <FooterCopyright>© 2026 Ministry of Finance Malaysia</FooterCopyright>
      </Footer>
    </div>
  );
}
```

## Officer tools

`AppShell` suits tools whose navigation needs labels, groups and nesting. `DeskShell` suits staff who live in one tool all day: it is always compact, puts navigation in a 48px icon rail, adds section tabs and a ⌘K command palette, and turns any rail item or tab with a `combo` (such as `g c`) into a keyboard shortcut listed by `?`. Inside either, use `DataTable` or `WorkQueue` for lists, `SplitPane` for list and detail, `DecisionPanel` for approve or reject, and `ActivityTimeline` for a case's history.

See each component's page for its parts and props.
