import React, { ComponentProps, forwardRef } from "react";
import { clx } from "@/lib/ftds/utils";

/**
 * Skeleton holds the place of content that is still loading, in the shape it will
 * take, so the layout does not jump when the data arrives. It is a Well-toned block
 * with a slow shimmer (still under reduced motion), hidden from screen readers.
 *
 * Shape it with `className` (height, width, radius). Announce loading once for the
 * region instead, e.g. `aria-busy="true"` on the container plus visually hidden
 * "Loading" text.
 *
 * @example
 * <div aria-busy="true" className="flex items-center gap-3">
 *   <span className="sr-only">Loading applications</span>
 *   <Skeleton className="size-10 rounded-full" />
 *   <div className="flex flex-1 flex-col gap-2">
 *     <Skeleton className="h-4 w-1/2" />
 *     <Skeleton className="h-4 w-1/3" />
 *   </div>
 * </div>
 */

type SkeletonProps = ComponentProps<"div">;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={clx(
        "bg-bg-washed block h-4 w-full rounded-md",
        "from-bg-washed via-bg-washed-active to-bg-washed animate-shimmer bg-gradient-to-r bg-[length:200%_100%]",
        "motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
export type { SkeletonProps };
