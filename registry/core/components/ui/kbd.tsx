import React, { ComponentProps, Fragment, forwardRef, useMemo } from "react";
import { clx } from "@/lib/ftds/utils";

/**
 * Kbd shows a keyboard shortcut as key caps, in the platform's own notation:
 * `mod+k` reads ⌘K on macOS and Ctrl K elsewhere.
 *
 * It also owns the combo syntax the shortcut layer (`shortcuts`) binds:
 * one or more space-separated steps, each `+`-joined modifiers then a key.
 * - `mod` is ⌘ on macOS and Ctrl elsewhere.
 * - Keys are `KeyboardEvent.key` values, lower-cased: `k`, `enter`, `arrowdown`, `escape`, `?`, `/`.
 * - Shift is implied by the character for punctuation (`?` is Shift+/); for letters
 *   and named keys it is explicit (`shift+a`, `shift+enter`).
 *
 * @example
 * <Kbd combo="mod+k" />
 * <Kbd combo="g i" />
 */

interface KeyLike {
  key: string;
  code: string;
  metaKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

const MODIFIERS = ["alt", "ctrl", "meta", "shift"] as const;
type Modifier = (typeof MODIFIERS)[number];

/** Canonical step: sorted modifiers then the key, e.g. "meta+shift+k". */
type ComboStep = string;

/** Whether shortcuts use ⌘ (macOS, iOS) rather than Ctrl. False during SSR. */
const isMac: boolean = (() => {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform =
    nav.userAgentData?.platform || nav.platform || nav.userAgent || "";
  return /mac|iphone|ipad/i.test(platform);
})();

const isLetter = (key: string) => /^[a-z]$/.test(key);
const isPunctuation = (key: string) =>
  key.length === 1 && !/[a-z0-9 ]/.test(key);

function canonical(mods: Set<Modifier>, key: string): ComboStep {
  // Shift is part of the character for punctuation ("?" is Shift+/)
  if (isPunctuation(key)) mods.delete("shift");
  return [...MODIFIERS.filter((m) => mods.has(m)), key].join("+");
}

/** Parses a combo into canonical steps for this platform. */
function parseCombo(combo: string): ComboStep[] {
  return combo
    .trim()
    .split(/\s+/)
    .map((step) => {
      // "+" alone (or as the last part, "shift++") is the plus key
      const parts = step === "+" ? ["+"] : step.toLowerCase().split(/\+(?!$)/);
      const key = parts.pop()!;
      const mods = new Set<Modifier>();
      for (const part of parts) {
        if (part === "mod") mods.add(isMac ? "meta" : "ctrl");
        else if (part === "cmd") mods.add("meta");
        else if ((MODIFIERS as readonly string[]).includes(part)) {
          mods.add(part as Modifier);
        } else {
          throw new Error(`Unknown modifier "${part}" in combo "${combo}"`);
        }
      }
      return canonical(mods, key === "space" ? " " : key);
    });
}

/** The canonical step a keyboard event represents. */
function eventStep(event: KeyLike): ComboStep {
  let key = event.key.toLowerCase();
  // With Alt held, macOS reports the composed character (⌥F → "ƒ"); fall back
  // to the physical key so "alt+f" still matches
  if (event.altKey) {
    const physical = /^Key([A-Z])$|^Digit([0-9])$/.exec(event.code);
    if (physical) key = (physical[1] ?? physical[2]!).toLowerCase();
  }
  const mods = new Set<Modifier>();
  if (event.altKey) mods.add("alt");
  if (event.ctrlKey) mods.add("ctrl");
  if (event.metaKey) mods.add("meta");
  if (event.shiftKey) mods.add("shift");
  return canonical(mods, key);
}

/** Bare modifier presses never form a step on their own. */
function isModifierOnly(event: KeyLike): boolean {
  return ["Shift", "Control", "Alt", "Meta"].includes(event.key);
}

const MAC_SYMBOLS: Record<string, string> = {
  meta: "⌘",
  ctrl: "⌃",
  alt: "⌥",
  shift: "⇧",
};
const PC_LABELS: Record<string, string> = {
  meta: "Win",
  ctrl: "Ctrl",
  alt: "Alt",
  shift: "Shift",
};
const KEY_LABELS: Record<string, string> = {
  enter: "↵",
  escape: "Esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  backspace: "⌫",
  delete: "Del",
  tab: "Tab",
  " ": "Space",
  home: "Home",
  end: "End",
  pageup: "PgUp",
  pagedown: "PgDn",
};

/** Key caps for display: one array of labels per step. */
function comboLabels(combo: string): string[][] {
  return parseCombo(combo).map((step) => {
    const parts = step === "+" ? ["+"] : step.split(/\+(?!$)/);
    const key = parts.pop()!;
    const labels = parts.map((m) => (isMac ? MAC_SYMBOLS : PC_LABELS)[m]!);
    labels.push(KEY_LABELS[key] ?? (isLetter(key) ? key.toUpperCase() : key));
    return labels;
  });
}

const SPOKEN: Record<string, string> = {
  "⌘": "Command",
  "⌃": "Control",
  "⌥": "Option",
  "⇧": "Shift",
  "↵": "Enter",
  "↑": "Up",
  "↓": "Down",
  "←": "Left",
  "→": "Right",
  "⌫": "Backspace",
  Esc: "Escape",
  Ctrl: "Control",
};

/** Spoken form of `comboLabels` for screen readers: "Command K", "G then I". */
function spokenLabel(steps: string[][], then: string): string {
  return steps
    .map((labels) => labels.map((label) => SPOKEN[label] ?? label).join(" "))
    .join(` ${then} `);
}

/*========================================================================================================================*/

interface KbdProps extends Omit<ComponentProps<"span">, "children"> {
  /** The shortcut, e.g. `mod+k`, `g i`, `?`, `shift+enter`. */
  combo: string;
  /** Word between the steps of a sequence ("G then I"). */
  thenLabel?: string;
  /** Key caps on a dark surface (tooltips, primary buttons). */
  inverse?: boolean;
}

/** Key caps for a combo. Read as words by screen readers ("Command K"). */
const Kbd = forwardRef<HTMLSpanElement, KbdProps>(
  (
    { combo, thenLabel = "then", inverse = false, className, ...props },
    ref,
  ) => {
    const steps = useMemo(() => comboLabels(combo), [combo]);
    return (
      <span
        ref={ref}
        role="img"
        aria-label={spokenLabel(steps, thenLabel)}
        className={clx(
          "font-body inline-flex shrink-0 items-center gap-1 whitespace-nowrap",
          className,
        )}
        {...props}
      >
        {steps.map((labels, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span
                aria-hidden
                className={clx(
                  "text-label-compact font-normal",
                  inverse ? "text-txt-white/70" : "text-txt-black-500",
                )}
              >
                {thenLabel}
              </span>
            )}
            <span aria-hidden className="inline-flex gap-0.5">
              {labels.map((label) => (
                <kbd
                  key={label}
                  className={clx(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-b-2 px-1",
                    // Label Compact: the Floor Rule's 13px minimum
                    "font-body text-label-compact leading-none font-medium",
                    inverse
                      ? "text-txt-white border-current/30 bg-current/10"
                      : "border-otl-gray-300 bg-bg-white text-txt-black-700",
                  )}
                >
                  {label}
                </kbd>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    );
  },
);
Kbd.displayName = "Kbd";

export { Kbd, isMac, parseCombo, eventStep, isModifierOnly };
export type { KbdProps, KeyLike, ComboStep };
