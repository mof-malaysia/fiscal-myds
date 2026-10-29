import React, { forwardRef, ForwardRefExoticComponent } from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { ArrowBackIcon } from "../../icons/arrow-back";
import { clx } from "../../utils";
import { link_cva } from "./link";

/**
 * Backlink takes the user to the previous step of a multi-page flow. Place it at
 * the top of the page, above the heading. Give it context where it helps:
 * "Back to Payment details". Pass `render` to use your router's link.
 *
 * @example
 * <Backlink href="/apply/details" />
 * <Backlink render={<NextLink href="/payments" />}>Back to Payments</Backlink>
 */

interface BacklinkProps extends useRender.ComponentProps<"a"> {}

const Backlink: ForwardRefExoticComponent<BacklinkProps> = forwardRef(
  ({ render, className, children = "Back", ...props }, ref) =>
    useRender({
      defaultTagName: "a",
      render,
      ref,
      props: mergeProps<"a">(
        {
          className: clx(
            "group font-body text-content text-txt-black-700 hover:text-txt-black-900 inline-flex w-fit items-center gap-1.5 rounded-xs font-medium",
            "transition-colors duration-150 outline-none motion-reduce:transition-none",
            "focus-ring",
            className,
          ),
          children: (
            <>
              <ArrowBackIcon aria-hidden className="size-4 shrink-0" />
              <span
                className={link_cva({
                  underline: "always",
                  className: "group-hover:decoration-2",
                })}
              >
                {children}
              </span>
            </>
          ),
        },
        props,
      ),
    }),
);
Backlink.displayName = "Backlink";

export { Backlink };
export type { BacklinkProps };
