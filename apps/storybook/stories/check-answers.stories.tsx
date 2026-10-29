import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  CheckAnswers,
  type CheckAnswersSection,
} from "@mof-malaysia/ftds-react/check-answers";
import {
  Callout,
  CalloutContent,
  CalloutTitle,
} from "@mof-malaysia/ftds-react/callout";

/**
 * ### Overview
 * The last page before submitting: every answer grouped by section, each with a
 * "Change" link back to the step that asked it (the link's hidden text says what
 * it changes), then an optional declaration and "Accept and submit".
 *
 * It renders a `<form>`. If the declaration isn't ticked, pass `declarationError`
 * back to show it on the checkbox and in an ErrorSummary.
 *
 * ### Usage
 * ```tsx
 * <CheckAnswers
 *   sections={[{ title: "Your details", rows: [{ label: "Full name", value: name, changeHref: "/apply/details" }] }]}
 *   declaration="I confirm that the information I have given is true and complete."
 *   declarationError={error}
 *   onSubmit={(event) => { event.preventDefault(); submit(); }}
 * />
 * ```
 */
const meta: Meta<typeof CheckAnswers> = {
  title: "App/Blocks/CheckAnswers",
  component: CheckAnswers,
  parameters: { layout: "padded" },
};

export default meta;

const SECTIONS: CheckAnswersSection[] = [
  {
    title: "Your details",
    rows: [
      { label: "Full name", value: "Nur Aisyah binti Ahmad", changeHref: "#" },
      { label: "IC number", value: "900101-14-5678", changeHref: "#" },
      {
        label: "Address",
        value: (
          <>
            No. 12, Jalan Damai 3
            <br />
            43000 Kajang, Selangor
          </>
        ),
        changeHref: "#",
        changeHint: "address",
      },
    ],
  },
  {
    title: "Your income",
    rows: [
      { label: "Annual income", value: "RM 68,400.00", changeHref: "#" },
      {
        label: "Employer",
        value: "Syarikat Maju Jaya Sdn. Bhd.",
        changeHref: "#",
      },
    ],
  },
];

const DECLARATION =
  "I confirm that the information I have given is true and complete. I understand that giving false information may lead to a penalty.";

const Interactive = () => {
  const [error, setError] = React.useState<string>();
  return (
    <CheckAnswers
      sections={SECTIONS}
      declaration={DECLARATION}
      declarationError={error}
      onSubmit={(event) => {
        event.preventDefault();
        const accepted = new FormData(event.currentTarget).get("declaration");
        setError(
          accepted
            ? undefined
            : "Confirm the declaration to submit your application",
        );
      }}
    />
  );
};

/** Submit without ticking the declaration to see the error. */
export const Default = createRender(Interactive);

export const DeclarationError = createRender(() => (
  <CheckAnswers
    sections={SECTIONS}
    declaration={DECLARATION}
    declarationError="Confirm the declaration to submit your application"
  />
));

/** No declaration, and a notice between the answers and the button. */
export const WithNotice = createRender(() => (
  <CheckAnswers sections={SECTIONS}>
    <Callout variant="info">
      <CalloutTitle>There is a RM 50.00 fee</CalloutTitle>
      <CalloutContent>
        You will pay it on the next page, after you submit.
      </CalloutContent>
    </Callout>
  </CheckAnswers>
));

export const Pending = createRender(() => (
  <CheckAnswers sections={SECTIONS} declaration={DECLARATION} pending />
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-6">
      <CheckAnswers
        sections={SECTIONS}
        declaration={DECLARATION}
        declarationError="Confirm the declaration to submit your application"
      />
    </div>
  ),
  "dark",
);
