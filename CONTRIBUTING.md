# Contributing to MYDS

Thank you for your interest in contributing to MYDS! We welcome all contributions that help improve the library, whether through bug fixes, new components, documentation, or discussions.

## Issue Reporting

If you've found a bug in MYDS that you'd like to fix, you may raise it in [Issues](https://github.com/govtechmy/myds/issues) first. After the bug is confirmed by our team, we may opt to resolve it ourselves or open it to the public (or you) to submit a pull request with the fix, depending on how critical the bug is.

We recommend searching the existing issues to avoid duplicates.

## New features

If there's a new feature you'd like to see added to MYDS, share your idea with us in the [Discussion](https://github.com/govtechmy/myds/discussions) forum to get it on our radar as something to consider for a future release.

Please note that we don't often accept pull requests for new features. Adding a new feature or component to MYDS requires us to think through the entire problem ourselves to make sure we agree with the proposed API, which means the feature needs to be high on our own priority list for us to be able to give it the attention it needs.

If you open a pull request for a new feature, we're likely to close it not because it's a bad idea, but because we aren't ready to prioritize the feature and don't want the PR to sit open for months or even years.

## Turborepo

MYDS is largely managed by [Turborepo](https://turbo.build/). If you would like contribute via code, we recommend learning to utilise the features of Turborepo to make your life easier, from running multiple dev servers, scope installs, using codegens and many more.

## Coding standards

Formatting is defined in [.prettierrc](./.prettierrc) and lint rules in [.oxlintrc.json](./.oxlintrc.json) ([oxlint](https://oxc.rs/docs/guide/usage/linter)). `apps/docs` is not linted.

```sh
pnpm run lint        # oxlint, fails on any warning
pnpm run lint:fix    # apply safe autofixes
pnpm run typecheck   # tsc --noEmit in every package, via Turborepo
```

## Git hooks

[Lefthook](https://lefthook.dev) installs the hooks when you run `pnpm install`. Before every commit it runs, in parallel:

- Prettier on staged `.ts`, `.tsx` and `.md` files, re-staging the fixes
- `pnpm lint` across the workspace
- `pnpm typecheck` across the workspace

A failing check blocks the commit. If the hooks are missing, run `pnpm exec lefthook install`. To skip them in an emergency, use `LEFTHOOK=0 git commit ...`, then run the checks yourself before opening a PR.

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
