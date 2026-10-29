---
title: Shortcuts
description: Keyboard layer for officer tools: named commands with optional shortcuts, a ⌘K command palette, a ? cheat sheet, sequences like g c, and scoped keys such as j and k in a list.
category: Utilities
---

## When to use

- Use the shortcut hooks to give an officer screen keyboard commands: "New case" on `c`, "Approve" on `shift+a`, next and previous row on `j` and `k`.
- `DeskShell` mounts a `ShortcutProvider` for you. Mount one yourself only in another frame, such as `AppShell`, near the root of the app.
- For a searchable list you build and open yourself, use `Command` or `CommandDialog` directly. The provider's palette is built from them and lists every registered command.
- Use `Kbd` to show a combo as key caps in your own text.

## Usage

`useCommands` registers named actions for as long as the calling component is mounted. Every command appears in the ⌘K palette under its `group`; a command with a `combo` is also bound as a shortcut and listed in the `?` cheat sheet. The `run` functions can change on every render without re-registering.

```tsx
import { useState } from "react";
import { useCommands } from "@/components/ui/shortcuts";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function ApplicationActions({
  reference,
  onApprove,
  onAssign,
}: {
  reference: string;
  onApprove: () => void;
  onAssign: () => void;
}) {
  const [notesOpen, setNotesOpen] = useState(false);

  useCommands([
    {
      id: "application.approve",
      title: `Approve ${reference}`,
      group: "Application",
      combo: "shift+a",
      run: onApprove,
    },
    {
      id: "application.assign",
      title: "Assign to me",
      group: "Application",
      combo: "i",
      keywords: ["take", "claim"],
      run: onAssign,
    },
    {
      id: "application.notes",
      title: notesOpen ? "Hide notes" : "Show notes",
      group: "Application",
      run: () => setNotesOpen((open) => !open),
    },
  ]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={onApprove}>
        Approve <Kbd combo="shift+a" inverse />
      </Button>
      <Button variant="default-outline" onClick={onAssign}>
        Assign to me <Kbd combo="i" />
      </Button>
    </div>
  );
}
```

`useShortcut` binds a key that isn't a palette command, such as list navigation. Give it a `scope` and activate the scope with `useShortcutScope` so the key works only while that screen is mounted. Document such keys in the cheat sheet with the provider's `extraShortcuts`.

```tsx
import { useState } from "react";
import { useShortcut, useShortcutScope } from "@/components/ui/shortcuts";

type Case = { id: string; title: string };

export function CaseList({
  cases,
  onOpen,
}: {
  cases: Case[];
  onOpen: (item: Case) => void;
}) {
  const [index, setIndex] = useState(0);

  useShortcutScope("case-list");
  useShortcut("j", () => setIndex((i) => Math.min(cases.length - 1, i + 1)), {
    scope: "case-list",
  });
  useShortcut("k", () => setIndex((i) => Math.max(0, i - 1)), {
    scope: "case-list",
  });
  useShortcut(
    "o",
    () => {
      const item = cases[index];
      if (item) onOpen(item);
    },
    { scope: "case-list" },
  );

  return (
    <ul className="m-0 list-none p-0" aria-label="Cases">
      {cases.map((item, i) => (
        <li key={item.id}>
          <button
            type="button"
            aria-current={i === index || undefined}
            onClick={() => onOpen(item)}
            className="hover:bg-bg-washed aria-[current]:bg-bg-primary-50 focus-ring text-content flex w-full gap-3 px-3 py-2 text-left"
          >
            <span className="text-txt-black-700 tabular-nums">{item.id}</span>
            <span className="text-txt-black-900">{item.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
```

Outside `DeskShell`, mount the provider yourself and pass the cheat-sheet entries for keys bound with `useShortcut`:

```tsx
import type { ReactNode } from "react";
import {
  ShortcutProvider,
  type ShortcutGroup,
} from "@/components/ui/shortcuts";

const listKeys: ShortcutGroup[] = [
  {
    group: "Lists",
    items: [
      { combo: "j", title: "Next case" },
      { combo: "k", title: "Previous case" },
      { combo: "o", title: "Open the case" },
    ],
  },
];

export function OfficerApp({ children }: { children: ReactNode }) {
  return (
    <ShortcutProvider extraShortcuts={listKeys}>{children}</ShortcutProvider>
  );
}
```

## Combo syntax

Combos are the `Kbd` syntax: space-separated steps, each made of `+`-joined modifiers and then a key.

- `mod` is ⌘ on macOS and Ctrl elsewhere: `mod+k`, `mod+s`.
- Keys are `KeyboardEvent.key` values in lower case: `k`, `enter`, `escape`, `arrowdown`, `/`, `?`.
- Shift is part of punctuation (`?` is Shift+/), but explicit for letters and named keys: `shift+a`, `shift+enter`.
- `g c` is a sequence: press G, then C within `sequenceTimeout` (1000ms by default).

## Notes

- Built in: `mod+k` opens and closes the palette (it works inside text fields), and `?` opens the cheat sheet. Pass `palette={false}` to the provider to leave ⌘K unbound and drop the palette.
- Shortcuts stand down while focus is in a text field, a dialog, a menu or a listbox, and when Enter or Space would press the focused button or link. Pass `allowInInput: true` to a command or shortcut that must still fire there.
- A key handled by a component first (`event.preventDefault()`, such as an editor's ⌘S) is left alone.
- A binding fires as soon as its whole sequence matches, so don't register a combo that starts another (`g` and `g c`). Among conflicting bindings, the most recently pushed scope wins, then the most recent registration.
- `useShortcut` options: `enabled` to switch it off, `when` to check a condition on each press, `allowDefault` to keep the browser's default action, and `optional` to do nothing outside a provider instead of throwing.
- Give each command a stable, unique `id`; registering the same `id` again replaces the earlier command. `hidden: true` keeps a command out of the palette but still binds it and lists it in the cheat sheet.
- `useShortcutActions()` returns `openPalette` and `openCheatSheet` for buttons. `useCommandList()` returns every registered command. All hooks except `useShortcutLabels` throw outside a provider (unless `optional`).
- A nested `ShortcutProvider` renders only its children: the outer one stays in charge.
- Translate the palette and cheat sheet with `labels` (for example `{ palettePlaceholder: "Taip arahan atau cari…", cheatSheetTitle: "Pintasan papan kekunci", sequenceThen: "kemudian" }`). Command titles and groups are yours to write in the service's language.
