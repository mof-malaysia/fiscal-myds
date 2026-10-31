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
 * @example
 * onEach("[data-ftds-tabs]", (root) => { ... });
 */
export function onEach(
  selector: string,
  setup: (element: HTMLElement) => void,
): void {
  const run = () => {
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
      if (element.dataset.ftdsReady !== undefined) continue;
      element.dataset.ftdsReady = "";
      setup(element);
    }
  };
  run();
  document.addEventListener("astro:page-load", run);
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
