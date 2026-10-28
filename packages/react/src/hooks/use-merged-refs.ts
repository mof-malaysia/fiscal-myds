import * as React from "react";

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Combines refs (an inner `useRef` and a forwarded ref, say) into one stable callback ref.
 * @example <input ref={useMergedRefs(innerRef, forwardedRef)} />
 */
function useMergedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback((node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
    }
  }, refs);
}

export { useMergedRefs };
