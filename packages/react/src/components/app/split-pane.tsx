"use client";

import React, {
  ComponentProps,
  ReactNode,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { clx } from "../../utils";

/**
 * SplitPane lays out a list beside its detail. The start pane has a width the
 * officer can drag (pointer) or step (arrow keys on the focused divider, Shift for
 * bigger steps, Home/End for the limits). With `storageKey`, the width is
 * remembered in localStorage as a per-browser convenience.
 *
 * Inside a `DeskPage`, pass `className="p-0"` to the page so the panes reach its edges.
 *
 * @example
 * <SplitPane
 *   storageKey="cases.split"
 *   start={<CaseList />}
 *   end={<CaseDetail />}
 * />
 */

interface SplitPaneProps extends Omit<ComponentProps<"div">, "children"> {
  /** The list (left) pane. */
  start: ReactNode;
  /** The detail (right) pane. */
  end: ReactNode;
  /** Start pane width in px when nothing is remembered. @default 380 */
  defaultWidth?: number;
  /** @default 240 */
  minWidth?: number;
  /** @default 760 */
  maxWidth?: number;
  /** When set, the width is remembered in localStorage under this key. */
  storageKey?: string;
  /** Accessible name of the divider. */
  handleLabel?: string;
  /** Accessible names of the panes. */
  startLabel?: string;
  endLabel?: string;
}

const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(
  (
    {
      start,
      end,
      defaultWidth = 380,
      minWidth = 240,
      maxWidth = 760,
      storageKey,
      handleLabel = "Resize panes",
      startLabel,
      endLabel,
      className,
      ...props
    },
    ref,
  ) => {
    const [width, setWidth] = useState(defaultWidth);
    const [dragging, setDragging] = useState(false);
    const origin = useRef({ x: 0, width: 0 });

    const clamp = (value: number) =>
      Math.min(maxWidth, Math.max(minWidth, value));

    // Restore the remembered width once, after hydration
    useEffect(() => {
      if (!storageKey) return;
      try {
        const stored = Number(window.localStorage.getItem(storageKey));
        if (stored > 0) setWidth(clamp(stored));
      } catch {
        // Storage unavailable (private mode, blocked): keep the default
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey]);

    const commit = (value: number) => {
      const next = clamp(value);
      setWidth(next);
      if (!storageKey) return;
      try {
        window.localStorage.setItem(storageKey, String(Math.round(next)));
      } catch {
        // Ignore: persistence is a convenience
      }
    };

    return (
      <div
        ref={ref}
        className={clx("flex h-full min-h-0 w-full min-w-0", className)}
        {...props}
      >
        <section
          aria-label={startLabel}
          className="min-h-0 shrink-0 overflow-y-auto"
          style={{ width }}
        >
          {start}
        </section>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={handleLabel}
          aria-valuenow={Math.round(width)}
          aria-valuemin={minWidth}
          aria-valuemax={maxWidth}
          tabIndex={0}
          data-dragging={dragging || undefined}
          className={clx(
            // A 1px Hairline with a wider, invisible hit area
            "group/split-handle bg-otl-gray-200 relative w-px shrink-0 cursor-col-resize touch-none outline-none select-none",
            "before:absolute before:inset-y-0 before:-right-1 before:-left-1 before:content-['']",
            "after:absolute after:inset-y-0 after:-left-px after:w-[3px] after:transition-colors after:duration-150 after:content-['']",
            "hover:after:bg-otl-primary-300 data-[dragging]:after:bg-txt-primary focus-visible:after:bg-txt-primary",
          )}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            origin.current = { x: event.clientX, width };
            setDragging(true);
          }}
          onPointerMove={(event) => {
            if (!dragging) return;
            setWidth(
              clamp(origin.current.width + event.clientX - origin.current.x),
            );
          }}
          onPointerUp={() => {
            setDragging(false);
            commit(width);
          }}
          onPointerCancel={() => setDragging(false)}
          onDoubleClick={() => commit(defaultWidth)}
          onKeyDown={(event) => {
            const step = event.shiftKey ? 64 : 16;
            if (event.key === "ArrowLeft") commit(width - step);
            else if (event.key === "ArrowRight") commit(width + step);
            else if (event.key === "Home") commit(minWidth);
            else if (event.key === "End") commit(maxWidth);
            else return;
            event.preventDefault();
          }}
        />
        <section
          aria-label={endLabel}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto"
        >
          {end}
        </section>
      </div>
    );
  },
);
SplitPane.displayName = "SplitPane";

export { SplitPane };
export type { SplitPaneProps };
