import {
  Component,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { ArrowOutgoingIcon } from "@/components/ui/icons/arrow-outgoing";
import { CheckIcon } from "@/components/ui/icons/check";
import { DesktopIcon } from "@/components/ui/icons/desktop";
import { ExpandIcon } from "@/components/ui/icons/expand";
import { LinkIcon } from "@/components/ui/icons/link";
import { MobileIcon } from "@/components/ui/icons/mobile";
import { MoonIcon } from "@/components/ui/icons/moon";
import { SunIcon } from "@/components/ui/icons/sun";
import { TabletIcon } from "@/components/ui/icons/tablet";
import { WarningIcon } from "@/components/ui/icons/warning";
import type { Problem } from "../shared/check";
import {
  VIEWPORT_WIDTH,
  type Screen,
  type Theme,
  type Viewport,
} from "../shared/screen";
import {
  emulateFrameWidth,
  followMovedPortals,
  runScreen,
  setFrameWidth,
} from "./runtime";
import { FRAME_CONTAINER } from "./styles";

type DisplayMode = "inline" | "fullscreen" | "pip";

export interface PreviewState {
  /** FTDS release this page renders with. */
  version: string;
  screen?: Screen;
  shareUrl?: string;
  problems: Problem[];
  /** The host has sent the screen but not render_screen's result yet. */
  waiting: boolean;
  displayMode: DisplayMode;
  displayModes: DisplayMode[];
}

/** What the page can ask of a chat host. */
export interface Host {
  openLink(url: string): Promise<void>;
  setDisplayMode(mode: DisplayMode): Promise<void>;
  reportError(message: string): Promise<void>;
}

interface Store {
  get(): PreviewState;
  subscribe(listener: () => void): () => void;
}

/** Inline in a chat the page has a fixed height, so the host can size it. */
const INLINE_HEIGHT = 720;

emulateFrameWidth();
followMovedPortals();

/** `host` is set inside a chat, and absent on a share link. */
export function Preview({ store, host }: { store: Store; host?: Host }) {
  const state = useSyncExternalStore(store.subscribe, store.get);
  const { screen } = state;
  const [theme, setTheme] = useState<Theme>(screen?.theme ?? "light");
  const [viewport, setViewport] = useState<Viewport>(
    screen?.viewport ?? "desktop",
  );
  const [showWarnings, setShowWarnings] = useState(false);

  // A new screen brings its own theme and width, from its first render
  const [shown, setShown] = useState(screen);
  if (screen !== shown) {
    setShown(screen);
    if (screen) {
      setTheme(screen.theme);
      setViewport(screen.viewport);
    }
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const reportError = useCallback(
    (message: string) => {
      host?.reportError(message);
    },
    [host],
  );

  const inline = host && state.displayMode !== "fullscreen";
  const errors = state.problems.filter((p) => p.severity === "error");
  const warnings = state.problems.filter((p) => p.severity === "warning");

  return (
    <div
      className="bg-bg-gray-50 text-txt-black-900 flex flex-col overflow-hidden"
      style={{ height: inline ? INLINE_HEIGHT : "100dvh" }}
    >
      <Toolbar
        state={state}
        host={host}
        theme={theme}
        viewport={viewport}
        warnings={warnings.length}
        showWarnings={showWarnings}
        onTheme={setTheme}
        onViewport={setViewport}
        onShowWarnings={setShowWarnings}
      />
      {!host &&
        screen &&
        screen.v !== state.version &&
        screen.v !== "unknown" && (
          <Notice>
            Made with FTDS {screen.v}; shown with {state.version}. Components
            may look slightly different.
          </Notice>
        )}
      {showWarnings && warnings.length > 0 && <Warnings warnings={warnings} />}
      {!screen ? (
        <Empty>
          {host
            ? "Waiting for the screen…"
            : "This link doesn't contain a screen. Ask whoever sent it for a new one."}
        </Empty>
      ) : errors.length ? (
        <Errors messages={errors.map(problemText)} />
      ) : (
        <Stage
          code={screen.code}
          viewport={viewport}
          theme={theme}
          onError={reportError}
        />
      )}
    </div>
  );
}

const WIDTHS: [Viewport, string, ComponentType<{ className?: string }>][] = [
  ["mobile", "Mobile width", MobileIcon],
  ["tablet", "Tablet width", TabletIcon],
  ["desktop", "Desktop width", DesktopIcon],
];

/**
 * One row of icon buttons at compact density, so the screen keeps the space.
 * Labels live in tooltips (`title`) and aria-labels; a native tooltip, since
 * portalled ones would be moved into the screen's frame.
 */
function Toolbar({
  state,
  host,
  theme,
  viewport,
  warnings,
  showWarnings,
  onTheme,
  onViewport,
  onShowWarnings,
}: {
  state: PreviewState;
  host?: Host;
  theme: Theme;
  viewport: Viewport;
  warnings: number;
  showWarnings: boolean;
  onTheme(theme: Theme): void;
  onViewport(viewport: Viewport): void;
  onShowWarnings(show: boolean): void;
}) {
  const [copied, setCopied] = useState<string>();
  const url = state.shareUrl;
  const fullscreen = state.displayMode === "fullscreen";
  const canFullscreen = state.displayModes.includes("fullscreen");
  const dark = theme === "dark";

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("Link copied");
    } catch {
      // Hosts may not allow clipboard access from the preview
      if (host) {
        await host.openLink(url);
        setCopied("Opened in your browser");
      } else {
        window.prompt("Copy this link", url);
      }
    }
    setTimeout(() => setCopied(undefined), 2500);
  };

  return (
    <header
      data-density="compact"
      className="border-otl-gray-200 bg-bg-white flex h-11 shrink-0 items-center gap-1 border-b px-2"
    >
      <p
        className="mr-auto min-w-0 truncate px-1 text-sm font-medium"
        title={`${state.screen?.title ?? "FTDS screen"} · FTDS ${state.version}`}
      >
        {state.screen?.title ?? "FTDS screen"}
        {state.waiting && (
          <span className="text-txt-black-500 font-normal"> · Checking…</span>
        )}
      </p>

      {warnings > 0 && (
        <Button
          size="small"
          variant="default-ghost"
          aria-expanded={showWarnings}
          title="Design-rule warnings the assistant can fix"
          onClick={() => onShowWarnings(!showWarnings)}
          className="text-txt-warning"
        >
          <ButtonIcon>
            <WarningIcon />
          </ButtonIcon>
          {warnings}
        </Button>
      )}

      <IconButton
        label={dark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={() => onTheme(dark ? "light" : "dark")}
      >
        {dark ? <MoonIcon /> : <SunIcon />}
      </IconButton>

      <ToggleGroup
        aria-label="Width"
        value={[viewport]}
        onValueChange={(value) => {
          // Pressing the current width again would leave none pressed
          if (value[0]) onViewport(value[0] as Viewport);
        }}
      >
        {WIDTHS.map(([option, label, Icon]) => (
          <Toggle
            key={option}
            value={option}
            iconOnly
            aria-label={label}
            title={label}
          >
            <Icon />
          </Toggle>
        ))}
      </ToggleGroup>

      <IconButton
        label={copied ?? "Copy share link"}
        disabled={!url}
        onClick={copy}
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
      </IconButton>
      {host && url && (
        <IconButton label="Open in browser" onClick={() => host.openLink(url)}>
          <ArrowOutgoingIcon />
        </IconButton>
      )}
      {host && canFullscreen && (
        <IconButton
          label={fullscreen ? "Exit full screen" : "Full screen"}
          pressed={fullscreen}
          onClick={() =>
            host.setDisplayMode(fullscreen ? "inline" : "fullscreen")
          }
        >
          <ExpandIcon />
        </IconButton>
      )}
      <span className="sr-only" aria-live="polite">
        {copied}
      </span>
    </header>
  );
}

function IconButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick(): void;
  children: ReactElement;
}) {
  return (
    <Button
      size="small"
      iconOnly
      variant={pressed ? "default-outline" : "default-ghost"}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <ButtonIcon>{children}</ButtonIcon>
    </Button>
  );
}

/**
 * The screen, at its viewport's width. When that is wider than the space
 * here (desktop in a chat), the frame scales down so the layout stays the
 * desktop one. The frame is the container breakpoints respond to, and its
 * transform makes it the box `position: fixed` elements (dialogs, sheets,
 * sticky headers) stay inside.
 */
const Stage = memo(function Stage({
  code,
  viewport,
  theme,
  onError,
}: {
  code: string;
  viewport: Viewport;
  theme: Theme;
  onError(message: string): void;
}) {
  const area = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>();

  useLayoutEffect(() => {
    const element = area.current!;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry!.contentRect.width,
        height: entry!.contentRect.height,
      }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Dialogs, menus and toasts portal to <body>. Move them into the frame, so
  // they open inside the screen, scaled with it and at its breakpoints.
  const measured = size !== undefined;
  useEffect(() => {
    const adopt = (node: Node) => {
      if (node instanceof HTMLElement && node.id !== "root" && frame.current) {
        frame.current.append(node);
      }
    };
    document.body.childNodes.forEach(adopt);
    const observer = new MutationObserver((records) =>
      records.forEach((record) => record.addedNodes.forEach(adopt)),
    );
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [measured]);

  const target = VIEWPORT_WIDTH[viewport];

  // Run again for a new width too, so JS media queries see it
  const rendered = useMemo((): { Screen?: ComponentType; error?: string } => {
    setFrameWidth(target);
    try {
      return { Screen: runScreen(code) };
    } catch (error) {
      return { error: (error as Error).message };
    }
  }, [code, target]);

  useEffect(() => {
    if (rendered.error) onError(rendered.error);
  }, [rendered.error, onError]);

  // Resizes only restyle the frame; the screen itself doesn't re-render
  const content = useMemo(
    () => (
      <ScreenBoundary
        key={`${code}\u0000${target}\u0000${theme}`}
        onError={onError}
      >
        {rendered.Screen && <rendered.Screen />}
      </ScreenBoundary>
    ),
    [rendered, code, target, theme, onError],
  );

  const scale = size ? Math.min(1, size.width / target) : 1;
  const left = size ? Math.max(0, (size.width - target * scale) / 2) : 0;

  return (
    <div
      ref={area}
      className="bg-bg-washed relative flex flex-1 flex-col overflow-hidden"
    >
      {rendered.error ? (
        <Errors messages={[rendered.error]} />
      ) : (
        size && (
          <div
            ref={frame}
            className="bg-bg-gray-50 text-txt-black-900 absolute top-0 overflow-hidden"
            style={{
              left,
              width: target,
              height: size.height / scale,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              containerType: "inline-size",
              containerName: FRAME_CONTAINER,
            }}
          >
            {/* Scrolls inside the frame, so portalled layers stay put while it scrolls */}
            <div className="h-full overflow-auto">{content}</div>
          </div>
        )
      )}
    </div>
  );
});

class ScreenBoundary extends Component<
  { children: ReactNode; onError(message: string): void },
  { error?: Error }
> {
  state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message);
  }

  render() {
    if (this.state.error) {
      return <Errors messages={[this.state.error.message]} />;
    }
    return this.props.children;
  }
}

function Errors({ messages }: { messages: string[] }) {
  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="bg-bg-danger-50 text-txt-danger mx-auto max-w-2xl rounded-lg p-4">
        <p className="font-semibold">This screen can't be shown yet</p>
        <p className="text-txt-black-700 mt-1 text-sm">
          The assistant has been told what to fix. Errors:
        </p>
        <ProblemList items={messages} className="mt-2 space-y-1 text-sm" />
      </div>
    </div>
  );
}

function Warnings({ warnings }: { warnings: Problem[] }) {
  return (
    <ProblemList
      items={warnings.map(problemText)}
      className="border-otl-gray-200 bg-bg-warning-50 text-txt-warning max-h-32 shrink-0 space-y-0.5 overflow-auto border-b py-1.5 pr-3 text-xs"
    />
  );
}

const problemText = (p: Problem) =>
  `${p.line ? `Line ${p.line}: ` : ""}${p.message}`;

function ProblemList({
  items,
  className,
}: {
  items: string[];
  className: string;
}) {
  return (
    <ul className={`list-disc pl-5 ${className}`}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="border-otl-gray-200 bg-bg-primary-50 text-txt-primary shrink-0 truncate border-b px-3 py-1 text-xs">
      {children}
    </p>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="text-txt-black-500 flex flex-1 items-center justify-center p-6 text-center text-sm">
      {children}
    </div>
  );
}
