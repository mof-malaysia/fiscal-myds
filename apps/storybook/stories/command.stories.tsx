import React from "react";
import type { Meta } from "@storybook/react-vite";
import { createRender } from "../utils";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@mof-malaysia/ftds-react/command";
import { Button } from "@mof-malaysia/ftds-react/button";
import {
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  SettingIcon,
} from "@mof-malaysia/ftds-react/icon";

/**
 * ### Overview
 * A searchable list of pages and actions (built on `cmdk`). Typing filters, arrow keys
 * move the highlight, Enter runs it. `CommandDialog` shows it in a Dialog; the shortcut
 * that opens it (⌘K / Ctrl K) is up to you, as in the Dialog story below.
 *
 * ### Usage
 * ```tsx
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Search…" />
 *   <CommandList>
 *     <CommandEmpty>No results.</CommandEmpty>
 *     <CommandGroup heading="Pages">
 *       <CommandItem onSelect={…}>Cases</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 * ```
 */
const meta: Meta<typeof Command> = {
  title: "App/Command",
  component: Command,
  parameters: { layout: "centered" },
};

export default meta;

const Items = ({ onSelect }: { onSelect?: () => void }) => (
  <>
    <CommandInput placeholder="Search pages and actions" />
    <CommandList>
      <CommandEmpty>
        Nothing matches. Try a case reference or a page name.
      </CommandEmpty>
      <CommandGroup heading="Pages">
        <CommandItem onSelect={onSelect}>
          <HomeIcon />
          Overview
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <FolderIcon />
          Cases
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <DocumentIcon />
          Reports
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Actions">
        <CommandItem onSelect={onSelect}>
          <PlusIcon />
          New case
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem onSelect={onSelect}>
          <SettingIcon />
          Settings
          <CommandShortcut>⌘,</CommandShortcut>
        </CommandItem>
        <CommandItem disabled>Archive all (no permission)</CommandItem>
      </CommandGroup>
    </CommandList>
  </>
);

/** Inline, on a Well so the Sheet panel reads. */
const Inline = () => (
  <div className="bg-bg-washed rounded-lg p-6">
    <Command label="Search pages and actions" className="w-[28rem]">
      <Items />
    </Command>
  </div>
);
export const Default = createRender(Inline);

/** Press ⌘K (Ctrl K on Windows) or the button. The consumer owns the shortcut. */
const PaletteDialog = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="default-outline"
        size="medium"
        onClick={() => setOpen(true)}
      >
        <SearchIcon aria-hidden className="size-4" />
        Search
        <span className="text-txt-black-700 ml-2 text-sm">⌘K</span>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ label: "Search pages and actions" }}
      >
        <Items onSelect={() => setOpen(false)} />
      </CommandDialog>
    </>
  );
};
export const Dialog = createRender(PaletteDialog);

export const Compact = createRender(() => (
  <div data-density="compact">
    <Inline />
  </div>
));

export const DarkTheme = createRender(
  () => (
    <div className="dark bg-bg-white p-4">
      <Inline />
    </div>
  ),
  "dark",
);
