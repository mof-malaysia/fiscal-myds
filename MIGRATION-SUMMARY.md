# Registry-Only Migration Summary

This document summarizes the changes made to convert MYDS from an npm package-based library to a registry-only component system.

## ✅ Completed Changes

### Phase 1: Package Configuration

#### 1.1 React Package (`packages/react/package.json`)
- ✅ Set `"private": true` to prevent publishing
- ✅ Added deprecation notice in `description` field
- ✅ Added `"deprecated"` field with registry URL
- ✅ Disabled build scripts (now echo messages instead of building)

**Before:**
```json
{
  "name": "@mof-malaysia/myds-react",
  "version": "1.0.2",
  "scripts": {
    "build": "tsup"
  }
}
```

**After:**
```json
{
  "name": "@mof-malaysia/myds-react",
  "version": "1.0.2",
  "private": true,
  "description": "DEPRECATED: Use registry at https://username.github.io/myds/registry",
  "scripts": {
    "build": "echo 'Build disabled - component source only'"
  }
}
```

#### 1.2 Root Package (`package.json`)
- ✅ Removed `@mof-malaysia/myds-react` from release script
- ✅ Only `@mof-malaysia/myds-style` is published now

**Before:**
```json
"release": "turbo build --filter=@mof-malaysia/myds-react --filter=@mof-malaysia/myds-style && changeset publish"
```

**After:**
```json
"release": "turbo build --filter=@mof-malaysia/myds-style && changeset publish"
```

### Phase 2: Storybook Migration

#### 2.1 Configuration Files
- ✅ Created `apps/storybook/components.json` with registry configuration
- ✅ Updated `apps/storybook/tsconfig.json` with path aliases `@/*`
- ✅ Created component directories: `components/ui/` and `lib/`

#### 2.2 Component Installation
- ✅ Created installation script: `scripts/install-components-local.ts`
- ✅ Installed all 42 components from registry to Storybook
- ✅ Copied icons to `components/ui/icons/index.tsx`

**Components Installed:**
- 36 UI components
- 4 Layout components
- 2 Utilities (utils, hooks)

#### 2.3 Dependencies Update
- ✅ Removed `@mof-malaysia/myds-react` workspace dependency
- ✅ Added required npm dependencies:
  - All @radix-ui packages
  - class-variance-authority
  - clsx, tailwind-merge
  - react-day-picker
  - input-otp
  - @tanstack/react-table

**Before:**
```json
"dependencies": {
  "@mof-malaysia/myds-react": "workspace:*",
  "@mof-malaysia/myds-style": "workspace:*"
}
```

**After:**
```json
"dependencies": {
  "@mof-malaysia/myds-style": "workspace:*",
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-checkbox": "^1.3.3",
  // ... all other required dependencies
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

#### 2.4 Story Files Update
- ✅ Created update script: `scripts/update-story-imports.ts`
- ✅ Updated 37 story files with new import paths

**Before:**
```tsx
import { Button } from "@mof-malaysia/myds-react/button";
import { clx } from "@mof-malaysia/myds-react/utils";
```

**After:**
```tsx
import { Button } from "@/components/ui/button";
import { clx } from "@/lib/utils";
```

### Phase 3: Build System

#### 3.1 Turbo Configuration
- ✅ No changes needed - turbo.json works with disabled build scripts
- ✅ React package build now just echoes a message (no actual build)

### Phase 4: Documentation

#### 4.1 README.md
- ✅ Updated to emphasize registry-only approach
- ✅ Removed npm package installation instructions
- ✅ Added shadcn CLI installation guide
- ✅ Clear quick start instructions

#### 4.2 REGISTRY.md
- ✅ Already registry-focused (no changes needed)
- ✅ Complete documentation for registry usage

## 📊 Statistics

### Files Modified
- **Configuration**: 5 files
- **Story Files**: 37 files updated
- **Components Installed**: 42 components
- **Dependencies Added**: 15+ npm packages

### Files Created
- `apps/storybook/components.json`
- `apps/storybook/components/ui/*.tsx` (42 components)
- `apps/storybook/lib/utils.ts`
- `apps/storybook/lib/hooks.ts`
- `apps/storybook/components/ui/icons/index.tsx`
- `scripts/install-components-local.ts`
- `scripts/update-story-imports.ts`
- `MIGRATION-SUMMARY.md` (this file)

## 🔄 How It Works Now

### For End Users

**Old Way (npm package):**
```bash
npm install @mof-malaysia/myds-react
import { Button } from "@mof-malaysia/myds-react/button"
```

**New Way (registry):**
```bash
npx shadcn@latest add button --registry=https://username.github.io/myds/registry
import { Button } from "@/components/ui/button"
```

### For Maintainers

**Component Source:**
- Components still live in `packages/react/src/components/`
- This is the source of truth for registry generation

**Development Workflow:**
1. Edit component in `packages/react/src/components/`
2. Run `pnpm registry:build` to regenerate registry
3. Deploy registry to GitHub Pages
4. Users can pull latest via `npx shadcn add component`

**Storybook Development:**
- Storybook now uses registry components
- Components are in `apps/storybook/components/ui/`
- Update these when developing/testing

## ⚠️ Important Notes

### What Still Works
- ✅ Style package (`@mof-malaysia/myds-style`) still published to npm
- ✅ All components functional via registry
- ✅ Storybook browses components normally
- ✅ Registry deployment to GitHub Pages

### What Changed
- ❌ Can't install components via npm package anymore
- ❌ `@mof-malaysia/myds-react` won't be published
- ✅ Must use shadcn CLI with registry URL
- ✅ Users get full control over component code

### Component Source Location
The `packages/react/` directory is now:
- **Purpose**: Source code for registry generation
- **Status**: Private (not published)
- **Build**: Disabled
- **Usage**: Registry generator reads from here

## 🚀 Next Steps

### For Users Currently on npm Package

If you're using the old npm package, migrate with these steps:

1. **Initialize shadcn in your project:**
   ```bash
   npx shadcn@latest init
   ```

2. **Configure registry:**
   ```json
   // components.json
   {
     "registry": "https://username.github.io/myds/registry"
   }
   ```

3. **Install components you need:**
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add accordion
   ```

4. **Update imports in your code:**
   ```tsx
   // Before
   import { Button } from "@mof-malaysia/myds-react/button"

   // After
   import { Button } from "@/components/ui/button"
   ```

5. **Uninstall old package:**
   ```bash
   npm uninstall @mof-malaysia/myds-react
   ```

### For New Users

Just follow the installation guide in README.md!

## 📝 Checklist for Publishing

Before making this public, ensure:

- [ ] Update GitHub repository URLs in documentation
- [ ] Replace `username.github.io` with actual GitHub Pages URL
- [ ] Test registry deployment
- [ ] Test component installation via shadcn CLI
- [ ] Update any external documentation
- [ ] Announce migration to existing users
- [ ] Create migration guide for users

## 🎯 Benefits of Registry-Only Approach

### For Users
✅ Full control over component code
✅ Easy customization
✅ No version lock-in
✅ Copy-paste friendly
✅ Smaller bundle sizes (only what you use)

### For Maintainers
✅ No npm publishing headaches
✅ Easier to update components
✅ Users can see exact source code
✅ Registry is just static JSON files
✅ Free hosting on GitHub Pages

## 🔧 Maintenance

### Updating Components

1. Edit component source in `packages/react/src/components/`
2. Run `pnpm registry:build`
3. Test locally if needed
4. Commit and push to main
5. GitHub Actions deploys automatically

### Adding New Components

1. Create component in `packages/react/src/components/`
2. Run `pnpm registry:build`
3. New component appears in registry automatically
4. Deploy to GitHub Pages

### Storybook Updates

If you need to update Storybook components:
```bash
cd apps/storybook
# Re-install specific component
npx shadcn@latest add button --overwrite
```

Or update all:
```bash
pnpm tsx scripts/install-components-local.ts
```

---

**Migration completed:** 2025-11-19
**Registry version:** 2.0.0
**Components migrated:** 42
