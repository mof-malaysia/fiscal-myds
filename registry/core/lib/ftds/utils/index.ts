import { ClassNameValue, extendTailwindMerge } from "tailwind-merge";

const twMergeConfig = extendTailwindMerge<"control">({
  extend: {
    // Density-aware spacing and the standard easing (packages/style tailwind.config.css)
    theme: {
      spacing: ["surface", "stack-lg", "stack-md", "stack-sm"],
      ease: ["standard"],
    },
    classGroups: {
      "font-size": [
        "text-heading-xl",
        "text-heading-lg",
        "text-heading-md",
        "text-heading-sm",
        "text-heading-xs",
        "text-heading-2xs",
        "text-body-xl",
        "text-body-lg",
        "text-body-md",
        "text-body-sm",
        "text-body-xs",
        // Density-aware type (packages/style tailwind.config.css)
        "text-label-sm",
        "text-label-md",
        "text-label-lg",
        "text-field-sm",
        "text-field-md",
        "text-field-lg",
        "text-content",
        // DESIGN.md type hierarchy
        "text-display",
        "text-headline",
        "text-title",
        "text-label-compact",
      ],
      // Density-aware control box (height + horizontal padding)
      control: [
        "control-sm",
        "control-md",
        "control-lg",
        "control-square-sm",
        "control-square-md",
        "control-square-lg",
      ],
    },
  },
});

/**
 * Base UI accepts a function for `className`; FTDS components take a plain string.
 * @example interface Props extends WithClassName<Popover.Popup.Props> {}
 */
export type WithClassName<P> = Omit<P, "className"> & { className?: string };

/**
 * Conditional class joiner.
 * @param args classNames
 * @returns string
 */
export const clx = (...args: ClassNameValue[]): string => {
  return twMergeConfig(args);
};

/**
 * Pick into key-pairs from array of objects.
 * @param results Array of objects
 * @param key Key of record
 * @param value Value of record
 * @returns {Record<string, any>} ObjectMap
 */
export const pick = <T = string>(
  results: Array<T>,
  key: keyof T | ((item: T) => string),
  value: keyof T | ((item: T) => unknown),
): Record<string, any> => {
  return results.reduce((previous, current) => {
    const _key = typeof key === "function" ? key(current) : current[key];
    const _value =
      typeof value === "function" ? value(current) : current[value];
    return { ...previous, [_key as string]: _value };
  }, {});
};

const POSITIONER_KEYS = [
  "side",
  "sideOffset",
  "align",
  "alignOffset",
  "anchor",
  "collisionAvoidance",
  "collisionBoundary",
  "collisionPadding",
  "sticky",
  "positionMethod",
  "arrowPadding",
  "disableAnchorTracking",
] as const;

type PositionerKey = (typeof POSITIONER_KEYS)[number];

/**
 * The positioning props a `*Content` part forwards to its Base UI Positioner.
 * @example interface Props extends WithClassName<Menu.Popup.Props>, PositionerProps<Menu.Positioner.Props> {}
 */
export type PositionerProps<P> = Pick<P, Extract<keyof P, PositionerKey>>;

/**
 * Splits a `*Content` part's props into Positioner props and the rest (for the Popup).
 * `defaults` fill in positioner props that are `undefined`.
 * @example const [positionerProps, popupProps] = splitPositionerProps(props, { align: "start", sideOffset: 4 });
 */
export const splitPositionerProps = <P extends object>(
  props: P,
  defaults: Partial<PositionerProps<P>> = {},
): [PositionerProps<P>, Omit<P, PositionerKey>] => {
  const positioner: Record<string, unknown> = { ...defaults };
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if ((POSITIONER_KEYS as readonly string[]).includes(key)) {
      if (value !== undefined) positioner[key] = value;
    } else {
      rest[key] = value;
    }
  }
  return [positioner as PositionerProps<P>, rest as Omit<P, PositionerKey>];
};

/** Whether keystrokes on `target` are text entry. */
export function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (target instanceof HTMLTextAreaElement) return true;
  if (target instanceof HTMLSelectElement) return true;
  if (target instanceof HTMLInputElement) {
    return ![
      "button",
      "checkbox",
      "radio",
      "reset",
      "submit",
      "range",
      "color",
    ].includes(target.type);
  }
  return false;
}

/**
 * A unique element id, e.g. `uniqueId("hero")` -> "hero-3f9a1c2b". For the
 * Astro components, which have no `useId`.
 */
export function uniqueId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
