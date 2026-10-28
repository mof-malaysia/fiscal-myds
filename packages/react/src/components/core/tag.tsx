import { ComponentProps, forwardRef } from "react";
import { cva } from "class-variance-authority";
import { clx } from "../../utils";

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

const tag_cva = cva(
  [
    "font-body inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium",
    "[&>svg]:size-3.5 [&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // Washed-active: the same grey as Well in light, one step up in dark so it shows
        default: "bg-bg-washed-active text-txt-black-700",
        primary: "bg-bg-primary-50 text-txt-primary",
        success: "bg-bg-success-50 text-txt-success",
        danger: "bg-bg-danger-50 text-txt-danger",
        warning: "bg-bg-warning-50 text-txt-warning",
      },
      size: {
        // The DESIGN.md badge: Label Compact, 2px 10px
        small: "text-label-compact h-[22px] px-2.5",
        medium: [
          "text-label-sm h-6 px-2.5",
          "in-data-[density=compact]:text-label-compact in-data-[density=compact]:h-[22px]",
        ],
        large: [
          "h-8 px-3 text-base leading-6",
          "in-data-[density=compact]:text-label-sm in-data-[density=compact]:h-6 in-data-[density=compact]:px-2.5",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);

const dot_cva = cva("inline-block shrink-0 rounded-full bg-current", {
  variants: {
    size: {
      small: "size-1.5",
      medium: "size-1.5",
      large: "size-2",
    },
  },
});

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
      {dot && <span aria-hidden className={dot_cva({ size })} />}
      {children}
    </span>
  ),
);
Tag.displayName = "Tag";

export { Tag };
export type { TagProps };
