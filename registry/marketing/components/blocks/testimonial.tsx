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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Testimonial shows what people say about a service. One quote renders as a
 * large centred pull quote; two or three render as a grid of Sheet panels.
 * Each quote has the person's name, an optional role and an optional avatar.
 * Marked up as `<figure>` / `<blockquote>` / `<figcaption>`.
 *
 * @example
 * <Testimonial
 *   items={[{ quote: "I paid my assessment in five minutes.", name: "Nurul Aina", role: "Business owner, Shah Alam" }]}
 * />
 */

interface TestimonialItem {
  quote: ReactNode;
  name: ReactNode;
  role?: ReactNode;
  /** Avatar image URL. Decorative: the name is the label. */
  avatar?: string;
}

interface TestimonialProps extends Omit<ComponentProps<"section">, "title"> {
  title?: ReactNode;
  /** One to three quotes. Extra items are dropped. */
  items: TestimonialItem[];
}

const initials = (name: ReactNode) =>
  typeof name === "string"
    ? name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
    : null;

const Person = ({ item }: { item: TestimonialItem }) => (
  <figcaption className="flex items-center gap-3">
    {item.avatar && (
      <Avatar className="size-11">
        <AvatarImage
          src={item.avatar}
          alt=""
          width={44}
          height={44}
          loading="lazy"
        />
        {/* The name sits beside it, so the initials are decorative */}
        <AvatarFallback aria-hidden>{initials(item.name)}</AvatarFallback>
      </Avatar>
    )}
    <span className="flex flex-col text-left">
      <span className="text-txt-black-900 text-body-md font-semibold">
        {item.name}
      </span>
      {item.role && (
        <span className="text-txt-black-700 text-body-sm">{item.role}</span>
      )}
    </span>
  </figcaption>
);

const Testimonial: ForwardRefExoticComponent<
  TestimonialProps & RefAttributes<HTMLElement>
> = forwardRef(({ title, items, className, ...props }, ref) => {
  const titleId = useId();
  const shown = items.slice(0, 3);
  const first = shown[0];
  const single = shown.length === 1;

  return (
    <section
      ref={ref}
      aria-labelledby={title ? titleId : undefined}
      className={clx("bg-bg-gray-50 font-body w-full", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 py-12 md:px-6 md:py-16 lg:py-24">
        <SectionHeading
          titleId={titleId}
          title={title}
          className={clx(single && "text-center")}
        />
        {single && first ? (
          <figure className="mx-auto flex max-w-[860px] flex-col items-center gap-8 text-center">
            <blockquote className="text-txt-black-900 text-heading-2xs md:text-heading-xs font-medium tracking-[-0.01em] text-balance">
              <p>{first.quote}</p>
            </blockquote>
            <Person item={first} />
          </figure>
        ) : (
          <ul
            className={clx(
              "grid grid-cols-1 gap-6 md:grid-cols-2",
              shown.length === 3 && "lg:grid-cols-3",
            )}
          >
            {shown.map((item, i) => (
              <li key={i} className="flex">
                <figure className="bg-bg-white p-surface flex w-full flex-col justify-between gap-6 rounded-lg">
                  <blockquote className="text-txt-black-900 text-body-lg">
                    <p>{item.quote}</p>
                  </blockquote>
                  <Person item={item} />
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
});
Testimonial.displayName = "Testimonial";

export { Testimonial };
export type { TestimonialProps, TestimonialItem };
