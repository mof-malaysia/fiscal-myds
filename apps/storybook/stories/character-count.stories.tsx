import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { CharacterCount } from "@mof-malaysia/ftds-react/character-count";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@mof-malaysia/ftds-react/field";

/**
 * ### Overview
 * `CharacterCount` adds a live limit to a text area. Near the limit the message
 * turns to a warning; past it, the field is invalid and won't submit. Screen
 * readers hear the count once typing pauses.
 *
 * ### Usage
 * ```tsx
 * <Field>
 *   <FieldLabel>Why are you appealing?</FieldLabel>
 *   <CharacterCount limit={200} />
 *   <FieldError />
 * </Field>
 * ```
 */
const meta: Meta<typeof CharacterCount> = {
  title: "App/CharacterCount",
  component: CharacterCount,
  parameters: { layout: "padded" },
};

export default meta;

const Basic = ({ defaultValue }: { defaultValue?: string }) => (
  <div className="max-w-xl">
    <Field>
      <FieldLabel>Why are you appealing this decision?</FieldLabel>
      <FieldDescription>
        Do not include personal or financial details.
      </FieldDescription>
      <CharacterCount limit={200} defaultValue={defaultValue} />
      <FieldError />
    </Field>
  </div>
);
export const Default = createRender(() => <Basic />);

export const NearLimit = createRender(() => (
  <Basic
    defaultValue={
      "I paid the full amount on 3 March but the system still shows it as outstanding. "
        .repeat(2)
        .trim() + " Receipt attached."
    }
  />
));

export const OverLimit = createRender(() => (
  <Basic
    defaultValue={"I paid the full amount on 3 March but the system still shows it as outstanding. ".repeat(
      3,
    )}
  />
));

const Words = () => (
  <div className="max-w-xl">
    <Field>
      <FieldLabel>Project summary</FieldLabel>
      <CharacterCount limit={50} countBy="words" />
    </Field>
  </div>
);
export const CountWords = createRender(Words);

const Malay = () => (
  <div className="max-w-xl">
    <Field>
      <FieldLabel>Sebab rayuan</FieldLabel>
      <CharacterCount
        limit={100}
        formatMessage={({ remaining }) =>
          remaining >= 0
            ? `Anda ada ${remaining} aksara lagi`
            : `Anda melebihi had sebanyak ${-remaining} aksara`
        }
        overLimitMessage={({ limit }) => `Masukkan ${limit} aksara atau kurang`}
      />
    </Field>
  </div>
);
export const CustomMessage = createRender(Malay);

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
