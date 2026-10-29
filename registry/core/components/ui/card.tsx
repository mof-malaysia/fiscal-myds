import React, { ComponentProps, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clx } from "@/lib/ftds/utils";

/**
 * Card groups related content on its own surface (DESIGN.md: Cards / Containers):
 * Sheet on a Paper page, or `tone="well"` for grouped secondary content. 12px
 * corners, no border, no shadow; 24px padding comfortable, 16px compact.
 *
 * Cards are never nested, and a card that has no job (one paragraph, one button)
 * should just be content on the page. If a card seems to need an edge, the
 * background tones are too close; change the tone, don't add a line.
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Payment summary</CardTitle>
 *     <CardDescription>Assessment year 2025</CardDescription>
 *     <CardAction><Button variant="default-ghost">Edit</Button></CardAction>
 *   </CardHeader>
 *   <CardContent>...</CardContent>
 *   <CardFooter><Button>Pay now</Button></CardFooter>
 * </Card>
 */

const card_cva = cva(
  [
    "font-body text-txt-black-900 flex flex-col rounded-lg",
    "gap-stack-lg p-surface",
  ],
  {
    variants: {
      tone: {
        sheet: "bg-bg-white",
        well: "bg-bg-washed",
      },
    },
    defaultVariants: {
      tone: "sheet",
    },
  },
);

interface CardProps
  extends ComponentProps<"div">,
    VariantProps<typeof card_cva> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, ...props }, ref) => (
    <div ref={ref} className={clx(card_cva({ tone }), className)} {...props} />
  ),
);
Card.displayName = "Card";

/** Title, description and an optional CardAction in the top-right corner. */
const CardHeader = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx(
        "grid auto-rows-min grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1",
        "[&>:not([data-slot=card-action])]:col-start-1",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends ComponentProps<"h3"> {
  /** Heading element; pick the level that fits the page outline. */
  as?: "h2" | "h3" | "h4" | "div";
}

/** Title type: 18px, 600. Renders an `h3` by default. */
const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Comp = "h3", ...props }, ref) => (
    <Comp
      ref={ref}
      className={clx("text-title text-txt-black-900 font-semibold", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

/** Supporting text under the title, in Ink Secondary. */
const CardDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={clx("text-content text-txt-black-700", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

/** Top-right slot in the header for one quiet action (a ghost button or menu). */
const CardAction = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={clx(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  ),
);
CardAction.displayName = "CardAction";

const CardContent = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clx("text-content", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

/** Actions at the bottom. Spacing separates it from the content; no divider. */
const CardFooter = forwardRef<HTMLDivElement, ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clx("gap-stack-sm flex flex-wrap items-center", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  card_cva,
};
export type { CardProps, CardTitleProps };
