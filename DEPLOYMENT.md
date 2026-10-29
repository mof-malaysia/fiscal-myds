# Releasing and deployment

FTDS is published two ways from the same release:

- **GitHub registry**: the repository itself. The shadcn CLI reads `registry.json` and the files under `registry/` straight from GitHub (`npx shadcn@latest add mof-malaysia/ftds/button#v0.1.0`). See the [shadcn docs](https://ui.shadcn.com/docs/registry/github).
- **GitHub Pages**: `https://mof-malaysia.github.io/ftds/`, with a JSON registry per release for the `@ftds` namespace, plus the docs site and Storybook.

The whole repository has one version, and a version is a git tag.

## Branching model

Development is trunk-based: short-lived branches merge into `main`, and releases are tags cut from `main`.

- `main` is always releasable. There is no CI workflow: the git hooks run the checks locally (see [CONTRIBUTING.md](./CONTRIBUTING.md#git-hooks)). Every commit gets lint and typecheck; every push also gets the registry checks, the agent-docs check and the Storybook, docs and playground builds.
- `registry/` is committed and must match `pnpm registry:build`. The pre-push hook fails if it doesn't, so commit the build output with every component, icon or style change.
- On `main`, `registryDependencies` are unpinned (`mof-malaysia/ftds/utils`). Anyone installing from GitHub without a tag gets unreleased work; the docs tell people to pin a tag.
- Nothing is deployed from `main`. GitHub Pages only changes when a release is cut.

## Cutting a release

1. Pull `main` and run the pre-push checks on it: `pnpm exec lefthook run pre-push --force`.
2. Go to **Actions** → **Release** → **Run workflow**, keep the branch on `main` and enter the version without the `v`: `0.1.0`, or `0.2.0-rc.1` for a prerelease.

The workflow:

1. Refuses to run unless it is on `main`, the version is valid and the tag doesn't exist yet.
2. Rebuilds the registry with `FTDS_REF=v0.1.0`, which pins every dependency to the tag (`mof-malaysia/ftds/utils#v0.1.0`). shadcn doesn't pass a ref on to dependencies, so without this a tagged install would pull its dependencies from `main`.
3. Commits that as `release: v0.1.0` on top of `main` and pushes only the tag. The release commit is never merged back, so `main` stays unpinned.
4. Creates a GitHub release with generated notes (marked as a prerelease for `-rc` and similar).
5. Runs the **Pages** workflow for the new tag.

Pick the version by [semver](https://semver.org): a breaking change to a component's props, a renamed or removed item or a change to where files install is a major; a new item or prop is a minor; a fix is a patch. Below 1.0, a breaking change bumps the minor instead (`0.1.0` → `0.2.0`), so the `v0` channel can break; tell projects to pin a tag until 1.0.

Tags are permanent. Never move or reuse one: people pin them, and every `#v0.1.0` dependency inside that release points at it. To undo a bad release, release a fix as the next patch.

## What GitHub Pages serves

```
https://mof-malaysia.github.io/ftds/
├── index.html, docs/        Docs site (apps/docs-astro), built from the latest release tag
├── storybook/               Storybook, built from the latest release tag
├── llms.txt, llms-full.txt  Docs for coding agents, with components/*.md, guides/*.md and icons.md
└── r/
    ├── v0.1.0/<name>.json   Every release tag, built from that tag's own registry files
    ├── v0/<name>.json       Newest stable 0.x release
    ├── latest/<name>.json   Newest stable release
    ├── <folder>/registry.json   Catalog of the items in that folder
    └── versions.json        Every published version and where each channel points
```

Every deploy rebuilds `r/` from the git tags (`scripts/deploy/prepare-gh-pages.ts` extracts each tag's `registry/` with `git archive` and converts it with `scripts/registry/build-json.ts`). Dependencies in each folder point inside the same folder, so `@ftds/button` from `r/v0/` brings `utils` from `r/v0/`. Prereleases get their own `r/<tag>/` folder but never move `latest` or a major channel.

Projects choose a folder in `components.json`:

```json
{
  "registries": {
    "@ftds": "https://mof-malaysia.github.io/ftds/r/v0/{name}.json"
  }
}
```

### The Astro docs site

`apps/docs-astro` is built by the Pages workflow from the release tag, so the docs always describe the published registry. It takes `site` and `base` from `FTDS_SITE_URL` (`https://mof-malaysia.github.io/ftds` unless the repository variable is set); without it, it builds for the root, which is what `pnpm dev` there uses. The pre-push hook builds it before every push.

`prepare-gh-pages.ts` copies the build to the root of `deploy/`, so the docs are the site. Keep `storybook/` and `r/` where they are, since projects already point at `r/`.

To check a deploy locally:

```sh
FTDS_SITE_URL=https://mof-malaysia.github.io/ftds pnpm --filter @mof-malaysia/ftds-docs-astro build
pnpm --filter @mof-malaysia/ftds-storybook build:gh-pages
pnpm deploy:prepare
```

## One-time setup on GitHub

1. **Settings** → **Pages** → **Source**: **GitHub Actions**.
2. **Settings** → **Environments** → **github-pages**: deployments must be allowed from `main`. The Release and Pages workflows run on `main` even when they build a tag.
3. **Settings** → **Actions** → **General** → **Workflow permissions**: the Release workflow asks for `contents: write` to push the tag and create the release. If a ruleset protects `v*` tags, let GitHub Actions bypass it.

## Cloudflare

Two Workers on the maintainer's Cloudflare account are deployed by hand, after `wrangler login`:

- **ftds-mcp**, the playground's MCP server ([apps/mcp](./apps/mcp/README.md)): `pnpm --filter @mof-malaysia/ftds-mcp run deploy`
- **ftds-storybook**, Storybook built for the site root: `pnpm --filter @mof-malaysia/ftds-storybook run deploy`

Use `run deploy`: `pnpm deploy` is a built-in pnpm command.

## Redeploying Pages

**Actions** → **Pages** → **Run workflow** from `main`, with the release tag to build the docs and Storybook from (normally the latest). Use it after a failed deploy or after deleting a tag that should disappear from `r/`.

## Custom domain

1. Add a DNS CNAME record pointing to `mof-malaysia.github.io`.
2. Set two repository variables (**Settings** → **Secrets and variables** → **Actions** → **Variables**): `FTDS_SITE_URL` (`https://ftds.example.gov.my`) and `FTDS_SITE_CNAME` (`ftds.example.gov.my`). The Pages workflow passes them to `deploy:prepare`, which builds the registry URLs from the first and writes `CNAME` from the second.
3. The site is now served from the domain root, so set the Storybook base path in `apps/storybook/package.json` to `BASE_PATH=/storybook`.
4. In **Settings** → **Pages**, enter the domain and enable **Enforce HTTPS**, then redeploy Pages.

Projects using the old `mof-malaysia.github.io/ftds/r/...` URL need to update `components.json`.

## Locally

```bash
pnpm registry:build      # regenerate registry.json and registry/
pnpm registry:validate   # shadcn registry validate

# Assemble the Pages site in deploy/ from your local tags
pnpm --filter @mof-malaysia/ftds-storybook build:gh-pages
pnpm deploy:prepare
npx serve deploy

# One release folder only
pnpm tsx scripts/registry/build-json.ts . /tmp/r http://localhost:3000/r/dev
```

## Scripts reference

| Command                  | What it does                                                          |
| ------------------------ | --------------------------------------------------------------------- |
| `pnpm registry:build`    | Generate `registry.json` and `registry/` (set `FTDS_REF` to pin deps) |
| `pnpm registry:validate` | `shadcn registry validate ./registry.json`                            |
| `pnpm registry:clean`    | Delete the generated registry                                         |
| `pnpm deploy:prepare`    | Assemble `deploy/`: docs, `r/` from every release tag, Storybook      |
| `pnpm deploy:clean`      | Delete `deploy/`                                                      |

## Troubleshooting

### CI: "registry/ is out of date"

Run `pnpm registry:build` and commit `registry.json` and `registry/`.

### Storybook 404s or broken assets

`BASE_PATH` must match where Storybook is served: `/ftds/storybook` on the default GitHub Pages URL, `/storybook` on a custom domain.

### A release folder is missing from `r/`

`deploy:prepare` skips tags without a `registry.json` (releases from before the GitHub registry) and tags that aren't `vX.Y.Z` or `vX.Y.Z-prerelease`. Check the tag name and the **Pages** run log.

### Installs from GitHub fail with a rate-limit error

The CLI reads each file through the GitHub API: 60 requests an hour per IP address without a login. Run `gh auth login`, set `GH_TOKEN`, or install through the `@ftds` namespace instead.

### The Release workflow can't push the tag

Check **Workflow permissions** and any tag ruleset (see [One-time setup](#one-time-setup-on-github)).
