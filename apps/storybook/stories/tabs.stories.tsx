import type { Meta, StoryObj } from "@storybook/react-vite";
import { createStory } from "../utils";
import {
  Tabs,
  TabsContent,
  TabsCounter,
  TabsIcon,
  TabsList,
  TabsTrigger,
} from "@mof-malaysia/myds-react/tabs";
import {
  ClockIcon,
  DocumentIcon,
  InfoIcon,
  MoneyIcon,
} from "@mof-malaysia/myds-react/icon";

/**
 * ### Overview
 * Tabs switch between views of the same subject, such as the parts of one application.
 * There is one style (DESIGN.md, Navigation): Label type in Ink Secondary on a single
 * Hairline, the active tab in Ink with a 2px MYDS Blue underline that slides between
 * tabs. No pills and no boxes.
 *
 * - Tab height follows the density toolbar (44px comfortable, 32px compact); `size`
 *   steps it within the density.
 * - `TabsCounter` is a neutral pill, so the only blue on the tab bar is the underline.
 * - Lists that don't fit scroll sideways without a scrollbar.
 * - Arrow keys move between tabs; `activationMode="manual"` waits for Enter or Space.
 *
 * ### Usage
 * ```tsx
 * import {
 *   Tabs,
 *   TabsContent,
 *   TabsCounter,
 *   TabsList,
 *   TabsTrigger,
 * } from "@mof-malaysia/myds-react/tabs";
 *
 * <Tabs defaultValue="details">
 *   <TabsList width="full">
 *     <TabsTrigger value="details">Details</TabsTrigger>
 *     <TabsTrigger value="documents">
 *       Documents <TabsCounter>3</TabsCounter>
 *     </TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="details">...</TabsContent>
 *   <TabsContent value="documents">...</TabsContent>
 * </Tabs>
 * ```
 */
const meta = {
  title: "Core/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  args: { defaultValue: "details", size: "small" },
  argTypes: {
    size: {
      description: "Tab height within the current density",
      control: "inline-radio",
      options: ["small", "medium"],
    },
    activationMode: {
      control: "inline-radio",
      options: ["automatic", "manual"],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const panels = (
  <>
    <TabsContent value="details">
      <p>
        Application APP-2025-00418 for the SME Digitalisation Matching Grant was
        submitted on 12 March 2025 and is with the assessing officer.
      </p>
    </TabsContent>
    <TabsContent value="documents">
      <p>
        3 documents uploaded: company registration, latest audited accounts and
        the vendor quotation.
      </p>
    </TabsContent>
    <TabsContent value="payments">
      <p>No payments are due on this application.</p>
    </TabsContent>
    <TabsContent value="history">
      <p>Submitted 12 March 2025. Assigned to an officer 14 March 2025.</p>
    </TabsContent>
  </>
);

export const Default: Story = createStory({
  children: (
    <>
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      {panels}
    </>
  ),
});

/** `width="full"` runs the Hairline across the container, the usual choice on a page. */
export const FullWidth: Story = createStory({
  children: (
    <>
      <TabsList width="full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      {panels}
    </>
  ),
});

/** Counts sit in a neutral pill in tabular figures. */
export const WithCounter: Story = createStory({
  children: (
    <>
      <TabsList width="full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="documents">
          Documents <TabsCounter>3</TabsCounter>
        </TabsTrigger>
        <TabsTrigger value="payments">
          Payments <TabsCounter>0</TabsCounter>
        </TabsTrigger>
        <TabsTrigger value="history">
          History <TabsCounter>12</TabsCounter>
        </TabsTrigger>
      </TabsList>
      {panels}
    </>
  ),
});

/** Icons take the tab's text colour and are hidden from screen readers. */
export const WithIcon: Story = createStory({
  children: (
    <>
      <TabsList width="full">
        <TabsTrigger value="details">
          <TabsIcon>
            <InfoIcon />
          </TabsIcon>
          Details
        </TabsTrigger>
        <TabsTrigger value="documents">
          <TabsIcon>
            <DocumentIcon />
          </TabsIcon>
          Documents
        </TabsTrigger>
        <TabsTrigger value="payments">
          <TabsIcon>
            <MoneyIcon />
          </TabsIcon>
          Payments
        </TabsTrigger>
        <TabsTrigger value="history">
          <TabsIcon>
            <ClockIcon />
          </TabsIcon>
          History
        </TabsTrigger>
      </TabsList>
      {panels}
    </>
  ),
});

/** A tab that can't be opened yet stays visible, in the disabled ink. */
export const Disabled: Story = createStory({
  children: (
    <>
      <TabsList width="full">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="payments" disabled>
          Payments
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      {panels}
    </>
  ),
});

/** More tabs than fit: the list scrolls sideways and keeps the underline in place. */
export const Overflow: Story = {
  ...createStory({
    defaultValue: "payments",
    children: (
      <>
        <TabsList width="full">
          {[
            "Details",
            "Applicant",
            "Company",
            "Documents",
            "Payments",
            "Assessment",
            "Correspondence",
            "History",
          ].map((label) => (
            <TabsTrigger key={label} value={label.toLowerCase()}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {panels}
      </>
    ),
  }),
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const DarkWithCounter: Story = createStory(
  {
    className: "dark",
    children: (
      <>
        <TabsList width="full">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">
            Documents <TabsCounter>3</TabsCounter>
          </TabsTrigger>
          <TabsTrigger value="payments" disabled>
            Payments
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        {panels}
      </>
    ),
  },
  "dark",
);
