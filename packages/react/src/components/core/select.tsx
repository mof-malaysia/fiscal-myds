"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  clx,
  splitPositionerProps,
  type PositionerProps,
} from "../../utils";
import { floating_popup_class } from "./popover";
import { cva } from "class-variance-authority";
import { ChevronDownFillIcon } from "../../icons/chevron-down-fill";
import { CheckCircleFillIcon } from "../../icons/check-circle-fill";
import { Checkbox } from "./checkbox";

type SelectBase = Omit<
  SelectPrimitive.Root.Props<string, boolean>,
  "value" | "defaultValue" | "onValueChange" | "multiple"
> & {
  variant: "outline" | "ghost" | null;
  size: "small" | "medium" | "large" | null;
};

type SelectSingle = SelectBase & {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onValueChange?: (
    value: string,
    eventDetails: SelectPrimitive.Root.ChangeEventDetails,
  ) => void;
};

type SelectMultiple = SelectBase & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (
    value: string[],
    eventDetails: SelectPrimitive.Root.ChangeEventDetails,
  ) => void;
};

const isMultiple = (props: { multiple?: boolean }): boolean =>
  Boolean(props.multiple);

type SelectProps = SelectSingle | SelectMultiple;

type SelectContextProps = {
  multiple: boolean;
  variant: SelectBase["variant"];
  size: SelectBase["size"];
  /** Current value. `null` when nothing is selected (single), `[]` (multiple). */
  value: string | string[] | null;
  /** Items register their rendered label so `<SelectValue>` can display it instead of the raw value. */
  registerLabel: (value: string, label: React.ReactNode) => void;
};

const SelectContext = React.createContext<SelectContextProps>({
  multiple: false,
  variant: "outline",
  size: "small",
  value: null,
  registerLabel: () => {},
});

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Normalise MYDS values ("" = empty) to Base UI values (`null` = empty). */
const normalise = (
  value: string | string[] | undefined | null,
  multiple: boolean,
): string | string[] | null => {
  if (multiple) return Array.isArray(value) ? value : [];
  if (Array.isArray(value) || !value) return null;
  return value;
};

const Select: React.FunctionComponent<SelectProps> = (props) => {
  const {
    multiple: _multiple,
    value: valueProp,
    defaultValue,
    onValueChange,
    variant,
    size,
    items,
    ...rest
  } = props;
  const multiple = isMultiple(props);

  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | string[] | null
  >(() => normalise(defaultValue, multiple));
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>(
    {},
  );

  const value = normalise(
    valueProp !== undefined ? valueProp : uncontrolledValue,
    multiple,
  );

  const registerLabel = React.useCallback(
    (itemValue: string, label: React.ReactNode) => {
      setLabels((prev) =>
        prev[itemValue] === label ? prev : { ...prev, [itemValue]: label },
      );
    },
    [],
  );

  const handleValueChange = (
    next: string | string[] | null,
    eventDetails: SelectPrimitive.Root.ChangeEventDetails,
  ) => {
    if (multiple) {
      const nextValue = Array.isArray(next) ? next : [];
      setUncontrolledValue(nextValue);
      (onValueChange as SelectMultiple["onValueChange"])?.(
        nextValue,
        eventDetails,
      );
    } else {
      if (next === undefined || next === null || Array.isArray(next)) return;
      setUncontrolledValue(next);
      (onValueChange as SelectSingle["onValueChange"])?.(next, eventDetails);
    }
  };

  return (
    <SelectContext.Provider
      value={{ multiple, variant, size, value, registerLabel }}
    >
      <SelectPrimitive.Root<string, boolean>
        {...rest}
        items={items ?? labels}
        multiple={multiple}
        value={value}
        onValueChange={handleValueChange}
      />
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";

const SelectGroup = SelectPrimitive.Group;

/*========================================================================================================================*/

const select_icon_cva = cva(["text-txt-black-900"], {
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
      large: "size-5",
    },
  },
});

interface SelectValueProps
  extends Omit<
    SelectPrimitive.Value.Props,
    "children" | "render" | "className"
  > {
  className?: string;
  label?: React.ReactNode;
  icon?: React.JSXElementConstructor<any>;
  children?: (value: string | string[]) => React.ReactNode;
}
const SelectValue: React.ForwardRefExoticComponent<
  SelectValueProps & React.RefAttributes<HTMLSpanElement>
> = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ label, icon, children, className, placeholder, ...props }, ref) => {
    const rootProps = React.useContext(SelectContext);
    const Icon = icon || ChevronDownFillIcon;

    const icon_node = (
      <SelectPrimitive.Icon className="flex shrink-0">
        <Icon className={select_icon_cva({ size: rootProps.size })} />
      </SelectPrimitive.Icon>
    );

    if (!rootProps.multiple)
      return (
        <>
          {typeof label === "string" ? (
            <SelectLabel>{label}</SelectLabel>
          ) : (
            label
          )}
          <SelectPrimitive.Value
            ref={ref}
            placeholder={placeholder}
            {...props}
            className={clx("text-inherit", className)}
          >
            {children}
          </SelectPrimitive.Value>
          {icon_node}
        </>
      );

    const selected = Array.isArray(rootProps.value) ? rootProps.value : [];

    return (
      <>
        {typeof label === "string" ? <SelectLabel>{label}</SelectLabel> : label}
        <SelectPrimitive.Value
          ref={ref}
          {...props}
          className={clx("text-inherit", className)}
        >
          {children ??
            ((value: string[]) => (value?.length ? null : placeholder))}
        </SelectPrimitive.Value>

        {!children && <SelectCounter>{selected.length}</SelectCounter>}

        {icon_node}
      </>
    );
  },
);
SelectValue.displayName = "SelectValue";

/*========================================================================================================================*/

const select_counter_cva = cva(
  [
    "flex aspect-square shrink-0 leading-none items-center justify-center bg-primary-600",
    "rounded-full px-1 leading-none text-white",
    "group-disabled:bg-bg-white-disabled group-disabled:text-inherit",
    "group-data-[disabled]:bg-bg-white-disabled group-data-[disabled]:text-inherit",
  ],
  {
    variants: {
      size: {
        small: "text-body-sm",
        medium: "text-body-md",
        large: "text-body-md",
      },
    },
    defaultVariants: {
      size: "small",
    },
  },
);

interface SelectCounterProps extends React.ComponentProps<"span"> {}

const SelectCounter: React.ForwardRefExoticComponent<SelectCounterProps> =
  React.forwardRef(({ children, className, ...props }, ref) => {
    const { size } = React.useContext(SelectContext);

    return (
      <span
        ref={ref}
        className={clx(select_counter_cva({ size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  });

SelectCounter.displayName = "SelectCounter";
/*========================================================================================================================*/

const select_trigger_cva = cva(
  [
    "group inline-flex select-none items-center gap-1.5 outline-none rounded-md w-fit text-txt-black-900",
    "focus-visible:ring focus-visible:ring-fr-primary",
    "disabled:bg-bg-white-disabled disabled:text-txt-black-disabled disabled:border-transparent disabled:cursor-not-allowed",
    "data-[disabled]:bg-bg-white-disabled data-[disabled]:text-txt-black-disabled data-[disabled]:border-transparent data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        outline: [
          "bg-bg-white border border-otl-control",
          "hover:bg-bg-white-hover hover:border-otl-control-hover",
        ],
        ghost: [
          "bg-transparent border border-transparent",
          "hover:bg-bg-white-hover",
        ],
      },
      size: {
        small: "control-sm text-field-sm",
        medium: "control-md text-field-md",
        large: "control-lg text-field-lg",
      },
    },
    defaultVariants: { variant: "outline", size: "small" },
  },
);

interface SelectTriggerProps
  extends Omit<SelectPrimitive.Trigger.Props, "className"> {
  className?: string;
}

const SelectTrigger: React.ForwardRefExoticComponent<
  SelectTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { variant, size } = React.useContext(SelectContext);

    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={select_trigger_cva({
          variant,
          size,
          className,
        })}
        {...props}
      >
        {children}
      </SelectPrimitive.Trigger>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

/*========================================================================================================================*/

const select_label_cva = cva(
  ["group-data-[disabled]:text-txt-black-disabled"],
  {
    variants: {
      size: {
        small: "text-body-sm",
        medium: "text-body-md",
        large: "text-body-lg",
      },
      multiple: {
        false: "text-txt-black-500",
        true: "text-txt-black-900",
      },
    },
    defaultVariants: { size: "small", multiple: false },
  },
);

const SelectLabel: React.ForwardRefExoticComponent<
  React.ComponentProps<"span">
> = React.forwardRef(({ className, ...props }, ref) => {
  const { size, multiple } = React.useContext(SelectContext);
  return (
    <span
      ref={ref}
      className={select_label_cva({ size, multiple, className })}
      {...props}
    />
  );
});
SelectLabel.displayName = "SelectLabel";

/*========================================================================================================================*/

const select_content_cva = cva(
  [
    floating_popup_class,
    "relative py-1 min-w-[max(8rem,var(--anchor-width))] overflow-y-auto",
  ],
  {
    variants: {
      size: {
        small: "max-h-64",
        medium: "max-h-72",
        large: "max-h-80",
      },
    },
    defaultVariants: { size: "small" },
  },
);

interface SelectContentProps
  extends Omit<SelectPrimitive.Popup.Props, "className">,
    PositionerProps<SelectPrimitive.Positioner.Props> {
  className?: string;
  /**
   * `popper` (default) positions the popup below the trigger.
   * `item-aligned` overlaps the trigger so the selected item aligns with the trigger value.
   */
  position?: "popper" | "item-aligned";
  /** Element to portal the popup into. Defaults to `document.body`. */
  container?: SelectPrimitive.Portal.Props["container"];
}

const SelectContent: React.ForwardRefExoticComponent<
  SelectContentProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", container, ...props }, ref) => {
    const { size } = React.useContext(SelectContext);
    const [positionerProps, popupProps] = splitPositionerProps(props, {
      side: "bottom",
      sideOffset: 4,
      align: "start",
    });
    return (
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Positioner
          className="z-50 outline-none"
          alignItemWithTrigger={position === "item-aligned"}
          {...positionerProps}
        >
          <SelectPrimitive.Popup
            ref={ref}
            className={select_content_cva({ size, className })}
            {...popupProps}
          >
            {children}
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    );
  },
);
SelectContent.displayName = "SelectContent";

/*========================================================================================================================*/

interface SelectGroupTitleProps
  extends Omit<SelectPrimitive.GroupLabel.Props, "className"> {
  className?: string;
}

const SelectGroupTitle = React.forwardRef<
  HTMLDivElement,
  SelectGroupTitleProps
>(({ className, ...props }, ref) => (
  <SelectXPad>
    <SelectPrimitive.GroupLabel
      ref={ref}
      className={clx(
        "text-body-xs px-2.5 py-1.5 font-semibold text-gray-400",
        className,
      )}
      {...props}
    />
  </SelectXPad>
));
SelectGroupTitle.displayName = "SelectGroupTitle";

/*========================================================================================================================*/

const select_item_cva = cva(
  [
    "flex items-center w-full cursor-default select-none py-1.5 gap-2 font-medium outline-none text-txt-black-700 rounded-xs",
    "data-[highlighted]:bg-bg-washed",
  ],
  {
    variants: {
      size: {
        small: "text-body-xs",
        medium: "text-body-sm",
        large: "text-body-md",
      },
      multiple: {
        false: "pl-2.5 pr-[38px]",
        true: "px-2.5",
      },
      disabled: {
        false: "",
        true: "bg-bg-white-disabled text-txt-black-disabled border-transparent cursor-not-allowed hover:bg-none",
      },
    },
    defaultVariants: { size: "small", multiple: false, disabled: false },
  },
);

interface SelectItemProps
  extends Omit<SelectPrimitive.Item.Props, "className" | "value"> {
  className?: string;
  value: string;
}

const SelectItem: React.ForwardRefExoticComponent<
  SelectItemProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, disabled, value, ...props }, ref) => {
    const rootProps = React.useContext(SelectContext);
    const { registerLabel } = rootProps;

    useIsoLayoutEffect(() => {
      registerLabel(value, children);
    }, [registerLabel, value, children]);

    if (!rootProps.multiple)
      return (
        <SelectXPad>
          <SelectPrimitive.Item
            ref={ref}
            value={value}
            disabled={disabled}
            className={clx(
              select_item_cva({
                size: rootProps.size,
                multiple: false,
                disabled,
              }),
              className,
            )}
            {...props}
          >
            <span className="absolute right-4 flex h-3.5 w-3.5 items-center justify-center">
              <SelectPrimitive.ItemIndicator>
                <CheckCircleFillIcon
                  data-size={rootProps.size}
                  className="text-primary-600 size-5 data-[size=small]:size-4"
                />
              </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        </SelectXPad>
      );

    const checked =
      Array.isArray(rootProps.value) && rootProps.value.includes(value);

    return (
      <SelectXPad>
        <SelectPrimitive.Item
          ref={ref}
          value={value}
          disabled={disabled}
          className={clx(
            select_item_cva({
              size: rootProps.size,
              multiple: true,
              disabled,
            }),
            className,
          )}
          {...props}
        >
          <Checkbox
            checked={checked}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none"
          />
          <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
      </SelectXPad>
    );
  },
);
SelectItem.displayName = "SelectItem";

/*========================================================================================================================*/

interface SelectSeparatorProps
  extends Omit<SelectPrimitive.Separator.Props, "className"> {
  className?: string;
}

const SelectSeparator: React.ForwardRefExoticComponent<
  SelectSeparatorProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={clx("bg-otl-divider -mx-1 my-1 h-px", className)}
      {...props}
    />
  ),
);
SelectSeparator.displayName = "SelectSeparator";

/*========================================================================================================================*/

const SelectHeader: React.ForwardRefExoticComponent<
  React.ComponentProps<"div">
> = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <SelectXPad
      ref={ref}
      className={clx("bg-bg-dialog sticky top-0 z-50 pb-1", className)}
      {...props}
    />
  );
});
SelectHeader.displayName = "SelectHeader";

/*========================================================================================================================*/

const SelectFooter: React.ForwardRefExoticComponent<
  React.ComponentProps<"div">
> = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <SelectXPad
      ref={ref}
      className={clx(
        "bg-bg-dialog border-otl-gray-200 sticky bottom-0 z-50 border-t py-1",
        className,
      )}
      {...props}
    />
  );
});
SelectFooter.displayName = "SelectFooter";

/*========================================================================================================================*/

const SelectXPad: React.FunctionComponent<React.ComponentProps<"div">> = ({
  children,
  className,
}) => <div className={clx("px-1", className)}>{children}</div>;

export {
  Select,
  SelectGroup,
  SelectGroupTitle,
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectContent,
  SelectHeader,
  SelectFooter,
  SelectItem,
  SelectSeparator,
  // SelectScrollUpButton,
  // SelectScrollDownButton,
};
