import { McpServer } from "@modelcontextprotocol/server";
import {
  RESOURCE_MIME_TYPE,
  registerAppResource,
  registerAppTool,
} from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import catalogueJson from "../generated/catalogue.json";
import viewHtml from "../../dist/view.html";
import type { Catalogue } from "../shared/catalogue";
import {
  checkScreen,
  closest,
  formatProblems,
  screenImports,
} from "../shared/check";
import { THEMES, VIEWPORTS, shareUrl, type Screen } from "../shared/screen";

const catalogue = catalogueJson as Catalogue;
const PREVIEW_URI = "ui://ftds/preview.html";

/** The 3 MB preview page, split once around the per-request origin. */
const previewParts = (viewHtml as string)
  .replaceAll("__FTDS_VERSION__", catalogue.version)
  .split("__FTDS_ORIGIN__");

const SCREEN_CODE = z.string().max(60_000);
const READ_DOCS_INPUT = z.object({
  names: z
    .array(z.string())
    .min(1)
    .max(12)
    .describe('Item names, "guide:<slug>" or "icons"'),
});
const RENDER_INPUT = z.object({
  title: z
    .string()
    .max(120)
    .describe('What the screen is, e.g. "Grant applications: officer review"'),
  code: SCREEN_CODE.describe("The whole TSX file"),
  theme: z.enum(THEMES).default("light"),
  viewport: z
    .enum(VIEWPORTS)
    .default("desktop")
    .describe(
      "mobile for citizen services on phones; desktop for officer tools",
    ),
});
const HANDOFF_INPUT = z.object({
  code: SCREEN_CODE.describe("The screen's TSX file"),
});

const INSTRUCTIONS = `FTDS Playground mocks up screens with FTDS, the Ministry of Finance Malaysia's design system, and shows them to the user in the chat. Use it when someone wants to see what a screen, page or flow could look like: gathering requirements, comparing options, preparing a demo. Call get_started first.`;

const HOW_TO_WRITE_A_SCREEN = `# How to write a screen

A screen is one TSX file:

\`\`\`tsx
import { useState } from "react";
import { PageHeader, PageHeaderTitle } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";

export default function Screen() {
  return (/* … */);
}
\`\`\`

- **One file, one default export.** Import only from \`react\` and FTDS (\`@/components/ui/<name>\`, \`@/components/blocks/<name>\`, \`@/components/ui/icons/<name>\`, \`@/lib/ftds/utils\`, \`@/lib/ftds/hooks\`). No other packages, no CSS imports, no network requests.
- **Start from a block or a layout.** Service screens, sign-in, settings, work queues and marketing sections already exist as blocks; page frames are in the Layout and Government chrome sections. Call list_components, then read_docs for every item you use before writing code: props and composition rules are on those pages.
- **Use realistic data.** People reviewing the screen judge it by its content. Fill it with plausible Malaysian government data: names, IC numbers (900101-14-5678), RM amounts with two decimals, dates, reference numbers, agencies. Write labels in the language the user writes in (English or Bahasa Melayu).
- **Make it work.** Use React state so tabs switch, dialogs open, filters filter and forms validate: the user clicks through the preview.
- **Follow the design rules** in the intro above. render_screen reports rules it can check as warnings; fix them before showing the screen as final.
- **Iterate by rendering again.** To change a screen, call render_screen with the whole new file. Each version gets its own share link.
- **When the user is happy**, call prepare_handoff to give developers the code and the install command.`;

const text = (value: string) => ({
  content: [{ type: "text" as const, text: value }],
});

const itemLine = (item: { name: string; description: string }) =>
  `- ${item.name}: ${item.description}`;

/** One fresh server per request: the Worker keeps no state between calls. */
export function createServer(origin: string): McpServer {
  const server = new McpServer(
    { name: "ftds-mcp", version: catalogue.version },
    { instructions: INSTRUCTIONS },
  );

  server.registerTool(
    "get_started",
    {
      title: "Get started with FTDS",
      description:
        "What FTDS is, the design rules, and how to write a screen for render_screen. Call this before the first screen in a conversation.",
      annotations: { readOnlyHint: true },
    },
    async () =>
      text(
        [
          catalogue.intro,
          HOW_TO_WRITE_A_SCREEN,
          `## Guides (read with read_docs)\n\n${catalogue.guides
            .map((g) => `- guide:${g.slug}: ${g.title}`)
            .join("\n")}`,
        ].join("\n\n"),
      ),
  );

  server.registerTool(
    "list_components",
    {
      title: "List FTDS components and blocks",
      description:
        "Every FTDS component, block and helper by category, with what each is for. Read the ones you use with read_docs.",
      annotations: { readOnlyHint: true },
    },
    async () =>
      text(
        [
          ...catalogue.sections.map(
            (s) => `## ${s.category}\n\n${s.items.map(itemLine).join("\n")}`,
          ),
          `## Icons\n\n${catalogue.icons.length} icons, imported from @/components/ui/icons/<name>. read_docs(["icons"]) lists them.`,
        ].join("\n\n"),
      ),
  );

  server.registerTool(
    "read_docs",
    {
      title: "Read FTDS docs",
      description:
        'The documentation page of components, blocks, guides or icons: the import, props with their types, examples and rules. Pass item names from list_components (e.g. "data-table", "work-queue"), guides as "guide:<slug>", or "icons".',
      inputSchema: READ_DOCS_INPUT,
      annotations: { readOnlyHint: true },
    },
    async ({ names }) => text(names.map(readDoc).join("\n\n---\n\n")),
  );

  registerAppTool(
    server,
    "render_screen",
    {
      title: "Render a screen",
      description:
        "Check and render a screen (one TSX file, see get_started) and show it to the user in the chat, with a share link anyone can open in a browser. Returns errors to fix if it can't render, and design-rule warnings. Call again with the whole file to change it.",
      inputSchema: RENDER_INPUT,
      annotations: { readOnlyHint: true },
      _meta: { ui: { resourceUri: PREVIEW_URI } },
    },
    async ({ title, code, theme, viewport }) => {
      const screen: Screen = {
        v: catalogue.version,
        title,
        code,
        theme,
        viewport,
      };
      const problems = checkScreen(code, catalogue.modules);
      const errors = problems.filter((p) => p.severity === "error");
      const warnings = problems.filter((p) => p.severity === "warning");

      if (errors.length) {
        return {
          isError: true,
          ...text(
            `The screen can't render. Fix these and call render_screen again:\n\n${formatProblems(errors)}${
              warnings.length
                ? `\n\nAlso fix:\n\n${formatProblems(warnings)}`
                : ""
            }`,
          ),
          structuredContent: { screen, problems },
        };
      }

      const url = shareUrl(origin, screen);
      return {
        ...text(
          [
            `Rendered "${title}" (${theme}, ${viewport}). The user sees it in the chat and can switch theme and width, and copy a share link, from the preview's toolbar.`,
            warnings.length
              ? `Design-rule warnings to fix:\n\n${formatProblems(warnings)}`
              : "No design-rule warnings.",
            `Share link (give it only if the user asks or can't see the preview; it opens in any browser): ${url}`,
          ].join("\n\n"),
        ),
        structuredContent: { screen, problems, shareUrl: url },
      };
    },
  );

  server.registerTool(
    "prepare_handoff",
    {
      title: "Prepare a developer handoff",
      description:
        "Turn a finished screen into what developers need to build it: the shadcn install command for every FTDS item it uses, setup notes and the code.",
      inputSchema: HANDOFF_INPUT,
      annotations: { readOnlyHint: true },
    },
    async ({ code }) => {
      const items = screenImports(code, catalogue.modules).map(
        (importPath) => catalogue.items[importPath]!,
      );
      return text(
        [
          `# Handoff`,
          `Built with FTDS ${catalogue.version}. Set up a project once with the setup guide (${catalogue.docsUrl}/guides/setup.md), then install what this screen uses:`,
          "```sh\nnpx shadcn@latest add " +
            items.map((i) => `@ftds/${i}`).join(" ") +
            "\n```",
          `Docs for each item: ${items.map((i) => `${catalogue.docsUrl}/components/${i}.md`).join(", ")}`,
          "```tsx\n" + code.trim() + "\n```",
        ].join("\n\n"),
      );
    },
  );

  registerAppResource(
    server,
    "FTDS screen preview",
    PREVIEW_URI,
    { description: "Renders FTDS screens from render_screen" },
    async () => ({
      contents: [
        {
          uri: PREVIEW_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: previewHtml(origin),
          _meta: {
            ui: {
              // The Inter font is served by this Worker
              csp: { resourceDomains: [origin] },
              prefersBorder: true,
            },
          },
        },
      ],
    }),
  );

  return server;
}

/** The preview page, told where this Worker is and which release it renders. */
export function previewHtml(origin: string): string {
  return previewParts.join(origin);
}

function readDoc(name: string): string {
  const key = name
    .trim()
    .replace(/^@ftds\//, "")
    .replace(/\.md$/, "");
  if (key === "icons") {
    return `# Icons\n\nImport each from its own path. Size with size-* classes; decorative icons need aria-hidden.\n\n${catalogue.icons
      .map((i) => `- ${i.export}: ${i.import}`)
      .join("\n")}`;
  }
  if (key.startsWith("guide:")) {
    const guide = catalogue.guides.find((g) => g.slug === key.slice(6));
    if (guide) return guide.body;
  }
  const page = catalogue.pages[key] ?? catalogue.pages[key.split("/").pop()!];
  if (page) return page;

  const close = closest(key, Object.keys(catalogue.pages));
  return `No docs for "${name}".${close.length ? ` Did you mean: ${close.join(", ")}?` : " Call list_components for the names."}`;
}
