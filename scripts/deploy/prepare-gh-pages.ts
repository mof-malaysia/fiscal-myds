import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { buildJsonRegistry } from "../registry/build-json";

/**
 * Assemble the GitHub Pages site in deploy/:
 *
 *   index.html, 404.html   landing page (the Astro docs take over the root later)
 *   storybook/             apps/storybook build (run `pnpm build:gh-pages` there first)
 *   r/v2.1.0/<name>.json   JSON registry of each release tag, built from its own files
 *   r/v2/<name>.json       latest 2.x release
 *   r/latest/<name>.json   latest release
 *   r/versions.json        every published version and what each channel points to
 *   llms.txt, llms-full.txt, components/*.md, guides/*.md, icons.md
 *                          docs for coding agents, built from the checked-out ref
 *
 * Only release tags are published; main is never served as a registry. Each
 * deploy rebuilds every version from git, so the checkout needs its tags
 * (`fetch-depth: 0` in CI).
 */

const ROOT_DIR = path.join(__dirname, "../..");
const DEPLOY_DIR = path.join(ROOT_DIR, "deploy");
const STORYBOOK_BUILD = path.join(ROOT_DIR, "apps/storybook/dist");

/** Where the site is served; set FTDS_SITE_URL for a custom domain. */
const SITE_URL = (
  process.env.FTDS_SITE_URL || "https://mof-malaysia.github.io/ftds"
).replace(/\/$/, "");

const RELEASE_TAG = /^v(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?$/;

interface Release {
  tag: string;
  major: number;
  minor: number;
  patch: number;
  prerelease: boolean;
}

function log(message: string) {
  console.log(`📦 ${message}`);
}

function git(...args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT_DIR, encoding: "utf-8" });
}

/** Release tags that carry a GitHub-source registry, newest first. */
function listReleases(): Release[] {
  return git("tag", "--list", "v*")
    .split("\n")
    .flatMap((tag) => {
      const match = tag.match(RELEASE_TAG);
      if (!match) return [];
      try {
        execFileSync("git", ["cat-file", "-e", `${tag}:registry.json`], {
          cwd: ROOT_DIR,
          stdio: "ignore",
        });
      } catch {
        return []; // released before the registry moved to GitHub-source files
      }
      return [
        {
          tag,
          major: Number(match[1]),
          minor: Number(match[2]),
          patch: Number(match[3]),
          prerelease: Boolean(match[4]),
        },
      ];
    })
    .sort(
      (a, b) =>
        b.major - a.major ||
        b.minor - a.minor ||
        b.patch - a.patch ||
        Number(a.prerelease) - Number(b.prerelease) ||
        b.tag.localeCompare(a.tag),
    );
}

/** latest -> newest stable release, v<major> -> newest stable release of that major. */
function resolveChannels(releases: Release[]): Record<string, string> {
  const channels: Record<string, string> = {};
  for (const release of releases.filter((r) => !r.prerelease)) {
    channels.latest ??= release.tag;
    channels[`v${release.major}`] ??= release.tag;
  }
  return channels;
}

function buildRegistries(
  releases: Release[],
  channels: Record<string, string>,
) {
  const registryDir = path.join(DEPLOY_DIR, "r");
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "ftds-registry-"));

  try {
    for (const { tag } of releases) {
      const sourceDir = path.join(workDir, tag);
      fs.mkdirSync(sourceDir);
      const archive = execFileSync(
        "git",
        ["archive", "--format=tar", tag, "registry.json", "registry"],
        { cwd: ROOT_DIR, maxBuffer: 256 * 1024 * 1024 },
      );
      execFileSync("tar", ["-x", "-C", sourceDir], { input: archive });

      const targets = [
        tag,
        ...Object.keys(channels).filter((channel) => channels[channel] === tag),
      ];
      for (const target of targets) {
        const count = buildJsonRegistry(
          sourceDir,
          path.join(registryDir, target),
          `${SITE_URL}/r/${target}`,
        );
        log(`r/${target}: ${count} items${target === tag ? "" : ` (${tag})`}`);
      }
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  fs.mkdirSync(registryDir, { recursive: true });
  fs.writeFileSync(
    path.join(registryDir, "versions.json"),
    JSON.stringify(
      { versions: releases.map((r) => r.tag), channels },
      null,
      2,
    ) + "\n",
  );
}

function copyStorybook() {
  if (!fs.existsSync(STORYBOOK_BUILD)) {
    throw new Error(
      "Storybook build not found. Run `pnpm build:gh-pages` in apps/storybook first.",
    );
  }
  fs.cpSync(STORYBOOK_BUILD, path.join(DEPLOY_DIR, "storybook"), {
    recursive: true,
  });
  log("storybook/ copied");
}

const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"]/g,
    (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot" }[c]};`,
  );

function landingPage(releases: Release[], channels: Record<string, string>) {
  const latest = channels.latest;
  const major = latest ? latest.split(".")[0] : "v2";
  const versions = releases.length
    ? releases
        .map(
          ({ tag }) =>
            `<li><a href="r/${tag}/registry.json"><code>${tag}</code></a></li>`,
        )
        .join("")
    : "<li>No release yet.</li>";
  const pin = latest ?? "v2.0.0";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FTDS Registry</title>
  <meta name="description" content="FiscalTech Design System: the Ministry of Finance's shadcn component registry.">
  <style>
    :root { --ink: #18181b; --muted: #52525b; --line: #e4e4e7; --well: #f4f4f5; --blue: #2563eb; --paper: #fff; }
    @media (prefers-color-scheme: dark) {
      :root { --ink: #fafafa; --muted: #a1a1aa; --line: #27272a; --well: #18181b; --blue: #6394ff; --paper: #09090b; }
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--paper); color: var(--ink); font: 16px/1.6 system-ui, -apple-system, "Segoe UI", sans-serif; }
    main { max-width: 760px; margin: 0 auto; padding: 56px 16px 80px; }
    h1 { font-size: 2rem; line-height: 1.2; margin: 0 0 8px; }
    h2 { font-size: 1.125rem; margin: 40px 0 8px; }
    p { margin: 0 0 12px; color: var(--muted); }
    a { color: var(--blue); }
    pre { background: var(--well); padding: 14px 16px; border-radius: 8px; overflow-x: auto; font-size: 0.875rem; margin: 0 0 12px; }
    code { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
    nav { display: flex; gap: 20px; margin: 20px 0 0; }
    ul { padding-left: 20px; color: var(--muted); }
    footer { margin-top: 56px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 0.875rem; color: var(--muted); }
  </style>
</head>
<body>
<main>
  <h1>FTDS Registry</h1>
  <p>FiscalTech Design System: components, icons and styles for Ministry of Finance services, installed with the shadcn CLI.${latest ? ` Latest release: <code>${escapeHtml(latest)}</code>.` : ""}</p>
  <nav><a href="storybook/">Storybook</a><a href="llms.txt">llms.txt</a><a href="https://github.com/mof-malaysia/ftds">GitHub</a><a href="https://github.com/mof-malaysia/ftds/releases">Releases</a></nav>

  <h2>Install from this site</h2>
  <p>Add the namespace to <code>components.json</code> once. <code>${major}</code> follows the latest ${major}.x release; use an exact version such as <code>${escapeHtml(pin)}</code> to pin, or <code>latest</code>.</p>
  <pre><code>"registries": {
  "@ftds": "${SITE_URL}/r/${major}/{name}.json"
}</code></pre>
  <pre><code>npx shadcn@latest add @ftds/ftds-init
npx shadcn@latest add @ftds/button --overwrite</code></pre>

  <h2>Install from GitHub</h2>
  <p>No configuration needed. Always pin a release tag: without one you get unreleased work from main.</p>
  <pre><code>npx shadcn@latest add mof-malaysia/ftds/button#${escapeHtml(pin)}</code></pre>
  <p>GitHub allows 60 unauthenticated API requests an hour per IP address, and the CLI makes one per file. Sign in with <code>gh auth login</code>, or use this site.</p>

  <h2>For coding agents</h2>
  <p>Point your coding agent at <a href="llms.txt"><code>${SITE_URL}/llms.txt</code></a>: the rules for writing FTDS code and a page per component with its props and checked examples. <a href="llms-full.txt"><code>llms-full.txt</code></a> has everything in one file.</p>

  <h2>Versions</h2>
  <ul>${versions}</ul>

  <footer>FTDS is built on MYDS, the Malaysia Government Design System, and is maintained by the Ministry of Finance.</footer>
</main>
</body>
</html>
`;
}

function main() {
  console.log("🚀 Preparing GitHub Pages deployment\n");

  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });

  const releases = listReleases();
  const channels = resolveChannels(releases);
  if (!releases.length) log("No release tags yet: r/ holds only versions.json");
  buildRegistries(releases, channels);
  copyStorybook();
  // The checked-out ref is the release being deployed, so the docs describe it
  execFileSync(
    path.join(ROOT_DIR, "node_modules/.bin/tsx"),
    ["scripts/llms/build.ts", "--out", DEPLOY_DIR, "--site", SITE_URL],
    { cwd: ROOT_DIR, stdio: "inherit" },
  );

  const page = landingPage(releases, channels);
  fs.writeFileSync(path.join(DEPLOY_DIR, "index.html"), page);
  fs.writeFileSync(path.join(DEPLOY_DIR, "404.html"), page);
  // Keep Jekyll from dropping files that start with an underscore
  fs.writeFileSync(path.join(DEPLOY_DIR, ".nojekyll"), "");
  if (process.env.FTDS_SITE_CNAME) {
    fs.writeFileSync(
      path.join(DEPLOY_DIR, "CNAME"),
      process.env.FTDS_SITE_CNAME,
    );
  }

  console.log(`\n✨ deploy/ ready for ${SITE_URL}`);
}

main();
