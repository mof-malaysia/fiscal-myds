import { useEffect, useState } from "react";

const secondsUntil = (endsAt: number | null) =>
  endsAt === null ? 0 : Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

/**
 * Whole seconds left until `endsAt` (a timestamp in ms), updated every second and
 * stopping at 0. Pass `null` while there is nothing to count down.
 * @example const remaining = useCountdown(open ? expiresAt : null);
 */
function useCountdown(endsAt: number | null): number {
  const [state, setState] = useState(() => ({
    endsAt,
    remaining: secondsUntil(endsAt),
  }));

  // A new end time takes effect in this render, so nothing sees the old count
  let current = state;
  if (state.endsAt !== endsAt) {
    current = { endsAt, remaining: secondsUntil(endsAt) };
    setState(current);
  }

  useEffect(() => {
    if (endsAt === null) return;
    let timer: number | undefined;
    const tick = () => {
      const remaining = secondsUntil(endsAt);
      setState((s) => (s.endsAt === endsAt ? { endsAt, remaining } : s));
      if (remaining === 0) window.clearInterval(timer);
    };
    tick();
    timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return current.remaining;
}

export { useCountdown };
