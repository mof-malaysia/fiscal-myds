import React, {
  ComponentProps,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  useContext,
} from "react";
import { clx } from "@/lib/ftds/utils";
import { EllipsisIcon } from "@/components/ui/icons/ellipsis";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { useRender } from "@base-ui/react/use-render";
import { usePagination } from "@/lib/ftds/hooks/use-pagination";

interface PaginationLabels {
  /** Name of the navigation landmark. */
  navigation: string;
  /** Visible text of the previous and next buttons in the simple and full layouts. */
  previous: string;
  next: string;
  /** Accessible names of the icon-only previous and next buttons. */
  previousPage: string;
  nextPage: string;
  /** Accessible name of a page number; `{page}` is replaced. */
  page: string;
  /** The "Page 2 of 10" text; `{page}` and `{total}` are replaced. */
  pageOf: string;
  /** Read for the ellipsis between page numbers. */
  morePages: string;
}

const DEFAULT_LABELS: PaginationLabels = {
  navigation: "Pagination",
  previous: "Previous",
  next: "Next",
  previousPage: "Previous page",
  nextPage: "Next page",
  page: "Page {page}",
  pageOf: "Page {page} of {total}",
  morePages: "More pages",
};

export interface PaginatorProps {
  /** The current page, from 1. */
  page: number;
  /** Items per page. */
  limit: number;
  /** Total number of items. */
  count: number;
  onPageChange: (page: number) => void;
  /**
   * `default`: previous, page numbers and next. `simple`: previous, "Page 2
   * of 10" and next. `full`: "Page 2 of 10" on the left, previous and next on
   * the right.
   * @default "default"
   */
  type?: "simple" | "full" | "default";
  /** Built-in text, for translation. Pass only the labels you change. */
  labels?: Partial<PaginationLabels>;
}

const PaginationContext = createContext<
  Omit<PaginatorProps, "labels"> & {
    totalPages: number;
    labels: PaginationLabels;
  }
>({
  page: 1,
  count: 0,
  limit: 6,
  totalPages: 0,
  type: "default",
  labels: DEFAULT_LABELS,
  onPageChange: () => {},
});

interface PaginationProps extends ComponentProps<"nav">, PaginatorProps {}

/**
 * Pagination moves through a list split into pages. Compose the parts
 * yourself, or use `AutoPagination` for the standard layouts.
 * @example
 * <AutoPagination page={page} limit={20} count={total} onPageChange={setPage} />
 */
const Pagination: ForwardRefExoticComponent<PaginationProps> = forwardRef(
  (
    {
      count,
      limit,
      page,
      children,
      className,
      type = "default",
      onPageChange,
      labels: labelsProp,
      ...props
    },
    ref,
  ) => {
    const totalPages = Math.ceil(count / limit);
    const labels = { ...DEFAULT_LABELS, ...labelsProp };
    return (
      <PaginationContext.Provider
        value={{ count, limit, page, totalPages, type, onPageChange, labels }}
      >
        <nav
          ref={ref}
          aria-label={labels.navigation}
          className={clx("text-body-md flex w-full justify-center", className)}
          {...props}
        >
          {children}
        </nav>
      </PaginationContext.Provider>
    );
  },
);

Pagination.displayName = "Pagination";

const PaginationContent: ForwardRefExoticComponent<ComponentProps<"ul">> =
  forwardRef(({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={clx("flex flex-row items-center gap-4", className)}
      {...props}
    />
  ));
PaginationContent.displayName = "PaginationContent";

const PaginationItem: ForwardRefExoticComponent<ComponentProps<"li">> =
  forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={clx("rounded-md", className)} {...props} />
  ));
PaginationItem.displayName = "PaginationItem";

const PaginationPrevious: ForwardRefExoticComponent<
  useRender.ComponentProps<"button">
> = forwardRef(({ render, children, ...props }, ref) => {
  const { page, onPageChange, labels } = useContext(PaginationContext);
  const disabled = page <= 1;
  const handlePreviousPage = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  // With `render`, the custom element is rendered as-is (no built-in styling or page handling).
  const custom = useRender({
    enabled: render !== undefined,
    render,
    ref,
    props: { ...props, children },
  });
  if (custom) return custom;

  return (
    <Button
      ref={ref}
      variant={"default-outline"}
      size={"medium"}
      disabled={disabled}
      className={clx(disabled && "shadow-transparent")}
      onClick={handlePreviousPage}
      // Visible text names the button; an icon-only one needs a name
      aria-label={children ? undefined : labels.previousPage}
      {...props}
    >
      <ButtonIcon>
        <ChevronLeftIcon />
      </ButtonIcon>
      {children}
    </Button>
  );
});

PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext: ForwardRefExoticComponent<
  useRender.ComponentProps<"button">
> = forwardRef(({ render, children, ...props }, ref) => {
  const { page, totalPages, onPageChange, labels } =
    useContext(PaginationContext);
  const disabled = page >= totalPages;
  const handleNextPage = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };
  // With `render`, the custom element is rendered as-is (no built-in styling or page handling).
  const custom = useRender({
    enabled: render !== undefined,
    render,
    ref,
    props: { ...props, children },
  });
  if (custom) return custom;

  return (
    <Button
      ref={ref}
      variant={"default-outline"}
      size={"medium"}
      disabled={disabled}
      className={clx(disabled && "shadow-transparent")}
      onClick={handleNextPage}
      aria-label={children ? undefined : labels.nextPage}
      {...props}
    >
      {children}
      <ButtonIcon>
        <ChevronRightIcon />
      </ButtonIcon>
    </Button>
  );
});

PaginationNext.displayName = "PaginationNext";

const PaginationNumber: ForwardRefExoticComponent<
  ComponentProps<"button"> & { number: number }
> = forwardRef(({ number, ...props }, ref) => {
  const { page, onPageChange, labels } = useContext(PaginationContext);
  const isActive = page === number;
  const handleClickPage = () => {
    onPageChange(number);
  };
  return (
    <Button
      ref={ref}
      onClick={handleClickPage}
      variant={"default-ghost"}
      size={"medium"}
      className={clx(
        isActive && "bg-bg-washed-active",
        "control-square-md w-(--ctl-h-md) items-center justify-center px-0",
      )}
      aria-label={labels.page.replace("{page}", String(number))}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {number}
    </Button>
  );
});

PaginationNumber.displayName = "PaginationNumber";

const PaginationLabel: ForwardRefExoticComponent<
  ComponentProps<"p"> & { content?: ReactNode }
> = forwardRef(({ className, content, ...props }, ref) => {
  const { page, totalPages, labels } = useContext(PaginationContext);
  return (
    <p ref={ref} className={clx("text-txt-black-700", className)} {...props}>
      {content ??
        labels.pageOf
          .replace("{page}", String(page))
          .replace("{total}", String(Math.max(totalPages, 1)))}
    </p>
  );
});

PaginationLabel.displayName = "PaginationLabel";

const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => {
  const { labels } = useContext(PaginationContext);
  return (
    <span
      className={clx("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <EllipsisIcon className="text-txt-black-700 size-4" aria-hidden />
      <span className="sr-only">{labels.morePages}</span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

interface AutoPaginationProps extends ComponentProps<"nav">, PaginatorProps {
  maxDisplay?: number;
  next?: ReactNode;
  previous?: ReactNode;
  fullText?: string;
}

const AutoPagination: ForwardRefExoticComponent<AutoPaginationProps> =
  forwardRef(
    (
      { type = "default", maxDisplay = 4, next, previous, fullText, ...props },
      ref,
    ) => {
      const labels = { ...DEFAULT_LABELS, ...props.labels };
      const { visiblePages } = usePagination({
        count: props.count,
        limit: props.limit,
        page: props.page,
        maxDisplay,
      });

      if (type === "simple") {
        return (
          <Pagination ref={ref} type={type} {...props}>
            <PaginationContent>
              <PaginationItem>
                {previous || (
                  <PaginationPrevious>{labels.previous}</PaginationPrevious>
                )}
              </PaginationItem>
              <PaginationItem>
                <PaginationLabel />
              </PaginationItem>
              <PaginationItem>
                {next || <PaginationNext>{labels.next}</PaginationNext>}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        );
      }
      if (type === "full") {
        return (
          <Pagination ref={ref} type={type} {...props}>
            <PaginationContent className="w-full max-w-lg">
              <PaginationItem className="flex-1">
                <PaginationLabel content={fullText} />
              </PaginationItem>
              <PaginationItem>
                {previous || (
                  <PaginationPrevious>{labels.previous}</PaginationPrevious>
                )}
              </PaginationItem>

              <PaginationItem>
                {next || <PaginationNext>{labels.next}</PaginationNext>}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        );
      }

      return (
        <Pagination ref={ref} type={type} {...props}>
          <PaginationContent>
            <PaginationItem>
              {previous || <PaginationPrevious />}
            </PaginationItem>
            {visiblePages.map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  typeof page === "number" && <PaginationNumber number={page} />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>{next || <PaginationNext />}</PaginationItem>
          </PaginationContent>
        </Pagination>
      );
    },
  );

export {
  Pagination,
  PaginationContext,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLabel,
  PaginationNext,
  PaginationNumber,
  PaginationPrevious,
  AutoPagination,
};

export type { AutoPaginationProps, PaginationLabels };
