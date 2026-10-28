import {
  ComponentProps,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  JSXElementConstructor,
  LegacyRef,
  ReactElement,
  ReactNode,
  useContext,
} from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { clx } from "../utils";
import { cva } from "class-variance-authority";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";

/*========================================================================================================================*/

/** Base UI parts accept a state function for className; MYDS keeps it a plain string. */
type WithStringClassName<P> = Omit<P, "className"> & { className?: string };

interface TabsProps extends WithStringClassName<TabsPrimitive.Root.Props> {
  variant?: "pill" | "enclosed" | "line";
  size?: "small" | "medium";
  /**
   * `automatic` activates a tab when it receives keyboard focus, `manual` requires Enter/Space.
   * @default "automatic"
   */
  activationMode?: "automatic" | "manual";
}

const TabsContext = createContext<
  Pick<TabsProps, "variant" | "size" | "activationMode">
>({
  variant: "line",
  size: "small",
  activationMode: "automatic",
});

/*========================================================================================================================*/

const Tabs: ForwardRefExoticComponent<TabsProps> = forwardRef(
  ({ variant, size, activationMode = "automatic", ...props }, ref) => (
    <TabsContext.Provider value={{ variant, size, activationMode }}>
      <TabsPrimitive.Root ref={ref} {...props} />
    </TabsContext.Provider>
  ),
);
Tabs.displayName = "Tabs";

/*========================================================================================================================*/

const tabs_list_cva = cva(
  "relative flex flex-row items-center space-x-1 justify-start font-medium py-1",
  {
    variants: {
      variant: {
        pill: "bg-transparent rounded-full",
        enclosed: "bg-bg-washed rounded-md",
        line: "before:h-[1px] before:absolute before:-bottom-[9px] before:bg-otl-gray-200 before:left-0 before:right-0",
      },
      width: {
        full: "w-full",
        fit: "w-fit",
      },
    },
    defaultVariants: {
      variant: "line",
    },
  },
);

interface TabsListProps
  extends WithStringClassName<TabsPrimitive.List.Props> {
  width?: "fit" | "full";
}

const TabsList: ForwardRefExoticComponent<TabsListProps> = forwardRef(
  ({ className, width = "fit", ...props }, ref) => {
    const { variant, activationMode } = useContext(TabsContext);

    return (
      <TabsPrimitive.List
        ref={ref}
        activateOnFocus={activationMode !== "manual"}
        className={tabs_list_cva({ variant, width, className })}
        {...props}
      />
    );
  },
);
TabsList.displayName = "TabsList";

/*========================================================================================================================*/

const tabs_trigger_cva = cva(
  [
    "relative flex gap-1 items-center text-txt-black-500 hover:text-txt-black-900 data-[active]:text-txt-black-900 outline-none border border-transparent",
    "focus:ring-2 focus:ring-fr-primary space",
  ],
  {
    variants: {
      variant: {
        pill: [
          "bg-transparent data-[active]:bg-bg-washed-active transition-colors rounded-full",
        ],
        enclosed: [
          "data-[active]:bg-bg-dialog-active rounded-md transition-[border] data-[active]:border-otl-gray-200",
          // "before:h-auto before:w-[1px] before:content-[''] before:absolute before:-left-1 before:bg-otl-gray-300 before:first-of-type:hidden",
        ],
        line: "rounded-md before:h-0.5 before:content-[''] before:absolute before:-bottom-2.5 before:left-0 before:right-0 data-[active]:before:bg-primary-600 before:transition-all before:duration-200",
      },
      size: {
        small: "text-body-sm py-1.5 px-2.5",
        medium: "text-body-md py-2 px-3",
      },
    },
    compoundVariants: [
      {
        variant: "enclosed",
        size: "small",
        className: "before:py-2",
      },
      {
        variant: "enclosed",
        size: "medium",
        className: "before:py-2.5",
      },
      {
        variant: "line",
        size: "small",
        className: "before:mx-2.5",
      },
      {
        variant: "line",
        size: "medium",
        className: "before:mx-3",
      },
    ],
    defaultVariants: {
      variant: "line",
      size: "small",
    },
  },
);

const TabsTrigger: ForwardRefExoticComponent<
  WithStringClassName<TabsPrimitive.Tab.Props>
> = forwardRef(({ className, ...props }, ref) => {
  const { variant, size } = useContext(TabsContext);
  return (
    <TabsPrimitive.Tab
      ref={ref}
      className={tabs_trigger_cva({ variant, size, className })}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

/*========================================================================================================================*/

const tab_icon_cva = cva(
  "block shrink-0 stroke-inherit text-inherit stroke-[1.5px]",
  {
    variants: {
      size: {
        small: "size-4",
        medium: "size-5",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

interface TabsIconProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

const TabsIcon: FunctionComponent<TabsIconProps> = ({ children }) => {
  const { size } = useContext(TabsContext);

  return useRender({
    render: children,
    props: mergeProps<"svg">({ className: clx(tab_icon_cva({ size })) }, {}),
  });
};

TabsIcon.displayName = "TabsIcon";
/*========================================================================================================================*/

interface TabsCounterProps extends ComponentProps<"span"> {
  children: ReactNode;
  ref?: LegacyRef<HTMLSpanElement>;
}

const TabsCounter: ForwardRefExoticComponent<TabsCounterProps> = forwardRef(
  ({ children, ...props }, ref) => {
    const { size } = useContext(TabsContext);
    return (
      <span
        ref={ref}
        className={clx(
          size === "medium" && "text-body-md",
          size === "small" && "text-body-sm",
          "text-txt-primary",
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

TabsCounter.displayName = "TabsCounter";

/*========================================================================================================================*/

const TabsContent: ForwardRefExoticComponent<
  WithStringClassName<TabsPrimitive.Panel.Props>
> = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={clx("text-txt-black-700", className)}
    {...props}
  />
));

TabsContent.displayName = "TabsContent";

/*========================================================================================================================*/

export { Tabs, TabsIcon, TabsCounter, TabsList, TabsTrigger, TabsContent };
