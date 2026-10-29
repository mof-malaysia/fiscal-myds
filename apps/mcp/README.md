# FTDS Playground

A remote MCP server, on a Cloudflare Worker, that lets Claude or ChatGPT mock up screens with FTDS. Screens render in the chat as an [MCP App](https://modelcontextprotocol.io/extensions/apps) and can be shared as a link that opens in any browser. The plan and findings are in [PLAYGROUND-PLAN.md](../../PLAYGROUND-PLAN.md).

The Worker keeps no state and calls no AI: the person's own Claude or ChatGPT does the work.

| Path          | What                                                                            |
| ------------- | ------------------------------------------------------------------------------- |
| `/mcp`        | The MCP server. Add `https://<worker>/mcp` as a custom connector.               |
| `/s#<screen>` | A shared screen. The screen is in the fragment, which never reaches the Worker. |
| `/`           | What this is and how to connect.                                                |

## Develop

```sh
pnpm --filter @mof-malaysia/ftds-mcp dev        # catalogue, preview, then wrangler dev on :8787
pnpm --filter @mof-malaysia/ftds-mcp test:host  # a stand-in chat host on :5199 (needs dev running)
pnpm --filter @mof-malaysia/ftds-mcp test       # the code checks
```

The test host calls `render_screen` on the local Worker and loads the preview the way the MCP Apps spec tells hosts to, with its CSP. To try a real host, expose the dev server (for example with `cloudflared tunnel --url http://localhost:8787`) and add the tunnel's `/mcp` URL as a connector.

`pnpm dev` doesn't watch the preview: after changing `src/view`, run `pnpm build:view` and wrangler reloads.

## How it fits together

- `scripts/catalogue.cts` runs the llms build (`scripts/llms`) and packs its pages, the component index and every module's exports into `src/generated/catalogue.json` for the tools.
- `src/view` is built by Vite into one file, `dist/view.html`, with every FTDS component and icon bundled. The Worker serves it as the `ui://ftds/preview.html` resource and as the share page.
- `src/shared/check.ts` checks a screen (compiles, imports exist, design rules) in the Worker, and compiles it in the preview.

## Deploy

```sh
pnpm --filter @mof-malaysia/ftds-mcp run deploy
```

Needs a Cloudflare account (`wrangler login`, or `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in a workflow). Set `FTDS_VERSION` to the release tag when deploying from a release, so tools and share links name it.
