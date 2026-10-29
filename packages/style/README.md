# ftds-style (internal)

Source for the FTDS colour tokens, light/dark themes, Tailwind v4 config and base styles.

**This package is not published to npm.** It is `private` and exists only inside this monorepo:

- `scripts/registry/generate-style.ts` reads `styles/` to build the shadcn style registry (`registry/style`, including `ftds-init`).
- `apps/docs` and `apps/storybook` consume it via `workspace:*`.

To use FTDS in a project, install styles from the registry. See the [root README](../../README.md).
