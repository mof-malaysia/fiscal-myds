"use client";

import {
  Children,
  ComponentProps,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  isValidElement,
  KeyboardEvent,
  ReactNode,
  RefAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { clx } from "@/lib/ftds/utils";
import { useMergedRefs } from "@/lib/ftds/hooks";
import { Button, ButtonProps } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { PauseIcon } from "@/components/ui/icons/pause";
import { PlayIcon } from "@/components/ui/icons/play";

/**
 * Carousel is a dependency-free, accessible slider built on native CSS
 * scroll-snap. Slides scroll by touch, trackpad, the previous / next buttons,
 * the optional dots, or the arrow keys while focus is inside the carousel.
 *
 * There is no autoplay by default. When `autoplay` is set, it pauses while the
 * pointer is over the carousel or focus is inside it, stops once the user
 * navigates, never starts under `prefers-reduced-motion`, and you must render
 * `<CarouselPlayToggle />` so people can pause it.
 *
 * @example
 * <Carousel aria-label="Featured services">
 *   <CarouselContent>
 *     <CarouselItem className="md:basis-1/2">Slide 1</CarouselItem>
 *     <CarouselItem className="md:basis-1/2">Slide 2</CarouselItem>
 *   </CarouselContent>
 *   <div className="flex gap-2">
 *     <CarouselPrevious />
 *     <CarouselNext />
 *     <CarouselDots />
 *   </div>
 * </Carousel>
 */

interface CarouselLabels {
  previous: string;
  next: string;
  pause: string;
  play: string;
  /** Accessible name of each dot. */
  goTo: (index: number) => string;
  /** Accessible name of each slide, e.g. "2 of 5". */
  slide: (index: number, count: number) => string;
}

const DEFAULT_LABELS: CarouselLabels = {
  previous: "Previous slide",
  next: "Next slide",
  pause: "Pause slides",
  play: "Play slides",
  goTo: (index) => `Go to slide ${index + 1}`,
  slide: (index, count) => `${index + 1} of ${count}`,
};

interface CarouselContextValue {
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
  index: number;
  count: number;
  canPrev: boolean;
  canNext: boolean;
  scrollTo: (index: number, fromUser?: boolean) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  update: (rescan?: boolean) => void;
  labels: CarouselLabels;
  autoplay: boolean;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);
const CarouselItemIndexContext = createContext(0);

const useCarousel = () => {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel parts must be used inside <Carousel>.");
  return ctx;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const getItems = (track: HTMLElement | null) =>
  track
    ? Array.from(
        track.querySelectorAll<HTMLElement>(":scope > [data-carousel-item]"),
      )
    : [];

/*========================================================================================================================*/

interface CarouselProps extends Omit<ComponentProps<"div">, "children"> {
  children?: ReactNode;
  /** Milliseconds between slides. Off by default; requires `<CarouselPlayToggle />`. */
  autoplay?: number | false;
  /** Called with the index of the slide at the start of the view. */
  onIndexChange?: (index: number) => void;
  /** Override the default English labels (BM/EN). */
  labels?: Partial<CarouselLabels>;
}

const Carousel: ForwardRefExoticComponent<
  CarouselProps & RefAttributes<HTMLDivElement>
> = forwardRef(
  (
    {
      children,
      className,
      autoplay = false,
      onIndexChange,
      labels: labelsProp,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<HTMLElement[]>([]);
    const [index, setIndex] = useState(0);
    const [count, setCount] = useState(0);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [playing, setPlaying] = useState(Boolean(autoplay));
    // Read by the stable callbacks and the autoplay timer without re-subscribing
    const indexRef = useRef(0);
    const canNextRef = useRef(false);
    // Hover and focus only matter while autoplay is on; `paused` is either
    const hoveredRef = useRef(false);
    const focusedRef = useRef(false);
    const [paused, setPaused] = useState(false);
    const syncPaused = () => {
      if (autoplay) setPaused(hoveredRef.current || focusedRef.current);
    };

    const labels = useMemo(
      () => ({ ...DEFAULT_LABELS, ...labelsProp }),
      [labelsProp],
    );

    /** Re-measure the track. `rescan` re-reads the slides (after they change or resize). */
    const update = useCallback((rescan = false) => {
      const track = trackRef.current;
      if (!track) return;
      if (rescan || !itemsRef.current[0]?.isConnected) {
        itemsRef.current = getItems(track);
      }
      const items = itemsRef.current;
      const { scrollLeft, clientWidth, scrollWidth } = track;
      let closest = 0;
      let distance = Infinity;
      items.forEach((item, i) => {
        const d = Math.abs(item.offsetLeft - scrollLeft);
        if (d < distance) {
          distance = d;
          closest = i;
        }
      });
      indexRef.current = closest;
      canNextRef.current = scrollLeft + clientWidth < scrollWidth - 1;
      setCount(items.length);
      setCanPrev(scrollLeft > 1);
      setCanNext(canNextRef.current);
      setIndex(closest);
    }, []);

    useEffect(() => {
      onIndexChange?.(index);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const scrollTo = useCallback((target: number, fromUser = true) => {
      const track = trackRef.current;
      const items = getItems(track);
      if (!track || items.length === 0) return;
      const clamped = Math.max(0, Math.min(items.length - 1, target));
      if (fromUser) setPlaying(false);
      track.scrollTo({
        left: items[clamped]?.offsetLeft ?? 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, []);

    const scrollPrev = useCallback(
      () => scrollTo(indexRef.current - 1),
      [scrollTo],
    );
    const scrollNext = useCallback(
      () => scrollTo(indexRef.current + 1),
      [scrollTo],
    );

    // Autoplay: never under reduced motion; paused on hover / focus.
    useEffect(() => {
      if (!autoplay || !playing || paused) return;
      if (prefersReducedMotion()) {
        setPlaying(false);
        return;
      }
      const id = window.setInterval(() => {
        scrollTo(canNextRef.current ? indexRef.current + 1 : 0, false);
      }, autoplay);
      return () => window.clearInterval(id);
    }, [autoplay, playing, paused, scrollTo]);

    const context = useMemo<CarouselContextValue>(
      () => ({
        trackRef,
        index,
        count,
        canPrev,
        canNext,
        scrollTo,
        scrollPrev,
        scrollNext,
        update,
        labels,
        autoplay: Boolean(autoplay),
        playing,
        setPlaying,
      }),
      [
        index,
        count,
        canPrev,
        canNext,
        scrollTo,
        scrollPrev,
        scrollNext,
        update,
        labels,
        autoplay,
        playing,
      ],
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable=true]"))
        return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    };

    return (
      <CarouselContext.Provider value={context}>
        {/* Arrow keys bubble up from the focused track or controls */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          className={clx("relative flex flex-col gap-4", className)}
          onKeyDown={handleKeyDown}
          onPointerEnter={(e) => {
            onPointerEnter?.(e);
            hoveredRef.current = true;
            syncPaused();
          }}
          onPointerLeave={(e) => {
            onPointerLeave?.(e);
            hoveredRef.current = false;
            syncPaused();
          }}
          onFocus={(e) => {
            onFocus?.(e);
            focusedRef.current = true;
            syncPaused();
          }}
          onBlur={(e) => {
            onBlur?.(e);
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              focusedRef.current = false;
              syncPaused();
            }
          }}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

/*========================================================================================================================*/

interface CarouselContentProps extends ComponentProps<"div"> {}

/** The scroll-snap track. Each direct child should be a `CarouselItem`. */
const CarouselContent: ForwardRefExoticComponent<
  CarouselContentProps & RefAttributes<HTMLDivElement>
> = forwardRef(({ children, className, onScroll, ...props }, ref) => {
  const { trackRef, update, autoplay, playing } = useCarousel();
  const items = Children.toArray(children).filter(isValidElement);
  const setRefs = useMergedRefs(trackRef, ref);

  useEffect(() => {
    update(true);
  }, [items.length, update]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => update(true));
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef, update]);

  // Measure at most once per frame while scrolling
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={setRefs}
      // Focusable so keyboard users can scroll it and use the arrow keys.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-live={autoplay && playing ? "off" : "polite"}
      className={clx(
        "gap-stack-md relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        "focus-ring rounded-lg outline-none",
        "motion-reduce:scroll-auto",
        className,
      )}
      onScroll={(e) => {
        onScroll?.(e);
        if (!frame.current) {
          frame.current = requestAnimationFrame(() => {
            frame.current = 0;
            update();
          });
        }
      }}
      {...props}
    >
      {items.map((child, i) => (
        <CarouselItemIndexContext.Provider key={child.key ?? i} value={i}>
          {child}
        </CarouselItemIndexContext.Provider>
      ))}
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

/*========================================================================================================================*/

interface CarouselItemProps extends ComponentProps<"div"> {}

/**
 * One slide. Full width by default; set a basis to show several at once,
 * e.g. `className="basis-4/5 md:basis-1/2 lg:basis-1/3"`.
 */
const CarouselItem: ForwardRefExoticComponent<
  CarouselItemProps & RefAttributes<HTMLDivElement>
> = forwardRef(({ className, ...props }, ref) => {
  const { count, labels } = useCarousel();
  const index = useContext(CarouselItemIndexContext);
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      aria-label={labels.slide(index, count)}
      data-carousel-item=""
      className={clx(
        "min-w-0 shrink-0 grow-0 basis-full snap-start",
        className,
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

/*========================================================================================================================*/

type CarouselButtonProps = Omit<ButtonProps, "children"> & {
  children?: ReactNode;
};

/** Ghost icon button that moves back one slide; disabled at the start. */
const CarouselPrevious: ForwardRefExoticComponent<
  CarouselButtonProps & RefAttributes<HTMLButtonElement>
> = forwardRef(({ children, onClick, disabled, ...props }, ref) => {
  const { canPrev, scrollPrev, labels } = useCarousel();
  return (
    <Button
      ref={ref}
      type="button"
      variant="default-ghost"
      size="small"
      iconOnly
      aria-label={labels.previous}
      disabled={disabled ?? !canPrev}
      onClick={(e) => {
        onClick?.(e);
        scrollPrev();
      }}
      {...props}
    >
      {children ?? <ChevronLeftIcon aria-hidden className="size-5" />}
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

/** Ghost icon button that moves forward one slide; disabled at the end. */
const CarouselNext: ForwardRefExoticComponent<
  CarouselButtonProps & RefAttributes<HTMLButtonElement>
> = forwardRef(({ children, onClick, disabled, ...props }, ref) => {
  const { canNext, scrollNext, labels } = useCarousel();
  return (
    <Button
      ref={ref}
      type="button"
      variant="default-ghost"
      size="small"
      iconOnly
      aria-label={labels.next}
      disabled={disabled ?? !canNext}
      onClick={(e) => {
        onClick?.(e);
        scrollNext();
      }}
      {...props}
    >
      {children ?? <ChevronRightIcon aria-hidden className="size-5" />}
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

/** Pause / play button. Required whenever `autoplay` is set. */
const CarouselPlayToggle: ForwardRefExoticComponent<
  CarouselButtonProps & RefAttributes<HTMLButtonElement>
> = forwardRef(({ onClick, ...props }, ref) => {
  const { playing, setPlaying, labels, autoplay } = useCarousel();
  if (!autoplay) return null;
  return (
    <Button
      ref={ref}
      type="button"
      variant="default-ghost"
      size="small"
      iconOnly
      aria-label={playing ? labels.pause : labels.play}
      onClick={(e) => {
        onClick?.(e);
        setPlaying(!playing);
      }}
      {...props}
    >
      {playing ? (
        <PauseIcon aria-hidden className="size-5" />
      ) : (
        <PlayIcon aria-hidden className="size-5" />
      )}
    </Button>
  );
});
CarouselPlayToggle.displayName = "CarouselPlayToggle";

/*========================================================================================================================*/

interface CarouselDotsProps extends ComponentProps<"div"> {}

/** Optional dots: one 24px target per slide; the current one is a blue pill. */
const CarouselDots: ForwardRefExoticComponent<
  CarouselDotsProps & RefAttributes<HTMLDivElement>
> = forwardRef(({ className, ...props }, ref) => {
  const { count, index, scrollTo, labels } = useCarousel();
  if (count < 2) return null;
  return (
    <div
      ref={ref}
      className={clx("flex items-center gap-0.5", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, i) => {
        const current = i === index;
        return (
          <button
            key={i}
            type="button"
            aria-label={labels.goTo(i)}
            aria-current={current ? "true" : undefined}
            onClick={() => scrollTo(i)}
            className={clx(
              "group flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full outline-none",
              "focus-visible:outline-fr-primary focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-solid",
            )}
          >
            <span
              aria-hidden
              className={clx(
                "ease-standard block h-2 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none",
                current
                  ? "bg-bg-primary-600 w-5"
                  : "bg-bg-black-400 group-hover:bg-bg-black-500 w-2",
              )}
            />
          </button>
        );
      })}
    </div>
  );
});
CarouselDots.displayName = "CarouselDots";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPlayToggle,
  CarouselDots,
  useCarousel,
};
export type {
  CarouselProps,
  CarouselContentProps,
  CarouselItemProps,
  CarouselButtonProps,
  CarouselDotsProps,
  CarouselLabels,
};
