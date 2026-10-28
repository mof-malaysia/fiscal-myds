import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  SettingsLayout,
  SettingsRow,
  SettingsSection,
} from "@mof-malaysia/myds-react/settings-layout";
import { Field, FieldLabel } from "@mof-malaysia/myds-react/field";
import { Input } from "@mof-malaysia/myds-react/input";
import { Switch } from "@mof-malaysia/myds-react/switch";
import { Button } from "@mof-malaysia/myds-react/button";
import {
  BellIcon,
  LockIcon,
  SettingIcon,
  UserIcon,
} from "@mof-malaysia/myds-react/icon";

/**
 * ### Overview
 * The frame of an account or settings area. On wide screens the sections are
 * listed beside the content; on narrow screens they become a row of links that
 * scrolls sideways. The current section takes the Blue Wash and `aria-current`.
 *
 * - **SettingsSection** groups related settings on a Well card. With `onSave`
 *   it becomes a form with a Save button, a pending state and a "Changes saved"
 *   confirmation announced to screen readers.
 * - **SettingsRow** puts a title and description beside a control. As a `label`
 *   (the default) the whole row toggles its Switch; use `as="div"` for buttons.
 *
 * ### Usage
 * ```tsx
 * <SettingsLayout title="Account settings" items={sections} current="profile">
 *   <SettingsSection title="Contact details" onSave={save} pending={saving} saved={saved}>
 *     <Field>…</Field>
 *   </SettingsSection>
 *   <SettingsSection title="Email and SMS">
 *     <SettingsRow title="Deadlines" description="Reminders before something is due." control={<Switch />} />
 *   </SettingsSection>
 * </SettingsLayout>
 * ```
 */
const meta: Meta<typeof SettingsLayout> = {
  title: "App/Blocks/SettingsLayout",
  component: SettingsLayout,
};

export default meta;

const ITEMS = [
  { id: "profile", label: "Profile", href: "#profile", icon: <UserIcon /> },
  {
    id: "security",
    label: "Sign-in and security",
    href: "#security",
    icon: <LockIcon />,
  },
  {
    id: "preferences",
    label: "Preferences",
    href: "#preferences",
    icon: <SettingIcon />,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "#notifications",
    icon: <BellIcon />,
  },
];

const Demo = () => {
  const [current, setCurrent] = React.useState("profile");
  const [state, setState] = React.useState<"idle" | "pending" | "saved">(
    "idle",
  );
  return (
    <SettingsLayout
      title="Account settings"
      description="Manage your details, how you sign in and how we contact you."
      items={ITEMS}
      current={current}
      onNavigate={(id, event) => {
        event.preventDefault();
        setCurrent(id);
      }}
    >
      <SettingsSection
        title="Contact details"
        description="We use these to send receipts and reminders."
        onSave={() => {
          setState("pending");
          setTimeout(() => setState("saved"), 700);
        }}
        onCancel={() => setState("idle")}
        onChange={() => setState("idle")}
        pending={state === "pending"}
        saved={state === "saved"}
      >
        <Field name="email">
          <FieldLabel>Email address</FieldLabel>
          <Input type="email" defaultValue="aisyah.abdullah@gmail.com" />
        </Field>
        <Field name="phone">
          <FieldLabel>Mobile number</FieldLabel>
          <Input type="tel" defaultValue="012-345 6789" />
        </Field>
      </SettingsSection>
      <SettingsSection
        title="Email and SMS"
        description="Changes take effect straight away."
      >
        <SettingsRow
          title="Deadlines"
          description="Reminders 7 days and 1 day before something is due."
          control={<Switch defaultChecked />}
        />
        <SettingsRow
          title="Payments"
          description="When a payment goes through or fails."
          control={<Switch defaultChecked />}
        />
        <SettingsRow
          title="News and new services"
          description="At most once a month."
          control={<Switch />}
        />
      </SettingsSection>
    </SettingsLayout>
  );
};

export const Default = createRender(() => <Demo />);

/** Saving failed: the message replaces the confirmation. */
export const SaveError = createRender(() => (
  <SettingsLayout items={ITEMS} current="profile" title="Account settings">
    <SettingsSection
      title="Contact details"
      onSave={() => {}}
      error="We couldn't save your changes. Try again."
    >
      <Field name="email">
        <FieldLabel>Email address</FieldLabel>
        <Input type="email" defaultValue="aisyah.abdullah@gmail.com" />
      </Field>
    </SettingsSection>
  </SettingsLayout>
));

/** A row whose control is a button uses `as="div"`. */
export const RowWithButton = createRender(() => (
  <div className="max-w-2xl">
    <SettingsSection title="Signed-in devices">
      <SettingsRow
        as="div"
        title="Safari on macOS"
        description="Putrajaya · 21 October 2026"
        control={
          <Button variant="default-ghost" size="small">
            Sign out
          </Button>
        }
      />
      <SettingsRow
        as="div"
        title="MyBayar app on iPhone"
        description="Kuala Lumpur · Yesterday at 9:12 pm"
        control={
          <Button variant="default-ghost" size="small">
            Sign out
          </Button>
        }
      />
    </SettingsSection>
  </div>
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Demo />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Demo />
    </div>
  ),
  "dark",
);
