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

/** Width of the preview frame; desktop fills the space it has. */
export const VIEWPORT_WIDTH: Record<Viewport, number | undefined> = {
  mobile: 390,
  tablet: 768,
  desktop: undefined,
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
    if (typeof value?.code !== "string") return undefined;
    return {
      v: typeof value.v === "string" ? value.v : "unknown",
      title: typeof value.title === "string" ? value.title : "Untitled screen",
      code: value.code,
      theme: THEMES.includes(value.theme) ? value.theme : "light",
      viewport: VIEWPORTS.includes(value.viewport) ? value.viewport : "desktop",
    };
  } catch {
    return undefined;
  }
}

export function shareUrl(origin: string, screen: Screen): string {
  return `${origin}/s#${encodeScreen(screen)}`;
}
