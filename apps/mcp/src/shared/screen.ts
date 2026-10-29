import LZString from "lz-string";

/**
 * One mocked-up screen: everything the preview needs to render it again.
 *
 * A share link carries the whole screen in its fragment (`/s#<encoded>`), so
 * the server never receives or stores it. `v` is the FTDS release the screen
 * was made with, so the page can say when it renders with a different one.
 */
export interface Screen {
  v: string;
  title: string;
  code: string;
  theme: Theme;
  viewport: Viewport;
}

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const VIEWPORTS = ["mobile", "tablet", "desktop"] as const;
export type Viewport = (typeof VIEWPORTS)[number];

/** Width of the preview frame. Wider than the space it has, it scales down. */
export const VIEWPORT_WIDTH: Record<Viewport, number> = {
  mobile: 390,
  tablet: 768,
  desktop: 1280,
};

export function encodeScreen(screen: Screen): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(screen));
}

/** Read a screen back from a fragment, or undefined when it isn't one. */
export function decodeScreen(fragment: string): Screen | undefined {
  const json = LZString.decompressFromEncodedURIComponent(
    fragment.replace(/^#/, ""),
  );
  if (!json) return undefined;
  try {
    const value = JSON.parse(json);
    return toScreen(value, typeof value?.v === "string" ? value.v : "unknown");
  } catch {
    return undefined;
  }
}

/** A screen from untrusted fields (a link, a tool's arguments), with defaults. */
export function toScreen(value: unknown, v: string): Screen | undefined {
  const fields = (value ?? {}) as Record<string, unknown>;
  if (typeof fields.code !== "string") return undefined;
  const pick = <T extends string>(
    field: unknown,
    options: readonly T[],
    fallback: T,
  ): T => (options.includes(field as T) ? (field as T) : fallback);
  return {
    v,
    title: typeof fields.title === "string" ? fields.title : "Untitled screen",
    code: fields.code,
    theme: pick(fields.theme, THEMES, "light"),
    viewport: pick(fields.viewport, VIEWPORTS, "desktop"),
  };
}

export function shareUrl(origin: string, screen: Screen): string {
  return `${origin}/s#${encodeScreen(screen)}`;
}
