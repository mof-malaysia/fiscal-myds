# FTDS Playground: plan

A way for project managers to turn requirements into FTDS screens while they
talk to Claude (or ChatGPT), and share the result as a link.

The PM adds one custom connector URL. Their chat assistant reads the FTDS
catalogue through it, writes a screen, and the screen renders inside the chat
with the real components and styles. Anyone with the share link sees the same
screen in a browser, with no assistant and no account.

We supply no AI and hold no keys: the PM's own Claude or ChatGPT plan does the
thinking. We host one stateless Cloudflare Worker.

## How it works

```
PM ──"grant review dashboard"──▶ Claude / ChatGPT  (PM's own plan)
                                     │  MCP over HTTPS
                                     ▼
                       Cloudflare Worker  /mcp   (stateless, no storage)
                       ├─ catalogue tools  ← llms build output, bundled at build time
                       ├─ render_screen    → checks the code, returns a share link
                       └─ ui://ftds/preview ← the preview view (single HTML file)
                                     │
            host renders the view in a sandboxed iframe in the chat
                                     │
                         share link ▼
                       Worker  /s#<compressed code>  → same view, in a browser
```

Two standards do the work:

- **Remote MCP**: the Worker exposes tools over Streamable HTTP at `/mcp`. The
  assistant lists them, reads their descriptions and calls them.
- **MCP Apps** (spec `2026-01-26`): `render_screen` names a UI resource in
  `_meta.ui.resourceUri`. The host loads that resource
  (`text/html;profile=mcp-app`) in a sandboxed iframe and sends it the tool's
  input and result (`ui/notifications/tool-input`, `ui/notifications/tool-result`).
  Hosts without MCP Apps show the tool's text, which is the share link.

## Status

Built in `apps/mcp` (phases 0 and 1 below) and deployed to
https://ftds-mcp.irfan-ismail96.workers.dev; not yet tried in a real
Claude or ChatGPT:

- The Worker serves `/mcp`, `/s` and `/`; `pnpm --filter @mof-malaysia/ftds-mcp dev`.
- All five tools, the code checks (6 unit tests) and the catalogue from the
  llms build.
- The preview renders real FTDS screens, in light and dark, at mobile, tablet
  and desktop widths, with dialogs and dropdowns working inside the frame.
- `test/host` stands in for a chat host (`pnpm test:host`): it loads the
  preview under the spec's CSP and logs what the preview sends back. Tool
  input and results, auto-height, errors and runtime-error reports to the
  model all work there.

Findings so far:

- **Hosts forbid `eval`.** The spec's CSP allows only `'unsafe-inline'`
  scripts, so a screen runs as an injected inline script, not `new Function`.
- **Hosts block external fonts** unless declared, so the resource declares the
  Worker's origin in `resourceDomains` and the Worker serves Inter. The font
  needs `Access-Control-Allow-Origin` (`public/_headers`): sandboxed frames
  fetch it cross-origin.
- **The preview is 3 MB (880 KB gzipped)**: every component and icon, React,
  Tailwind's compiler and sucrase. The Worker bundle is 1.35 MB gzipped, under
  the free plan's 3 MB. Trimming it is the first thing to look at if it loads
  slowly in Claude.
- **Desktop screens in a 700px chat** render at 1280px and scale down. Tailwind
  breakpoints are rewritten as container queries on the frame, and JS
  `matchMedia` width queries answer for the frame, so `md:` and `AppShell`'s
  mobile switch follow the chosen width, not the chat's.
- **Portals** (dialogs, menus, toasts) are moved from `<body>` into the frame so
  they open inside the screen; a small shim keeps React's DOM calls working
  after the move.
- **Share links are about 2.6 KB** for a dashboard with a table.

## Tools

Few and broad. Every tool description costs context on every turn.

| Tool              | Returns                                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `get_started`     | What FTDS is and its rules (the llms.txt intro), how to write a screen (one TSX file, FTDS imports only, realistic Malaysian data, working state), the guides.                                                     |
| `list_components` | Every component, block and helper by category with its one-line purpose, from the llms index.                                                                                                                      |
| `read_docs`       | Up to 12 pages at once: components and blocks (`components/<name>.md`), guides (`guide:<slug>`), or `icons`.                                                                                                       |
| `render_screen`   | Input: `title`, `code`, `theme`, `viewport`. Checks the code (below); errors come back as text to fix; otherwise the preview shows in the chat and the result carries the share link and any design-rule warnings. |
| `prepare_handoff` | The `shadcn add` command for every FTDS item a screen imports, links to their docs, and the code. Takes the code, since the server keeps no state.                                                                 |

### Checks in `render_screen`

The model never sees the rendered pixels, so the server catches what it can
before anything renders:

1. **Compiles**: sucrase (TSX → JS) in the Worker. Syntax errors go back with
   line numbers.
2. **Imports**: only `react` and `@/components/ui/*` names that exist in the
   catalogue. Unknown names are reported with the closest real one.
3. **Design rules**: no raw palette classes where FTDS tokens exist
   (`bg-blue-600`, hex colours, arbitrary values), no hand-built buttons,
   inputs or tables when the component exists. Taken from DESIGN.md's Named
   Rules; start with a short list and grow it from what models actually get
   wrong.
4. **Runtime errors**: caught by the view's error boundary and sent with
   `ui/update-model-context`, so the model sees them on its next turn.

## The preview view

One build, used twice: as the `ui://ftds/preview` resource and as the `/s`
share page.

- React, every FTDS component and icon, the FTDS theme CSS, sucrase, and
  `@tailwindcss/browser` so classes the model writes still get styles.
- Built with Vite into **one self-contained HTML file**. MCP Apps blocks
  external scripts unless `_meta.ui.csp.resourceDomains` allows them; inlining
  avoids the question for the spike. Measure the size; if it is too large,
  serve the runtime from the Worker and declare that domain instead.
- An import map (or a small module registry) resolves `@/components/ui/<name>`
  to the bundled components, the same paths the docs examples use.
- Toolbar: light / dark, mobile / tablet / desktop width, **Copy share link**,
  **Open full screen** (`ui/request-display-mode`).
- Error boundary that shows the error to the PM and reports it to the model.

### Share links

- `/s#<lz-string compressed code + theme>`. The code lives in the fragment, so
  it never reaches the Worker and nothing is stored.
- The share page renders the screen inside an `<iframe sandbox="allow-scripts">`
  (no `allow-same-origin`), because a link can carry any code. Nothing
  sensitive lives on the Worker's origin, but the sandbox keeps it that way.
- Long screens make long links. If that becomes a problem, add short links
  backed by KV later (that is the first thing that would make the Worker
  stateful).

## Where it lives

```
apps/mcp/
├── scripts/catalogue.cts   llms build → src/generated/catalogue.json (gitignored)
├── src/worker/             MCP server (createMcpHandler from the MCP SDK, stateless), /s, /
├── src/view/               the preview page, built to one file, dist/view.html
├── src/shared/             code checks and share-link encoding, used by both
├── test/host/              a stand-in chat host for testing the preview
├── wrangler.jsonc
└── vite.config.ts
```

- `packages/react` stays source-only. The view build resolves the
  `@/components/ui/*` paths to its source like `apps/docs-astro` does.
- The catalogue comes from the same llms build as the docs site's `llms.txt`,
  bundled into the Worker, so the tools describe exactly the components the
  preview renders. Exports for the import checks come from the TypeScript
  checker (`scripts/llms/api.ts`).
- It uses `@modelcontextprotocol/server` (SDK v2) and
  `@modelcontextprotocol/ext-apps` directly; Cloudflare's Agents SDK isn't
  needed for a stateless server.

## Deployment

- One Worker, `ftds-mcp`, on `*.workers.dev` for the spike; a custom
  domain later.
- Deploys with the **Release** workflow, from the release tag, like the docs
  site, so the playground matches the published registry. Needs
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets.
- The pre-push hook builds the Worker and runs the checks' tests.
- Public and authless. Add Cloudflare rate limiting on `/mcp`; the tools only
  read bundled data, so the cost of abuse is Worker requests.

## Phases

### 0. Prove the riskiest part (1–2 days)

A Worker with one `render_screen` tool whose view renders a hard-coded FTDS
`Button` and `DataTable` in Claude (web and desktop) and ChatGPT. Answers:
does the single-file view load under each host's CSP, how big is it, how fast
does it appear, does `@tailwindcss/browser` work in the sandbox, and does
the view still render when the conversation is shared with Claude's own share
link.

Stop here if the view can't render reliably; fall back to share links only.

### 1. Working loop

- Preview view: compile and render any TSX, toolbar, error boundary.
- Catalogue tools from the llms build.
- `render_screen` with compile and import checks.
- Share page.
- Test with real PM prompts (a dashboard, a form, a list → detail flow) in
  Claude and ChatGPT; note what the model gets wrong.

### 2. Make it reliable

- Design-rule checks, seeded from the mistakes found in phase 1.
- Runtime errors back to the model.
- `get_code` with install commands.
- Tune tool descriptions and `get_started` until first renders are usually
  right.

### 3. Ship

- Release workflow deploy, secrets, rate limiting.
- A docs page, "Mock up screens with Claude": add the connector (Claude,
  ChatGPT), a first prompt to try, how to share, what admins must allow on
  Team / Enterprise plans. Link it from the front page.

### Later

- Multi-screen flows: several screens in one share link, linked by buttons.
- Short links in KV.
- WebMCP on the share page (`document.modelContext`) for browser agents such
  as Gemini in Chrome, reusing the same tool functions.

## Open decisions

- **Old share links after a release**: links carry the FTDS version they were
  made with, and the share page says when it renders with a newer one. Keep
  per-release previews (`/s/v0.1.0`) so old links render exactly, or accept
  the notice.
- **Domain**: `ftds-mcp.<account>.workers.dev` or a custom domain.
- **Which Cloudflare account** owns it, and who holds the deploy token.
- **Deploy on release only**, or also from `main` to a preview Worker for
  testing.
- **Which hosts to support** at launch: Claude only, or Claude and ChatGPT.

## Risks

- **MCP Apps is young.** Hosts differ in what they support (ChatGPT lacked
  some view-to-host calls at launch). Build against
  `@modelcontextprotocol/ext-apps`, test every host, keep the share link as
  the fallback.
- **The model can't see the screen.** Server checks and runtime error
  reporting are the substitute; the PM is the visual reviewer.
- **View size.** Every FTDS component, React, a compiler and Tailwind in one
  file. Phase 0 measures it.
- **Org policy.** Team and Enterprise admins must allow custom connectors.
