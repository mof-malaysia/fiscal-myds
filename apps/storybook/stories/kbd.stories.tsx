import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Kbd } from "@mof-malaysia/myds-react/kbd";

/**
 * ### Overview
 * Key caps for a keyboard shortcut, in the platform's own notation: `mod+k` reads
 * ⌘K on macOS and Ctrl K elsewhere. Screen readers hear the words ("Command K").
 *
 * Combos are space-separated steps of `+`-joined modifiers and a key: `mod+k`,
 * `g i` (a sequence), `?`, `shift+enter`. The same syntax binds shortcuts in
 * `useCommands` and `useShortcut`.
 *
 * ### Usage
 * ```tsx
 * <Kbd combo="mod+k" />
 * <Kbd combo="g i" />
 * ```
 */
const meta: Meta<typeof Kbd> = {
  title: "Core/Kbd",
  component: Kbd,
  args: { combo: "mod+k" },
};

export default meta;

export const Default = {};

const COMBOS = [
  "mod+k",
  "?",
  "g i",
  "shift+enter",
  "alt+arrowdown",
  "escape",
  "j",
];

export const Combos = createRender(() => (
  <dl className="text-txt-black-900 text-content grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2">
    {COMBOS.map((combo) => (
      <React.Fragment key={combo}>
        <dt className="text-txt-black-500 text-label-compact font-mono">
          {combo}
        </dt>
        <dd className="m-0">
          <Kbd combo={combo} />
        </dd>
      </React.Fragment>
    ))}
  </dl>
));

/** On dark surfaces (tooltips, primary buttons) use `inverse`. */
export const Inverse = createRender(() => (
  <div className="bg-bg-black-900 text-txt-white inline-flex items-center gap-2 rounded-sm px-3 py-2 text-xs">
    Go to cases <Kbd combo="g c" inverse />
  </div>
));
