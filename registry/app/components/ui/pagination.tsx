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

/**
 * Props for Pagination component.
 * @typedef PaginatorProps
 * @property {number} page - The current page number.
 * @property {number} limit - The number of items per page
 * @property {number} count - The total number of items
 * @property {"basic" | "basic-alternate" | "number"}  type - The variation of the pagination
 * @property {function} onPageChange - function which tracks the page
 */
export interface PaginatorProps {
  page: number;
  limit: number;
  count: number;
  onPageChange: (page: number) => void;
  type: "simple" | "full" | "default";
}

const PaginationContext = createContext<
  PaginatorProps & {
    totalPages: number;
  }
>({
  page: 1,
  count: 0,
  limit: 6,
  totalPages: 0,
  type: "default",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onPageChange: (page) => {},
});

interface PaginationProps extends ComponentProps<"nav">, PaginatorProps {}

/**
 * Component that allows users to navigate through a large set of content divided into discrete pages.
 * @component
 * @example
 * <Pagination propName="value" />
 */
const Pagination: ForwardRefExoticComponent<PaginationProps> = forwardRef(
  (
    { count, limit, page, children, className, type, onPageChange, ...props },
    ref,
  ) => {
    const totalPages = Math.ceil(count / limit);
    return (
      <PaginationContext.Provider
        value={{ count, limit, page, totalPages, type, onPageChange }}
      >
        <nav
          ref={ref}
          role="navigation"
          aria-label="pagination"
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
  const { page, onPageChange } = useContext(PaginationContext);
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
      {...props}
      aria-label="previous page"
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
  const { page, totalPages, onPageChange } = useContext(PaginationContext);
  const disabled = page === totalPages;
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
      {...props}
      aria-label="next page"
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
  const { page, onPageChange } = useContext(PaginationContext);
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
      {...props}
      aria-label={`page ${number}`}
    >
      {number}
    </Button>
  );
});

PaginationNumber.displayName = "PaginationNumber";

const PaginationLabel: ForwardRefExoticComponent<
  ComponentProps<"p"> & { content?: ReactNode }
> = forwardRef(({ className, content, ...props }, ref) => {
  const { page, totalPages, type } = useContext(PaginationContext);
  return (
    <p ref={ref} className={clx("text-txt-black-700", className)} {...props}>
      {content ? content : type === "full" && `Page ${page} of ${totalPages}`}
    </p>
  );
});

PaginationLabel.displayName = "PaginationLabel";

const PaginationEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    aria-hidden
    className={clx("flex size-8 items-center justify-center", className)}
    {...props}
  >
    <EllipsisIcon className="text-txt-black-700 size-4" />
    <span className="sr-only">More pages</span>
  </span>
);
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
                {previous || <PaginationPrevious>Previous</PaginationPrevious>}
              </PaginationItem>
              <PaginationItem>
                <PaginationLabel />
              </PaginationItem>
              <PaginationItem>
                {next || <PaginationNext>Next</PaginationNext>}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        );
      }
      if (type === "full") {
        return (
          <Pagination ref={ref} type={type} {...props}>
            <PaginationContent className="w-[512px]">
              <PaginationItem className="flex-1">
                <PaginationLabel content={fullText} />
              </PaginationItem>
              <PaginationItem>
                {previous || <PaginationPrevious>Previous</PaginationPrevious>}
              </PaginationItem>

              <PaginationItem>
                {next || <PaginationNext>Next</PaginationNext>}
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
  PaginationNext,
  PaginationNumber,
  PaginationPrevious,
  AutoPagination,
};

export type { AutoPaginationProps };
