import {
  ComponentProps,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  FunctionComponent,
  JSXElementConstructor,
  ReactElement,
  useContext,
} from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { clx } from "@/lib/ftds/utils";
import { cva } from "class-variance-authority";
import {
  tabs_indicator_cva,
  tabs_list_cva,
  tabs_trigger_cva,
} from "@/components/ui/tabs.variants";
import { useRender } from "@base-ui/react/use-render";

/**
 * Tabs switch between views of the same subject. There is one style (DESIGN.md,
 * Navigation): Label type in Ink Secondary on a single Hairline, the active tab in Ink
 * with a 2px FTDS Blue underline that slides between tabs. No pills, no boxes.
 *
 * Tab height follows `data-density`; `size` steps it within the density.
 *
 * @example
 * <Tabs defaultValue="details">
 *   <TabsList>
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *     <TabsTrigger value="documents">
 *       Documents <TabsCounter>3</TabsCounter>
 *     </TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="details">...</TabsContent>
 *   <TabsContent value="documents">...</TabsContent>
 * </Tabs>
 */

/*========================================================================================================================*/

/** Base UI parts accept a state function for className; FTDS keeps it a plain string. */
type WithStringClassName<P> = Omit<P, "className"> & { className?: string };

interface TabsProps extends WithStringClassName<TabsPrimitive.Root.Props> {
  /** @default "small" */
  size?: "small" | "medium";
  /**
   * `automatic` activates a tab when it receives keyboard focus, `manual` requires Enter/Space.
   * @default "automatic"
   */
  activationMode?: "automatic" | "manual";
}

const TabsContext = createContext<Pick<TabsProps, "size" | "activationMode">>({
  size: "small",
  activationMode: "automatic",
});

/*========================================================================================================================*/

const Tabs: ForwardRefExoticComponent<TabsProps> = forwardRef(
  (
    { size = "small", activationMode = "automatic", className, ...props },
    ref,
  ) => (
    <TabsContext.Provider value={{ size, activationMode }}>
      <TabsPrimitive.Root
        ref={ref}
        className={clx("font-body flex flex-col", className)}
        {...props}
      />
    </TabsContext.Provider>
  ),
);
Tabs.displayName = "Tabs";

/*========================================================================================================================*/

interface TabsListProps extends WithStringClassName<TabsPrimitive.List.Props> {
  /**
   * `full` runs the Hairline across the container; `fit` stops it at the last tab.
   * @default "fit"
   */
  width?: "fit" | "full";
}

const TabsList: ForwardRefExoticComponent<TabsListProps> = forwardRef(
  ({ className, width = "fit", children, ...props }, ref) => {
    const { activationMode } = useContext(TabsContext);

    return (
      <TabsPrimitive.List
        ref={ref}
        activateOnFocus={activationMode !== "manual"}
        className={clx(tabs_list_cva({ width }), className)}
        {...props}
      >
        {children}
        <TabsPrimitive.Indicator className={tabs_indicator_cva()} />
      </TabsPrimitive.List>
    );
  },
);
TabsList.displayName = "TabsList";

/*========================================================================================================================*/

const TabsTrigger: ForwardRefExoticComponent<
  WithStringClassName<TabsPrimitive.Tab.Props>
> = forwardRef(({ className, ...props }, ref) => {
  const { size } = useContext(TabsContext);
  return (
    <TabsPrimitive.Tab
      ref={ref}
      className={tabs_trigger_cva({ size, className })}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

/*========================================================================================================================*/

const tab_icon_cva = cva("block shrink-0 stroke-inherit text-inherit", {
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

interface TabsIconProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

const TabsIcon: FunctionComponent<TabsIconProps> = ({ children }) => {
  const { size } = useContext(TabsContext);

  return useRender({
    render: children,
    props: { className: tab_icon_cva({ size }), "aria-hidden": true },
  });
};
TabsIcon.displayName = "TabsIcon";

/*========================================================================================================================*/

/** A count beside the tab label: a neutral wash pill in tabular figures. */
const TabsCounter: ForwardRefExoticComponent<ComponentProps<"span">> =
  forwardRef(({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={clx(
        "bg-bg-washed-active text-txt-black-700 text-label-compact inline-flex min-w-5 justify-center rounded-full px-1.5 font-medium tabular-nums",
        className,
      )}
      {...props}
    />
  ));
TabsCounter.displayName = "TabsCounter";

/*========================================================================================================================*/

const TabsContent: ForwardRefExoticComponent<
  WithStringClassName<TabsPrimitive.Panel.Props>
> = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Panel
    ref={ref}
    className={clx(
      "text-txt-black-900 text-content focus-ring rounded-md pt-(--space-stack-md)",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

/*========================================================================================================================*/

export { Tabs, TabsIcon, TabsCounter, TabsList, TabsTrigger, TabsContent };
export type { TabsProps, TabsListProps };
