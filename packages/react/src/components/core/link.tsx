import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { forwardRef, ForwardRefExoticComponent } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { clx } from "../../utils";

interface LinkProps
  extends useRender.ComponentProps<"a">,
    VariantProps<typeof link_cva> {
  newTab?: boolean;
}

const link_cva = cva(
  "decoration-1 underline-offset-[3px] transition-colors rounded-xs outline-none focus-ring",
  {
    variants: {
      underline: {
        always: "underline hover:decoration-2",
        hover: "no-underline hover:underline",
        none: "no-underline",
      },
      primary: {
        true: "text-txt-primary",
        false: "text-inherit decoration-inherit",
      },
    },
  },
);

/**
 * The Link component extends the `<a>` element, customised according to the MYDS theme.
 * @example
 * <Link href="https://design.digital.gov.my" newTab primary underline="always">MYDS</Link>
 * @see {@link https://design.digital.gov.my/?path=/docs/myds-react-link--docs}
 */
const Link: ForwardRefExoticComponent<LinkProps> = forwardRef(
  (
    {
      render,
      className,
      href,
      newTab = false,
      primary = false,
      underline = "always",
      ...props
    },
    ref,
  ) => {
    return useRender({
      defaultTagName: "a",
      render,
      ref,
      props: mergeProps<"a">(
        {
          href,
          className: clx(link_cva({ primary, underline }), className),
          target: newTab ? "_blank" : "_self",
          rel: newTab ? "noopener noreferrer" : undefined,
        },
        props,
      ),
    });
  },
);
Link.displayName = "Link";

export { Link, link_cva };
export type { LinkProps };
