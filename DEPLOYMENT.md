# GitHub Pages Deployment Guide

This guide explains how to deploy the FTDS component registry and Storybook to GitHub Pages.

## Deployment Structure

The deployment is one GitHub Pages site:

```
https://mof-malaysia.github.io/ftds/
├── /                            → Registry landing page
├── /registry/                   → Registry JSON
│   ├── index.json               → Root index of the five registries
│   └── core|app|marketing|icons|style/
│       ├── index.json           → Catalog for that registry
│       └── styles/default/*.json
└── /storybook/                  → Storybook component browser
```

## Automatic Deployment

> **Status:** the workflow in `.github/workflows/deploy-gh-pages.yml` is currently commented out, so pushes to `main` do **not** deploy. Deploy manually (below) until it is re-enabled.

### Enabling it

1. Uncomment `.github/workflows/deploy-gh-pages.yml`.
2. On GitHub, go to **Settings** → **Pages** and set **Source** to **GitHub Actions**.
3. Push to `main`, or run the workflow from the **Actions** tab (`workflow_dispatch`).

### What the workflow does

1. Checks out the repo and sets up pnpm and Node.js 20 (`setup-node` caches the pnpm store)
2. `pnpm install --frozen-lockfile`
3. `pnpm run registry:build`
4. `pnpm run build:gh-pages` in `apps/storybook` (sets `BASE_PATH=/ftds/storybook`)
5. `pnpm run deploy:prepare`
6. Uploads `./deploy` and deploys it to GitHub Pages

It runs with `contents: read`, `pages: write` and `id-token: write`, and only one deployment runs at a time.

Deployments usually finish in a few minutes. Watch progress in the **Actions** tab.

## Manual Deployment

### 1. Build everything

```bash
pnpm registry:build                      # regenerate registry/
pnpm --filter @mof-malaysia/ftds-storybook build:gh-pages
pnpm deploy:prepare                      # assemble ./deploy
```

`deploy:prepare` copies `registry/` and `apps/storybook/dist` into `deploy/`, and writes the landing page, `404.html` and `.nojekyll`.

### 2. Push to the gh-pages branch

```bash
cd deploy
git init
git checkout -b gh-pages
git add .
git commit -m "Deploy to GitHub Pages"
git remote add origin git@github.com:mof-malaysia/ftds.git
git push -f origin gh-pages
```

### 3. Point GitHub Pages at it

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** and **/ (root)**, then **Save**

## Custom Domain (Optional)

1. Add a DNS CNAME record pointing to `mof-malaysia.github.io`:
   ```
   CNAME    ftds    mof-malaysia.github.io
   ```
2. In `scripts/deploy/prepare-gh-pages.ts`, uncomment and set `createCNAME("ftds.yourdomain.com");`.
3. The site is now served from the domain root, so change the Storybook base path in `apps/storybook/package.json`:
   ```json
   "build:gh-pages": "BASE_PATH=/storybook storybook build -o dist"
   ```
4. Rebuild registry items against the new host: `FTDS_REGISTRY_URL=https://ftds.yourdomain.com/registry pnpm registry:build`.
5. In **Settings** → **Pages**, enter the custom domain and enable **Enforce HTTPS**.

## Local Development

```bash
# Storybook dev server at http://localhost:6006
pnpm --filter @mof-malaysia/ftds-storybook dev

# Production build, served locally
pnpm --filter @mof-malaysia/ftds-storybook build
npx serve apps/storybook/dist
```

## Scripts Reference

| Command               | What it does                                                     |
| --------------------- | ---------------------------------------------------------------- |
| `pnpm registry:build` | Run every registry generator and write the `index.json` catalogs |
| `pnpm registry:clean` | Delete the generated registry output                             |
| `pnpm deploy:prepare` | Assemble `deploy/` from the registry and Storybook builds        |
| `pnpm deploy:clean`   | Delete `deploy/`                                                 |

## Troubleshooting

### Storybook 404s or broken assets

`BASE_PATH` must match where Storybook is served. On the default GitHub Pages URL that is `/ftds/storybook`; on a custom domain it is `/storybook`.

### Registry files return 404

1. Rebuild: `pnpm registry:build`
2. Check the files exist in `deploy/registry/<core|app|marketing|icons|style>/`
3. Check the deployment finished in the **Actions** tab (or that `gh-pages` was pushed)

### Workflow fails with a permissions error

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Re-run the workflow

### Custom domain not working

1. Check the CNAME record
2. Allow for DNS propagation (up to 24 hours)
3. Check `deploy/CNAME` exists
4. Check **Settings** → **Pages** shows the domain

## File Structure

```
ftds/
├── .github/workflows/
│   └── deploy-gh-pages.yml        # GitHub Pages workflow (currently disabled)
├── apps/storybook/
│   ├── .storybook/main.ts         # Reads BASE_PATH
│   └── package.json               # build:gh-pages script
├── registry/                      # Generated by pnpm registry:build
│   ├── index.json
│   └── core|app|marketing|icons|style/
├── scripts/
│   ├── registry/
│   │   ├── build-multi.ts         # pnpm registry:build entry point
│   │   ├── generate-components.ts # core, app and marketing tiers, utils, hooks
│   │   ├── generate-icons.ts      # Icons
│   │   ├── generate-style.ts      # ftds-init and the granular style items
│   │   ├── sync-exports.ts        # packages/react exports (pnpm components:sync-exports)
│   │   └── utils.ts
│   └── deploy/
│       └── prepare-gh-pages.ts    # pnpm deploy:prepare
└── deploy/                        # Generated, not committed
    ├── index.html                 # Landing page
    ├── 404.html
    ├── .nojekyll
    ├── CNAME                      # Only with a custom domain
    ├── registry/
    └── storybook/
```

## URLs

- **Landing**: `https://mof-malaysia.github.io/ftds/`
- **Storybook**: `https://mof-malaysia.github.io/ftds/storybook/`
- **Registry index**: `https://mof-malaysia.github.io/ftds/registry/index.json`
- **An item**: `https://mof-malaysia.github.io/ftds/registry/core/styles/default/button.json`

## Using the Registry

Users install items by full URL (the shadcn CLI has no `--registry` flag):

```bash
npx shadcn@latest init   # keep the default Base UI library
npx shadcn@latest add https://mof-malaysia.github.io/ftds/registry/style/styles/default/ftds-init.json
npx shadcn@latest add https://mof-malaysia.github.io/ftds/registry/core/styles/default/button.json --overwrite
```

See [REGISTRY.md](./REGISTRY.md) for the full guide.

## Rollback

With the workflow enabled, re-run the last good deployment from the **Actions** tab. Manually:

```bash
git checkout <good-commit>
pnpm install
pnpm registry:build
pnpm --filter @mof-malaysia/ftds-storybook build:gh-pages
pnpm deploy:prepare
# then push deploy/ to gh-pages as in Manual Deployment
```
