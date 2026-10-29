import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import { Faq } from "@mof-malaysia/myds-react/faq";
import { Link } from "@mof-malaysia/myds-react/link";

/**
 * ### Overview
 * Section heading and intro beside an accordion of questions and answers,
 * passed as data, with an optional "still need help" contact line.
 *
 * ### Usage
 * ```tsx
 * <Faq
 *   title="Frequently asked questions"
 *   items={[{ question: "Who can apply?", answer: "…" }]}
 *   contact={<>Still need help? <Link href="/contact" primary>Contact us</Link></>}
 * />
 * ```
 */
const meta: Meta<typeof Faq> = {
  title: "Marketing/Blocks/Faq",
  component: Faq,
  parameters: { layout: "fullscreen" },
};

export default meta;

const items = [
  {
    question: "Which bills can I pay here?",
    answer:
      "Fees, fines and assessments from more than 30 federal agencies, including JPJ summonses, LHDN instalments and court fines.",
  },
  {
    question: "How do I know my payment went through?",
    answer:
      "You see a confirmation page with a reference number straight away, and we email you an official receipt within five minutes.",
  },
  {
    question: "Can I pay on behalf of someone else?",
    answer:
      "Yes. Enter their bill or reference number. The receipt will show their name and your payment details.",
  },
  {
    question: "What if I paid the wrong amount?",
    answer:
      "Contact the agency that issued the bill. Refunds are handled by the agency and usually take 14 working days.",
  },
];

const contact = (
  <>
    Still need help?{" "}
    <Link href="#" primary underline="always">
      Contact the help centre
    </Link>
  </>
);

const Standard = () => (
  <Faq
    description="Answers to the questions people ask most about paying online."
    items={items}
    contact={contact}
    defaultOpen="faq-0"
  />
);
export const Default = createRender(Standard);

export const MultipleOpen = createRender(() => (
  <Faq title="Soalan lazim" items={items} multiple />
));

export const Compact = createRender(() => (
  <div data-density="compact">
    <Standard />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white">
      <Standard />
    </div>
  ),
  "dark",
);
