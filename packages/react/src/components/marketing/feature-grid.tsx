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
import { Link } from "../core/link";
import { ArrowForwardIcon } from "../../icons/arrow-forward";
import { SectionHeading } from "./section-heading";
import {
  grid_cva,
  item_cva,
} from "@mof-malaysia/ftds-style/variants/feature-grid";

/**
 * FeatureGrid introduces what a service offers: a section title and intro,
 * then a responsive grid (1 / 2 / 3 columns) of features. Each feature has an
 * icon in a primary-wash circle, a title, supporting text and an optional link.
 *
 * @example
 * <FeatureGrid
 *   title="Everything in one account"
 *   description="One MyDigital ID for every MOF service."
 *   features={[
 *     { icon: <MoneyIcon />, title: "Pay online", description: "FPX, cards and e-wallets.", href: "/pay" },
 *   ]}
 * />
 */

interface Feature {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  /** Link text. Defaults to the grid's `linkLabel`. */
  linkLabel?: ReactNode;
}

interface FeatureGridProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  features: Feature[];
  /** Columns on desktop. Defaults to 3. */
  columns?: 2 | 3;
  /** `"sheet"` puts each feature on a Sheet surface. Defaults to `"none"`. */
  surface?: "none" | "sheet";
  /** Default link text for features with an `href`. */
  linkLabel?: ReactNode;
}

const FeatureGrid: ForwardRefExoticComponent<
  FeatureGridProps & RefAttributes<HTMLElement>
> = forwardRef(
  (
    {
      title,
      description,
      features,
      columns = 3,
      surface = "none",
      linkLabel = "Learn more",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const titleId = useId();
    return (
      <section
        ref={ref}
        aria-labelledby={title ? titleId : undefined}
        className={clx("bg-bg-gray-50 font-body w-full", className)}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-12 md:px-6 md:py-16 lg:gap-12 lg:py-24">
          <SectionHeading
            titleId={titleId}
            title={title}
            description={description}
            className="max-w-[720px]"
          />
          <ul className={grid_cva({ columns })}>
            {features.map((feature, i) => (
              <li key={i} className={item_cva({ surface })}>
                {feature.icon && (
                  <span
                    aria-hidden
                    className="bg-bg-primary-50 text-txt-primary flex size-12 shrink-0 items-center justify-center rounded-full [&_svg]:size-6"
                  >
                    {feature.icon}
                  </span>
                )}
                <div className="flex flex-col gap-2">
                  <h3 className="text-txt-black-900 text-title font-semibold">
                    {feature.title}
                  </h3>
                  {feature.description && (
                    <p className="text-txt-black-700 text-content">
                      {feature.description}
                    </p>
                  )}
                </div>
                {feature.href && (
                  <Link
                    href={feature.href}
                    primary
                    underline="hover"
                    className="text-label-md inline-flex items-center gap-1.5 font-medium"
                  >
                    {feature.linkLabel ?? linkLabel}
                    {typeof feature.title === "string" && (
                      <span className="sr-only">: {feature.title}</span>
                    )}
                    <ArrowForwardIcon aria-hidden className="size-4" />
                  </Link>
                )}
              </li>
            ))}
          </ul>
          {children}
        </div>
      </section>
    );
  },
);
FeatureGrid.displayName = "FeatureGrid";

export { FeatureGrid };
export type { FeatureGridProps, Feature };
