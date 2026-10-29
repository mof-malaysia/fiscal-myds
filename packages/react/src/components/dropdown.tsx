import {
  ComponentProps,
  forwardRef,
  ForwardRefExoticComponent,
  JSXElementConstructor,
  ReactElement,
  RefAttributes,
} from "react";
import { Menu as DropdownPrimitive } from "@base-ui/react/menu";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { cva, VariantProps } from "class-variance-authority";

/**----------------------------------------------
 * *                   INFO
 *   Commented components remain pending
 *   until design for the use case are finalised
 *
 *---------------------------------------------**/

const Dropdown = (props: DropdownPrimitive.Root.Props) => (
  <DropdownPrimitive.Root {...props} />
);
Dropdown.displayName = "Dropdown";

const DropdownTrigger: ForwardRefExoticComponent<
  DropdownPrimitive.Trigger.Props & RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, DropdownPrimitive.Trigger.Props>(
  (props, ref) => {
    return <DropdownPrimitive.Trigger {...props} ref={ref} />;
  },
);
DropdownTrigger.displayName = "DropdownTrigger";

// const DropdownGroup = DropdownPrimitive.Group;

// const DropdownPortal = DropdownPrimitive.Portal;

// const DropdownSub = DropdownPrimitive.Sub;

// const DropdownRadioGroup = DropdownPrimitive.RadioGroup;

// const DropdownSubTrigger = forwardRef<
//   ElementRef<typeof DropdownPrimitive.SubTrigger>,
//   ComponentPropsWithoutRef<typeof DropdownPrimitive.SubTrigger> & {
//     inset?: boolean;
//   }
// >(({ className, inset, children, ...props }, ref) => (
//   <DropdownPrimitive.SubTrigger
//     ref={ref}
//     className={clx(
//       "focus:bg-accent data-[state=open]:bg-accent flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//       inset && "pl-8",
//       className,
//     )}
//     {...props}
//   >
//     {children}
//     <ChevronRightIcon className="ml-auto" />
//   </DropdownPrimitive.SubTrigger>
// ));
// DropdownSubTrigger.displayName = DropdownPrimitive.SubTrigger.displayName;

// const DropdownSubContent = forwardRef<
//   ElementRef<typeof DropdownPrimitive.SubContent>,
//   ComponentPropsWithoutRef<typeof DropdownPrimitive.SubContent>
// >(({ className, ...props }, ref) => (
//   <DropdownPrimitive.SubContent
//     ref={ref}
//     className={clx(
//       "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
//       className,
//     )}
//     {...props}
//   />
// ));
// DropdownSubContent.displayName = DropdownPrimitive.SubContent.displayName;

const dropdown_content_cva = cva([
  "bg-bg-dialog border-otl-gray-200 shadow-context-menu min-w-[10rem] overflow-hidden rounded-md border p-[5px] outline-none",
  "data-[open]:animate-in data-[closed]:animate-out data-[closed]:fill-mode-forwards data-[closed]:fade-out-0 data-[open]:fade-in-0 data-[closed]:zoom-out-95 data-[open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
]);

interface DropdownContentProps
  extends Omit<DropdownPrimitive.Popup.Props, "className">,
    Pick<
      DropdownPrimitive.Positioner.Props,
      | "side"
      | "sideOffset"
      | "align"
      | "alignOffset"
      | "collisionPadding"
      | "collisionBoundary"
      | "sticky"
      | "positionMethod"
    > {
  className?: string;
  /** Element to portal the popup into. Defaults to `document.body`. */
  container?: DropdownPrimitive.Portal.Props["container"];
}

const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  (
    {
      className,
      side = "bottom",
      align = "end",
      sideOffset = 4,
      alignOffset,
      collisionPadding,
      collisionBoundary,
      sticky,
      positionMethod,
      container,
      ...props
    },
    ref,
  ) => (
    <DropdownPrimitive.Portal container={container}>
      <DropdownPrimitive.Positioner
        className="z-50 outline-none"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        collisionBoundary={collisionBoundary}
        sticky={sticky}
        positionMethod={positionMethod}
      >
        <DropdownPrimitive.Popup
          ref={ref}
          className={dropdown_content_cva({ className })}
          {...props}
        />
      </DropdownPrimitive.Positioner>
    </DropdownPrimitive.Portal>
  ),
);
DropdownContent.displayName = "DropdownContent";

const dropdown_item_cva = cva(
  [
    "rounded-xs relative flex cursor-default select-none items-center gap-2 px-2.5 py-1.5 outline-none transition-colors [&>svg]:size-4 [&>svg]:shrink-0",
    "text-sm font-medium cursor-pointer",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40",
  ],
  {
    variants: {
      variant: {
        default:
          "text-txt-black-700 data-[highlighted]:text-txt-black-900 data-[highlighted]:bg-bg-washed-active ",
        danger: "text-txt-danger data-[highlighted]:bg-bg-danger-50 ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface DropdownItemProps
  extends Omit<DropdownPrimitive.Item.Props, "className">,
    VariantProps<typeof dropdown_item_cva> {
  className?: string;
}

const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ className, variant, ...props }, ref) => (
    <DropdownPrimitive.Item
      ref={ref}
      className={dropdown_item_cva({ variant, className })}
      {...props}
    />
  ),
);
DropdownItem.displayName = "DropdownItem";

const dropdown_item_icon_cva = cva(
  "block stroke-inherit text-inherit stroke-[1.5px] size-4 shrink-0",
);

interface DropdownItemIconProps extends ComponentProps<"div"> {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

const DropdownItemIcon: ForwardRefExoticComponent<DropdownItemIconProps> =
  forwardRef(({ children, className, ...props }, ref) => {
    return useRender({
      render: children,
      ref,
      props: mergeProps<"div">(
        { className: dropdown_item_icon_cva({ className }) },
        props,
      ),
    });
  });

DropdownItemIcon.displayName = "DropdownItemIcon";

// const DropdownCheckboxItem = forwardRef<
//   ElementRef<typeof DropdownPrimitive.CheckboxItem>,
//   ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>
// >(({ className, children, checked, ...props }, ref) => (
//   <DropdownPrimitive.CheckboxItem
//     ref={ref}
//     className={clx(
//       "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className,
//     )}
//     checked={checked}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownPrimitive.ItemIndicator>
//         <Check className="h-4 w-4" />
//       </DropdownPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownPrimitive.CheckboxItem>
// ));
// DropdownCheckboxItem.displayName = DropdownPrimitive.CheckboxItem.displayName;

// const DropdownRadioItem = forwardRef<
//   ElementRef<typeof DropdownPrimitive.RadioItem>,
//   ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>
// >(({ className, children, ...props }, ref) => (
//   <DropdownPrimitive.RadioItem
//     ref={ref}
//     className={clx(
//       "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
//       className,
//     )}
//     {...props}
//   >
//     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
//       <DropdownPrimitive.ItemIndicator>
//         <Circle className="h-2 w-2 fill-current" />
//       </DropdownPrimitive.ItemIndicator>
//     </span>
//     {children}
//   </DropdownPrimitive.RadioItem>
// ));
// DropdownRadioItem.displayName = DropdownPrimitive.RadioItem.displayName;

// const DropdownLabel = forwardRef<
//   ElementRef<typeof DropdownPrimitive.Label>,
//   ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>
// >(({ className, ...props }, ref) => (
//   <DropdownPrimitive.Label
//     ref={ref}
//     className={clx("px-2 py-1.5 text-xs font-semibold", className)}
//     {...props}
//   />
// ));
// DropdownLabel.displayName = DropdownPrimitive.Label.displayName;

// const DropdownSeparator = forwardRef<
//   ElementRef<typeof DropdownPrimitive.Separator>,
//   ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>
// >(({ className, ...props }, ref) => (
//   <DropdownPrimitive.Separator
//     ref={ref}
//     className={clx("bg-otl-divider -mx-1 my-1 h-px", className)}
//     {...props}
//   />
// ));
// DropdownSeparator.displayName = DropdownPrimitive.Separator.displayName;

// const DropdownShortcut = ({
//   className,
//   ...props
// }: HTMLAttributes<HTMLSpanElement>) => {
//   return (
//     <span
//       className={clx("ml-auto text-xs tracking-widest opacity-60", className)}
//       {...props}
//     />
//   );
// };
// DropdownShortcut.displayName = "DropdownShortcut";

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownItemIcon,
  // DropdownCheckboxItem,
  // DropdownRadioItem,
  // DropdownLabel,
  // DropdownSeparator,
  // DropdownShortcut,
  // DropdownGroup,
  // DropdownPortal,
  // DropdownSub,
  // DropdownSubContent,
  // DropdownSubTrigger,
  // DropdownRadioGroup,
};
