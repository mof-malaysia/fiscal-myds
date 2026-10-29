"use client";

import { isEditable } from "@/lib/ftds/utils";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Kbd,
  eventStep,
  isModifierOnly,
  parseCombo,
  type ComboStep,
  type KeyLike,
} from "@/components/ui/kbd";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

/**
 * The keyboard layer of an officer tool: one window listener that turns
 * keystrokes into actions, a ⌘K command palette and a `?` cheat sheet.
 *
 * - **Commands** (`useCommands`) are named actions. The palette lists them and,
 *   when they have a `combo`, they are bound as shortcuts and listed in the cheat
 *   sheet. A screen's commands exist exactly while it is mounted.
 * - **Shortcuts** (`useShortcut`) are bindings that aren't palette commands,
 *   such as `j`/`k` in a list.
 * - **Scopes** (`useShortcutScope`) make a binding live only while a screen or
 *   panel is mounted; the most recently pushed scope wins a conflict.
 * - **Sequences** like `g i` wait up to `sequenceTimeout` for the next key.
 * - Shortcuts stand down while the user types in a field, inside a dialog, a
 *   menu or a listbox, and when Enter/Space would press a focused control,
 *   unless a binding opts in with `allowInInput` (⌘K does).
 *
 * Combos use the `Kbd` syntax: `mod+k`, `g i`, `?`, `shift+enter`.
 * `DeskShell` mounts a provider for you; nested providers defer to the outer one.
 *
 * @example
 * <ShortcutProvider>
 *   <App />
 * </ShortcutProvider>
 *
 * function CasesPage() {
 *   useCommands([
 *     { id: "cases.new", title: "New case", group: "Cases", combo: "c", run: openNewCase },
 *   ]);
 *   …
 * }
 */

const GLOBAL_SCOPE = "global";

interface ShortcutOptions {
  /** Only live while this scope is active (see `useShortcutScope`). Global by default. */
  scope?: string;
  /** Fire while focus is in a text field, dialog, menu or listbox. */
  allowInInput?: boolean;
  /** Checked on each keypress; returning false lets the key through. */
  when?: () => boolean;
  /** Leave the browser's default action alone. */
  allowDefault?: boolean;
}

interface ShortcutBinding extends ShortcutOptions {
  combo: string;
  run: (event: KeyLike) => void;
}

interface RegistryEntry {
  binding: ShortcutBinding;
  steps: ComboStep[];
  order: number;
}

const isWanted = ({ binding }: RegistryEntry) => binding.when?.() ?? true;

const sameSteps = (a: ComboStep[], b: ComboStep[]) =>
  a.length === b.length && a.every((step, i) => step === b[i]);

/** Whether `typed` is a strict prefix of `steps`. */
const isPrefix = (typed: ComboStep[], steps: ComboStep[]) =>
  typed.length < steps.length && typed.every((step, i) => step === steps[i]);

/**
 * Where keystrokes become actions. Framework-free: the provider feeds it window
 * keydown events. A binding fires as soon as its whole sequence matches, so don't
 * register a combo that is a prefix of another ("g" and "g i").
 */
class ShortcutRegistry {
  private entries = new Set<RegistryEntry>();
  private scopes: string[] = [];
  private buffer: ComboStep[] = [];
  private lastAt = 0;
  private order = 0;

  constructor(private readonly options: { timeoutMs?: number } = {}) {}

  /** Registers a binding; returns its remover. */
  add(binding: ShortcutBinding): () => void {
    const entry: RegistryEntry = {
      binding,
      steps: parseCombo(binding.combo),
      order: this.order++,
    };
    this.entries.add(entry);
    return () => {
      this.entries.delete(entry);
    };
  }

  /** Activates a scope; returns the function that deactivates it. */
  pushScope(scope: string): () => void {
    this.scopes.push(scope);
    return () => {
      const at = this.scopes.lastIndexOf(scope);
      if (at !== -1) this.scopes.splice(at, 1);
    };
  }

  /**
   * Offers a keydown: "ran" (a binding fired) and "pending" (the key continues a
   * sequence) mean it was consumed; "ignored" means let it through.
   */
  handle(
    event: KeyLike,
    context: { editable: boolean },
  ): "ran" | "pending" | "ignored" {
    if (isModifierOnly(event)) return "ignored";
    const now = Date.now();
    if (now - this.lastAt > (this.options.timeoutMs ?? 1000)) this.buffer = [];
    this.lastAt = now;

    const step = eventStep(event);
    const live = this.liveEntries(context.editable);

    // Continue a pending sequence; if it can't continue, start over with this
    // key alone (so "g x" followed by "j" still lets "j" work)
    for (const buffer of this.buffer.length ? [this.buffer, []] : [[]]) {
      const typed = [...buffer, step];
      // `when` runs only for entries the keys actually reach
      const match = live.find(
        (entry) => sameSteps(entry.steps, typed) && isWanted(entry),
      );
      if (match) {
        this.buffer = [];
        match.binding.run(event);
        return match.binding.allowDefault ? "ignored" : "ran";
      }
      if (
        live.some((entry) => isPrefix(typed, entry.steps) && isWanted(entry))
      ) {
        this.buffer = typed;
        return "pending";
      }
    }
    this.buffer = [];
    return "ignored";
  }

  /** Eligible entries, highest precedence first. */
  private liveEntries(editable: boolean): RegistryEntry[] {
    const rank = (scope: string) =>
      scope === GLOBAL_SCOPE ? -1 : this.scopes.lastIndexOf(scope);
    return Array.from(this.entries)
      .filter(({ binding }) => {
        const scope = binding.scope ?? GLOBAL_SCOPE;
        if (scope !== GLOBAL_SCOPE && rank(scope) === -1) return false;
        return !(editable && !binding.allowInInput);
      })
      .sort((a, b) => {
        const byScope =
          rank(b.binding.scope ?? GLOBAL_SCOPE) -
          rank(a.binding.scope ?? GLOBAL_SCOPE);
        // Later registrations win within a scope
        return byScope || b.order - a.order;
      });
  }
}

/*========================================================================================================================*/

interface ShortcutCommand {
  /** Stable, unique id, e.g. "nav.cases". */
  id: string;
  /** Shown in the palette and the cheat sheet. */
  title: string;
  /** Group heading in the palette and the cheat sheet. */
  group: string;
  /** Shortcut, e.g. `g c` or `mod+s`. */
  combo?: string;
  /** Extra palette search terms. */
  keywords?: string[];
  /** Shortcut scope (global by default). */
  scope?: string;
  /** Let the shortcut fire while typing in a field. */
  allowInInput?: boolean;
  /** Keep out of the palette (still bound and listed in the cheat sheet). */
  hidden?: boolean;
  run: () => void;
}

/** A tiny external store, so React can subscribe without re-registering on render. */
class CommandStore {
  private commands = new Map<string, ShortcutCommand>();
  private snapshot: ShortcutCommand[] = [];
  private listeners = new Set<() => void>();

  /** Adds (or replaces by id); returns the remover. */
  add(command: ShortcutCommand): () => void {
    this.commands.set(command.id, command);
    this.emit();
    return () => {
      if (this.commands.get(command.id) === command) {
        this.commands.delete(command.id);
        this.emit();
      }
    };
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ShortcutCommand[] => this.snapshot;

  private emit() {
    this.snapshot = Array.from(this.commands.values());
    this.listeners.forEach((listener) => listener());
  }
}

/*========================================================================================================================*/

/** An open dialog, menu or listbox owns the keyboard as much as a text field does. */
const KEYBOARD_OWNERS =
  '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]';

function isInKeyboardOwner(target: EventTarget | null): boolean {
  return target instanceof Element && !!target.closest(KEYBOARD_OWNERS);
}

/** Enter/Space on these activate them natively; shortcuts must not steal it. */
const ACTIVATABLE =
  "button, a[href], summary, [role=button], [role=link], [role=menuitem], [role=option], [role=tab]";

function isNativeActivation(event: KeyboardEvent): boolean {
  if (event.key !== "Enter" && event.key !== " ") return false;
  return event.target instanceof Element && !!event.target.closest(ACTIVATABLE);
}

/*========================================================================================================================*/

interface ShortcutLabels {
  /** Palette dialog title (visually hidden). */
  paletteTitle: string;
  palettePlaceholder: string;
  paletteEmpty: string;
  /** Palette footer hints. */
  paletteNavigate: string;
  paletteRun: string;
  paletteDismiss: string;
  cheatSheetTitle: string;
  cheatSheetDescription: string;
  /** Group of the built-in commands. */
  groupGeneral: string;
  openPalette: string;
  showShortcuts: string;
  /** Word between the steps of a sequence ("G then I"). */
  sequenceThen: string;
}

const DEFAULT_LABELS: ShortcutLabels = {
  paletteTitle: "Command palette",
  palettePlaceholder: "Type a command or search…",
  paletteEmpty: "No matching commands. Try a page name or an action.",
  paletteNavigate: "to move",
  paletteRun: "to run",
  paletteDismiss: "to close",
  cheatSheetTitle: "Keyboard shortcuts",
  cheatSheetDescription:
    "Shortcuts work anywhere outside a text field. Press ? to open this list.",
  groupGeneral: "General",
  openPalette: "Open command palette",
  showShortcuts: "Show keyboard shortcuts",
  sequenceThen: "then",
};

/** Keys bound outside the command store (list navigation, editors), documented in the cheat sheet. */
interface ShortcutGroup {
  group: string;
  items: { combo: string; title: string }[];
}

interface ShortcutContextValue {
  registry: ShortcutRegistry;
  commands: CommandStore;
  labels: ShortcutLabels;
  openPalette: () => void;
  openCheatSheet: () => void;
}

const ShortcutContext = createContext<ShortcutContextValue | null>(null);

const MISSING_PROVIDER =
  "Shortcut hooks must be used inside <ShortcutProvider> (or <DeskShell>).";

/** The registry, or null outside a provider when `optional`. */
function useRegistry(optional = false): ShortcutRegistry | null {
  const context = useContext(ShortcutContext);
  if (!context && !optional) throw new Error(MISSING_PROVIDER);
  return context?.registry ?? null;
}

function useShortcutContext(): ShortcutContextValue {
  const context = useContext(ShortcutContext);
  if (!context) throw new Error(MISSING_PROVIDER);
  return context;
}

interface ShortcutProviderProps {
  children?: ReactNode;
  /** How long a sequence (`g i`) waits for its next key, in milliseconds. @default 1000 */
  sequenceTimeout?: number;
  /** Text for the palette, cheat sheet and built-in commands. */
  labels?: Partial<ShortcutLabels>;
  /** Extra groups for the cheat sheet, for keys bound outside `useCommands`. */
  extraShortcuts?: ShortcutGroup[];
  /** Bind ⌘K to the palette. @default true */
  palette?: boolean;
}

/**
 * Mounts the keyboard layer: the window listener, the command store, the ⌘K
 * palette and the `?` cheat sheet. Inside another provider it renders only its
 * children, so the outer one stays in charge.
 */
const ShortcutProvider = (props: ShortcutProviderProps) => {
  const parent = useContext(ShortcutContext);
  if (parent) return <>{props.children}</>;
  return <ShortcutRoot {...props} />;
};
ShortcutProvider.displayName = "ShortcutProvider";

const ShortcutRoot = ({
  children,
  sequenceTimeout = 1000,
  labels: labelsProp,
  extraShortcuts = [],
  palette = true,
}: ShortcutProviderProps) => {
  const [registry] = useState(
    () => new ShortcutRegistry({ timeoutMs: sequenceTimeout }),
  );
  const [commands] = useState(() => new CommandStore());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(labelsProp)],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // A component that handled the key itself (an editor's ⌘S, a menu's arrows) has the last word
      if (event.defaultPrevented || event.isComposing) return;
      if (isNativeActivation(event)) return;
      const result = registry.handle(event, {
        editable: isEditable(event.target) || isInKeyboardOwner(event.target),
      });
      if (result !== "ignored") event.preventDefault();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [registry]);

  const value = useMemo<ShortcutContextValue>(
    () => ({
      registry,
      commands,
      labels,
      openPalette: () => setPaletteOpen(true),
      openCheatSheet: () => setCheatSheetOpen(true),
    }),
    [registry, commands, labels],
  );

  return (
    <ShortcutContext.Provider value={value}>
      <BuiltInCommands
        palette={palette}
        togglePalette={() => setPaletteOpen((open) => !open)}
      />
      {children}
      {palette && (
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      )}
      <ShortcutCheatSheet
        open={cheatSheetOpen}
        onOpenChange={setCheatSheetOpen}
        extraShortcuts={extraShortcuts}
      />
    </ShortcutContext.Provider>
  );
};

const BuiltInCommands = ({
  palette,
  togglePalette,
}: {
  palette: boolean;
  togglePalette: () => void;
}) => {
  const { labels, openCheatSheet } = useShortcutContext();
  useCommands([
    ...(palette
      ? [
          {
            id: "shortcuts.palette",
            title: labels.openPalette,
            group: labels.groupGeneral,
            combo: "mod+k",
            allowInInput: true,
            hidden: true,
            run: togglePalette,
          },
        ]
      : []),
    {
      id: "shortcuts.cheat-sheet",
      title: labels.showShortcuts,
      group: labels.groupGeneral,
      combo: "?",
      run: openCheatSheet,
    },
  ]);
  return null;
};

/*========================================================================================================================*/

/**
 * Registers commands for as long as the calling component is mounted. Their `run`
 * functions may change every render; registration only changes when a command's
 * visible definition does.
 */
function useCommands(list: ShortcutCommand[]): void {
  const { registry, commands } = useShortcutContext();
  const runs = useRef(new Map<string, () => void>());
  runs.current = new Map(list.map((command) => [command.id, command.run]));

  const signature = JSON.stringify(
    list.map(({ run: _run, ...definition }) => definition),
  );

  useEffect(() => {
    const definitions = JSON.parse(signature) as Omit<ShortcutCommand, "run">[];
    const cleanups = definitions.flatMap((definition) => {
      const run = () => runs.current.get(definition.id)?.();
      const removers = [commands.add({ ...definition, run })];
      if (definition.combo) {
        removers.push(
          registry.add({
            combo: definition.combo,
            scope: definition.scope,
            allowInInput: definition.allowInInput,
            run,
          }),
        );
      }
      return removers;
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [signature, registry, commands]);
}

/** Binds a shortcut that isn't a palette command (list navigation, local actions) while mounted. */
function useShortcut(
  combo: string,
  run: () => void,
  options: ShortcutOptions & {
    enabled?: boolean;
    /** Do nothing outside a `ShortcutProvider` instead of throwing (for blocks that work with or without one). */
    optional?: boolean;
  } = {},
): void {
  const registry = useRegistry(options.optional);
  const latest = useRef(run);
  latest.current = run;
  const when = useRef(options.when);
  when.current = options.when;
  const { enabled = true, scope, allowInInput, allowDefault } = options;

  useEffect(() => {
    if (!enabled || !registry) return;
    return registry.add({
      combo,
      scope,
      allowInInput,
      allowDefault,
      when: () => when.current?.() ?? true,
      run: () => latest.current(),
    });
  }, [registry, combo, scope, allowInInput, allowDefault, enabled]);
}

/**
 * Activates a shortcut scope while the component is mounted (and `active`).
 * With `optional`, does nothing outside a `ShortcutProvider` instead of throwing.
 */
function useShortcutScope(
  scope: string,
  {
    active = true,
    optional = false,
  }: { active?: boolean; optional?: boolean } = {},
): void {
  const registry = useRegistry(optional);
  useEffect(() => {
    if (!active || !registry) return;
    return registry.pushScope(scope);
  }, [registry, scope, active]);
}

/** All registered commands; re-renders when the set changes. */
function useCommandList(): ShortcutCommand[] {
  const { commands } = useShortcutContext();
  return useSyncExternalStore(
    commands.subscribe,
    commands.getSnapshot,
    commands.getSnapshot,
  );
}

/** Opens the palette or the cheat sheet from a button. */
function useShortcutActions(): Pick<
  ShortcutContextValue,
  "openPalette" | "openCheatSheet"
> {
  const { openPalette, openCheatSheet } = useShortcutContext();
  return { openPalette, openCheatSheet };
}

/** The provider's labels, for parts that show shortcut text (e.g. `Kbd`'s "then"). */
function useShortcutLabels(): ShortcutLabels {
  return useContext(ShortcutContext)?.labels ?? DEFAULT_LABELS;
}

/*========================================================================================================================*/

function groupBy<T extends { group: string }>(items: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    groups.set(item.group, [...(groups.get(item.group) ?? []), item]);
  }
  return Array.from(groups);
}

interface ShortcutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** ⌘K: every visible command, grouped, searchable. Mounted by `ShortcutProvider`. */
const CommandPalette = ({ open, onOpenChange }: ShortcutDialogProps) => {
  const { labels } = useShortcutContext();
  const commands = useCommandList().filter((command) => !command.hidden);

  const run = (command: ShortcutCommand) => {
    onOpenChange(false);
    // Let the dialog close (and return focus) before the command navigates or opens something else
    requestAnimationFrame(() => command.run());
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title={labels.paletteTitle}
      description={labels.palettePlaceholder}
      commandProps={{ label: labels.paletteTitle }}
    >
      <CommandInput placeholder={labels.palettePlaceholder} />
      <CommandList>
        <CommandEmpty>{labels.paletteEmpty}</CommandEmpty>
        {groupBy(commands).map(([group, items]) => (
          <CommandGroup key={group} heading={group}>
            {items.map((command) => (
              <CommandItem
                key={command.id}
                value={`${command.title} ${command.id}`}
                keywords={command.keywords}
                onSelect={() => run(command)}
              >
                <span className="min-w-0 flex-1 truncate">{command.title}</span>
                {command.combo && (
                  <Kbd combo={command.combo} thenLabel={labels.sequenceThen} />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
      <div className="border-otl-gray-200 text-txt-black-500 text-label-compact flex flex-wrap gap-x-4 gap-y-1 border-t px-4 py-2">
        <span className="inline-flex items-center gap-1">
          <Kbd combo="arrowup" />
          <Kbd combo="arrowdown" /> {labels.paletteNavigate}
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd combo="enter" /> {labels.paletteRun}
        </span>
        <span className="inline-flex items-center gap-1">
          <Kbd combo="escape" /> {labels.paletteDismiss}
        </span>
      </div>
    </CommandDialog>
  );
};
CommandPalette.displayName = "CommandPalette";

/** `?`: every bound shortcut, grouped. Mounted by `ShortcutProvider`. */
const ShortcutCheatSheet = ({
  open,
  onOpenChange,
  extraShortcuts,
}: ShortcutDialogProps & { extraShortcuts: ShortcutGroup[] }) => {
  const { labels } = useShortcutContext();
  const bound = useCommandList().filter((command) => command.combo);
  const groups: ShortcutGroup[] = [
    ...groupBy(bound).map(([group, items]) => ({
      group,
      items: items.map((command) => ({
        combo: command.combo!,
        title: command.title,
      })),
    })),
    ...extraShortcuts,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogBody className="sm:max-w-2xl">
        <DialogHeader border>
          <DialogTitle>{labels.cheatSheetTitle}</DialogTitle>
          <DialogDescription>{labels.cheatSheetDescription}</DialogDescription>
        </DialogHeader>
        <DialogContent className="max-h-[60dvh] overflow-y-auto pb-6">
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {groups.map(({ group, items }) => (
              <section key={group} aria-label={group} className="min-w-0">
                <h3 className="text-txt-black-700 text-label-compact mb-1 font-medium">
                  {group}
                </h3>
                <dl className="m-0">
                  {items.map((item) => (
                    <div
                      key={item.combo + item.title}
                      className="border-otl-gray-200 flex items-center justify-between gap-4 border-b py-1.5 last:border-b-0"
                    >
                      <dt className="text-txt-black-900 text-content min-w-0 truncate">
                        {item.title}
                      </dt>
                      <dd className="m-0">
                        <Kbd
                          combo={item.combo}
                          thenLabel={labels.sequenceThen}
                        />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </DialogContent>
      </DialogBody>
    </Dialog>
  );
};
ShortcutCheatSheet.displayName = "ShortcutCheatSheet";

export {
  ShortcutProvider,
  useCommands,
  useShortcut,
  useShortcutScope,
  useCommandList,
  useShortcutActions,
  useShortcutLabels,
};
export type {
  ShortcutProviderProps,
  ShortcutCommand,
  ShortcutOptions,
  ShortcutGroup,
  ShortcutLabels,
};
