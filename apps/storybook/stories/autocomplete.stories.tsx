import React from "react";
import type { Meta } from "@storybook/react";
import { createRender } from "../utils";
import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@mof-malaysia/myds-react/autocomplete";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";

/**
 * ### Overview
 * `Autocomplete` is a free-text input with suggestions. The value is the text;
 * choosing a suggestion fills it in. Built on Base UI Autocomplete and joins a
 * surrounding `Field`. To force a choice from a list, use `Combobox`.
 *
 * ### Usage
 * ```tsx
 * <Autocomplete items={employers}>
 *   <AutocompleteInput placeholder="For example, Petronas" />
 *   <AutocompleteContent>
 *     <AutocompleteEmpty>No suggestions</AutocompleteEmpty>
 *     <AutocompleteList>
 *       {(name: string) => <AutocompleteItem key={name} value={name}>{name}</AutocompleteItem>}
 *     </AutocompleteList>
 *   </AutocompleteContent>
 * </Autocomplete>
 * ```
 */
const meta: Meta<typeof Autocomplete> = {
  title: "App/Autocomplete",
  component: Autocomplete,
  parameters: { layout: "padded" },
};

export default meta;

const employers = [
  "Petroliam Nasional Berhad",
  "Tenaga Nasional Berhad",
  "Maybank",
  "CIMB Group",
  "Telekom Malaysia",
  "Axiata Group",
  "Sime Darby",
  "Public Bank",
  "AirAsia",
  "Malaysia Airlines",
];

const Suggestions = () => (
  <AutocompleteContent>
    <AutocompleteEmpty>
      No suggestions. You can still type the full name.
    </AutocompleteEmpty>
    <AutocompleteList>
      {(name: string) => (
        <AutocompleteItem key={name} value={name}>
          {name}
        </AutocompleteItem>
      )}
    </AutocompleteList>
  </AutocompleteContent>
);

const Basic = () => (
  <div className="max-w-sm">
    <Field name="employer">
      <FieldLabel>Employer name</FieldLabel>
      <FieldDescription>As shown on your EA form.</FieldDescription>
      <Autocomplete items={employers}>
        <AutocompleteInput placeholder="For example, Maybank" />
        <Suggestions />
      </Autocomplete>
    </Field>
  </div>
);
export const Default = createRender(Basic);

const groups = [
  { value: "Recent searches", items: ["Cukai pendapatan", "e-Filing"] },
  {
    value: "Popular",
    items: ["Bayaran balik cukai", "Pelepasan cukai", "Borang BE"],
  },
];

const Grouped = () => (
  <div className="max-w-sm">
    <Field name="search">
      <FieldLabel>Search the service</FieldLabel>
      <Autocomplete items={groups} openOnInputClick>
        <AutocompleteInput placeholder="Search" showTrigger />
        <AutocompleteContent>
          <AutocompleteEmpty>No suggestions</AutocompleteEmpty>
          <AutocompleteList>
            {(group: (typeof groups)[number]) => (
              <AutocompleteGroup key={group.value} items={group.items}>
                <AutocompleteGroupLabel>{group.value}</AutocompleteGroupLabel>
                <AutocompleteCollection>
                  {(item: string) => (
                    <AutocompleteItem key={item} value={item}>
                      {item}
                    </AutocompleteItem>
                  )}
                </AutocompleteCollection>
              </AutocompleteGroup>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </Field>
  </div>
);
export const GroupedSuggestions = createRender(Grouped);

const Invalid = () => (
  <div className="max-w-sm">
    <Field name="employer-invalid" invalid>
      <FieldLabel>Employer name</FieldLabel>
      <Autocomplete items={employers}>
        <AutocompleteInput />
        <Suggestions />
      </Autocomplete>
      <FieldError>Enter the name of your employer</FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Sizes = () => (
  <div className="flex max-w-sm flex-col gap-4">
    {(["small", "medium", "large"] as const).map((size) => (
      <Autocomplete key={size} items={employers}>
        <AutocompleteInput
          size={size}
          aria-label={`Employer (${size})`}
          placeholder={size}
        />
        <Suggestions />
      </Autocomplete>
    ))}
  </div>
);
export const AllSizes = createRender(Sizes);

const Compact = () => (
  <div data-density="compact">
    <Basic />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white p-4">
    <Basic />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
