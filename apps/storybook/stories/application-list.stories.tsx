import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  ApplicationList,
  type ApplicationListItem,
} from "@mof-malaysia/myds-react/application-list";
import { Button } from "@mof-malaysia/myds-react/button";

/**
 * ### Overview
 * A citizen's applications on their dashboard: what each one is, its reference
 * and date, where it stands in plain words, and the one thing they can do next.
 * "Action needed" gets the primary button, drafts a tonal one, the rest a quiet
 * "View". Each action's hidden text names its application.
 *
 * With no items it shows an empty state; pass `emptyAction` to offer a way in.
 *
 * ### Usage
 * ```tsx
 * <ApplicationList
 *   items={[{ id: "1", title: "Individual tax relief", reference: "KK-2026-0412",
 *     date: submittedAt, status: "action-needed", href: "/applications/KK-2026-0412" }]}
 *   emptyAction={<Button>Start an application</Button>}
 * />
 * ```
 */
const meta: Meta<typeof ApplicationList> = {
  title: "App/Blocks/ApplicationList",
  component: ApplicationList,
  parameters: { layout: "padded" },
};

export default meta;

const ITEMS: ApplicationListItem[] = [
  {
    id: "1",
    title: "Individual tax relief",
    reference: "KK-2026-0412",
    date: new Date("2026-10-12"),
    status: "action-needed",
    href: "#",
  },
  {
    id: "2",
    title: "SME digitalisation grant",
    date: new Date("2026-10-20"),
    status: "draft",
    href: "#",
  },
  {
    id: "3",
    title: "Money lending licence renewal",
    reference: "LL-2026-1187",
    date: new Date("2026-09-30"),
    status: "in-review",
    href: "#",
  },
  {
    id: "4",
    title: "Duty exemption: imported equipment",
    reference: "DE-2026-0551",
    date: new Date("2026-09-18"),
    status: "submitted",
    href: "#",
  },
  {
    id: "5",
    title: "Stamp duty exemption",
    reference: "SD-2026-0093",
    date: new Date("2026-08-02"),
    status: "approved",
    href: "#",
  },
  {
    id: "6",
    title: "Hardship assistance",
    reference: "HA-2026-0017",
    date: new Date("2026-06-11"),
    status: "rejected",
    statusText: "Your household income is above the limit",
    href: "#",
  },
];

/** Every status. */
export const Default = createRender(() => (
  <div className="max-w-3xl">
    <ApplicationList items={ITEMS} />
  </div>
));

export const Empty = createRender(() => (
  <div className="max-w-3xl">
    <ApplicationList
      items={[]}
      emptyAction={<Button size="medium">Start an application</Button>}
    />
  </div>
));

/** Bahasa Melayu labels, including the status text. */
export const Malay = createRender(() => (
  <div className="max-w-3xl">
    <ApplicationList
      items={ITEMS.slice(0, 3)}
      locale="ms-MY"
      labels={{
        title: "Permohonan anda",
        reference: "Rujukan",
        started: "Dimulakan",
        submitted: "Dihantar",
        status: {
          draft: {
            label: "Draf",
            description: "Belum dihantar",
            action: "Teruskan",
          },
          "in-review": {
            label: "Dalam semakan",
            description: "Pegawai sedang menyemak",
            action: "Lihat",
          },
          "action-needed": {
            label: "Tindakan diperlukan",
            description: "Kami perlukan maklumat lanjut daripada anda",
            action: "Balas",
          },
        },
      }}
    />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-6">
      <div className="max-w-3xl">
        <ApplicationList items={ITEMS} />
      </div>
    </div>
  ),
  "dark",
);
