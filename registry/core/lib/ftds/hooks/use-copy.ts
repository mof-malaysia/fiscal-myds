import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copies `text` to the clipboard; `copied` stays true for `timeout` ms so a button
 * can confirm. A blocked clipboard is ignored: the text is still on screen.
 * @example const [copied, copy] = useCopy(reference);
 */
function useCopy(text: string, timeout: number = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), timeout);
    } catch {
      // Clipboard blocked: leave the text for the user to copy by hand
    }
  }, [text, timeout]);

  return [copied, copy] as const;
}

export { useCopy };
