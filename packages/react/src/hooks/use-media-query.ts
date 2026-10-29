import * as React from "react";

/**
 * Whether a media query matches, kept in sync as the viewport changes.
 * Returns `false` during server rendering.
 * @example const isMobile = useMediaQuery("(max-width: 767px)");
 */
function useMediaQuery(query: string): boolean {
  const mql = React.useMemo(
    () => (typeof window === "undefined" ? null : window.matchMedia(query)),
    [query],
  );

  const subscribe = React.useCallback(
    (onChange: () => void) => {
      mql?.addEventListener("change", onChange);
      return () => mql?.removeEventListener("change", onChange);
    },
    [mql],
  );

  return React.useSyncExternalStore(
    subscribe,
    () => mql?.matches ?? false,
    () => false,
  );
}

export { useMediaQuery };
