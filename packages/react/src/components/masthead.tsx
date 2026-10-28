import {
  ComponentProps,
  FunctionComponent,
  ReactNode,
  MouseEvent,
  isValidElement,
} from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronDownIcon } from "../icons/chevron-down";
import { MalaysiaFlagIcon } from "../icons/malaysia-flag";
import { clx } from "../utils";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";

const Masthead: FunctionComponent<ComponentProps<"div">> = ({
  children,
  className,
  ...props
}) => {
  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     const details = document.getElementById(
  //       "masthead",
  //     ) as HTMLDetailsElement | null;

  //     if (
  //       event.altKey &&
  //       (event.metaKey || event.ctrlKey) &&
  //       event.key === "Enter"
  //     ) {
  //       event.preventDefault();
  //       if (details) {
  //         details.open = !details.open;
  //       }
  //     }

  //     if ((event.metaKey || event.ctrlKey) && event.key === "k") {
  //       event.preventDefault();
  //     }
  //   };

  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => document.removeEventListener("keydown", handleKeyDown);
  // }, []);

  return (
    <CollapsiblePrimitive.Root>
      <div
        id="masthead"
        className={clx("bg-bg-washed print:hidden", className)}
        data-nosnippet
        {...props}
      >
        <div className="mx-auto grid w-full max-w-screen-xl transition-[grid-template-rows] duration-500 outline-none print:hidden">
          {children}
        </div>
      </div>
    </CollapsiblePrimitive.Root>
  );
};

Masthead.displayName = "Masthead";

const MastheadHeader: FunctionComponent<ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div
      className="flex items-center gap-2 overflow-x-hidden px-4.5 py-2 outline-none sm:py-1 md:px-6"
      {...props}
    >
      <MalaysiaFlagIcon className="inline-block aspect-auto w-fit shrink-0" />
      <div className="text-txt-black-700 text-body-sm flex w-full items-center justify-between truncate sm:justify-start">
        {children}
      </div>
    </div>
  );
};

MastheadHeader.displayName = "MastheadHeader";

const MastheadTitle: FunctionComponent<ComponentProps<"p">> = ({
  className,
  ...props
}) => {
  return (
    <p
      className={clx(
        "text-txt-black-700 text-body-sm truncate sm:max-w-full sm:flex-grow-0",
        className,
      )}
      {...props}
    />
  );
};

MastheadTitle.displayName = "MastheadTitle";

const MastheadTrigger: FunctionComponent<ComponentProps<"button">> = ({
  children,
  onClick,
  ...props
}) => {
  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(event);
  };

  return (
    <CollapsiblePrimitive.Trigger
      className="text-txt-primary focus-visible:ring-fr-primary bg-otl-gray-200 group flex items-center gap-0.5 rounded-md p-1 px-1 focus:outline-none focus-visible:ring focus-visible:ring-inset sm:bg-transparent sm:pl-1.5 xl:rounded-sm"
      aria-label="Toggle masthead"
      tabIndex={0}
      onClick={handleToggle}
      {...props}
    >
      <span className="text-txt-primary hidden tracking-[-0.01em] select-none sm:block">
        {children}
      </span>
      <ChevronDownIcon className="size-4 rotate-0 transform transition-transform group-data-[panel-open]:rotate-180" />
    </CollapsiblePrimitive.Trigger>
  );
};

MastheadTrigger.displayName = "MastheadTrigger";

const MastheadContent: FunctionComponent<
  Omit<CollapsiblePrimitive.Panel.Props, "className"> & { className?: string }
> = ({ children, className, ...props }) => {
  return (
    <CollapsiblePrimitive.Panel
      className={clx(
        "h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-300 ease-out",
        "data-[ending-style]:h-0 data-[starting-style]:h-0",
        "motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-4.5 px-4.5 pt-3 pb-6 sm:grid-cols-2 sm:flex-row sm:pt-6 sm:pb-8 md:px-6">
        {children}
      </div>
    </CollapsiblePrimitive.Panel>
  );
};

MastheadContent.displayName = "MastheadContent";

interface MastheadSectionProps extends ComponentProps<"div"> {
  icon: ReactNode;
  title: string;
}

const MastheadSection: FunctionComponent<MastheadSectionProps> = ({
  icon,
  children,
  title,
  className,
  ...props
}) => {
  const iconIsElement = isValidElement(icon);
  // Merges the icon classes onto the `icon` element.
  const iconElement = useRender({
    defaultTagName: "span",
    render: iconIsElement ? icon : undefined,
    props: mergeProps<"span">(
      { className: "text-txt-black-500 size-6 shrink-0" },
      iconIsElement ? {} : { children: icon },
    ),
  });

  return (
    <div className={clx("flex w-full gap-3", className)} {...props}>
      {iconElement}
      <div className="space-y-1.5">
        <p className="text-txt-black-900 text-body-sm sm:text-body-md font-medium">
          {title}
        </p>
        <p className="text-txt-black-700 text-body-sm max-w-[50ch] text-balance">
          {children}
        </p>
      </div>
    </div>
  );
};

MastheadSection.displayName = "MastheadSection";

// Exports
export {
  Masthead,
  MastheadHeader,
  MastheadTitle,
  MastheadTrigger,
  MastheadContent,
  MastheadSection,
};
