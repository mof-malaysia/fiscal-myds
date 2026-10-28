"use client";

import React, { ComponentProps, ComponentRef, forwardRef } from "react";
import {
  CommandRoot as CommandPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandList as CommandListPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandLoading as CommandLoadingPrimitive,
  useCommandState,
} from "cmdk";
import { SearchIcon } from "../../icons/search";
import {
  Dialog,
  DialogBody,
  DialogDescription,
  DialogTitle,
  type DialogProps,
} from "../core/dialog";
import {
  menu_group_label_class,
  menu_item_layout_class,
  menu_separator_class,
  MenuShortcut,
} from "../core/menu";
import { clx } from "../../utils";

/**
 * Command is a searchable list of actions and destinations: the officer's
 * "jump to anything" palette. Typing filters the list; arrow keys move the
 * highlight and Enter runs it (built on `cmdk`).
 *
 * `CommandDialog` opens it in a Dialog. The keyboard shortcut that opens it
 * (usually ⌘K / Ctrl K) is the consumer's: listen for it and set `open`.
 *
 * @example
 * <CommandDialog open={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Search cases, people, pages…" />
 *   <CommandList>
 *     <CommandEmpty>No results.</CommandEmpty>
 *     <CommandGroup heading="Pages">
 *       <CommandItem onSelect={() => go("/cases")}>Cases</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 * </CommandDialog>
 */

type CommandProps = ComponentProps<typeof CommandPrimitive>;

const Command = forwardRef<ComponentRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={clx(
        "bg-bg-white text-txt-black-900 font-body flex h-full w-full flex-col overflow-hidden rounded-lg",
        className,
      )}
      {...props}
    />
  ),
);
Command.displayName = "Command";

/*========================================================================================================================*/

type CommandInputProps = ComponentProps<typeof CommandInputPrimitive>;

/** The search field. No stroke inside the palette: the palette is the field. */
const CommandInput = forwardRef<
  ComponentRef<typeof CommandInputPrimitive>,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <div className="flex items-center gap-2 px-4 in-data-[density=compact]:px-3">
    <SearchIcon
      aria-hidden
      className="text-txt-black-700 size-5 shrink-0 in-data-[density=compact]:size-4"
    />
    <CommandInputPrimitive
      ref={ref}
      className={clx(
        "text-txt-black-900 placeholder:text-txt-black-500 h-[var(--ctl-h-md)] w-full min-w-0 bg-transparent text-field-md outline-none",
        "disabled:cursor-not-allowed disabled:text-txt-black-disabled",
        className,
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

/*========================================================================================================================*/

const CommandList = forwardRef<
  ComponentRef<typeof CommandListPrimitive>,
  ComponentProps<typeof CommandListPrimitive>
>(({ className, ...props }, ref) => (
  <CommandListPrimitive
    ref={ref}
    className={clx(
      "max-h-[min(24rem,60dvh)] scroll-py-2 overflow-y-auto overscroll-contain px-2 pb-2",
      className,
    )}
    {...props}
  />
));
CommandList.displayName = "CommandList";

/** Shown when nothing matches. Say what to try next, not just "No results". */
const CommandEmpty = forwardRef<
  ComponentRef<typeof CommandEmptyPrimitive>,
  ComponentProps<typeof CommandEmptyPrimitive>
>(({ className, ...props }, ref) => (
  <CommandEmptyPrimitive
    ref={ref}
    className={clx(
      "text-txt-black-700 text-content px-4 py-6 text-center",
      className,
    )}
    {...props}
  />
));
CommandEmpty.displayName = "CommandEmpty";

const CommandLoading = forwardRef<
  ComponentRef<typeof CommandLoadingPrimitive>,
  ComponentProps<typeof CommandLoadingPrimitive>
>(({ className, ...props }, ref) => (
  <CommandLoadingPrimitive
    ref={ref}
    className={clx("text-txt-black-700 text-content px-4 py-6 text-center", className)}
    {...props}
  />
));
CommandLoading.displayName = "CommandLoading";

/** A titled group. The `heading` is set in Label Compact, Ink Secondary. */
const CommandGroup = forwardRef<
  ComponentRef<typeof CommandGroupPrimitive>,
  ComponentProps<typeof CommandGroupPrimitive>
>(({ className, heading, ...props }, ref) => (
  <CommandGroupPrimitive
    ref={ref}
    className={clx("py-1", className)}
    // Menu's group label (Label Compact, Ink Secondary)
    heading={
      heading ? (
        <span className={clx("block", menu_group_label_class)}>{heading}</span>
      ) : undefined
    }
    {...props}
  />
));
CommandGroup.displayName = "CommandGroup";

/**
 * Hairline between groups, hidden while searching (like cmdk's own separator).
 * Not cmdk's Separator: it forces role="separator", which a listbox may not contain.
 */
const CommandSeparator = forwardRef<
  HTMLDivElement,
  ComponentProps<"div"> & { alwaysRender?: boolean }
>(({ className, alwaysRender = false, ...props }, ref) => {
  const searching = useCommandState((state) => state.search !== "");
  if (searching && !alwaysRender) return null;

  return (
    <div
      ref={ref}
      role="none"
      aria-hidden
      className={clx(menu_separator_class, "-mx-2", className)}
      {...props}
    />
  );
});
CommandSeparator.displayName = "CommandSeparator";

/*========================================================================================================================*/

/** One result. The highlighted item (`data-selected`) takes the Well fill. */
const CommandItem = forwardRef<
  ComponentRef<typeof CommandItemPrimitive>,
  ComponentProps<typeof CommandItemPrimitive>
>(({ className, ...props }, ref) => (
  <CommandItemPrimitive
    ref={ref}
    className={clx(
      menu_item_layout_class,
      "text-txt-black-700 motion-reduce:transition-none",
      // cmdk sets data-selected/data-disabled to "true" or "false", so match the value
      "data-[selected=true]:bg-bg-washed data-[selected=true]:text-txt-black-900",
      "data-[disabled=true]:text-txt-black-disabled data-[disabled=true]:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";


/*========================================================================================================================*/

interface CommandDialogProps extends DialogProps {
  /** Accessible title of the dialog (visually hidden). */
  title?: string;
  /** Accessible description of the dialog (visually hidden). */
  description?: string;
  /** Class name for the dialog panel. */
  className?: string;
  /** Props for the inner `Command`, such as `filter`, `shouldFilter`, `loop` or `label`. */
  commandProps?: Omit<CommandProps, "children">;
}

/** Command inside a core Dialog, near the top of the screen. Esc and the scrim close it. */
const CommandDialog = ({
  title = "Command palette",
  description = "Search for a page or an action",
  className,
  commandProps,
  children,
  ...props
}: CommandDialogProps) => (
  <Dialog {...props}>
    <DialogBody
      hideClose
      className={clx(
        "top-[12dvh] translate-y-0 overflow-hidden p-0 sm:max-w-xl",
        className,
      )}
    >
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogDescription className="sr-only">{description}</DialogDescription>
      <Command loop {...commandProps}>
        {children as React.ReactNode}
      </Command>
    </DialogBody>
  </Dialog>
);
CommandDialog.displayName = "CommandDialog";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandLoading,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  MenuShortcut as CommandShortcut,
  CommandDialog,
};
export type { CommandProps, CommandInputProps, CommandDialogProps };
