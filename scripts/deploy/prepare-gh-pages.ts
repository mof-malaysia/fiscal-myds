import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { buildJsonRegistry } from "../registry/build-json";

/**
 * Assemble the GitHub Pages site in deploy/:
 *
 *   index.html, docs/      apps/docs-astro build at the root (run `pnpm build`
 *                          there with FTDS_SITE_URL set first)
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
const DOCS_BUILD = path.join(ROOT_DIR, "apps/docs-astro/dist");

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

/** The Astro docs are the site, so they go at the root. */
function copyDocs() {
  if (!fs.existsSync(DOCS_BUILD)) {
    throw new Error(
      "Docs build not found. Run `pnpm build` in apps/docs-astro first.",
    );
  }
  fs.cpSync(DOCS_BUILD, DEPLOY_DIR, { recursive: true });
  log("docs copied");
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

function main() {
  console.log("🚀 Preparing GitHub Pages deployment\n");

  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
  fs.mkdirSync(DEPLOY_DIR, { recursive: true });

  const releases = listReleases();
  const channels = resolveChannels(releases);
  if (!releases.length) log("No release tags yet: r/ holds only versions.json");
  copyDocs();
  buildRegistries(releases, channels);
  copyStorybook();
  // The checked-out ref is the release being deployed, so the docs describe it
  execFileSync(
    path.join(ROOT_DIR, "node_modules/.bin/tsx"),
    ["scripts/llms/build.ts", "--out", DEPLOY_DIR, "--site", SITE_URL],
    { cwd: ROOT_DIR, stdio: "inherit" },
  );

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
