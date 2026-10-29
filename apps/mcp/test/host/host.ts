import {
  AppBridge,
  PostMessageTransport,
} from "@modelcontextprotocol/ext-apps/app-bridge";

/**
 * A stand-in for a chat host, for testing the preview without Claude: it
 * calls the local Worker's MCP tools and embeds the MCP App the way the spec
 * tells hosts to, in a sandboxed iframe with the spec's default CSP (no eval,
 * no external scripts, the resource's resourceDomains allowed).
 *
 * Run `pnpm dev` (the Worker on :8787), then `pnpm test:host`.
 */

const MCP = "http://localhost:8787/mcp";
const log = (...parts: unknown[]) => {
  document.getElementById("log")!.textContent +=
    parts
      .map((p) => (typeof p === "string" ? p : JSON.stringify(p, null, 1)))
      .join(" ") + "\n";
};

let id = 0;
async function rpc(method: string, params: unknown) {
  const response = await fetch(MCP, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-06-18",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }),
  });
  const text = await response.text();
  const body = text.includes("data: ")
    ? text.slice(text.indexOf("data: ") + 6)
    : text;
  return JSON.parse(body).result;
}

const SCREENS: Record<string, string> = {
  good: `import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";

export default function Screen() {
  const [name, setName] = useState("Nurul Aina binti Hassan");
  return (
    <div className="flex flex-col gap-4 p-6 md:flex-row">
      <div className="flex-1 rounded-lg bg-bg-white p-4">
        <p className="text-sm text-txt-black-500">MOF-2026-0412</p>
        <p className="text-lg font-semibold">{name}</p>
        <Tag variant="warning">In review</Tag>
      </div>
      <div className="flex flex-1 flex-col gap-3 rounded-lg bg-bg-white p-4">
        <Field><FieldLabel>Applicant name</FieldLabel><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Dialog>
          <DialogTrigger render={<Button variant="primary-fill" />}>Approve</DialogTrigger>
          <DialogBody>
            <DialogHeader><DialogTitle>Approve RM 12,500.00?</DialogTitle></DialogHeader>
            <DialogContent>{name} will be told by email.</DialogContent>
            <DialogFooter><DialogClose render={<Button variant="default-outline" />}>Cancel</DialogClose><Button variant="primary-fill">Approve grant</Button></DialogFooter>
          </DialogBody>
        </Dialog>
      </div>
    </div>
  );
}`,
  warn: `import { Button } from "@/components/ui/button";
export default function Screen() {
  return (
    <div className="flex flex-col gap-3 p-6">
      <p className="font-bold text-gray-500">Breaks two design rules</p>
      <Button variant="primary-fill">Hantar permohonan</Button>
    </div>
  );
}`,
  bad: `import { Buton } from "@/components/ui/button";\nexport default () => <Buton />;`,
  crash: `export default function Screen() {\n  const rows: { name: string }[] = undefined as any;\n  return <p>{rows.map((r) => r.name)}</p>;\n}`,
};

function withHostCsp(html: string, resourceDomains: string[]): string {
  const domains = resourceDomains.join(" ");
  const csp = [
    "default-src 'none'",
    `script-src 'self' 'unsafe-inline' ${domains}`,
    `style-src 'self' 'unsafe-inline' ${domains}`,
    "connect-src 'self'",
    `img-src 'self' data: ${domains}`,
    `font-src 'self' ${domains}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
  return html.replace(
    "<head>",
    `<head><meta http-equiv="Content-Security-Policy" content="${csp}">`,
  );
}

async function render(name: string) {
  const args = {
    title: `Test: ${name}`,
    code: SCREENS[name],
    theme: "light",
    viewport: "desktop",
  };
  const resource = (
    await rpc("resources/read", { uri: "ui://ftds/preview.html" })
  ).contents[0];
  const result = await rpc("tools/call", {
    name: "render_screen",
    arguments: args,
  });
  log(
    `render_screen(${name}) →`,
    result.isError ? "error" : "ok",
    `${resource.text.length} bytes of view`,
  );

  const iframe = document.createElement("iframe");
  iframe.setAttribute("sandbox", "allow-scripts allow-forms");
  iframe.style.height = "200px";
  document.getElementById("chat")!.append(iframe);

  const bridge = new AppBridge(
    null,
    { name: "test-host", version: "1" },
    { openLinks: {}, updateModelContext: { text: {} } },
  );
  bridge.setHostContext({
    theme: "light",
    displayMode: "inline",
    availableDisplayModes: ["inline", "fullscreen"],
  });
  bridge.onsizechange = ({ height }) => {
    if (height) iframe.style.height = `${height}px`;
    log("size", height);
  };
  bridge.onopenlink = async ({ url }) => {
    log("open link", url.slice(0, 60) + "…");
    return {};
  };
  bridge.onupdatemodelcontext = async (params) => {
    log("model context ←", params);
    return {};
  };
  bridge.onrequestdisplaymode = async ({ mode }) => {
    log("display mode", mode);
    return { mode };
  };
  bridge.oninitialized = async () => {
    log("view initialized");
    await bridge.sendToolInput({ arguments: args });
    await bridge.sendToolResult(result);
  };
  await bridge.connect(
    new PostMessageTransport(iframe.contentWindow!, iframe.contentWindow!),
  );
  iframe.srcdoc = withHostCsp(
    resource.text,
    resource._meta?.ui?.csp?.resourceDomains ?? [],
  );
}

window.addEventListener("securitypolicyviolation", (e) =>
  log("CSP violation (host)", e.violatedDirective),
);
document
  .querySelectorAll<HTMLButtonElement>("button[data-screen]")
  .forEach((button) =>
    button.addEventListener("click", () => render(button.dataset.screen!)),
  );
