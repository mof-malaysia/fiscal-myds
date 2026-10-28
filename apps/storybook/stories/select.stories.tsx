import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Select,
  SelectContent,
  SelectFooter,
  SelectGroup,
  SelectGroupTitle,
  SelectHeader,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectOption,
} from "@mof-malaysia/myds-react/select";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/myds-react/field";
import { Input, InputIcon } from "@mof-malaysia/myds-react/input";
import { Button } from "@mof-malaysia/myds-react/button";
import {
  FilterIcon,
  GlobeIcon,
  SearchIcon,
} from "@mof-malaysia/myds-react/icon";

/**
 * ### Overview
 * Select lets someone choose one option, or several with `multiple`, from a list
 * that opens below a field-like trigger. It sits in a `Field` like any other
 * control: the label goes above it in `FieldLabel`, never inside the trigger, and
 * an invalid field turns its stroke Danger.
 *
 * - **Shorthand:** pass `items` (and a `placeholder`) and Select renders the
 *   trigger and the list. Items can carry a `description` and a `group`.
 * - **Composed:** use the parts for headers, footers, custom display or icons.
 * - **Width:** the trigger fills its container, like Input. Pass
 *   `className="w-fit"` for toolbar selects.
 * - **Multiple:** the trigger shows the first choice and "+2 more"; screen
 *   readers hear every choice.
 * - `clearable` adds a clear button once something is chosen.
 *
 * ### Usage
 * ```tsx
 * <Field name="state">
 *   <FieldLabel>State</FieldLabel>
 *   <Select placeholder="Choose a state" items={[
 *     { value: "jhr", label: "Johor" },
 *     { value: "kdh", label: "Kedah" },
 *   ]} />
 * </Field>
 *
 * <Select multiple clearable>
 *   <SelectTrigger icon={<FilterIcon />} className="w-fit">
 *     <SelectValue placeholder="Any status" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="pending">Pending</SelectItem>
 *     <SelectItem value="approved">Approved</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
const meta: Meta<typeof Select> = {
  title: "Core/Select",
  component: Select,
  parameters: { layout: "centered" },
};

export default meta;

const STATES: SelectOption[] = [
  { value: "jhr", label: "Johor" },
  { value: "kdh", label: "Kedah" },
  { value: "ktn", label: "Kelantan" },
  { value: "mlk", label: "Melaka" },
  { value: "nsn", label: "Negeri Sembilan" },
  { value: "phg", label: "Pahang" },
  { value: "prk", label: "Perak" },
  { value: "pls", label: "Perlis" },
  { value: "png", label: "Pulau Pinang" },
  { value: "sbh", label: "Sabah" },
  { value: "swk", label: "Sarawak" },
  { value: "sgr", label: "Selangor" },
  { value: "trg", label: "Terengganu" },
  { value: "kul", label: "Kuala Lumpur", group: "Federal territories" },
  { value: "lbn", label: "Labuan", group: "Federal territories" },
  { value: "pjy", label: "Putrajaya", group: "Federal territories" },
];

const PAYMENT: SelectOption[] = [
  {
    value: "fpx",
    label: "FPX online banking",
    description: "Pay from your bank account. Most banks in Malaysia.",
  },
  {
    value: "card",
    label: "Debit or credit card",
    description: "Visa or Mastercard.",
  },
  {
    value: "duitnow",
    label: "DuitNow QR",
    description: "Scan with your banking or e-wallet app.",
  },
  {
    value: "cheque",
    label: "Cheque",
    description: "No longer accepted for online payments.",
    disabled: true,
  },
];

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "review", label: "In review" },
  { value: "action", label: "Action needed" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const Frame = ({
  children,
  width = "w-80",
}: {
  children: React.ReactNode;
  width?: string;
}) => <div className={`${width} flex flex-col gap-6`}>{children}</div>;

/** A labelled field with the `items` shorthand. The label sits above, never in the trigger. */
export const Default = createRender(() => (
  <Frame>
    <Field name="state">
      <FieldLabel>State</FieldLabel>
      <FieldDescription>Where your business is registered</FieldDescription>
      <Select placeholder="Choose a state" items={STATES} />
    </Field>
  </Frame>
));

/** Options with a second line. Only the label shows in the trigger once chosen. */
export const WithDescriptions = createRender(() => (
  <Frame>
    <Field name="method">
      <FieldLabel>Payment method</FieldLabel>
      <Select
        size="medium"
        placeholder="Choose how to pay"
        defaultValue="fpx"
        items={PAYMENT}
      />
    </Field>
  </Frame>
));

/** Small (32px compact / officer), medium and large (citizen forms). */
export const Sizes = createRender(() => (
  <Frame>
    {(["small", "medium", "large"] as const).map((size) => (
      <Field key={size} name={size}>
        <FieldLabel>State ({size})</FieldLabel>
        <Select size={size} placeholder="Choose a state" items={STATES} />
      </Field>
    ))}
  </Frame>
));

/** Inside an invalid Field the stroke turns Danger and the error shows below. */
export const Invalid = createRender(() => (
  <Frame>
    <Field name="state" invalid>
      <FieldLabel>State</FieldLabel>
      <Select placeholder="Choose a state" items={STATES} />
      <FieldError>
        Choose the state where your business is registered
      </FieldError>
    </Field>
  </Frame>
));

export const Disabled = createRender(() => (
  <Frame>
    <Field name="state" disabled>
      <FieldLabel>State</FieldLabel>
      <Select disabled defaultValue="sgr" items={STATES} />
    </Field>
  </Frame>
));

/** Several choices: the first, then "+N more". `clearable` empties it in one press. */
export const Multiple = createRender(() => (
  <Frame>
    <Field name="statuses">
      <FieldLabel>Statuses</FieldLabel>
      <Select
        multiple
        clearable
        placeholder="Any status"
        defaultValue={["submitted", "review", "action"]}
        items={STATUSES}
      />
    </Field>
  </Frame>
));

/** A compact toolbar filter: ghost variant, fitted width, leading icon, clear button. */
export const ToolbarFilter = createRender(() => {
  const [status, setStatus] = React.useState("review");
  return (
    <div data-density="compact" className="flex items-center gap-2">
      <Select
        variant="ghost"
        clearable
        value={status}
        onValueChange={setStatus}
        items={STATUSES}
      >
        <SelectTrigger
          aria-label="Status"
          className="w-fit"
          icon={<FilterIcon />}
        >
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue="en"
        items={[
          { value: "en", label: "English" },
          { value: "ms", label: "Bahasa Melayu" },
        ]}
      >
        <SelectTrigger
          aria-label="Language"
          className="w-fit"
          icon={<GlobeIcon />}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ms">Bahasa Melayu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});

/** Composed parts: a pinned search header, groups, a separator and a footer action. */
export const WithHeaderAndFooter = createRender(() => {
  const [query, setQuery] = React.useState("");
  const [value, setValue] = React.useState<string[]>([]);
  const matches = (option: SelectOption) =>
    String(option.label).toLowerCase().includes(query.toLowerCase());
  const states = STATES.filter((s) => !s.group && matches(s));
  const territories = STATES.filter((s) => s.group && matches(s));
  return (
    <Frame>
      <Field name="regions">
        <FieldLabel>Regions</FieldLabel>
        <Select multiple value={value} onValueChange={setValue} items={STATES}>
          <SelectTrigger>
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectHeader>
              <Input
                size="small"
                aria-label="Search regions"
                placeholder="Search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <InputIcon position="left">
                  <SearchIcon />
                </InputIcon>
              </Input>
            </SelectHeader>
            {(
              [
                ["States", states],
                ["Federal territories", territories],
              ] as const
            )
              .filter(([, options]) => options.length > 0)
              .map(([title, options], i) => (
                <React.Fragment key={title}>
                  {i > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectGroupTitle>{title}</SelectGroupTitle>
                    {options.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </React.Fragment>
              ))}
            <SelectFooter>
              <Button
                size="small"
                variant="default-ghost"
                className="w-full justify-center"
                disabled={value.length === 0}
                onClick={() => setValue([])}
              >
                Clear all
              </Button>
            </SelectFooter>
          </SelectContent>
        </Select>
      </Field>
    </Frame>
  );
});

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-6">
      <Frame>
        <Field name="state">
          <FieldLabel>State</FieldLabel>
          <Select placeholder="Choose a state" items={STATES} />
        </Field>
        <Field name="statuses">
          <FieldLabel>Statuses</FieldLabel>
          <Select
            multiple
            clearable
            defaultValue={["submitted", "review"]}
            items={STATUSES}
          />
        </Field>
      </Frame>
    </div>
  ),
  "dark",
);
