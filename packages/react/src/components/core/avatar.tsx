"use client";

import React, {
  ComponentProps,
  ComponentRef,
  createContext,
  forwardRef,
  useContext,
  useMemo,
} from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { clx, type WithClassName } from "../../utils";

/**
 * Avatar shows a person's photo, falling back to their initials on a soft MYDS Blue
 * wash while the image loads or if it fails. Always give the image `alt` text, or
 * put the person's name next to the avatar and leave `alt=""`.
 *
 * `AvatarGroup` overlaps several avatars, each with a ring in the page colour (Paper)
 * so they stay distinct. On a Sheet, pass `ringClassName="ring-bg-white"`.
 *
 * @example
 * <Avatar size="medium">
 *   <AvatarImage src="/officers/aminah.jpg" alt="Aminah binti Yusof" />
 *   <AvatarFallback>AY</AvatarFallback>
 * </Avatar>
 */

const avatar_cva = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
    "bg-bg-primary-50 text-txt-primary font-body font-medium align-middle",
  ],
  {
    variants: {
      size: {
        // Initials never drop below 13px (DESIGN.md: The Floor Rule)
        small: "size-7 text-label-compact",
        medium: "size-10 text-body-sm",
        large: "size-14 text-body-lg",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  },
);

interface AvatarProps
  extends WithClassName<AvatarPrimitive.Root.Props>,
    VariantProps<typeof avatar_cva> {}

const Avatar = forwardRef<
  ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => {
  const group = useContext(AvatarGroupContext);
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={clx(
        avatar_cva({ size: size ?? group?.size }),
        group && clx("ring-2", group.ringClassName),
        className,
      )}
      {...props}
    />
  );
});
Avatar.displayName = "Avatar";

const AvatarImage = forwardRef<
  ComponentRef<typeof AvatarPrimitive.Image>,
  WithClassName<AvatarPrimitive.Image.Props>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={clx("size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

/**
 * Initials (one or two letters) or an icon. Hidden from screen readers when the
 * image has loaded. Use `delay` (ms) to avoid a flash of initials on fast networks.
 */
const AvatarFallback = forwardRef<
  ComponentRef<typeof AvatarPrimitive.Fallback>,
  WithClassName<AvatarPrimitive.Fallback.Props>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={clx(
      "flex size-full items-center justify-center uppercase [&_svg]:size-[60%]",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";

const AvatarGroupContext = createContext<{
  size: AvatarProps["size"];
  ringClassName: string;
} | null>(null);

interface AvatarGroupProps extends ComponentProps<"div"> {
  /** Size applied to every Avatar inside, unless one sets its own. */
  size?: AvatarProps["size"];
  /** Ring colour, matching the surface behind the group. Defaults to Paper. */
  ringClassName?: string;
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    { className, size = "medium", ringClassName = "ring-bg-gray-50", ...props },
    ref,
  ) => {
    const context = useMemo(
      () => ({ size, ringClassName }),
      [size, ringClassName],
    );
    return (
      <AvatarGroupContext.Provider value={context}>
        <div
          ref={ref}
          className={clx(
            "flex items-center",
            size === "small"
              ? "-space-x-1.5"
              : size === "large"
                ? "-space-x-3"
                : "-space-x-2",
            className,
          )}
          {...props}
        />
      </AvatarGroupContext.Provider>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, avatar_cva };
export type { AvatarProps, AvatarGroupProps };
