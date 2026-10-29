import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { FeatureGrid } from "@mof-malaysia/myds-react/feature-grid";
import {
  BellIcon,
  ChatBubbleIcon,
  CheckShieldIcon,
  DocumentIcon,
  MobileIcon,
  MoneyIcon,
} from "@mof-malaysia/myds-react/icon";

/**
 * ### Overview
 * A section title and intro over a 1 / 2 / 3-column grid of features. Each
 * feature has an icon in a primary-wash circle, a title, text and an optional
 * link. Set `surface="sheet"` to put each feature on a Sheet panel.
 *
 * ### Usage
 * ```tsx
 * <FeatureGrid
 *   title="Everything in one account"
 *   features={[{ icon: <MoneyIcon />, title: "Pay online", description: "…", href: "/pay" }]}
 * />
 * ```
 */
const meta: Meta<typeof FeatureGrid> = {
  title: "Marketing/Blocks/FeatureGrid",
  component: FeatureGrid,
  parameters: { layout: "fullscreen" },
};

export default meta;

const features = [
  {
    icon: <MoneyIcon />,
    title: "Pay online",
    description:
      "FPX, debit and credit cards, and e-wallets. No queue, no cheque.",
    href: "#",
  },
  {
    icon: <DocumentIcon />,
    title: "Official receipts",
    description:
      "Every payment gets a receipt you can download, print or share.",
    href: "#",
  },
  {
    icon: <BellIcon />,
    title: "Due-date reminders",
    description: "We remind you before a payment is due, by email or SMS.",
  },
  {
    icon: <CheckShieldIcon />,
    title: "Secure by default",
    description: "Sign in with MyDigital ID. Your data stays in Malaysia.",
  },
  {
    icon: <MobileIcon />,
    title: "Works on your phone",
    description: "Designed for small screens first, with large, readable text.",
  },
  {
    icon: <ChatBubbleIcon />,
    title: "Help when you need it",
    description:
      "Guidance in BM and English, and a person to talk to if you are stuck.",
    href: "#",
  },
];

const Three = () => (
  <FeatureGrid
    title="Everything in one account"
    description="One MyDigital ID for every Ministry of Finance service, from paying a bill to tracking a claim."
    features={features}
  />
);
export const Default = createRender(Three);

export const TwoColumnsOnSheets = createRender(() => (
  <FeatureGrid
    title="Why use the online service"
    columns={2}
    surface="sheet"
    features={features.slice(0, 4)}
  />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Three />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <FeatureGrid
        title="Everything in one account"
        surface="sheet"
        features={features}
      />
    </div>
  ),
  "dark",
);
