---
title: Command
description: A searchable list of actions and destinations: type to filter, arrows to move, Enter to run. Shown inline or in a dialog as a "jump to anything" palette (built on cmdk).
category: Navigation
---

## When to use

- Use `CommandDialog` for a palette you open yourself, for example from a search button or your own ⌘K listener.
- In `DeskShell`, or under a `ShortcutProvider`, a ⌘K palette already exists: register entries with `useCommands` instead of building a second palette.
- Use `Command` inline (not in a dialog) for a searchable list that stays on the page.
- Use `Combobox` or `Autocomplete` to pick a value for a form field, and `Menu` for a short list of actions behind a button.

## Usage

```tsx
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { FolderIcon } from "@/components/ui/icons/folder";
import { HomeIcon } from "@/components/ui/icons/home";
import { MoneyIcon } from "@/components/ui/icons/money";

export function JumpToPalette({ go }: { go: (href: string) => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const run = (href: string) => {
    setOpen(false);
    go(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search cases, pages and actions" />
      <CommandList>
        <CommandEmpty>
          Nothing matches. Try a case reference or a page name.
        </CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => run("/")}>
            <HomeIcon />
            Overview
          </CommandItem>
          <CommandItem onSelect={() => run("/queue")}>
            <FolderIcon />
            Case queue
          </CommandItem>
          <CommandItem
            keywords={["refund", "bayaran"]}
            onSelect={() => run("/payments")}
          >
            <MoneyIcon />
            Payments
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent cases">
          <CommandItem onSelect={() => run("/cases/MOF-2026-0412")}>
            MOF-2026-0412: Lifestyle relief
            <CommandShortcut>Opened today</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

Inline, with results loaded from a server. Turn off the built-in filter with `shouldFilter={false}` when the server already filters:

```tsx
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";

type Taxpayer = { tin: string; name: string };

export function TaxpayerSearch({
  results,
  loading,
  onSearch,
  onOpen,
}: {
  results: Taxpayer[];
  loading: boolean;
  onSearch: (query: string) => void;
  onOpen: (tin: string) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <Command shouldFilter={false} label="Search taxpayers">
      <CommandInput
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          onSearch(value);
        }}
        placeholder="Name or tax identification number"
      />
      <CommandList>
        {loading && <CommandLoading>Searching…</CommandLoading>}
        <CommandEmpty>No taxpayers match. Check the number.</CommandEmpty>
        <CommandGroup heading="Taxpayers">
          {results.map((taxpayer) => (
            <CommandItem
              key={taxpayer.tin}
              value={taxpayer.tin}
              onSelect={() => onOpen(taxpayer.tin)}
            >
              {taxpayer.name}
              <span className="text-txt-black-500 ml-auto tabular-nums">
                {taxpayer.tin}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
```

## Notes

- `CommandDialog` does not bind a shortcut. Listen for the keys yourself and set `open`, or use the shortcut layer, which does it for you.
- `CommandItem` runs `onSelect` on click or Enter. Close the dialog yourself in `onSelect` before navigating.
- Items are matched on their text, or on `value` when set; `keywords` adds extra search terms. Give items with the same text different `value`s.
- Arrow keys wrap from the last item to the first inside `CommandDialog` (it sets `loop`). On `Command`, set `loop` yourself.
- `CommandEmpty` shows only when nothing matches. Say what to try next, not just "No results".
- `CommandSeparator` hides while the user is searching; pass `alwaysRender` to keep it.
- `CommandShortcut` is a hint at the end of an item. It is decorative: the shortcut must work on its own.
- `CommandDialog` has a visually hidden title and description for screen readers; translate them with `title` (default "Command palette") and `description` (default "Search for a page or an action"). Pass `Command` props such as `filter` or `label` through `commandProps`.
