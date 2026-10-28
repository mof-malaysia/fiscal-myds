import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@mof-malaysia/myds-react/avatar";
import { UserIcon } from "@mof-malaysia/myds-react/icon";

/**
 * ### Overview
 * `Avatar` shows a photo with initials as the fallback while loading or on error.
 * `AvatarGroup` overlaps several avatars. Built on Base UI Avatar.
 *
 * ### Usage
 * ```tsx
 * <Avatar>
 *   <AvatarImage src="/aminah.jpg" alt="Aminah binti Yusof" />
 *   <AvatarFallback>AY</AvatarFallback>
 * </Avatar>
 * ```
 */
const meta: Meta<typeof Avatar> = {
  title: "Core/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
};

export default meta;

// Inline SVG keeps the story offline and deterministic
const photo =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#94a3b8"/><circle cx="32" cy="26" r="12" fill="#e2e8f0"/><rect x="12" y="42" width="40" height="22" rx="11" fill="#e2e8f0"/></svg>',
  );

const Sizes = () => (
  <div className="flex items-center gap-4">
    <Avatar size="small">
      <AvatarFallback>AY</AvatarFallback>
    </Avatar>
    <Avatar size="medium">
      <AvatarFallback>AY</AvatarFallback>
    </Avatar>
    <Avatar size="large">
      <AvatarFallback>AY</AvatarFallback>
    </Avatar>
    <Avatar size="large">
      <AvatarImage src={photo} alt="Aminah binti Yusof" />
      <AvatarFallback>AY</AvatarFallback>
    </Avatar>
    <Avatar size="large">
      <AvatarImage src="/does-not-exist.jpg" alt="Lim Wei Ming" />
      <AvatarFallback>LW</AvatarFallback>
    </Avatar>
    <Avatar size="large">
      <AvatarFallback>
        <UserIcon aria-hidden />
        <span className="sr-only">Unknown user</span>
      </AvatarFallback>
    </Avatar>
  </div>
);
export const Default = createRender(Sizes);

const Group = () => (
  <AvatarGroup
    role="group"
    aria-label="Reviewers: Aminah, Lim, Rajesh and 2 more"
  >
    <Avatar>
      <AvatarImage src={photo} alt="" />
      <AvatarFallback>AY</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>LW</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>RK</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback className="bg-bg-washed text-txt-black-700">
        +2
      </AvatarFallback>
    </Avatar>
  </AvatarGroup>
);
export const Stacked = createRender(Group);

const Dark = () => (
  <div className="dark bg-bg-gray-50 flex flex-col items-start gap-4 p-4">
    <Sizes />
    <Group />
  </div>
);
export const DarkTheme = createRender(Dark, "dark");
