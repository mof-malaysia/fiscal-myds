---
title: Settings Layout
description: The frame of an account or settings area. Section links beside the content (a scrolling row on phones), with SettingsSection forms and SettingsRow controls.
---

## When to use

- Use `SettingsLayout` for an account or settings area with several sections: profile, security, notifications, linked accounts.
- Fill it with `SettingsSection`: a group of settings on the Well tone with a title, and with `onSave` a form with "Save changes" and a "Changes saved" confirmation. Use `SettingsRow` inside a section for one setting on a line, such as a `Switch`.
- Use `AuthLayout` for sign-in and password screens, `AppShell` or `DeskShell` for officer tools, and `FormStep` for a multi-step application.

## Usage

`items` are the section links; `current` is the `id` of the one shown, marked with `aria-current="page"`. Each link goes to its `href` (or `#id`). Call `event.preventDefault()` in `onNavigate` to route on the client.

```tsx
import { useState } from "react";
import {
  SettingsLayout,
  SettingsRow,
  SettingsSection,
} from "@/components/blocks/settings-layout";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function AccountSettings({
  saveProfile,
}: {
  saveProfile: (data: FormData) => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <SettingsLayout
      title="Account settings"
      description="Manage your details and how we contact you."
      items={[
        { id: "profile", label: "Profile", href: "/account/profile" },
        {
          id: "notifications",
          label: "Notifications",
          href: "/account/notifications",
        },
        { id: "security", label: "Security", href: "/account/security" },
      ]}
      current="profile"
    >
      <SettingsSection
        title="Contact details"
        description="We use these to send updates about your applications."
        pending={saving}
        saved={saved}
        error={error}
        onChange={() => setSaved(false)}
        onSave={async (data) => {
          setSaving(true);
          setError(undefined);
          try {
            await saveProfile(data);
            setSaved(true);
          } catch {
            setError("Your changes were not saved. Try again.");
          } finally {
            setSaving(false);
          }
        }}
      >
        <Field name="email">
          <FieldLabel>Email address</FieldLabel>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue="nur.aisyah@example.com"
          />
        </Field>
        <Field name="phone">
          <FieldLabel>Mobile number</FieldLabel>
          <Input
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue="012-345 6789"
          />
        </Field>
      </SettingsSection>

      <SettingsSection title="Reminders">
        <SettingsRow
          title="Deadlines"
          description="An SMS 7 days before a tax return or payment is due."
          control={<Switch defaultChecked />}
        />
        <SettingsRow
          title="Application updates"
          description="An email when the status of an application changes."
          control={<Switch defaultChecked />}
        />
      </SettingsSection>
    </SettingsLayout>
  );
}
```

Client-side routing, a row whose control is a button (`as="div"`), and a translated navigation name:

```tsx
import {
  SettingsLayout,
  SettingsRow,
  SettingsSection,
} from "@/components/blocks/settings-layout";
import { Button } from "@/components/ui/button";

export function TetapanKeselamatan({
  navigate,
  changePassword,
}: {
  navigate: (id: string) => void;
  changePassword: () => void;
}) {
  return (
    <SettingsLayout
      title="Tetapan akaun"
      items={[
        { id: "profile", label: "Profil" },
        { id: "security", label: "Keselamatan" },
      ]}
      current="security"
      onNavigate={(id, event) => {
        event.preventDefault();
        navigate(id);
      }}
      labels={{ nav: "Bahagian tetapan" }}
    >
      <SettingsSection title="Kata laluan">
        <SettingsRow
          as="div"
          title="Kata laluan"
          description="Ditukar 3 bulan lalu."
          control={
            <Button variant="default-outline" onClick={changePassword}>
              Tukar kata laluan
            </Button>
          }
        />
      </SettingsSection>
    </SettingsLayout>
  );
}
```

## Notes

- `title` is the page's `h1`; each section's `title` is an `h2` that names the section.
- `onSave` receives the section's `FormData` and the submit event (the default is already prevented), so give each control a `name`. Enter in a field submits the section.
- "Changes saved" shows while `saved` is true and not `pending`; clear it when the form changes again. `error` replaces it with a danger message. Both are in a status region, so screen readers hear them.
- `onCancel` adds a Cancel button; `footer` replaces the Save and Cancel row. `labels` on a section translates "Save changes", "Saving…", "Cancel" and "Changes saved".
- Each section with `onSave` has its own blue "Save changes" button. If a page has several, consider one form for the page instead, so it keeps one primary action.
- `SettingsRow` is a `<label>` by default, so clicking anywhere on the row toggles its `Switch` or `Checkbox`. Use `as="div"` when the control is a button, link or `Select`.
- An item's `icon` shows before the label on wide screens only, and is decorative.
- The installed file is yours: edit it when the props don't cover what you need.
