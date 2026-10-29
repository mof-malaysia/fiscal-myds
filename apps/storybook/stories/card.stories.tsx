import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mof-malaysia/ftds-react/card";
import { Button } from "@mof-malaysia/ftds-react/button";

/**
 * ### Overview
 * `Card` groups related content on a Sheet (or `tone="well"`) surface: 12px corners,
 * no border, no shadow, 24px padding comfortable and 16px compact. Never nest cards.
 *
 * ### Usage
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Payment summary</CardTitle>
 *     <CardDescription>Assessment year 2025</CardDescription>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter><Button>Pay now</Button></CardFooter>
 * </Card>
 * ```
 */
const meta: Meta<typeof Card> = {
  title: "Core/Card",
  component: Card,
  parameters: { layout: "centered" },
};

export default meta;

const rows = [
  ["Income tax", "4,820.00"],
  ["Late payment penalty", "241.00"],
  ["Total due", "5,061.00"],
];

const Summary = ({ tone }: { tone?: "sheet" | "well" }) => (
  <Card tone={tone} className="w-96">
    <CardHeader>
      <CardTitle>Payment summary</CardTitle>
      <CardDescription>Assessment year 2025</CardDescription>
      <CardAction>
        <Button variant="default-ghost" size="small">
          Details
        </Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <dl className="flex flex-col gap-2">
        {rows.map(([label, amount]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-txt-black-700">{label}</dt>
            <dd className="font-medium tabular-nums">RM {amount}</dd>
          </div>
        ))}
      </dl>
    </CardContent>
    <CardFooter>
      <Button>Pay now</Button>
      <Button variant="default-outline">Download statement</Button>
    </CardFooter>
  </Card>
);

const Page = () => (
  <div className="bg-bg-gray-50 flex flex-wrap gap-6 p-6">
    <Summary />
    <Summary tone="well" />
  </div>
);
export const Default = createRender(Page);

const Compact = () => (
  <div data-density="compact" className="bg-bg-gray-50 p-6">
    <Summary />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-gray-50 flex flex-wrap gap-6 p-4">
    <Summary />
    <Summary tone="well" />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
