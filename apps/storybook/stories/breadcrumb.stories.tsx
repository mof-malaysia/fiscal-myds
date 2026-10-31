import type { Meta, StoryObj } from "@storybook/react-vite";
import { createStory } from "../utils";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mof-malaysia/ftds-react/breadcrumb";
import React from "react";

/**
 * ### Overview
 * Breadcrumb shows where the current page sits and links back up the trail. It is quiet
 * navigation: Label type, parent pages in Ink Secondary, the current page in Ink, small
 * chevrons between them, and no container around the trail.
 *
 * Long names truncate at 200px and keep the full name in a tooltip. For deep trails, keep
 * the first and the last two levels and collapse the middle into `BreadcrumbEllipsis`.
 *
 * ### Usage
 * ```tsx
 * import {
 *   Breadcrumb,
 *   BreadcrumbItem,
 *   BreadcrumbLink,
 *   BreadcrumbPage,
 *   BreadcrumbSeparator,
 * } from "@mof-malaysia/ftds-react/breadcrumb";
 *
 * <Breadcrumb>
 *   <BreadcrumbItem>
 *     <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *   </BreadcrumbItem>
 *   <BreadcrumbSeparator />
 *   <BreadcrumbItem>
 *     <BreadcrumbPage>Applications</BreadcrumbPage>
 *   </BreadcrumbItem>
 * </Breadcrumb>
 * ```
 */
const meta = {
  // Pinned so URLs survive the "FTDS for React" title prefix
  id: "core-breadcrumb",
  title: "Core/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "basic",
  },
  argTypes: {
    children: {
      type: "string",
      control: "select",
      options: ["basic", "deep", "long-text", "collapsed"],
      description: "Trail scenario",
      mapping: {
        basic: (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Applications</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ),
        deep: (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Tax</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Applications</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>APP-2025-00418</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ),
        "long-text": (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Grants</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                Application for the Small and Medium Enterprise Digitalisation
                Matching Grant
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ),
        collapsed: (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Applications</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>APP-2025-00418</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ),
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A parent page and the current page. */
export const Basic: Story = createStory({ children: "basic" });

/** Every parent level is a link; only the current page is Ink. */
export const Deep: Story = createStory({ children: "deep" });

/** Long names truncate at 200px; hover shows the full name. */
export const LongText: Story = createStory({ children: "long-text" });

/** Deep trails keep the first and last two levels and collapse the middle. */
export const Collapsed: Story = createStory({ children: "collapsed" });

export const DarkDeep: Story = createStory(
  { children: "deep", className: "dark" },
  "dark",
);

export const DarkLongText: Story = createStory(
  { children: "long-text", className: "dark" },
  "dark",
);
