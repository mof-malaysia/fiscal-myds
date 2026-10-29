import { createRoot } from "react-dom/client";
import { App } from "@modelcontextprotocol/ext-apps/app-with-deps";
import { decodeScreen, THEMES, VIEWPORTS, type Screen } from "../shared/screen";
import type { Problem } from "../shared/check";
import { startStyles } from "./styles";
import { Preview, type PreviewState, type Host } from "./preview";

/**
 * The preview page. The same file runs in two places:
 *
 * - inside Claude or ChatGPT, as the MCP App for render_screen: the host
 *   sends the tool's input and result;
 * - at /s#<screen>, the share link: the screen is in the fragment.
 */

const meta = (name: string) => {
  const value = document.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  )?.content;
  return value && !value.startsWith("__") ? value : undefined;
};

const origin = meta("ftds-origin");
const version = meta("ftds-version") ?? "main";
const inHost = window.parent !== window;

let state: PreviewState = {
  mode: inHost ? "host" : "share",
  version,
  problems: [],
  waiting: inHost,
  displayMode: "inline",
  displayModes: [],
};
const listeners = new Set<() => void>();
const store = {
  get: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
function update(patch: Partial<PreviewState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

/** A screen from render_screen's arguments, before the server has checked it. */
function screenFromArguments(
  args: Record<string, unknown> = {},
): Screen | undefined {
  if (typeof args.code !== "string") return undefined;
  return {
    v: version,
    title: typeof args.title === "string" ? args.title : "Untitled screen",
    code: args.code,
    theme: THEMES.includes(args.theme as never)
      ? (args.theme as Screen["theme"])
      : "light",
    viewport: VIEWPORTS.includes(args.viewport as never)
      ? (args.viewport as Screen["viewport"])
      : "desktop",
  };
}

async function connectHost(): Promise<Host> {
  const app = new App(
    { name: "FTDS preview", version },
    {},
    { autoResize: true },
  );

  app.addEventListener("toolinput", ({ arguments: args }) => {
    const screen = screenFromArguments(args);
    if (screen)
      update({ screen, problems: [], shareUrl: undefined, waiting: true });
  });
  app.addEventListener("toolresult", (result) => {
    const content = (result.structuredContent ?? {}) as {
      screen?: Screen;
      problems?: Problem[];
      shareUrl?: string;
    };
    update({
      screen: content.screen ?? state.screen,
      problems: content.problems ?? [],
      shareUrl: content.shareUrl,
      waiting: false,
    });
  });
  app.addEventListener("hostcontextchanged", (context) => {
    if (context.displayMode) update({ displayMode: context.displayMode });
    if (context.availableDisplayModes)
      update({ displayModes: context.availableDisplayModes });
  });

  await app.connect();
  const context = app.getHostContext();
  update({
    displayMode: context?.displayMode ?? "inline",
    displayModes: context?.availableDisplayModes ?? [],
  });

  return {
    openLink: (url) => app.openLink({ url }).then(() => undefined),
    setDisplayMode: (mode) =>
      app.requestDisplayMode({ mode }).then(() => undefined),
    reportError: (message) =>
      app
        .updateModelContext({
          content: [
            {
              type: "text",
              text: `The last screen rendered with a runtime error in the preview: ${message}. Fix it with render_screen.`,
            },
          ],
        })
        .then(() => undefined),
  };
}

function readFragment() {
  const screen = decodeScreen(location.hash);
  update({
    screen,
    shareUrl: screen ? location.href : undefined,
    waiting: false,
  });
  if (screen) document.title = `${screen.title} · FTDS`;
}

async function main() {
  await startStyles(origin);
  let host: Host | undefined;
  if (inHost) {
    host = await connectHost();
  } else {
    readFragment();
    window.addEventListener("hashchange", readFragment);
  }
  createRoot(document.getElementById("root")!).render(
    <Preview store={store} host={host} />,
  );
}

main();
