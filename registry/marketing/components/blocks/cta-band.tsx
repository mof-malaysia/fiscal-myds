// registry:block — composed page section, installs to components/blocks
import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useId,
} from "react";
import { clx } from "@/lib/ftds/utils";
import {
  renderAction,
  SectionHeading,
  type BlockAction,
} from "@/components/ui/section-heading";
import { band_cva } from "@/components/ui/cta-band.variants";

/**
 * CtaBand is the closing call to action of a page: a title, short text, one
 * primary action and an optional secondary one. It sits on a Well or a
 * primary-wash band, never a saturated blue block (Wash, Not Fill), so the
 * primary button stays the only filled blue on screen.
 *
 * Actions accept `{ label, href }` (links styled as buttons) or any node.
 *
 * @example
 * <CtaBand
 *   title="Ready to pay?"
 *   description="It takes about three minutes. Keep your bill number handy."
 *   primaryAction={{ label: "Start a payment", href: "/pay" }}
 *   secondaryAction={{ label: "Contact us", href: "/contact" }}
 * />
 */

type CtaAction = BlockAction;

interface CtaBandProps extends Omit<ComponentProps<"section">, "title"> {
  title: ReactNode;
  description?: ReactNode;
  primaryAction: CtaAction;
  secondaryAction?: CtaAction;
  /** Band colour: Well (default) or FTDS Blue Wash. */
  tone?: "well" | "primary";
}

const CtaBand: ForwardRefExoticComponent<
  CtaBandProps & RefAttributes<HTMLElement>
> = forwardRef(
  (
    {
      title,
      description,
      primaryAction,
      secondaryAction,
      tone = "well",
      className,
      ...props
    },
    ref,
  ) => {
    const titleId = useId();
    return (
      <section
        ref={ref}
        aria-labelledby={titleId}
        className={clx(band_cva({ tone }), className)}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-12 md:px-6 md:py-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <SectionHeading
            titleId={titleId}
            title={title}
            description={description}
            className="max-w-[680px]"
          />
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {renderAction(primaryAction, "primary-fill")}
            {secondaryAction &&
              // Ghost hover must differ from the band: wash on Well, Raised on wash.
              (tone === "well"
                ? renderAction(secondaryAction, "primary-ghost")
                : renderAction(
                    secondaryAction,
                    "default-ghost",
                    "hover:bg-bg-raised",
                  ))}
          </div>
        </div>
      </section>
    );
  },
);
CtaBand.displayName = "CtaBand";

export { CtaBand };
export type { CtaBandProps, CtaAction };
