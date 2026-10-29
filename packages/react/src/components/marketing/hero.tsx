// registry:block — composed page section, installs to components/blocks
import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useId,
} from "react";
import { clx } from "../../utils";
import { Tag } from "../core/tag";
import { renderAction, type BlockAction } from "./section-heading";

/**
 * Hero is the opening section of an agency or landing page: an optional
 * eyebrow tag, the page's single h1, supporting text, a primary and a
 * secondary action, and an optional media slot that sits beside the text on
 * desktop. Paper background, no gradient.
 *
 * Actions accept `{ label, href }` (rendered as links styled as buttons) or
 * any node, such as your own `<Button>`.
 *
 * @example
 * <Hero
 *   eyebrow="New"
 *   title="Pay your government bills in one place"
 *   description="Settle fees, fines and assessments from 30 agencies with one MyDigital ID."
 *   primaryAction={{ label: "Start a payment", href: "/pay" }}
 *   secondaryAction={{ label: "How it works", href: "#how" }}
 *   media={<img src="/hero.png" alt="" />}
 * />
 */

type HeroAction = BlockAction;

interface HeroProps extends Omit<ComponentProps<"section">, "title"> {
  /** Short label above the title. A string renders a primary Tag. */
  eyebrow?: ReactNode;
  /** The page title, rendered as the only h1. */
  title: ReactNode;
  description?: ReactNode;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  /** Image or illustration; beside the text on desktop, below on mobile. */
  media?: ReactNode;
  /** Extra content under the actions, e.g. a short reassurance line. */
  footnote?: ReactNode;
}

const Hero: ForwardRefExoticComponent<HeroProps & RefAttributes<HTMLElement>> =
  forwardRef(
    (
      {
        eyebrow,
        title,
        description,
        primaryAction,
        secondaryAction,
        media,
        footnote,
        className,
        children,
        ...props
      },
      ref,
    ) => {
      const titleId = useId();
      const hasMedia = Boolean(media);

      return (
        <section
          ref={ref}
          aria-labelledby={titleId}
          className={clx("bg-bg-gray-50 font-body w-full", className)}
          {...props}
        >
          <div
            className={clx(
              "mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 py-12 md:px-6 md:py-16 lg:py-24",
              hasMedia && "lg:grid-cols-12 lg:gap-12",
            )}
          >
            <div
              className={clx(
                "flex flex-col items-start gap-6",
                hasMedia ? "lg:col-span-6" : "max-w-[760px]",
              )}
            >
              {eyebrow &&
                (typeof eyebrow === "string" ? (
                  <Tag variant="primary" size="medium">
                    {eyebrow}
                  </Tag>
                ) : (
                  eyebrow
                ))}
              <div className="flex flex-col gap-4">
                <h1
                  id={titleId}
                  className="text-txt-black-900 text-heading-sm md:text-heading-md lg:text-heading-lg font-semibold tracking-[-0.02em] text-balance"
                >
                  {title}
                </h1>
                {description && (
                  <p className="text-txt-black-700 text-body-lg md:text-body-xl max-w-[60ch]">
                    {description}
                  </p>
                )}
              </div>
              {(primaryAction || secondaryAction) && (
                <div className="flex flex-wrap items-center gap-3">
                  {primaryAction && renderAction(primaryAction, "primary-fill")}
                  {secondaryAction &&
                    renderAction(secondaryAction, "default-outline")}
                </div>
              )}
              {footnote && (
                <p className="text-txt-black-700 text-body-md">{footnote}</p>
              )}
              {children}
            </div>
            {hasMedia && (
              <div className="overflow-hidden rounded-lg lg:col-span-6">
                {media}
              </div>
            )}
          </div>
        </section>
      );
    },
  );
Hero.displayName = "Hero";

export { Hero };
export type { HeroProps, HeroAction };
