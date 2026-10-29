import { createMcpHandler } from "@modelcontextprotocol/server";
import { createServer, previewHtml } from "./server";

/**
 * FTDS Playground Worker. It keeps no state and stores nothing:
 *
 *   /mcp          the MCP server (Streamable HTTP) people add to Claude or ChatGPT as a connector
 *   /s#<screen>   a shared screen; the screen is in the fragment, which never reaches this Worker
 *   /fonts/*      static assets (served before this code runs)
 *   /             what this is and how to connect
 */

const mcp = createMcpHandler(({ requestInfo }) =>
  createServer(new URL(requestInfo?.url ?? "https://localhost").origin),
);

/** Browser-based MCP clients (the MCP Inspector, web hosts) call /mcp cross-origin. Nothing here is private. */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/mcp") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS });
      }
      const response = await mcp.fetch(request);
      const headers = new Headers(response.headers);
      for (const [name, value] of Object.entries(CORS))
        headers.set(name, value);
      return new Response(response.body, { status: response.status, headers });
    }

    if (url.pathname === "/s") return sharePage(url.origin);
    if (url.pathname === "/") return landingPage(url.origin);
    return new Response("Not found", { status: 404 });
  },
};

/**
 * The share page runs whatever code its link carries, so it is locked down
 * like the chat hosts lock down the preview: a sandbox with an opaque origin,
 * no network, and nothing loaded except the font from this Worker.
 */
function sharePage(origin: string): Response {
  const csp = [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline'",
    `img-src data: ${origin}`,
    `font-src ${origin}`,
    "connect-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    // allow-forms lets onSubmit run; form-action 'none' still stops any submission leaving the page
    "sandbox allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox",
  ].join("; ");
  return new Response(previewHtml(origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": csp,
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "public, max-age=300",
    },
  });
}

function landingPage(origin: string): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FTDS Playground</title>
<style>
  :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
  body { max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.6; }
  code { background: rgb(127 127 127 / 0.15); padding: 0.15rem 0.35rem; border-radius: 0.25rem; }
</style>
</head>
<body>
<h1>FTDS Playground</h1>
<p>Mock up screens with FTDS in Claude or ChatGPT. Add this URL as a custom connector, then ask for a screen:</p>
<p><code>${origin}/mcp</code></p>
<p>Screens render in the chat and can be shared as a link that opens in any browser.</p>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
