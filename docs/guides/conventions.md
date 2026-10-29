---
title: Conventions for writing FTDS code
description: How FTDS components are built and composed: Base UI parts, the render prop, controlled state, clx, labels for translation, and what to avoid.
order: 2
---

Read this before writing UI with FTDS. It applies to every component page.

## Components are compound parts

Most components are a set of parts that you nest, all exported from the same file. The root holds state; the parts render pieces of it.

```tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

export function WithdrawApplication() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="danger-outline" />}>
        Withdraw application
      </DialogTrigger>
      <DialogBody>
        <DialogHeader>
          <DialogTitle>Withdraw this application?</DialogTitle>
          <DialogDescription>
            You will need to start a new application to apply again.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>Your saved answers will be deleted.</DialogContent>
        <DialogFooter>
          <DialogClose render={<Button variant="default-outline" />}>
            Keep application
          </DialogClose>
          <Button variant="danger-fill">Withdraw application</Button>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
}
```

Each component page lists every part and the props it declares, with exact types and allowed values. Use only those parts and props; don't guess names from other libraries.

## Compose with `render`, never `asChild`

FTDS is built on [Base UI](https://base-ui.com). To render a part as another element or component, pass it to `render`. The part's behaviour and styles are merged onto that element.

```tsx
import { Button } from "@/components/ui/button";

export function StartLink() {
  return <Button render={<a href="/apply/start" />}>Start now</Button>;
}
```

This is how you make a link look like a button, use a router's `Link`, or make a `DialogTrigger` a `Button`. `asChild` does not exist in FTDS.

## Controlled and uncontrolled state

Stateful components work both ways, with Base UI's names:

- Uncontrolled: `defaultValue`, `defaultOpen`, `defaultChecked`.
- Controlled: `value` with `onValueChange`, `open` with `onOpenChange`, `checked` with `onCheckedChange`.

```tsx
import { useState } from "react";
import { Select } from "@/components/ui/select";

export function StateSelect() {
  const [state, setState] = useState("");
  return (
    <Select
      value={state}
      onValueChange={setState}
      placeholder="Select a state"
      items={[
        { label: "Johor", value: "johor" },
        { label: "Kedah", value: "kedah" },
        { label: "Selangor", value: "selangor" },
      ]}
    />
  );
}
```

## Classes: `clx` and `className`

Use `clx` from `@/lib/ftds/utils` to join and merge Tailwind classes (it resolves conflicts, so a later `p-4` beats an earlier `p-2`). Every component takes `className`; use it for layout (margins, width, grid placement), not to recolour or reshape a component. If a component needs a different look, check its `variant` and `size` props first.

```tsx
import { clx } from "@/lib/ftds/utils";
import { Button } from "@/components/ui/button";

export function FullWidthOnMobile({ wide }: { wide: boolean }) {
  return (
    <Button className={clx("w-full sm:w-fit", wide && "sm:min-w-48")}>
      Continue
    </Button>
  );
}
```

## Built-in text and translation

Components write their built-in text (close buttons, "There is a problem", pagination, table controls) in English. To replace it, for example in Bahasa Melayu, larger components take a `labels` object (pass only the labels you change) and smaller ones take individual props such as `showLabel` and `hideLabel`. Each component page lists them.

```tsx
import { PasswordInput } from "@/components/ui/password-input";
import { Field, FieldLabel } from "@/components/ui/field";

export function KataLaluan() {
  return (
    <Field name="password">
      <FieldLabel>Kata laluan</FieldLabel>
      <PasswordInput
        showLabel="Tunjuk kata laluan"
        hideLabel="Sembunyi kata laluan"
      />
    </Field>
  );
}
```

All other text (titles, descriptions, button labels, messages) is yours to pass in, in the service's language.

## Icons

Icons are separate items (`@ftds/icon-<name>`, see the icon catalogue) imported from `@/components/ui/icons/<name>`. Components that use icons install them automatically. Inside a `Button`, wrap an icon in `ButtonIcon`; an icon-only button needs `iconOnly` and an `aria-label`.

## Blocks are starting points

Blocks (`@/components/blocks/...`) are whole screens and page sections built from components: sign-in, check your answers, confirmation, hero, FAQ. Install one when it matches the screen you are building, then pass your content and handlers through its props. Because the code is yours, you can also edit the installed file when the screen needs something the props don't cover.

## Don'ts

- Don't import from `@mof-malaysia/ftds-react` or `@base-ui/react` directly in app code when an FTDS component exists.
- Don't use `asChild`, `cn` or Radix-style prop names (`onSelect` for menus is fine where documented; check the page).
- Don't add borders, shadows or ring outlines to FTDS components, and don't wrap content in bordered boxes: use spacing and the `bg-bg-washed` tone.
- Don't use raw Tailwind palette colours (`bg-blue-600`, `text-gray-500`); use tokens (see the styling guide).
- Don't fill more than one action per screen in blue.
- Don't hide labels, remove focus rings or put meaning in colour alone.
