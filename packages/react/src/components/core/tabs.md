---
title: Tabs
description: Switches between views of the same subject on one page, such as a case's details, documents and history. One underline style, with optional icons and counts.
category: Navigation
---

## When to use

- Use `Tabs` to split related content about one thing into views people switch between: Details, Documents, History on a case page.
- Use `Stepper` or `FormStep` for steps the user goes through in order, and `ToggleGroup` for a small set of options that change how one view looks.
- Use `Navbar`, `Sidebar` or links for moving between pages. Tabs switch panels on the same page.
- Don't hide content people need to compare side by side in different tabs.

## Usage

Each `TabsTrigger` and `TabsContent` pair shares a `value`:

```tsx
import {
  Tabs,
  TabsContent,
  TabsCounter,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function CaseTabs({ documents }: { documents: number }) {
  return (
    <Tabs defaultValue="details">
      <TabsList width="full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="documents">
          Documents <TabsCounter>{documents}</TabsCounter>
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        Applicant, IC number 900101-14-5678, and the relief claimed.
      </TabsContent>
      <TabsContent value="documents">
        EA form, receipts and supporting letters.
      </TabsContent>
      <TabsContent value="history">
        Every action taken on this case.
      </TabsContent>
    </Tabs>
  );
}
```

Controlled with `value` and `onValueChange`, with icons and manual activation (arrow keys move focus; Enter or Space opens the tab):

```tsx
import { useState } from "react";
import { DocumentIcon } from "@/components/ui/icons/document";
import { MoneyIcon } from "@/components/ui/icons/money";
import {
  Tabs,
  TabsContent,
  TabsIcon,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function AccountTabs() {
  const [tab, setTab] = useState("statements");

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      size="medium"
      activationMode="manual"
    >
      <TabsList>
        <TabsTrigger value="statements">
          <TabsIcon>
            <DocumentIcon />
          </TabsIcon>
          Statements
        </TabsTrigger>
        <TabsTrigger value="payments">
          <TabsIcon>
            <MoneyIcon />
          </TabsIcon>
          Payments
        </TabsTrigger>
      </TabsList>
      <TabsContent value="statements">
        Your statements for the last 12 months.
      </TabsContent>
      <TabsContent value="payments">
        Payments you made to LHDN in 2026.
      </TabsContent>
    </Tabs>
  );
}
```

## Notes

- There is one tab style: a hairline under the list, with a 2px blue underline under the active tab. Don't restyle tabs as pills or boxes.
- `size` is `small` (default) or `medium`; tab height follows the density, so don't set heights yourself.
- `TabsList` `width` is `fit` (default, the hairline stops at the last tab) or `full` (it runs across the container). The list scrolls sideways when the tabs don't fit.
- `activationMode="automatic"` (default) opens a tab as soon as it gets keyboard focus. Use `manual` when opening a tab is slow, for example when it loads data.
- `TabsCounter` shows a count beside the label in tabular figures. Keep the label meaningful without it.
- `TabsIcon` sizes one icon to the tab and hides it from screen readers; the label must still say what the tab is.
- Tab labels are short nouns ("Documents"), not sentences.
