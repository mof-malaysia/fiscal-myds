# Contributing to FTDS

Thank you for your interest in contributing to FTDS! We welcome all contributions that help improve the library, whether through bug fixes, new components, documentation, or discussions.

## Issue Reporting

If you've found a bug in FTDS that you'd like to fix, you may raise it in [Issues](https://github.com/mof-malaysia/ftds/issues) first. After the bug is confirmed by our team, we may opt to resolve it ourselves or open it to the public (or you) to submit a pull request with the fix, depending on how critical the bug is.

We recommend searching the existing issues to avoid duplicates.

## New features

If there's a new feature you'd like to see added to FTDS, share your idea with us in the [Discussions](https://github.com/mof-malaysia/ftds/discussions) forum to get it on our radar as something to consider for a future release.

Please note that we don't often accept pull requests for new features. Adding a new feature or component to FTDS requires us to think through the entire problem ourselves to make sure we agree with the proposed API, which means the feature needs to be high on our own priority list for us to be able to give it the attention it needs.

If you open a pull request for a new feature, we're likely to close it not because it's a bad idea, but because we aren't ready to prioritize the feature and don't want the PR to sit open for months or even years.

## Turborepo

FTDS is largely managed by [Turborepo](https://turbo.build/). If you would like contribute via code, we recommend learning to utilise the features of Turborepo to make your life easier, from running multiple dev servers to scoped installs and many more.

## Coding standards

Formatting is defined in [.oxfmtrc.json](./.oxfmtrc.json) ([oxfmt](https://oxc.rs/docs/guide/usage/formatter)) and lint rules in [.oxlintrc.json](./.oxlintrc.json) ([oxlint](https://oxc.rs/docs/guide/usage/linter)). `apps/docs` is not linted.

```sh
pnpm run lint        # oxlint, fails on any warning
pnpm run lint:fix    # apply safe autofixes
pnpm run typecheck   # tsc --noEmit in every package, via Turborepo
```

## Icons

Icons are generated from SVGs. Add or edit a file in [packages/react/src/svg/icons](./packages/react/src/svg/icons) (dash-case, e.g. `arrow-back.svg`), then run:

```sh
pnpm run icons:generate
```

This rewrites `packages/react/src/icons/*.tsx` and its `index.ts`, so don't edit those files by hand. `#18181B` fills and strokes become `currentColor`.

## Component docs

Every component, block, `utils` and `hooks` has a hand-written doc next to its source (`packages/react/src/components/<tier>/<name>.md`). The docs build `llms.txt` for coding agents and give each registry item its title and description. A doc has frontmatter (`title`, `description`, `category`) and three sections: **When to use**, **Usage** and **Notes**. The props table is generated from the TypeScript source, so don't write one. See `button.md` for the pattern.

- Every ` ```tsx ` example is a complete module and must typecheck: `pnpm llms:check`.
- `pnpm llms:build` fails if a component has no doc, or a doc names an export that doesn't exist.
- Rebuild the registry after changing a doc's title or description: `pnpm registry:build`.

Guides for agents live in `docs/guides/`, and the rules at the top of `llms.txt` in `docs/llms-intro.md`.

## Git hooks

[Lefthook](https://lefthook.dev) installs the hooks when you run `pnpm install`. They are the project's checks: there is no CI workflow.

Before every commit, in parallel:

- oxfmt on staged `.ts`, `.tsx` and `.md` files, re-staging the fixes
- `pnpm lint` across the workspace
- `pnpm typecheck` across the workspace

Before every push:

- `registry/` matches `pnpm registry:build`, and `pnpm registry:validate` passes
- `pnpm llms:check`: every component has a doc and every docs example typechecks
- In parallel, the Storybook build, the docs build, and the playground's tests and build

A failing check blocks the commit or push. The push checks read the working tree, so commit or stash other changes first. Run them by hand with `pnpm exec lefthook run pre-push --force`. If the hooks are missing, run `pnpm exec lefthook install`. To skip them in an emergency, use `LEFTHOOK=0 git commit ...` or `LEFTHOOK=0 git push ...`, then run the checks yourself before opening a PR.

## Submitting a Pull Request (PR)

1. **Ensure Checks Pass**:
   ```sh
   pnpm run lint && pnpm run typecheck
   ```
2. **Format Code**:

   ```sh
   pnpm run format
   ```

3. **Push Your Changes**:
   ```sh
   git push origin feature/your-feature-name
   ```
4. **Open a Pull Request**:
   - Go to the repository on GitHub.
   - Click "New pull request".
   - Fill out the PR template.
   - Link to relevant issues.
   - Request a review from a maintainer.

## Questions?

Feel free to open a discussion or reach out to the maintainers.

Thank you for contributing! 🎉
