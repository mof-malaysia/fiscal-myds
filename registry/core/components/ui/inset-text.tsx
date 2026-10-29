import { forwardRef, ForwardRefExoticComponent } from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { clx } from "@/lib/ftds/utils";

/**
 * InsetText sets a passage apart from the text around it: a deadline, a
 * requirement, a quote. It sits in a Well with no side stripe (DESIGN.md: tone,
 * not lines). For a status or warning with an icon, use a Callout instead.
 * Render it as a `<blockquote>` for quotes and add an `InsetTextAuthor`.
 *
 * @example
 * <InsetText>
 *   You must submit your declaration by 30 April 2026 to avoid a late penalty.
 * </InsetText>
 *
 * <InsetText render={<figure />}>
 *   <blockquote>Public money must be spent with care.</blockquote>
 *   <InsetTextAuthor>Minister of Finance</InsetTextAuthor>
 * </InsetText>
 */

interface InsetTextProps extends useRender.ComponentProps<"div"> {}

const InsetText: ForwardRefExoticComponent<InsetTextProps> = forwardRef(
  ({ render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps<"div">(
        {
          className: clx(
            "bg-bg-washed text-txt-black-900 font-body text-content flex max-w-[70ch] flex-col gap-stack-sm rounded-lg p-surface",
            className,
          ),
        },
        props,
      ),
    }),
);
InsetText.displayName = "InsetText";

interface InsetTextAuthorProps extends useRender.ComponentProps<"figcaption"> {}

/** Who said it. Renders a `<figcaption>`, so render the InsetText as a `<figure>`. */
const InsetTextAuthor: ForwardRefExoticComponent<InsetTextAuthorProps> =
  forwardRef(({ render, className, ...props }, ref) =>
    useRender({
      defaultTagName: "figcaption",
      render,
      ref,
      props: mergeProps<"figcaption">(
        {
          className: clx(
            "text-txt-black-700 text-label-md font-medium",
            className,
          ),
        },
        props,
      ),
    }),
  );
InsetTextAuthor.displayName = "InsetTextAuthor";

export { InsetText, InsetTextAuthor };
export type { InsetTextProps, InsetTextAuthorProps };
