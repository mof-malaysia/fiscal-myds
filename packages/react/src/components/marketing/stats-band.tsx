// registry:block — composed page section, installs to components/blocks
import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useId,
} from "react";
import { cva } from "class-variance-authority";
import { clx } from "../../utils";
import { SectionHeading } from "./section-heading";

/**
 * StatsBand shows two to four headline figures on a Well band. Each figure
 * is set large in tabular figures with a label and an optional footnote; the
 * markup is a description list, so screen readers hear the label first.
 *
 * @example
 * <StatsBand
 *   title="The service in numbers"
 *   stats={[
 *     { value: "RM 4.2 bil", label: "Collected online in 2025" },
 *     { value: "1.8 juta", label: "Payments a month", footnote: "Average, Jan–Sep 2026" },
 *   ]}
 *   source="Source: Kementerian Kewangan, September 2026"
 * />
 */

interface Stat {
  value: ReactNode;
  label: ReactNode;
  footnote?: ReactNode;
}

const grid_cva = cva("grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2", {
  variants: {
    count: {
      1: "sm:grid-cols-1",
      2: "",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
    },
  },
  defaultVariants: { count: 3 },
});

interface StatsBandProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Two to four figures. Extra items are dropped. */
  stats: Stat[];
  /** Source or date line under the figures. */
  source?: ReactNode;
}

const StatsBand: ForwardRefExoticComponent<
  StatsBandProps & RefAttributes<HTMLElement>
> = forwardRef(
  ({ title, description, stats, source, className, ...props }, ref) => {
    const titleId = useId();
    const shown = stats.slice(0, 4);
    const count = Math.max(1, shown.length) as 1 | 2 | 3 | 4;

    return (
      <section
        ref={ref}
        aria-labelledby={title ? titleId : undefined}
        className={clx("bg-bg-washed font-body w-full", className)}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-12 md:px-6 md:py-16">
          <SectionHeading
            titleId={titleId}
            title={title}
            description={description}
            responsive={false}
            className="max-w-[720px]"
          />
          <dl className={grid_cva({ count })}>
            {shown.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <dt className="text-txt-black-700 text-body-md order-2 font-medium">
                  {stat.label}
                </dt>
                <dd className="text-txt-black-900 text-heading-md lg:text-heading-lg order-1 font-semibold tracking-[-0.02em] tabular-nums [font-feature-settings:'tnum'_1,'cv11'_1]">
                  {stat.value}
                </dd>
                {stat.footnote && (
                  <dd className="text-txt-black-700 text-body-sm order-3">
                    {stat.footnote}
                  </dd>
                )}
              </div>
            ))}
          </dl>
          {source && (
            <p className="text-txt-black-700 text-body-sm">{source}</p>
          )}
        </div>
      </section>
    );
  },
);
StatsBand.displayName = "StatsBand";

export { StatsBand };
export type { StatsBandProps, Stat };
