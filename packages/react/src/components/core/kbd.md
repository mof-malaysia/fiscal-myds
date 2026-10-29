---
title: Kbd
description: Shows a keyboard shortcut as key caps in the platform's notation (mod+k reads ⌘K on macOS, Ctrl K elsewhere), and is read aloud as words.
category: Utilities
---

## When to use

- Use `Kbd` wherever you mention a keyboard shortcut: in a tooltip, a menu item, a help line, the shortcut list.
- To make the shortcut work, register it with the shortcut layer (`ShortcutProvider` and `useShortcut`). `DeskShell` and `Command` already show and bind their own shortcuts.

## Usage

Write the shortcut as a `combo`: space-separated steps, each made of `+`-joined modifiers then a key.

```tsx
import { Kbd } from "@/components/ui/kbd";

export function ShortcutHelp() {
  return (
    <ul className="gap-stack-sm text-content text-txt-black-700 flex flex-col">
      <li className="flex items-center justify-between gap-4">
        Search cases <Kbd combo="mod+k" />
      </li>
      <li className="flex items-center justify-between gap-4">
        Go to inbox <Kbd combo="g i" />
      </li>
      <li className="flex items-center justify-between gap-4">
        Approve and go to the next case <Kbd combo="shift+enter" />
      </li>
      <li className="flex items-center justify-between gap-4">
        Show all shortcuts <Kbd combo="?" />
      </li>
    </ul>
  );
}
```

| Combo         | macOS    | Windows and Linux |
| ------------- | -------- | ----------------- |
| `mod+k`       | ⌘ K      | Ctrl K            |
| `g i`         | G then I | G then I          |
| `shift+enter` | ⇧ ↵      | Shift ↵           |
| `alt+f`       | ⌥ F      | Alt F             |
| `?`           | ?        | ?                 |

On a dark or filled surface (a tooltip, a primary button) pass `inverse`. When the text next to it already says the shortcut, hide the key caps from screen readers with `aria-hidden`:

```tsx
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

export function SubmitWithShortcut() {
  return (
    <Button type="submit" aria-keyshortcuts="Control+Enter Meta+Enter">
      Submit decision
      <Kbd combo="mod+enter" inverse aria-hidden />
    </Button>
  );
}
```

## Notes

- `mod` is ⌘ on macOS and Ctrl elsewhere; use it rather than `ctrl` or `cmd` so the shortcut suits each platform. `cmd`, `ctrl`, `alt`, `shift` and `meta` are also accepted; any other modifier throws an error.
- Keys are `KeyboardEvent.key` names in lower case: `k`, `enter`, `escape`, `arrowdown`, `space`, `/`, `?`. Shift is implied for punctuation (`?` is Shift+/) but must be written for letters and named keys (`shift+a`).
- Screen readers hear the shortcut as words ("Command K", "G then I"). `thenLabel` replaces "then" in sequences, for example `thenLabel="kemudian"`.
- The platform is read once, when the module loads, and is not macOS on the server. A server-rendered `Kbd` with `mod` therefore shows the Windows form in the HTML and can cause a hydration mismatch on macOS; render it on the client only if that matters.
- The file also exports the helpers the shortcut layer uses: `parseCombo`, `eventStep`, `isModifierOnly` and `isMac`.
