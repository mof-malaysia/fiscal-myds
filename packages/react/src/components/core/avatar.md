---
title: Avatar
description: A person's photo in a circle, falling back to their initials while the image loads or if it fails. AvatarGroup overlaps several, such as a case's officers.
category: Data display
---

## When to use

- Use `Avatar` to help people recognise a person: the signed-in user in a menu, the officer assigned to a case, the author of a note.
- Use `AvatarGroup` to show several people in little space, such as everyone working on an application.
- Don't use an avatar for an agency or service; use its logo or an icon.

## Usage

Put an `AvatarImage` and an `AvatarFallback` inside. The fallback shows until the image has loaded, and stays if it fails or there is no image:

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AssignedOfficer({ photo }: { photo?: string }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={photo} alt="" />
        <AvatarFallback delay={300}>AY</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-content text-txt-black-900 font-medium">
          Aminah binti Yusof
        </span>
        <span className="text-content text-txt-black-700">
          Assessment officer, LHDN Kuala Lumpur
        </span>
      </div>
    </div>
  );
}
```

A group sets one size for all its avatars and gives each a ring in the surface colour, so they stay distinct where they overlap:

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

const team = [
  { name: "Aminah binti Yusof", initials: "AY", photo: "/officers/aminah.jpg" },
  { name: "Rajesh a/l Kumar", initials: "RK", photo: "/officers/rajesh.jpg" },
  { name: "Tan Mei Ling", initials: "TM", photo: "/officers/meiling.jpg" },
];

export function CaseTeam() {
  return (
    <div className="bg-bg-white p-surface rounded-lg">
      <AvatarGroup size="small" ringClassName="ring-bg-white">
        {team.map((person) => (
          <Avatar key={person.name}>
            <AvatarImage src={person.photo} alt={person.name} />
            <AvatarFallback aria-label={person.name}>
              {person.initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}
```

## Notes

- Give the image `alt` text with the person's name, or, when the name is written next to the avatar, `alt=""` so it isn't read twice.
- The fallback is one or two letters (they are uppercased for you) or an icon. Use `delay` (in milliseconds) to avoid a flash of initials on fast connections.
- `size` is `small` (28px), `medium` (40px, default) or `large` (56px). On `AvatarGroup`, `size` applies to every avatar that doesn't set its own.
- The group's ring defaults to the page colour (Paper). On a white surface such as a `Card`, pass `ringClassName="ring-bg-white"`.
- Initials sit on the Blue Wash. Don't recolour avatars to tell people apart; write their names.
