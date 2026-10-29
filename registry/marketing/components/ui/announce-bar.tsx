import { ComponentProps, forwardRef, ForwardRefExoticComponent } from "react";
import { clx } from "@/lib/ftds/utils";
import { Tag } from "@/components/ui/tag";

/**
 * AnnounceBar is a short notice across the top of an agency site: a status tag
 * and one line of text, such as planned maintenance or a new service. For a
 * service in alpha or beta, use PhaseBanner.
 * @component
 * @example
 * <AnnounceBar>
 *   <AnnounceBarTag variant="warning">
 *     Maintenance
 *   </AnnounceBarTag>
 *   <AnnounceBarDescription>
 *     <p>This service is undergoing maintenance. Thank you for your patience. <Link *underline="always" primary href="#">Send us your feedback here.</Link></p>
 *   </AnnounceBarDescription>
 * </AnnounceBar>
 */

interface AnnounceBarProps extends ComponentProps<"div"> {
  border?: boolean;
}
const AnnounceBar: ForwardRefExoticComponent<AnnounceBarProps> = forwardRef(
  ({ className, children, border = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "mx-[18px] flex flex-row gap-2 py-2 md:mx-6",
          border && "border-otl-gray-200 border-b",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

const AnnounceBarTag: typeof Tag = Tag;

const AnnounceBarDescription: ForwardRefExoticComponent<ComponentProps<"div">> =
  forwardRef(({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clx(
          "text-txt-black-700 font-body text-content flex min-h-[28px] items-center",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  });

export { AnnounceBar, AnnounceBarTag, AnnounceBarDescription };
