import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderNav,
  PageHeaderTitle,
} from "@mof-malaysia/ftds-react/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@mof-malaysia/ftds-react/breadcrumb";
import { Button } from "@mof-malaysia/ftds-react/button";
import { Tag } from "@mof-malaysia/ftds-react/tag";

/**
 * ### Overview
 * `PageHeader` opens a service or officer page: breadcrumb slot, the page's one
 * `h1`, a description, actions on the right (wrapping below on narrow screens),
 * and a meta row for status and facts.
 *
 * ### Usage
 * ```tsx
 * <PageHeader>
 *   <PageHeaderNav>...</PageHeaderNav>
 *   <PageHeaderContent>
 *     <PageHeaderTitle>Applications</PageHeaderTitle>
 *     <PageHeaderDescription>...</PageHeaderDescription>
 *   </PageHeaderContent>
 *   <PageHeaderActions><Button>New application</Button></PageHeaderActions>
 * </PageHeader>
 * ```
 */
const meta: Meta<typeof PageHeader> = {
  title: "App/PageHeader",
  component: PageHeader,
  parameters: { layout: "padded" },
};

export default meta;

const Record = () => (
  <PageHeader>
    <PageHeaderNav>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Applications</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>MOF-2026-0412</BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    </PageHeaderNav>
    <PageHeaderContent>
      <PageHeaderTitle size="headline">
        Application MOF-2026-0412
      </PageHeaderTitle>
      <PageHeaderDescription>
        Grant application submitted by Syarikat Maju Jaya Sdn. Bhd. for the 2027
        SME digitalisation programme.
      </PageHeaderDescription>
    </PageHeaderContent>
    <PageHeaderActions>
      <Button variant="default-outline">Request changes</Button>
      <Button>Approve</Button>
    </PageHeaderActions>
    <PageHeaderMeta>
      <Tag variant="warning" size="small">
        Pending review
      </Tag>
      <span>Last updated 27 October 2026</span>
    </PageHeaderMeta>
  </PageHeader>
);
export const Default = createRender(Record);

const Landing = () => (
  <PageHeader>
    <PageHeaderContent>
      <PageHeaderTitle>Pay your income tax</PageHeaderTitle>
      <PageHeaderDescription>
        Check what you owe for assessment year 2025 and pay online. It takes
        about 5 minutes.
      </PageHeaderDescription>
    </PageHeaderContent>
    <PageHeaderActions>
      <Button size="medium">Start now</Button>
    </PageHeaderActions>
  </PageHeader>
);
export const ServiceLanding = createRender(Landing);

const Narrow = () => (
  <div className="max-w-sm">
    <Record />
  </div>
);
export const NarrowScreen = createRender(Narrow);

const Compact = () => (
  <div data-density="compact">
    <Record />
  </div>
);
export const CompactDensity = createRender(Compact);

const Dark = () => (
  <div className="dark bg-bg-gray-50 p-4">
    <Record />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
