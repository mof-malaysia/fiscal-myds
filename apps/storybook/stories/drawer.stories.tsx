import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerSide,
} from "@mof-malaysia/myds-react/drawer";
import { Button } from "@mof-malaysia/myds-react/button";
import { Checkbox } from "@mof-malaysia/myds-react/checkbox";

/**
 * ### Overview
 * A panel that slides in from an edge and can be swiped away (Base UI Drawer).
 * Bottom by default, with a grab handle; `side` also accepts `left`, `right` and `top`.
 * Focus is trapped; Esc, the close button, the scrim and a swipe all dismiss it.
 *
 * ### Usage
 * ```tsx
 * <Drawer side="right">
 *   <DrawerTrigger render={<Button variant="default-outline" />}>Filters</DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader><DrawerTitle>Filters</DrawerTitle></DrawerHeader>
 *     <DrawerBody>…</DrawerBody>
 *     <DrawerFooter>…</DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
const meta: Meta<typeof Drawer> = {
  title: "App/Drawer",
  component: Drawer,
  parameters: { layout: "centered" },
};

export default meta;

const statuses = ["Pending review", "Approved", "Returned", "Overdue"];

const Filters = ({ side, label }: { side?: DrawerSide; label: string }) => {
  const id = React.useId();
  return (
    <Drawer side={side}>
      <DrawerTrigger
        render={<Button variant="default-outline" size="medium" />}
      >
        {label}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter applications</DrawerTitle>
          <DrawerDescription>
            Show only the applications you need to act on.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-txt-black-900 mb-2 font-medium">
              Status
            </legend>
            {statuses.map((status, i) => (
              <label
                key={status}
                htmlFor={`${id}-${i}`}
                className="flex items-center gap-3"
              >
                <Checkbox id={`${id}-${i}`} defaultChecked={i === 0} />
                {status}
              </label>
            ))}
          </fieldset>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose
            render={<Button variant="default-outline" size="medium" />}
          >
            Cancel
          </DrawerClose>
          <DrawerClose render={<Button variant="primary-fill" size="medium" />}>
            Show results
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const Default = createRender(() => (
  <Filters label="Open bottom drawer" />
));

export const Sides = createRender(() => (
  <div className="flex flex-wrap gap-3">
    <Filters side="left" label="Left" />
    <Filters side="right" label="Right" />
    <Filters side="top" label="Top" />
    <Filters side="bottom" label="Bottom" />
  </div>
));

/** Controlled with `open` / `onOpenChange`. */
const ControlledDrawer = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant="default-outline"
        size="medium"
        onClick={() => setOpen(true)}
      >
        View case details
      </Button>
      <Drawer side="right" open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>LHDN-2024-0192</DrawerTitle>
            <DrawerDescription>
              Refund claim, submitted 3 March 2025.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerBody>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <dt className="text-txt-black-700">Amount</dt>
              <dd className="font-medium tabular-nums">RM 1,240.00</dd>
              <dt className="text-txt-black-700">Officer</dt>
              <dd>Nur Aisyah binti Rahman</dd>
            </dl>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export const Controlled = createRender(ControlledDrawer);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Filters side="right" label="Open compact drawer" />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Filters label="Open drawer" />
    </div>
  ),
  "dark",
);
