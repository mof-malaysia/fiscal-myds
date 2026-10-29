"use client";

import React, {
  ComponentRef,
  createContext,
  forwardRef,
  useContext,
} from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { cva, VariantProps } from "class-variance-authority";
import { CheckIcon } from "@/components/ui/icons/check";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { CrossIcon } from "@/components/ui/icons/cross";
import {
  menu_group_label_class,
  menu_indicator_class,
  menu_item_cva,
  menu_popup_cva,
  menu_separator_class,
} from "@/components/ui/menu";
import {
  clx,
  splitPositionerProps,
  type PositionerProps,
  type WithClassName,
} from "@/lib/ftds/utils";

/**
 * Combobox lets people pick one or more values from a long list by typing to filter
 * it: a district, an agency, a tax relief category. The value is the chosen item,
 * never free text (for free text with suggestions, use Autocomplete).
 *
 * It joins a surrounding Field for label, hint, error and validity.
 *
 * @example
 * <Field name="state">
 *   <FieldLabel>State</FieldLabel>
 *   <Combobox items={states}>
 *     <ComboboxInput placeholder="Search states" />
 *     <ComboboxContent>
 *       <ComboboxEmpty>No states match your search</ComboboxEmpty>
 *       <ComboboxList>
 *         {(state: string) => <ComboboxItem key={state} value={state}>{state}</ComboboxItem>}
 *       </ComboboxList>
 *     </ComboboxContent>
 *   </Combobox>
 * </Field>
 *
 * // Multiple: chips inside the input. Anchor the popup to the chips container.
 * const anchor = useRef<HTMLDivElement>(null);
 * <Combobox items={agencies} multiple>
 *   <ComboboxChips ref={anchor}>
 *     <ComboboxValue>
 *       {(values: string[]) => values.map((v) => (
 *         <ComboboxChip key={v}>{v}<ComboboxChipRemove /></ComboboxChip>
 *       ))}
 *     </ComboboxValue>
 *     <ComboboxChipsInput placeholder="Add an agency" />
 *   </ComboboxChips>
 *   <ComboboxContent anchor={anchor}>...</ComboboxContent>
 * </Combobox>
 */

type Size = "small" | "medium" | "large";

const ComboboxSizeContext = createContext<Size>("small");

const Combobox = ComboboxPrimitive.Root;

/** Render prop access to the selected value(s). */
const ComboboxValue = ComboboxPrimitive.Value;

/** Renders the items of the nearest `ComboboxGroup` (`items` prop). */
const ComboboxCollection = ComboboxPrimitive.Collection;

/** Filter helper matching Base UI's locale-aware `contains` / `startsWith`. */
const useComboboxFilter = ComboboxPrimitive.useFilter;

/*========================================================================================================================*/

/** Stroke, fill and states of a single-element field (toolbar input, OTP slot). */
const combobox_field_box_class = clx(
  "bg-bg-white border-otl-control text-txt-black-900 rounded-md border outline-none",
  "transition-colors duration-150 motion-reduce:transition-none",
  "focus-visible:border-otl-primary-300 focus-visible:ring focus-visible:ring-fr-primary",
  // Inside an invalid Field (DESIGN.md: error stroke turns Danger)
  "data-[invalid]:border-bg-danger-600",
  "data-[disabled]:bg-bg-washed data-[disabled]:text-txt-black-disabled data-[disabled]:cursor-not-allowed",
);

/** The bordered box around the text input and its buttons; shared with Autocomplete and NumberField. */
const combobox_input_group_cva = cva(
  [
    "relative flex w-full items-center rounded-md border border-otl-control bg-bg-white transition-colors",
    "has-[input:focus-visible]:border-otl-primary-300 has-[input:focus-visible]:ring has-[input:focus-visible]:ring-fr-primary",
    // Inside an invalid Field (DESIGN.md: error stroke turns Danger)
    "data-[invalid]:border-bg-danger-600 has-[input[data-invalid]]:border-bg-danger-600",
    "data-[disabled]:bg-bg-washed data-[disabled]:border-transparent data-[disabled]:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        // Border-box height matches Input; follows data-density
        small: "h-[var(--ctl-h-sm)]",
        medium: "h-[var(--ctl-h-md)]",
        large: "h-[var(--ctl-h-lg)]",
      },
      /** Which edges hold buttons: `end` (clear/open) or `both` (NumberField steppers). */
      edges: {
        end: "",
        both: "",
      },
    },
    compoundVariants: [
      { edges: "end", size: ["small", "medium"], className: "pr-1" },
      { edges: "end", size: "large", className: "pr-1.5" },
      { edges: "both", size: ["small", "medium"], className: "px-1" },
      { edges: "both", size: "large", className: "px-1.5" },
    ],
    defaultVariants: { size: "small", edges: "end" },
  },
);

/** The bare text input; shared with Autocomplete and NumberField. */
const combobox_input_cva = cva(
  [
    "h-full min-w-0 flex-1 bg-transparent outline-none",
    "font-body text-txt-black-900 placeholder:text-txt-black-500",
    "disabled:cursor-not-allowed disabled:text-txt-black-disabled",
  ],
  {
    variants: {
      size: {
        small: "text-field-sm",
        medium: "text-field-md",
        large: "text-field-lg",
      },
      /** `tight` when buttons sit on both sides (NumberField). */
      padding: {
        default: "",
        tight: "",
      },
      align: {
        start: "",
        center: "text-center",
        end: "text-right",
      },
    },
    compoundVariants: [
      { padding: "default", size: ["small", "medium"], className: "px-3" },
      { padding: "default", size: "large", className: "px-3.5" },
      { padding: "tight", size: ["small", "medium"], className: "px-2" },
      { padding: "tight", size: "large", className: "px-2.5" },
    ],
    defaultVariants: { size: "small", padding: "default", align: "start" },
  },
);

/** Ghost icon button (clear, open, chip remove, steppers); shared with Autocomplete and NumberField. Never boxed. */
const combobox_icon_button_cva = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-txt-black-700 outline-none",
    "transition-colors duration-150 ease-standard motion-reduce:transition-none",
    "hover:bg-bg-washed hover:text-txt-black-900",
    "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-fr-primary",
    "disabled:cursor-not-allowed disabled:text-txt-black-disabled disabled:hover:bg-transparent",
    "data-[disabled]:cursor-not-allowed data-[disabled]:text-txt-black-disabled data-[disabled]:hover:bg-transparent",
    "[&>svg]:size-4",
  ],
  {
    variants: {
      size: {
        small: "in-data-[density=compact]:size-6",
        medium: "in-data-[density=compact]:size-7",
        large: "in-data-[density=compact]:size-8",
      },
      /** `stepper`: NumberField's larger, press-and-hold buttons. */
      variant: {
        icon: "",
        stepper: "select-none",
      },
    },
    compoundVariants: [
      { variant: "icon", size: ["small", "medium"], className: "size-8" },
      { variant: "icon", size: "large", className: "size-9" },
      { variant: "stepper", size: "small", className: "size-9" },
      { variant: "stepper", size: "medium", className: "size-10" },
      { variant: "stepper", size: "large", className: "size-11" },
    ],
    defaultVariants: { size: "small", variant: "icon" },
  },
);

/*========================================================================================================================*/

interface ComboboxInputProps
  extends WithClassName<Omit<ComboboxPrimitive.Input.Props, "size">>,
    Pick<VariantProps<typeof combobox_input_group_cva>, "size"> {
  /** Class for the bordered wrapper. `className` goes to the `<input>`. */
  groupClassName?: string;
  /**
   * Show a clear button while there is a value.
   * @default true
   */
  showClear?: boolean;
  /**
   * Show a chevron button that opens the list.
   * @default true (Combobox), false (Autocomplete)
   */
  showTrigger?: boolean;
  /** Accessible name of the clear button. */
  clearLabel?: string;
  /** Accessible name of the open button. */
  triggerLabel?: string;
}

interface ComboboxContentProps
  extends WithClassName<ComboboxPrimitive.Popup.Props>,
    PositionerProps<ComboboxPrimitive.Positioner.Props> {
  /** Element to portal the popup into. Defaults to `document.body`. */
  container?: ComboboxPrimitive.Portal.Props["container"];
}

/** Popup styling shared with Autocomplete: the Menu popup, as wide as the input. */
const combobox_popup_class = clx(
  menu_popup_cva(),
  "w-[var(--anchor-width)] min-w-[var(--anchor-width)] max-h-[min(var(--available-height),24rem)]",
);

/** Empty/Status message: collapses to nothing while it has no text. */
const combobox_message_class =
  "font-body text-content text-txt-black-700 px-2.5 py-2 empty:p-0";

/**
 * Builds the parts Combobox and Autocomplete share. Base UI's Autocomplete reuses
 * Combobox's Input, Clear, Trigger, List, Popup, Group and Separator parts, so only
 * the display names and default labels differ.
 */
const createComboboxParts = (
  name: "Combobox" | "Autocomplete",
  defaults: { showTrigger: boolean; clearLabel: string; triggerLabel: string },
) => {
  /** Clears the value. Only visible while there is one. */
  const Clear = forwardRef<
    HTMLButtonElement,
    WithClassName<ComboboxPrimitive.Clear.Props>
  >(({ className, children, ...props }, ref) => {
    const size = useContext(ComboboxSizeContext);
    return (
      <ComboboxPrimitive.Clear
        ref={ref}
        aria-label={defaults.clearLabel}
        className={combobox_icon_button_cva({ size, className })}
        {...props}
      >
        {children ?? <CrossIcon aria-hidden />}
      </ComboboxPrimitive.Clear>
    );
  });
  Clear.displayName = `${name}Clear`;

  /** Opens the list. */
  const Trigger = forwardRef<
    HTMLButtonElement,
    WithClassName<ComboboxPrimitive.Trigger.Props>
  >(({ className, children, ...props }, ref) => {
    const size = useContext(ComboboxSizeContext);
    return (
      <ComboboxPrimitive.Trigger
        ref={ref}
        aria-label={defaults.triggerLabel}
        className={combobox_icon_button_cva({
          size,
          className: clx(
            "[&>svg]:transition-transform [&>svg]:duration-150 data-[popup-open]:[&>svg]:rotate-180 motion-reduce:[&>svg]:transition-none",
            className,
          ),
        })}
        {...props}
      >
        {children ?? <ChevronDownIcon aria-hidden />}
      </ComboboxPrimitive.Trigger>
    );
  });
  Trigger.displayName = `${name}Trigger`;

  /** Text input with optional clear and open buttons, styled like Input. */
  const Input = forwardRef<HTMLInputElement, ComboboxInputProps>(
    (
      {
        className,
        groupClassName,
        size,
        showClear = true,
        showTrigger = defaults.showTrigger,
        clearLabel = defaults.clearLabel,
        triggerLabel = defaults.triggerLabel,
        ...props
      },
      ref,
    ) => {
      const s = size ?? "small";
      return (
        <ComboboxSizeContext.Provider value={s}>
          <ComboboxPrimitive.InputGroup
            className={combobox_input_group_cva({
              size: s,
              className: groupClassName,
            })}
          >
            <ComboboxPrimitive.Input
              ref={ref}
              className={combobox_input_cva({ size: s, className })}
              {...props}
            />
            {showClear && <Clear aria-label={clearLabel} />}
            {showTrigger && <Trigger aria-label={triggerLabel} />}
          </ComboboxPrimitive.InputGroup>
        </ComboboxSizeContext.Provider>
      );
    },
  );
  Input.displayName = `${name}Input`;

  /** Renders `Portal` → `Positioner` → `Popup`; positioning props go to the Positioner. */
  const Content = forwardRef<HTMLDivElement, ComboboxContentProps>(
    ({ className, container, ...props }, ref) => {
      const [positionerProps, popupProps] = splitPositionerProps(props, {
        side: "bottom",
        align: "start",
        sideOffset: 4,
      });
      return (
        <ComboboxPrimitive.Portal container={container}>
          <ComboboxPrimitive.Positioner
            className="z-50 outline-none"
            {...positionerProps}
          >
            <ComboboxPrimitive.Popup
              ref={ref}
              className={clx(combobox_popup_class, className)}
              {...popupProps}
            />
          </ComboboxPrimitive.Positioner>
        </ComboboxPrimitive.Portal>
      );
    },
  );
  Content.displayName = `${name}Content`;

  /** The list of items. Children can be a function of each item (needs `items` on the root). */
  const List = forwardRef<
    HTMLDivElement,
    WithClassName<ComboboxPrimitive.List.Props>
  >(({ className, ...props }, ref) => (
    <ComboboxPrimitive.List
      ref={ref}
      className={clx("scroll-py-1 outline-none", className)}
      {...props}
    />
  ));
  List.displayName = `${name}List`;

  /** Shown when nothing matches. Keep it mounted: it announces politely to screen readers. */
  const Empty = forwardRef<
    HTMLDivElement,
    WithClassName<ComboboxPrimitive.Empty.Props>
  >(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Empty
      ref={ref}
      className={clx(combobox_message_class, className)}
      {...props}
    />
  ));
  Empty.displayName = `${name}Empty`;

  /** Polite live region for async states ("Searching…"). */
  const Status = forwardRef<
    HTMLDivElement,
    WithClassName<ComboboxPrimitive.Status.Props>
  >(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Status
      ref={ref}
      className={clx(combobox_message_class, className)}
      {...props}
    />
  ));
  Status.displayName = `${name}Status`;

  const Group = forwardRef<
    HTMLDivElement,
    WithClassName<ComboboxPrimitive.Group.Props>
  >(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Group
      ref={ref}
      className={clx("[&+&]:mt-1", className)}
      {...props}
    />
  ));
  Group.displayName = `${name}Group`;

  const GroupLabel = forwardRef<
    HTMLDivElement,
    WithClassName<ComboboxPrimitive.GroupLabel.Props>
  >(({ className, ...props }, ref) => (
    <ComboboxPrimitive.GroupLabel
      ref={ref}
      className={clx(menu_group_label_class, className)}
      {...props}
    />
  ));
  GroupLabel.displayName = `${name}GroupLabel`;

  /** Hairline between groups. */
  const Separator = forwardRef<
    HTMLDivElement,
    WithClassName<ComboboxPrimitive.Separator.Props>
  >(({ className, ...props }, ref) => (
    <ComboboxPrimitive.Separator
      ref={ref}
      className={clx(menu_separator_class, className)}
      {...props}
    />
  ));
  Separator.displayName = `${name}Separator`;

  return {
    Input,
    Clear,
    Trigger,
    Content,
    List,
    Empty,
    Status,
    Group,
    GroupLabel,
    Separator,
  };
};

const {
  Input: ComboboxInput,
  Clear: ComboboxClear,
  Trigger: ComboboxTrigger,
  Content: ComboboxContent,
  List: ComboboxList,
  Empty: ComboboxEmpty,
  Status: ComboboxStatus,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Separator: ComboboxSeparator,
} = createComboboxParts("Combobox", {
  showTrigger: true,
  clearLabel: "Clear",
  triggerLabel: "Show options",
});

/*========================================================================================================================*/

const combobox_chips_cva = cva(
  [
    "relative flex w-full flex-wrap items-center gap-1 rounded-md border border-otl-control bg-bg-white px-1.5 py-1 transition-colors",
    "has-[input:focus-visible]:border-otl-primary-300 has-[input:focus-visible]:ring has-[input:focus-visible]:ring-fr-primary",
    "has-[input[data-invalid]]:border-bg-danger-600",
    "has-[input:disabled]:bg-bg-washed has-[input:disabled]:border-transparent",
  ],
  {
    variants: {
      size: {
        small: "min-h-[var(--ctl-h-sm)]",
        medium: "min-h-[var(--ctl-h-md)]",
        large: "min-h-[var(--ctl-h-lg)]",
      },
    },
    defaultVariants: { size: "small" },
  },
);

interface ComboboxChipsProps
  extends WithClassName<ComboboxPrimitive.Chips.Props>,
    VariantProps<typeof combobox_chips_cva> {}

/** Input box for `multiple`: holds the chips and a `ComboboxChipsInput`. Pass its ref to `ComboboxContent anchor`. */
const ComboboxChips = forwardRef<HTMLDivElement, ComboboxChipsProps>(
  ({ className, size, ...props }, ref) => {
    const s = size ?? "small";
    return (
      <ComboboxSizeContext.Provider value={s}>
        <ComboboxPrimitive.Chips
          ref={ref}
          className={combobox_chips_cva({ size: s, className })}
          {...props}
        />
      </ComboboxSizeContext.Provider>
    );
  },
);
ComboboxChips.displayName = "ComboboxChips";

/** The text input inside `ComboboxChips`. */
const ComboboxChipsInput = forwardRef<
  HTMLInputElement,
  WithClassName<ComboboxPrimitive.Input.Props>
>(({ className, ...props }, ref) => {
  const size = useContext(ComboboxSizeContext);
  return (
    <ComboboxPrimitive.Input
      ref={ref}
      className={combobox_input_cva({
        size,
        className: clx("h-auto min-w-[8ch] self-stretch px-1.5", className),
      })}
      {...props}
    />
  );
});
ComboboxChipsInput.displayName = "ComboboxChipsInput";

/** A selected value: a borderless wash pill (DESIGN.md: Badges and Tags). */
const ComboboxChip = forwardRef<
  HTMLDivElement,
  WithClassName<ComboboxPrimitive.Chip.Props>
>(({ className, ...props }, ref) => (
  <ComboboxPrimitive.Chip
    ref={ref}
    className={clx(
      "bg-bg-washed-active text-txt-black-900 inline-flex max-w-full items-center gap-0.5 rounded-full py-0.5 pr-0.5 pl-2.5",
      "font-body text-body-sm in-data-[density=compact]:text-label-compact font-medium",
      "focus-visible:outline-fr-primary outline-none focus-visible:outline-2 focus-visible:outline-solid",
      "data-[disabled]:text-txt-black-disabled",
      className,
    )}
    {...props}
  />
));
ComboboxChip.displayName = "ComboboxChip";

/** Ghost ✕ inside a chip. */
const ComboboxChipRemove = forwardRef<
  HTMLButtonElement,
  WithClassName<ComboboxPrimitive.ChipRemove.Props>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.ChipRemove
    ref={ref}
    aria-label="Remove"
    className={clx(
      "text-txt-black-700 inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none",
      "hover:bg-bg-black-300 hover:text-txt-black-900 transition-colors duration-150 motion-reduce:transition-none",
      "focus-visible:outline-fr-primary focus-visible:outline-2 focus-visible:outline-solid",
      "[&>svg]:size-3.5",
      className,
    )}
    {...props}
  >
    {children ?? <CrossIcon aria-hidden />}
  </ComboboxPrimitive.ChipRemove>
));
ComboboxChipRemove.displayName = "ComboboxChipRemove";

/*========================================================================================================================*/

/** An option. Selected options show a FTDS Blue check. */
const ComboboxItem = forwardRef<
  ComponentRef<typeof ComboboxPrimitive.Item>,
  WithClassName<ComboboxPrimitive.Item.Props>
>(({ className, children, ...props }, ref) => (
  <ComboboxPrimitive.Item
    ref={ref}
    className={menu_item_cva({
      inset: true,
      className: clx("data-[selected]:text-txt-black-900", className),
    })}
    {...props}
  >
    <ComboboxPrimitive.ItemIndicator className={menu_indicator_class}>
      <CheckIcon className="size-4" />
    </ComboboxPrimitive.ItemIndicator>
    {children}
  </ComboboxPrimitive.Item>
));
ComboboxItem.displayName = "ComboboxItem";

export {
  Combobox,
  ComboboxInput,
  ComboboxClear,
  ComboboxTrigger,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxValue,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxCollection,
  ComboboxSeparator,
  useComboboxFilter,
  combobox_input_group_cva,
  combobox_input_cva,
  combobox_icon_button_cva,
  combobox_popup_class,
  combobox_field_box_class,
  createComboboxParts,
};
export type { ComboboxInputProps, ComboboxChipsProps, ComboboxContentProps };
