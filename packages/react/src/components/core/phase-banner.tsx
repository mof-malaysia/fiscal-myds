import React, { forwardRef, ForwardRefExoticComponent, ReactNode } from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { Tag } from "./tag";
import { Link } from "./link";
import { clx } from "../../utils";

type TagProps = React.ComponentProps<typeof Tag>;

/**
 * PhaseBanner tells users which stage a service is at (Alpha, Beta, Maintenance)
 * and invites feedback. Place it directly under the masthead or top bar; it
 * scrolls away with the page and is never sticky. Paper background with one
 * Hairline rule beneath, like the top bar.
 *
 * @example
 * <PhaseBanner phase="Beta">
 *   This is a new service. Your <PhaseBannerLink href="/feedback">feedback</PhaseBannerLink> will help us improve it.
 * </PhaseBanner>
 */

interface PhaseBannerProps extends useRender.ComponentProps<"div"> {
  /** The phase shown in the tag, e.g. "Alpha", "Beta", "Maintenance". */
  phase?: ReactNode;
  /** Tag colour. Primary for Alpha/Beta, warning for Maintenance, default for Retired. */
  tagVariant?: TagProps["variant"];
  /** Class for the inner max-width row. */
  containerClassName?: string;
}

const PhaseBanner: ForwardRefExoticComponent<PhaseBannerProps> = forwardRef(
  (
    {
      render,
      className,
      containerClassName,
      phase = "Beta",
      tagVariant = "primary",
      children,
      ...props
    },
    ref,
  ) =>
    useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          className: clx(
            "bg-bg-gray-50 border-otl-gray-200 font-body w-full border-b",
            className,
          ),
          children: (
            <div
              className={clx(
                "gap-stack-sm mx-auto flex w-full max-w-[1280px] items-start px-[18px] py-3 md:items-center md:px-6",
                "in-data-[density=compact]:py-2",
                containerClassName,
              )}
            >
              <Tag
                variant={tagVariant}
                size="medium"
                mode="pill"
                className="max-md:text-label-compact max-md:h-[22px] max-md:px-2 max-md:py-0.5"
              >
                {phase}
              </Tag>
              <p className="text-txt-black-700 text-content m-0 min-w-0">
                {children}
              </p>
            </div>
          ),
        },
        props,
      ),
    }),
);
PhaseBanner.displayName = "PhaseBanner";

interface PhaseBannerLinkProps extends useRender.ComponentProps<"a"> {}

/** The feedback link inside the message. Pass `render` to use your router's link. */
const PhaseBannerLink: ForwardRefExoticComponent<PhaseBannerLinkProps> =
  forwardRef(({ className, ...props }, ref) => (
    <Link
      ref={ref}
      primary
      underline="always"
      className={clx("font-medium", className)}
      {...props}
    />
  ));
PhaseBannerLink.displayName = "PhaseBannerLink";

export { PhaseBanner, PhaseBannerLink };
export type { PhaseBannerProps, PhaseBannerLinkProps };
