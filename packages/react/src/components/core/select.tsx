"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cva } from "class-variance-authority";
import { clx, splitPositionerProps, type PositionerProps } from "../../utils";
import {
  menu_group_label_class,
  menu_item_cva,
  menu_popup_cva,
  menu_separator_class,
} from "./menu";
import { Checkbox } from "./checkbox";
import { useMergedRefs } from "../../hooks";
import { CheckIcon } from "../../icons/check";
import { ChevronDownIcon } from "../../icons/chevron-down";
import { CrossIcon } from "../../icons/cross";

/**
 * Select lets someone choose one option (or several, with `multiple`) from a
 * list that opens below a field-like trigger. It sits in a `Field` like any
 * other control: the label goes above it in `FieldLabel`, never inside the
 * trigger, and the field's invalid state turns its stroke Danger.
 *
 * For a plain list, pass `items` and Select renders the trigger and the list.
 * Compose the parts when you need groups, a header or custom rendering.
 *
 * @example
 * <Field name="state">
 *   <FieldLabel>State</FieldLabel>
 *   <Select placeholder="Choose a state" items={[
 *     { value: "jhr", label: "Johor" },
 *     { value: "kdh", label: "Kedah" },
 *   ]} />
 * </Field>
 *
 * @example
 * <Select multiple clearable defaultValue={["apple"]}>
 *   <SelectTrigger icon={<FilterIcon />}>
 *     <SelectValue placeholder="Any fruit" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectGroup>
 *       <SelectGroupTitle>Fruits</SelectGroupTitle>
 *       <SelectItem value="apple" description="Crisp and sweet">Apple</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 * </Select>
 */

type SelectVariant = "outline" | "ghost";
type SelectSize = "small" | "medium" | "large";

/** One option for the `items` shorthand. Consecutive items with the same `group` share a heading. */
interface SelectOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

type SelectBase = Omit<
  SelectPrimitive.Root.Props<string, boolean>,
  "value" | "defaultValue" | "onValueChange" | "multiple" | "items"
> & {
  /** `outline` for forms; `ghost` for toolbars and dense headers. @default "outline" */
  variant?: SelectVariant;
  /** Follows `data-density`, like Input. @default "small" */
  size?: SelectSize;
  /** Shows a button that clears the value. For optional choices and filters. */
  clearable?: boolean;
  /** Accessible name of the clear button. @default "Clear selection" */
  clearLabel?: string;
  /**
   * The options. Without children, Select renders the trigger and the list from
   * these. With children, pass them anyway whenever labels differ from values:
   * options only report their labels once the list has opened, so this is how
   * the trigger shows "In review" rather than "review" on first render.
   */
  items?: SelectOption[];
  /** For the `items` shorthand: text shown while nothing is chosen. */
  placeholder?: React.ReactNode;
  /** For the `items` shorthand: an icon before the value. */
  icon?: React.ReactNode;
  /** For the `items` shorthand: sizes the trigger, e.g. `w-fit` or `max-w-64`. */
  className?: string;
};

type SelectSingle = SelectBase & {
  multiple?: false;
  /** `""` means nothing is chosen. */
  value?: string;
  defaultValue?: string;
  /** Called with `""` when the clear button empties it (no `eventDetails` then). */
  onValueChange?: (
    value: string,
    eventDetails?: SelectPrimitive.Root.ChangeEventDetails,
  ) => void;
};

type SelectMultiple = SelectBase & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  /** Called with `[]` when the clear button empties it (no `eventDetails` then). */
  onValueChange?: (
    value: string[],
    eventDetails?: SelectPrimitive.Root.ChangeEventDetails,
  ) => void;
};

type SelectProps = SelectSingle | SelectMultiple;

interface SelectContextValue {
  multiple: boolean;
  variant: SelectVariant;
  size: SelectSize;
  /** `null` when nothing is chosen (single), `[]` (multiple). */
  value: string | string[] | null;
  /** Rendered label of each value, so the trigger shows labels, not raw values. */
  labels: Record<string, React.ReactNode>;
  registerLabel: (value: string, label: React.ReactNode) => void;
  clearable: boolean;
  clearLabel: string;
  clear: () => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  multiple: false,
  variant: "outline",
  size: "small",
  value: null,
  labels: {},
  registerLabel: () => {},
  clearable: false,
  clearLabel: "Clear selection",
  clear: () => {},
});

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** FTDS values ("" = empty) to Base UI values (`null` = empty). */
const normalise = (
  value: string | string[] | undefined | null,
  multiple: boolean,
): string | string[] | null => {
  if (multiple) return Array.isArray(value) ? value : [];
  if (Array.isArray(value) || !value) return null;
  return value;
};

const hasValue = (value: string | string[] | null) =>
  Array.isArray(value) ? value.length > 0 : value !== null;

/** Consecutive options that share a `group`, in order. */
const groupOptions = (items: SelectOption[]) =>
  items.reduce<{ group?: string; items: SelectOption[] }[]>((groups, item) => {
    const last = groups[groups.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else groups.push({ group: item.group, items: [item] });
    return groups;
  }, []);

const Select: React.FunctionComponent<SelectProps> = (props) => {
  const {
    multiple: _multiple,
    value: valueProp,
    defaultValue,
    onValueChange,
    variant = "outline",
    size = "small",
    clearable = false,
    clearLabel = "Clear selection",
    items,
    placeholder,
    icon,
    className,
    children,
    ...rest
  } = props;
  const multiple = Boolean(_multiple);

  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | string[] | null
  >(() => normalise(defaultValue, multiple));
  const raw = valueProp !== undefined ? valueProp : uncontrolledValue;
  const value = React.useMemo(() => normalise(raw, multiple), [raw, multiple]);

  // Labels come from `items` first; options outside `items` register their own once mounted
  const itemLabels = React.useMemo(
    () =>
      items &&
      Object.fromEntries(items.map((item) => [item.value, item.label])),
    [items],
  );
  const itemLabelsRef = React.useRef(itemLabels);
  itemLabelsRef.current = itemLabels;
  const [registered, setRegistered] = React.useState<
    Record<string, React.ReactNode>
  >({});
  const registerLabel = React.useCallback(
    (itemValue: string, label: React.ReactNode) => {
      if (itemLabelsRef.current && itemValue in itemLabelsRef.current) return;
      setRegistered((prev) =>
        prev[itemValue] === label ? prev : { ...prev, [itemValue]: label },
      );
    },
    [],
  );
  const labels = React.useMemo(
    () => ({ ...registered, ...itemLabels }),
    [registered, itemLabels],
  );

  // One loose handler inside; the single/multiple union only matters to callers
  const onChange = React.useRef(
    onValueChange as
      | ((
          value: string | string[],
          eventDetails?: SelectPrimitive.Root.ChangeEventDetails,
        ) => void)
      | undefined,
  );
  onChange.current = onValueChange as typeof onChange.current;

  const emit = React.useCallback(
    (
      next: string | string[],
      eventDetails?: SelectPrimitive.Root.ChangeEventDetails,
    ) => {
      setUncontrolledValue(normalise(next, multiple));
      onChange.current?.(next, eventDetails);
    },
    [multiple],
  );

  const handleValueChange = (
    next: string | string[] | null,
    eventDetails: SelectPrimitive.Root.ChangeEventDetails,
  ) => {
    if (multiple) emit(Array.isArray(next) ? next : [], eventDetails);
    else if (typeof next === "string") emit(next, eventDetails);
  };

  const clear = React.useCallback(
    () => emit(multiple ? [] : ""),
    [emit, multiple],
  );

  // Stable unless something it carries changes, so options don't all re-render
  const context = React.useMemo<SelectContextValue>(
    () => ({
      multiple,
      variant,
      size,
      value,
      labels,
      registerLabel,
      clearable,
      clearLabel,
      clear,
    }),
    [
      multiple,
      variant,
      size,
      value,
      labels,
      registerLabel,
      clearable,
      clearLabel,
      clear,
    ],
  );

  return (
    <SelectContext.Provider value={context}>
      <SelectPrimitive.Root<string, boolean>
        {...rest}
        items={labels}
        multiple={multiple}
        value={value}
        onValueChange={handleValueChange}
      >
        {children ??
          (items && (
            <>
              <SelectTrigger icon={icon} className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {groupOptions(items).map(({ group, items: options }, i) => {
                  const rendered = options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      description={option.description}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ));
                  return group ? (
                    <SelectGroup key={`${group}-${i}`}>
                      <SelectGroupTitle>{group}</SelectGroupTitle>
                      {rendered}
                    </SelectGroup>
                  ) : (
                    <React.Fragment key={i}>{rendered}</React.Fragment>
                  );
                })}
              </SelectContent>
            </>
          ))}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};
Select.displayName = "Select";

/*========================================================================================================================*/

const select_trigger_cva = cva(
  [
    "group flex w-full min-w-0 cursor-pointer select-none items-center gap-2 rounded-md text-left outline-none",
    "font-body text-txt-black-900 transition-colors duration-150 motion-reduce:transition-none",
    // Focus and open match Input: Blue stroke, Focus Blue ring on keyboard focus
    "focus-visible:ring focus-visible:ring-fr-primary focus-visible:border-otl-primary-300",
    "data-[popup-open]:border-otl-primary-300",
    // Inside an invalid Field (DESIGN.md: error stroke turns Danger)
    "data-[invalid]:border-bg-danger-600",
    // Disabled: Well, Ink Tertiary, stroke removed
    "data-[disabled]:bg-bg-washed data-[disabled]:text-txt-black-disabled data-[disabled]:border-transparent data-[disabled]:cursor-not-allowed",
    "[&>svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        outline:
          "bg-bg-white border border-otl-control hover:border-otl-control-hover",
        ghost:
          "bg-transparent border border-transparent hover:bg-bg-washed data-[popup-open]:bg-bg-washed",
      },
      size: {
        // Follows data-density, like Input
        small: "control-sm text-field-sm [&>svg]:size-4",
        medium: "control-md text-field-md [&>svg]:size-5",
        large: "control-lg text-field-lg [&>svg]:size-5",
      },
    },
    defaultVariants: { variant: "outline", size: "small" },
  },
);

interface SelectTriggerProps
  extends Omit<SelectPrimitive.Trigger.Props, "className"> {
  /** Sizes and places the control, e.g. `w-fit` for a toolbar or `max-w-64`. */
  className?: string;
  /** Icon before the value, e.g. a filter or language icon. */
  icon?: React.ReactNode;
}

/**
 * The field-like button. Put a `SelectValue` inside. Fills its container; pass
 * `className="w-fit"` for a compact one. With `clearable`, a clear button sits
 * beside the chevron once something is chosen.
 */
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, icon, ...props }, forwardedRef) => {
    const { variant, size, value, clearable, clearLabel, clear } =
      React.useContext(SelectContext);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const ref = useMergedRefs(triggerRef, forwardedRef);
    const showClear = clearable && hasValue(value) && !props.disabled;

    return (
      // The clear button can't sit inside the trigger button, so both share a frame
      <div className={clx("relative flex w-full min-w-0", className)}>
        <SelectPrimitive.Trigger
          ref={ref}
          className={select_trigger_cva({ variant, size })}
          {...props}
        >
          {icon && (
            <span aria-hidden className="text-txt-black-700 flex shrink-0">
              {icon}
            </span>
          )}
          {children}
          {/* Keeps the value clear of the clear button */}
          {showClear && <span aria-hidden className="w-5 shrink-0" />}
          <ChevronDownIcon
            aria-hidden
            className="text-txt-black-700 transition-transform duration-200 group-data-[popup-open]:rotate-180 motion-reduce:transition-none"
          />
        </SelectPrimitive.Trigger>
        {showClear && (
          <button
            type="button"
            aria-label={clearLabel}
            className={clx(
              "text-txt-black-700 hover:text-txt-black-900 hover:bg-bg-washed focus-ring absolute top-1/2 grid size-6 -translate-y-1/2 cursor-pointer place-content-center rounded-sm",
              size === "small" ? "right-8" : "right-9",
            )}
            onClick={() => {
              clear();
              triggerRef.current?.focus();
            }}
          >
            <CrossIcon aria-hidden className="size-4" />
          </button>
        )}
      </div>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

/*========================================================================================================================*/

interface SelectValueProps
  extends Omit<
    SelectPrimitive.Value.Props,
    "children" | "render" | "className"
  > {
  className?: string;
  /** Custom display of the chosen value(s). */
  children?: (value: string | string[]) => React.ReactNode;
  /** Multiple: text after the first choice; `{count}` is the number of others. @default "+{count} more" */
  moreLabel?: string;
}

/**
 * The chosen option's label, or the placeholder in Ink Secondary. With
 * `multiple`, the first choice and "+2 more"; screen readers hear every choice.
 */
const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  (
    { children, className, placeholder, moreLabel = "+{count} more", ...props },
    ref,
  ) => {
    const { multiple, labels } = React.useContext(SelectContext);
    const labelOf = (value: string) => labels[value] ?? value;

    const summary = (value: string[]) => {
      if (!value.length)
        return <span className="text-txt-black-500">{placeholder}</span>;
      const others = value.length - 1;
      return (
        <>
          <span aria-hidden>
            {labelOf(value[0]!)}
            {others > 0 && (
              <span className="text-txt-black-700">
                {" "}
                {moreLabel.replace("{count}", String(others))}
              </span>
            )}
          </span>
          <span className="sr-only">
            {value.map((item, i) => (
              <React.Fragment key={item}>
                {i > 0 && ", "}
                {labelOf(item)}
              </React.Fragment>
            ))}
          </span>
        </>
      );
    };

    return (
      <SelectPrimitive.Value
        ref={ref}
        placeholder={placeholder}
        className={clx(
          "min-w-0 flex-1 truncate text-inherit",
          "data-[placeholder]:text-txt-black-500",
          className,
        )}
        {...props}
      >
        {children ??
          (multiple ? (value: string[]) => summary(value ?? []) : undefined)}
      </SelectPrimitive.Value>
    );
  },
);
SelectValue.displayName = "SelectValue";

/*========================================================================================================================*/

interface SelectContentProps
  extends Omit<SelectPrimitive.Popup.Props, "className">,
    PositionerProps<SelectPrimitive.Positioner.Props> {
  className?: string;
  /**
   * `popper` (default) opens the list below the trigger. `item-aligned` overlaps
   * the trigger so the chosen option sits where the value was.
   */
  position?: "popper" | "item-aligned";
  /** Element to portal the list into. Defaults to `document.body`. */
  container?: SelectPrimitive.Portal.Props["container"];
}

/** The list, on a floating panel at least as wide as the trigger. */
const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", container, ...props }, ref) => {
    const [positionerProps, popupProps] = splitPositionerProps(props, {
      side: "bottom",
      sideOffset: 4,
      align: "start",
    });
    return (
      <SelectPrimitive.Portal container={container}>
        <SelectPrimitive.Positioner
          className="z-popup outline-none"
          alignItemWithTrigger={position === "item-aligned"}
          {...positionerProps}
        >
          <SelectPrimitive.Popup
            ref={ref}
            className={menu_popup_cva({
              // The Menu panel, at least as wide as the trigger
              className: clx(
                "font-body relative max-h-[min(20rem,var(--available-height))] min-w-[max(8rem,var(--anchor-width))]",
                className,
              ),
            })}
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

const SelectGroup = SelectPrimitive.Group;

interface SelectGroupTitleProps
  extends Omit<SelectPrimitive.GroupLabel.Props, "className"> {
  className?: string;
}

/** Group heading in Label Compact, Ink Secondary (the Menu group label). */
const SelectGroupTitle = React.forwardRef<
  HTMLDivElement,
  SelectGroupTitleProps
>(({ className, ...props }, ref) => (
  <SelectPrimitive.GroupLabel
    ref={ref}
    className={clx(menu_group_label_class, className)}
    {...props}
  />
));
SelectGroupTitle.displayName = "SelectGroupTitle";

/*========================================================================================================================*/

const select_item_cva = cva(
  [
    // The Menu item; options read as content, so full Ink and regular weight until chosen
    menu_item_cva(),
    "w-full font-normal text-txt-black-900 data-[selected]:font-medium",
  ],
  {
    variants: {
      // Bigger triggers are for citizen forms: give the options room to tap
      size: {
        small: "",
        medium: "py-2.5",
        large: "py-2.5",
      },
      hasDescription: { true: "items-start", false: "" },
    },
  },
);

interface SelectItemProps
  extends Omit<SelectPrimitive.Item.Props, "className" | "value"> {
  className?: string;
  value: string;
  /** A second line under the label, in Ink Secondary. Not shown in the trigger. */
  description?: React.ReactNode;
}

/** One option. The label (children) is what the trigger shows once it's chosen. */
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, description, value, disabled, ...props }, ref) => {
    const {
      multiple,
      size,
      value: selected,
      registerLabel,
    } = React.useContext(SelectContext);

    useIsoLayoutEffect(() => {
      registerLabel(value, children);
    }, [registerLabel, value, children]);

    const text = (
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <SelectPrimitive.ItemText className="min-w-0">
          {children}
        </SelectPrimitive.ItemText>
        {description && (
          <span className="text-txt-black-700 text-label-compact in-data-[disabled]:text-txt-black-disabled font-normal">
            {description}
          </span>
        )}
      </span>
    );

    return (
      <SelectPrimitive.Item
        ref={ref}
        value={value}
        disabled={disabled}
        className={clx(
          select_item_cva({ size, hasDescription: !!description }),
          className,
        )}
        {...props}
      >
        {multiple && (
          <Checkbox
            checked={Array.isArray(selected) && selected.includes(value)}
            disabled={disabled}
            tabIndex={-1}
            aria-hidden
            className="pointer-events-none"
          />
        )}
        {text}
        {!multiple && (
          <SelectPrimitive.ItemIndicator className="text-txt-primary flex shrink-0">
            <CheckIcon aria-hidden className="size-4" />
          </SelectPrimitive.ItemIndicator>
        )}
      </SelectPrimitive.Item>
    );
  },
);
SelectItem.displayName = "SelectItem";

/*========================================================================================================================*/

interface SelectSeparatorProps
  extends Omit<SelectPrimitive.Separator.Props, "className"> {
  className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
      ref={ref}
      className={clx(menu_separator_class, className)}
      {...props}
    />
  ),
);
SelectSeparator.displayName = "SelectSeparator";

/** Pinned above the options, e.g. a search field or a note. */
const SelectHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clx(
      "bg-bg-dialog sticky -top-1 z-10 -mx-1 -mt-1 px-1 pt-1 pb-1",
      className,
    )}
    {...props}
  />
));
SelectHeader.displayName = "SelectHeader";

/** Pinned below the options, e.g. "Select all" or a link. */
const SelectFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clx(
      "bg-bg-dialog border-otl-gray-200 sticky -bottom-1 z-10 -mx-1 mt-1 -mb-1 border-t p-1",
      className,
    )}
    {...props}
  />
));
SelectFooter.displayName = "SelectFooter";

export {
  Select,
  SelectGroup,
  SelectGroupTitle,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectHeader,
  SelectFooter,
  SelectItem,
  SelectSeparator,
};
export type {
  SelectProps,
  SelectOption,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
  SelectVariant,
  SelectSize,
};
