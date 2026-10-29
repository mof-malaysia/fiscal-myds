import React from "react";
import {
  SettingsLayout,
  SettingsRow,
  SettingsSection,
} from "@mof-malaysia/ftds-react/settings-layout";
import {
  NotificationList,
  type NotificationItem,
} from "@mof-malaysia/ftds-react/notification-list";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";
import { Input } from "@mof-malaysia/ftds-react/input";
import { PasswordInput } from "@mof-malaysia/ftds-react/password-input";
import { Switch } from "@mof-malaysia/ftds-react/switch";
import {
  Radio,
  RadioButton,
  RadioItem,
  RadioLabel,
} from "@mof-malaysia/ftds-react/radio";
import { ToggleGroup } from "@mof-malaysia/ftds-react/toggle-group";
import { Toggle } from "@mof-malaysia/ftds-react/toggle";
import { Button } from "@mof-malaysia/ftds-react/button";
import { Tag } from "@mof-malaysia/ftds-react/tag";
import { DesktopIcon, MobileIcon } from "@mof-malaysia/ftds-react/icon";
import { AccountChrome } from "./account-chrome";
import { NOTIFICATIONS, NOW, SETTINGS_NAV } from "./account-data";

/** Simulates a save: pending for a moment, then "Changes saved". */
const useFakeSave = () => {
  const [state, setState] = React.useState<"idle" | "pending" | "saved">(
    "idle",
  );
  return {
    pending: state === "pending",
    saved: state === "saved",
    save: () => {
      setState("pending");
      setTimeout(() => setState("saved"), 700);
    },
    reset: () => setState("idle"),
  };
};

const Settings = ({
  current,
  children,
}: {
  current: string;
  children: React.ReactNode;
}) => (
  <AccountChrome unread={3}>
    <SettingsLayout
      title="Account settings"
      description="Manage your details, how you sign in and how we contact you."
      items={SETTINGS_NAV}
      current={current}
      onNavigate={(_, event) => event.preventDefault()}
    >
      {children}
    </SettingsLayout>
  </AccountChrome>
);

export const ProfilePage = () => {
  const details = useFakeSave();
  const contact = useFakeSave();
  return (
    <Settings current="profile">
      <SettingsSection
        title="Personal details"
        description="These come from your MyDigital ID. To change your name or IC number, update them at a JPN counter."
      >
        <dl className="m-0 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {[
            ["Full name", "Nur Aisyah binti Abdullah"],
            ["IC number", "900101-14-5678"],
            ["Date of birth", "1 January 1990"],
            ["Nationality", "Malaysian"],
          ].map(([term, value]) => (
            <div key={term}>
              <dt className="text-label-compact text-txt-black-700 font-medium">
                {term}
              </dt>
              <dd className="text-content text-txt-black-900 m-0 mt-0.5">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </SettingsSection>

      <SettingsSection
        title="Contact details"
        description="We use these to send receipts, reminders and updates about your applications."
        onSave={details.save}
        pending={details.pending}
        saved={details.saved}
        onChange={details.reset}
      >
        <Field name="email">
          <FieldLabel>Email address</FieldLabel>
          <Input
            type="email"
            autoComplete="email"
            defaultValue="aisyah.abdullah@gmail.com"
          />
        </Field>
        <Field name="phone">
          <FieldLabel>Mobile number</FieldLabel>
          <FieldDescription>For example, 012-345 6789</FieldDescription>
          <Input type="tel" autoComplete="tel" defaultValue="012-345 6789" />
        </Field>
      </SettingsSection>

      <SettingsSection
        title="Mailing address"
        description="Where we post letters and documents you ask for."
        onSave={contact.save}
        onCancel={contact.reset}
        pending={contact.pending}
        saved={contact.saved}
        onChange={contact.reset}
      >
        <Field name="line1">
          <FieldLabel>Address line 1</FieldLabel>
          <Input
            autoComplete="address-line1"
            defaultValue="No. 12, Jalan Setia 3/5"
          />
        </Field>
        <Field name="line2">
          <FieldLabel>Address line 2 (optional)</FieldLabel>
          <Input autoComplete="address-line2" defaultValue="Taman Setia" />
        </Field>
        <div className="gap-stack-md grid sm:grid-cols-2">
          <Field name="postcode">
            <FieldLabel>Postcode</FieldLabel>
            <Input
              autoComplete="postal-code"
              inputMode="numeric"
              defaultValue="40170"
            />
          </Field>
          <Field name="city">
            <FieldLabel>Town or city</FieldLabel>
            <Input autoComplete="address-level2" defaultValue="Shah Alam" />
          </Field>
        </div>
      </SettingsSection>
    </Settings>
  );
};

const DEVICES = [
  {
    id: "d1",
    icon: <DesktopIcon />,
    name: "Chrome on Windows",
    where: "Shah Alam, Selangor",
    when: "Active now",
    current: true,
  },
  {
    id: "d2",
    icon: <MobileIcon />,
    name: "MyFiscal app on iPhone",
    where: "Kuala Lumpur",
    when: "Yesterday at 9:12 pm",
  },
  {
    id: "d3",
    icon: <DesktopIcon />,
    name: "Safari on macOS",
    where: "Putrajaya",
    when: "21 October 2026",
  },
];

export const SecurityPage = () => {
  const password = useFakeSave();
  const [devices, setDevices] = React.useState(DEVICES);
  const [twoStep, setTwoStep] = React.useState(true);
  return (
    <Settings current="security">
      <SettingsSection
        title="Change password"
        description="Use at least 12 characters. A short phrase is easier to remember than a jumble."
        onSave={password.save}
        pending={password.pending}
        saved={password.saved}
        onChange={password.reset}
        labels={{ save: "Change password", saved: "Password changed" }}
      >
        <Field name="current">
          <FieldLabel>Current password</FieldLabel>
          <PasswordInput autoComplete="current-password" />
        </Field>
        <Field name="new">
          <FieldLabel>New password</FieldLabel>
          <PasswordInput autoComplete="new-password" />
        </Field>
      </SettingsSection>

      <SettingsSection
        title="Two-step verification"
        description="We send a code to your phone when you sign in on a new device."
      >
        <SettingsRow
          title="Ask for a code on new devices"
          description="Sent to 012-••• 6789"
          control={<Switch checked={twoStep} onCheckedChange={setTwoStep} />}
        />
      </SettingsSection>

      <SettingsSection
        title="Where you're signed in"
        description="If you don't recognise a device, sign it out and change your password."
      >
        <div role="list">
          {devices.map((device) => (
            <SettingsRow
              key={device.id}
              role="listitem"
              as="div"
              title={
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="text-txt-black-700 [&>svg]:size-5"
                  >
                    {device.icon}
                  </span>
                  {device.name}
                  {device.current && (
                    <Tag size="small" variant="success">
                      This device
                    </Tag>
                  )}
                </span>
              }
              description={`${device.where} · ${device.when}`}
              control={
                !device.current && (
                  <Button
                    variant="default-ghost"
                    size="small"
                    onClick={() =>
                      setDevices((all) => all.filter((d) => d.id !== device.id))
                    }
                  >
                    Sign out
                  </Button>
                )
              }
            />
          ))}
        </div>
      </SettingsSection>
    </Settings>
  );
};

export const PreferencesPage = () => {
  const [language, setLanguage] = React.useState("ms");
  const [theme, setTheme] = React.useState("system");
  const [prefs, setPrefs] = React.useState({
    deadlines: true,
    payments: true,
    applications: true,
    news: false,
  });
  const toggle = (key: keyof typeof prefs) => (checked: boolean) =>
    setPrefs((all) => ({ ...all, [key]: checked }));

  return (
    <Settings current="preferences">
      <SettingsSection
        title="Language"
        description="The language we use on screen and in emails and SMS."
      >
        <Radio
          value={language}
          onValueChange={(value) => setLanguage(value as string)}
          aria-label="Language"
        >
          <RadioItem>
            <RadioButton value="ms" id="lang-ms" />
            <RadioLabel htmlFor="lang-ms">Bahasa Melayu</RadioLabel>
          </RadioItem>
          <RadioItem>
            <RadioButton value="en" id="lang-en" />
            <RadioLabel htmlFor="lang-en">English</RadioLabel>
          </RadioItem>
        </Radio>
      </SettingsSection>

      <SettingsSection
        title="Appearance"
        description="Dark mode can be easier on the eyes in low light."
      >
        <SettingsRow
          as="div"
          title="Theme"
          description="System follows your device setting."
          control={
            <ToggleGroup
              aria-label="Theme"
              value={[theme]}
              onValueChange={(value) => value[0] && setTheme(value[0])}
            >
              <Toggle value="light">Light</Toggle>
              <Toggle value="dark">Dark</Toggle>
              <Toggle value="system">System</Toggle>
            </ToggleGroup>
          }
        />
      </SettingsSection>

      <SettingsSection
        title="Email and SMS"
        description="Changes take effect straight away. We always send messages the law requires, such as payment receipts."
      >
        <SettingsRow
          title="Deadlines"
          description="Reminders 7 days and 1 day before something is due."
          control={
            <Switch
              checked={prefs.deadlines}
              onCheckedChange={toggle("deadlines")}
            />
          }
        />
        <SettingsRow
          title="Payments"
          description="When a payment goes through or fails."
          control={
            <Switch
              checked={prefs.payments}
              onCheckedChange={toggle("payments")}
            />
          }
        />
        <SettingsRow
          title="Application updates"
          description="When we need something from you, or make a decision."
          control={
            <Switch
              checked={prefs.applications}
              onCheckedChange={toggle("applications")}
            />
          }
        />
        <SettingsRow
          title="News and new services"
          description="At most once a month."
          control={
            <Switch checked={prefs.news} onCheckedChange={toggle("news")} />
          }
        />
      </SettingsSection>
    </Settings>
  );
};

export const NotificationsPage = () => {
  const [items, setItems] = React.useState<NotificationItem[]>(NOTIFICATIONS);
  const markRead = (id: string) =>
    setItems((all) => all.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const unread = items.filter((n) => !n.read).length;
  return (
    <AccountChrome unread={unread}>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-headline text-txt-black-900 mb-stack-lg font-semibold">
          Notifications
        </h1>
        <NotificationList
          now={NOW}
          items={items}
          onSelect={markRead}
          onMarkRead={markRead}
          onMarkAllRead={() =>
            setItems((all) => all.map((n) => ({ ...n, read: true })))
          }
        />
      </div>
    </AccountChrome>
  );
};
