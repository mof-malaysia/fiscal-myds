/**
 * Behaviour for the FTDS Astro components that need a script. Each component
 * imports from here in its own `<script>`, which Astro bundles once per page
 * however many times the component appears.
 *
 * Rules (docs/rfc/astro.md): markup works without JavaScript, scripts find
 * elements by `data-ftds-*` attributes, and setup runs again after every
 * Astro view transition.
 */

/**
 * Run `setup` once for every element matching `selector`: now, and after
 * each view transition (`astro:page-load`). An element is never set up twice.
 *
 * After `setup`, elements inside the root (or the root itself) marked
 * `hidden data-ftds-requires-js` are shown: controls that only work with
 * JavaScript, such as a close button.
 *
 * `setup` may return a cleanup function for anything that outlives the
 * element (window or media query listeners, timers). It runs before the
 * next view transition swaps the page.
 *
 * @example
 * onEach("[data-ftds-tabs]", (root) => { ... });
 */
export function onEach(
  selector: string,
  setup: (element: HTMLElement) => void | (() => void),
): void {
  const cleanups: (() => void)[] = [];
  const run = () => {
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      if (element.dataset.ftdsReady !== undefined) continue;
      element.dataset.ftdsReady = "";
      const cleanup = setup(element);
      if (cleanup) cleanups.push(cleanup);
      for (const control of [
        element,
        ...element.querySelectorAll<HTMLElement>("[data-ftds-requires-js]"),
      ]) {
        if (control.hasAttribute("data-ftds-requires-js"))
          control.hidden = false;
      }
    }
  };
  run();
  document.addEventListener("astro:page-load", run);
  document.addEventListener("astro:before-swap", () => {
    cleanups.splice(0).forEach((cleanup) => cleanup());
  });
}

/** localStorage, or null where it is unavailable (privacy modes, sandboxes). */
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Save to localStorage; a no-op where it is unavailable. */
export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not persisted; the choice still applies to this page
  }
}

/**
 * Keep a popover trigger's `aria-expanded` in step with the popover,
 * updated before the toggle so it is right when focus moves.
 */
export function trackExpanded(
  trigger: HTMLElement,
  popover: HTMLElement,
): void {
  trigger.setAttribute("aria-expanded", "false");
  popover.addEventListener("beforetoggle", (event) => {
    trigger.setAttribute(
      "aria-expanded",
      String((event as ToggleEvent).newState === "open"),
    );
  });
}

/**
 * Move focus within `items` with the arrow keys, Home and End, as a
 * tablist or toolbar does. Returns the item focused, or null when the key
 * isn't one it handles.
 */
export function moveFocus(
  event: KeyboardEvent,
  items: HTMLElement[],
  orientation: "horizontal" | "vertical" = "horizontal",
): HTMLElement | null {
  const enabled = items.filter((item) => !item.hasAttribute("disabled"));
  const index = enabled.indexOf(event.currentTarget as HTMLElement);
  const [prev, next] =
    orientation === "horizontal"
      ? ["ArrowLeft", "ArrowRight"]
      : ["ArrowUp", "ArrowDown"];
  const target =
    event.key === next
      ? enabled[(index + 1) % enabled.length]
      : event.key === prev
        ? enabled[(index - 1 + enabled.length) % enabled.length]
        : event.key === "Home"
          ? enabled[0]
          : event.key === "End"
            ? enabled[enabled.length - 1]
            : null;
  if (!target) return null;
  event.preventDefault();
  target.focus();
  return target;
}
