---
title: Cookie Banner
description: A panel in the bottom-right corner that asks for consent to non-essential cookies, with an optional preferences view. Show it until the user makes a choice.
category: Government chrome
---

## When to use

- Show a `CookieBanner` when the site sets cookies that aren't strictly necessary, such as analytics. If the site only uses essential cookies, you don't need one; explain them on the cookies page instead.
- Use `Callout` or `AnnounceBar` for other site-wide messages.

## Usage

The banner doesn't remember anything: control `open` yourself, save the user's choice, and keep it closed once a choice exists. `CookieBannerAction` holds buttons for the first view; `CookieBannerAction preferences` holds the buttons shown while the preferences are open. `CookieBannerPreferencesTrigger` switches between the two views, and each choice is a `CookieBannerClose`:

```tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CookieBanner,
  CookieBannerAction,
  CookieBannerClose,
  CookieBannerDescription,
  CookieBannerPreferences,
  CookieBannerPreferencesTrigger,
  CookieBannerTitle,
} from "@/components/ui/cookie-banner";
import {
  Field,
  FieldDescription,
  FieldItem,
  FieldLabel,
} from "@/components/ui/field";

const STORAGE_KEY = "cookie-consent";

type Consent = { analytics: boolean };

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === null) setOpen(true);
  }, []);

  function save(consent: Consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  }

  return (
    <CookieBanner open={open} onOpenChange={setOpen}>
      <CookieBannerTitle>Cookies on MyTax</CookieBannerTitle>
      <CookieBannerDescription>
        We use essential cookies to make this service work. We would also like
        to use analytics cookies to understand how you use it.
      </CookieBannerDescription>

      <CookieBannerPreferences render={<div />}>
        <Field name="necessary" disabled>
          <FieldItem>
            <Checkbox checked />
            <FieldLabel>Essential cookies</FieldLabel>
          </FieldItem>
          <FieldDescription>
            Keep you signed in and remember your cookie choice. Always on.
          </FieldDescription>
        </Field>
        <Field name="analytics">
          <FieldItem>
            <Checkbox
              checked={analytics}
              onCheckedChange={(checked) => setAnalytics(checked === true)}
            />
            <FieldLabel>Analytics cookies</FieldLabel>
          </FieldItem>
          <FieldDescription>
            Count visits and see which pages are used, without identifying you.
          </FieldDescription>
        </Field>
      </CookieBannerPreferences>

      <CookieBannerAction>
        <CookieBannerClose
          render={<Button variant="default-outline" size="medium" />}
          onClick={() => save({ analytics: true })}
        >
          Accept analytics cookies
        </CookieBannerClose>
        <CookieBannerClose
          render={<Button variant="default-outline" size="medium" />}
          onClick={() => save({ analytics: false })}
        >
          Reject analytics cookies
        </CookieBannerClose>
        <CookieBannerPreferencesTrigger variant="default-ghost">
          Choose cookies
        </CookieBannerPreferencesTrigger>
      </CookieBannerAction>

      <CookieBannerAction preferences>
        <CookieBannerClose
          render={<Button variant="primary-fill" size="medium" />}
          onClick={() => save({ analytics })}
        >
          Save cookie settings
        </CookieBannerClose>
        <CookieBannerPreferencesTrigger variant="default-ghost">
          Back
        </CookieBannerPreferencesTrigger>
      </CookieBannerAction>
    </CookieBanner>
  );
}
```

## Notes

- Make accepting and rejecting equally easy: same style, same size, side by side. Don't pre-tick optional cookies.
- Load analytics scripts only after the user accepts, and read the saved choice on later visits before loading them.
- The banner is a Base UI dialog without a scrim. It opens as a modal (focus moves into it), and Esc, a click outside and the built-in close button all close it without a choice. Treat that as "no consent yet" and keep the optional cookies off.
- The built-in close button is an icon with no text label. Your choice buttons are the main way out, so keep them clearly labelled.
- `CookieBannerPreferences` renders only while the preferences view is open. It renders a `<p>` by default, so pass `render={<div />}` when it holds fields.
- `CookieBannerPreferencesTrigger` toggles the view; it is a `Button` (default `primary-outline`, `medium`) and takes `Button` props.
- Every piece of text is yours to pass, so the banner translates with the page. Link to the site's cookies page from the description when there is one.
