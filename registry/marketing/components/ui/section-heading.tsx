import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  isValidElement,
  ReactNode,
  RefAttributes,
} from "react";
import { clx } from "@/lib/ftds/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * SectionHeading is the title and intro shared by the marketing blocks
 * (FeatureGrid, StatsBand, Faq, Testimonial, CtaBand): an h2 with the
 * section title and an optional larger intro paragraph. Pass the title's
 * `id` so the block's `<section>` can point `aria-labelledby` at it.
 * Anything in `children` renders under the intro.
 *
 * @example
 * <section aria-labelledby="features">
 *   <SectionHeading
 *     titleId="features"
 *     title="Everything in one account"
 *     description="One MyDigital ID for every MOF service."
 *   />
 * </section>
 */

interface SectionHeadingProps extends Omit<ComponentProps<"div">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** `id` for the heading, referenced by the section's `aria-labelledby`. */
  titleId?: string;
  /** Heading level. Defaults to `"h2"`. */
  as?: "h2" | "h3";
  /** Step the title up to heading-sm from `md`. Defaults to true. */
  responsive?: boolean;
}

const SectionHeading: ForwardRefExoticComponent<
  SectionHeadingProps & RefAttributes<HTMLDivElement>
> = forwardRef(
  (
    {
      title,
      description,
      titleId,
      as: Heading = "h2",
      responsive = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    if (!title && !description && !children) return null;
    return (
      <div
        ref={ref}
        className={clx("flex flex-col gap-3", className)}
        {...props}
      >
        {title && (
          <Heading
            id={titleId}
            className={clx(
              "text-txt-black-900 font-semibold text-balance",
              responsive
                ? "text-heading-xs md:text-heading-sm tracking-[-0.015em]"
                : "text-headline",
            )}
          >
            {title}
          </Heading>
        )}
        {description && (
          <p className="text-txt-black-700 text-body-lg">{description}</p>
        )}
        {children}
      </div>
    );
  },
);
SectionHeading.displayName = "SectionHeading";

/*========================================================================================================================*/

/** A block action: `{ label, href }` renders a link styled as a button; any other node renders as is. */
type BlockAction = ReactNode | { label: ReactNode; href: string };

const isLinkAction = (
  action: BlockAction,
): action is { label: ReactNode; href: string } =>
  typeof action === "object" &&
  action !== null &&
  !isValidElement(action) &&
  "href" in action;

/** Renders a block action as a large Button link, or passes a node through. */
const renderAction = (
  action: BlockAction,
  variant: ButtonProps["variant"],
  className?: string,
) =>
  isLinkAction(action) ? (
    <Button
      variant={variant}
      size="large"
      className={className}
      // Button renders the label into this anchor
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      render={<a href={action.href} />}
    >
      {action.label}
    </Button>
  ) : (
    action
  );

export { SectionHeading, renderAction };
export type { SectionHeadingProps, BlockAction };
