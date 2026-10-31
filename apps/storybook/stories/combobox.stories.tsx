import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Combobox,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@mof-malaysia/ftds-react/combobox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";

/**
 * ### Overview
 * `Combobox` picks one or more values from a long list by typing to filter it.
 * Built on Base UI Combobox: keyboard navigation, `aria-activedescendant` and
 * live empty-state announcements are handled for you. It joins a surrounding `Field`.
 *
 * ### Usage
 * ```tsx
 * <Combobox items={states}>
 *   <ComboboxInput placeholder="Search states" />
 *   <ComboboxContent>
 *     <ComboboxEmpty>No states match your search</ComboboxEmpty>
 *     <ComboboxList>
 *       {(state: string) => <ComboboxItem key={state} value={state}>{state}</ComboboxItem>}
 *     </ComboboxList>
 *   </ComboboxContent>
 * </Combobox>
 * ```
 */
const meta: Meta<typeof Combobox> = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "app-combobox",
  title: "App/Combobox",
  component: Combobox,
  parameters: { layout: "padded" },
};

export default meta;

const states = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "W.P. Kuala Lumpur",
  "W.P. Labuan",
  "W.P. Putrajaya",
];

const StateList = () => (
  <ComboboxContent>
    <ComboboxEmpty>No states match your search</ComboboxEmpty>
    <ComboboxList>
      {(state: string) => (
        <ComboboxItem key={state} value={state}>
          {state}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
);

const Basic = () => (
  <div className="max-w-sm">
    <Field name="state">
      <FieldLabel>State of residence</FieldLabel>
      <FieldDescription>Where you lived on 31 December.</FieldDescription>
      <Combobox items={states}>
        <ComboboxInput placeholder="Search states" />
        <StateList />
      </Combobox>
    </Field>
  </div>
);
export const Default = createRender(Basic);

const agencies = [
  "Jabatan Akauntan Negara",
  "Jabatan Kastam Diraja Malaysia",
  "Lembaga Hasil Dalam Negeri",
  "Kementerian Kewangan",
  "Bank Negara Malaysia",
  "Suruhanjaya Syarikat Malaysia",
  "Kumpulan Wang Simpanan Pekerja",
];

const Multiple = () => {
  const anchor = React.useRef<HTMLDivElement>(null);
  return (
    <div className="max-w-md">
      <Field name="agencies">
        <FieldLabel>Agencies to notify</FieldLabel>
        <Combobox items={agencies} multiple defaultValue={[agencies[2]]}>
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(values: string[]) =>
                values.map((value) => (
                  <ComboboxChip key={value}>
                    {value}
                    <ComboboxChipRemove aria-label={`Remove ${value}`} />
                  </ComboboxChip>
                ))
              }
            </ComboboxValue>
            <ComboboxChipsInput placeholder="Add an agency" />
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No agencies match your search</ComboboxEmpty>
            <ComboboxList>
              {(agency: string) => (
                <ComboboxItem key={agency} value={agency}>
                  {agency}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
    </div>
  );
};
export const MultipleSelection = createRender(Multiple);

const groupedReliefs = [
  {
    value: "Family",
    items: [
      "Spouse",
      "Child under 18",
      "Child in higher education",
      "Parents' medical",
    ],
  },
  {
    value: "Lifestyle",
    items: [
      "Books and journals",
      "Computer or smartphone",
      "Sports equipment",
      "Internet subscription",
    ],
  },
  {
    value: "Savings",
    items: [
      "EPF contributions",
      "Life insurance",
      "SSPN deposit",
      "Private retirement scheme",
    ],
  },
];

const Grouped = () => (
  <div className="max-w-sm">
    <Field name="relief">
      <FieldLabel>Relief category</FieldLabel>
      <Combobox items={groupedReliefs}>
        <ComboboxInput placeholder="Search reliefs" />
        <ComboboxContent>
          <ComboboxEmpty>No reliefs match your search</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof groupedReliefs)[number]) => (
              <ComboboxGroup key={group.value} items={group.items}>
                <ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  </div>
);
export const GroupedItems = createRender(Grouped);

const Invalid = () => (
  <div className="max-w-sm">
    <Field name="state-invalid" invalid>
      <FieldLabel>State of residence</FieldLabel>
      <Combobox items={states}>
        <ComboboxInput placeholder="Search states" />
        <StateList />
      </Combobox>
      <FieldError>Select the state you lived in on 31 December</FieldError>
    </Field>
  </div>
);
export const WithError = createRender(Invalid);

const Disabled = () => (
  <div className="max-w-sm">
    <Field name="state-disabled" disabled>
      <FieldLabel>State of residence</FieldLabel>
      <Combobox items={states} defaultValue="Selangor" disabled>
        <ComboboxInput />
        <StateList />
      </Combobox>
    </Field>
  </div>
);
export const DisabledState = createRender(Disabled);

const Compact = () => (
  <div data-density="compact" className="flex flex-col gap-4">
    <Basic />
    <Multiple />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-white flex flex-col gap-4 p-4">
    <Basic />
    <Multiple />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
