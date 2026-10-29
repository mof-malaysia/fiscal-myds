"use client";

import React, { forwardRef } from "react";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { menu_item_cva } from "../core/menu";
import {
  createComboboxParts,
  type ComboboxContentProps,
  type ComboboxInputProps,
} from "./combobox";
import { type WithClassName } from "../../utils";

/**
 * Autocomplete is a free-text input that offers suggestions as people type: a
 * company name, a street, a search box. The value is whatever text is in the input;
 * picking a suggestion just fills it in. To force a choice from a list, use Combobox.
 *
 * It joins a surrounding Field for label, hint, error and validity.
 *
 * @example
 * <Field name="employer">
 *   <FieldLabel>Employer name</FieldLabel>
 *   <Autocomplete items={employers}>
 *     <AutocompleteInput placeholder="For example, Petronas" />
 *     <AutocompleteContent>
 *       <AutocompleteEmpty>No suggestions. You can still type the full name.</AutocompleteEmpty>
 *       <AutocompleteList>
 *         {(name: string) => <AutocompleteItem key={name} value={name}>{name}</AutocompleteItem>}
 *       </AutocompleteList>
 *     </AutocompleteContent>
 *   </Autocomplete>
 * </Field>
 */

const Autocomplete = AutocompletePrimitive.Root;

/** Render prop access to the current text. */
const AutocompleteValue = AutocompletePrimitive.Value;

/** Renders the items of the nearest `AutocompleteGroup` (`items` prop). */
const AutocompleteCollection = AutocompletePrimitive.Collection;

/** Filter helper matching Base UI's locale-aware `contains` / `startsWith`. */
const useAutocompleteFilter = AutocompletePrimitive.useFilter;

/*========================================================================================================================*/

/** Text input with an optional clear button (`showTrigger` defaults to false), styled like Input. */
type AutocompleteInputProps = ComboboxInputProps;

/** Renders `Portal` → `Positioner` → `Popup`; positioning props go to the Positioner. */
type AutocompleteContentProps = ComboboxContentProps;

// Base UI Autocomplete reuses Combobox's parts; only names and default labels differ
const {
  Input: AutocompleteInput,
  Clear: AutocompleteClear,
  Trigger: AutocompleteTrigger,
  Content: AutocompleteContent,
  List: AutocompleteList,
  Empty: AutocompleteEmpty,
  Status: AutocompleteStatus,
  Group: AutocompleteGroup,
  GroupLabel: AutocompleteGroupLabel,
  Separator: AutocompleteSeparator,
} = createComboboxParts("Autocomplete", {
  showTrigger: false,
  clearLabel: "Clear",
  triggerLabel: "Show suggestions",
});

/** A suggestion. No check mark: choosing it only fills the text. */
const AutocompleteItem = forwardRef<
  HTMLDivElement,
  WithClassName<AutocompletePrimitive.Item.Props>
>(({ className, ...props }, ref) => (
  <AutocompletePrimitive.Item
    ref={ref}
    className={menu_item_cva({ className })}
    {...props}
  />
));
AutocompleteItem.displayName = "AutocompleteItem";

export {
  Autocomplete,
  AutocompleteInput,
  AutocompleteClear,
  AutocompleteTrigger,
  AutocompleteValue,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteEmpty,
  AutocompleteStatus,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection,
  AutocompleteSeparator,
  useAutocompleteFilter,
};
export type { AutocompleteInputProps, AutocompleteContentProps };
