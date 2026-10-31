import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { forwardRef, ForwardRefExoticComponent } from "react";
import { type VariantProps } from "class-variance-authority";
import { clx } from "../../utils";
import { link_cva } from "@mof-malaysia/ftds-style/variants/link";

interface LinkProps
  extends useRender.ComponentProps<"a">, VariantProps<typeof link_cva> {
  newTab?: boolean;
}

/**
 * The Link component extends the `<a>` element, customised according to the FTDS theme.
 * @example
 * <Link href="https://www.mof.gov.my" newTab primary underline="always">Ministry of Finance</Link>
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
