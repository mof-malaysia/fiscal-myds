# ftds-style (internal)

Source for the FTDS colour tokens, light/dark themes, Tailwind v4 config and base styles, and for the cva variants the React and Astro components share.

**This package is not published to npm.** It is `private` and exists only inside this monorepo:

- `scripts/registry/generate-style.ts` reads `styles/` to build the shadcn style registry (`registry/style`, including `ftds-init`).
- `apps/docs` and `apps/storybook` consume it via `workspace:*`.
- `variants/<name>.ts` holds the classes of components that exist in both `packages/react` and `packages/astro`. Both import them as `@mof-malaysia/ftds-style/variants/<name>`. The registry generators ship each file inside the items that use it, installed as `components/ui/<name>.variants.ts`. Change a component's look here, once, for both stacks.

To use FTDS in a project, install styles from the registry. See the [root README](../../README.md).
