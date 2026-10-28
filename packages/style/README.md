# myds-style

> ⚠️ **DEPRECATED**: This package is no longer maintained. Please use MYDS v2 via shadcn registry instead.

![myds-hero-img](https://d2391uizq0pg2.cloudfront.net/design/myds-hero-img.png)

---

## 🚨 Migration Notice

This npm package (`@mof-malaysia/myds-style`) has been **deprecated** in favor of a modern, registry-based distribution via shadcn CLI.

### Why the change?

- ✅ **No npm dependencies** - Full ownership of your styles
- ✅ **Tailwind v4 native** - CSS-based configuration
- ✅ **Better customization** - Modify styles directly in your codebase
- ✅ **Dark mode support** - Built-in light/dark theme system
- ✅ **Granular control** - Install only what you need

### Migrate to MYDS v2

Instead of installing this package:

```bash
# ❌ Old way (deprecated)
npm install @mof-malaysia/myds-style
```

Use the new registry-based installation:

```bash
# ✅ New way (recommended)
npx shadcn@latest add myds-init --registry=https://mof-malaysia.github.io/fiscal-myds/registry/style
```

For full migration instructions, see the [main README](../../README.md#migration-from-v1-npm).

---

## Old Documentation (v1)

> The Malaysian Government Design System (MYDS) is an open-source design system to build products for the Malaysian government. It contains the design guideline and the component library for creating consistent and accessible digital services.

## Getting started

To install `@mof-malaysia/myds-style` in your project, run the installation command for the package manager of your choice:

```bash
# npm
npm i @mof-malaysia/myds-style

# yarn
yarn add @mof-malaysia/myds-style

# pnpm
pnpm add @mof-malaysia/myds-style
```

## Usage

The package provides styling necessary to support MYDS implementation for your project. Using it is as simple as:

A. Import via CSS

```ts
/* Place in the CSS entry point */
@import "@mof-malaysia/myds-tailwindcss/full.css";
```

B. Import via JS (Bundler)

```ts
// Place in the bundle entry point (eg. index.{ts,js})
import "@mof-malaysia/myds-tailwindcss/full.css";
```

MYDS is an open-source project and welcomes contributions from the public. To contribute:

1. **Discuss New Features**: Before submitting a pull request (PR), please open an issue to discuss the feature you would like to add or change. This helps to ensure that your contribution aligns with the project's goals and guidelines.
2. **Submit a PR**: Once the feature has been discussed and approved, you can submit a PR with your changes. Please follow the contribution guidelines provided in the repository.

We look forward to collaborating with you to improve MYDS.

---
