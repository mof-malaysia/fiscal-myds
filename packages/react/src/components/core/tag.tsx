import { ComponentProps, forwardRef } from "react";
import { clx } from "../../utils";
import { tag_cva } from "@mof-malaysia/ftds-style/variants/tag";

/**
 * Tag labels the status or category of an item (DESIGN.md, Badges and Tags): a wash
 * background with matching coloured text, pill-shaped, Medium weight, no border. The
 * words carry the meaning, so status never rests on colour alone.
 *
 * Sizes follow `data-density`. `small` is the 13px badge for tables and dense lists in
 * either density. `medium` (the default) is 14px in comfortable and drops to the 13px
 * badge in compact. `large` is 16px for citizen-facing emphasis, 14px in compact.
 *
 * For a tag people can remove, use `Pill`.
 *
 * @example
 * <Tag variant="success">Paid</Tag>
 * <Tag variant="warning" dot>Due in 3 days</Tag>
 */

interface TagProps extends ComponentProps<"span"> {
  /** Shows a dot in the tag's colour before the label. */
  dot?: boolean;
  /** @default "default" */
  variant?: "default" | "primary" | "success" | "danger" | "warning";
  /** @default "medium" */
  size?: "small" | "medium" | "large";
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = "default",
      size = "medium",
      dot = false,
      className,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      className={clx(tag_cva({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span
          aria-hidden
          className={clx(
            "inline-block shrink-0 rounded-full bg-current",
            size === "large" ? "size-2" : "size-1.5",
          )}
        />
      )}
      {children}
    </span>
  ),
);
Tag.displayName = "Tag";

export { Tag };
export type { TagProps };
