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

/**
 * LogoCloud lists the agencies or partners that use a service, as a quiet
 * row of logos. Logos are greyed and slightly faded at rest and return to
 * full colour on hover or focus, so they support the page without competing
 * with it. Every logo needs `alt` text naming the organisation.
 *
 * @example
 * <LogoCloud
 *   title="Agencies using this service"
 *   logos={[{ src: "/lhdn.svg", alt: "Lembaga Hasil Dalam Negeri", href: "https://www.hasil.gov.my" }]}
 * />
 */

interface LogoCloudLogo {
  src: string;
  /** Name of the organisation. Required. */
  alt: string;
  href?: string;
  width?: number;
  height?: number;
}

interface LogoCloudProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  logos: LogoCloudLogo[];
  /** Show the logos greyed out until hovered; set `false` for full colour. @default true */
  muted?: boolean;
}

const LogoCloud: ForwardRefExoticComponent<
  LogoCloudProps & RefAttributes<HTMLElement>
> = forwardRef(({ title, logos, muted = true, className, ...props }, ref) => {
  const titleId = useId();
  const imgClass = clx(
    "h-10 w-auto max-w-[160px] object-contain select-none md:h-12",
    muted &&
      "opacity-70 grayscale transition-[opacity,filter] duration-200 ease-standard group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 motion-reduce:transition-none",
  );

  return (
    <section
      ref={ref}
      aria-labelledby={title ? titleId : undefined}
      className={clx("bg-bg-gray-50 font-body w-full", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-4 py-12 md:px-6 md:py-16">
        {title && (
          <h2
            id={titleId}
            className="text-txt-black-700 text-body-md text-center font-medium"
          >
            {title}
          </h2>
        )}
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 md:gap-x-14">
          {logos.map((logo, i) => {
            const image = (
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                loading="lazy"
                className={imgClass}
              />
            );
            return (
              <li key={i} className="group flex items-center">
                {logo.href ? (
                  <a
                    href={logo.href}
                    className={clx(
                      "group flex items-center rounded-md outline-none",
                      "focus-visible:outline-fr-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-solid",
                    )}
                  >
                    {image}
                  </a>
                ) : (
                  image
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
});
LogoCloud.displayName = "LogoCloud";

export { LogoCloud };
export type { LogoCloudProps, LogoCloudLogo };
