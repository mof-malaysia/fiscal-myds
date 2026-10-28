# myds-react (internal)

Source for the MYDS React components, hooks, icons and utilities.

**This package is not published to npm.** It is `private` and exists only inside this monorepo:

- `scripts/registry/generate-ui.ts` and `scripts/registry/generate-icons.ts` read `src/` to build the shadcn registry (`registry/ui`, `registry/icons`).
- `apps/docs` and `apps/storybook` consume it via `workspace:*`.

To use MYDS in a project, install components from the registry. See the [root README](../../README.md).
