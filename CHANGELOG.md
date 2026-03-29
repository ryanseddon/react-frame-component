# react-frame-component

## 5.3.2

### Patch Changes

- f191d58: Add types condition to package.json exports to fix TypeScript resolution with TSGo and modern ESM tools
- 1820bc3: ## Fix race condition in getMountTarget() (issue #250)

  Fixed "Cannot read properties of null" errors when `initialContent` changes rapidly by adding null checks for `doc` and `doc.body` in `getMountTarget()`.

  ### Changes
  - **src/Frame.jsx**: Added null check in `getMountTarget()` to handle cases when iframe document is temporarily unavailable during rapid rerenders

## 5.3.1

### Patch Changes

- 14c215c: Fix React 19 and Vite compatibility by externalizing react/jsx-runtime

  The ESM and UMD builds were incorrectly bundling react/jsx-runtime inline from CommonJS source,
  which caused two issues:
  1. **ESM builds contained `__require("react")` calls** - This failed in browser ESM environments
     with "Could not dynamically require react" errors when using Vite.
  2. **UMD builds referenced `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner`** -
     This internal API was removed in React 19, causing "Cannot read properties of undefined" errors.

  The fix adds `react/jsx-runtime` and `react/jsx-dev-runtime` to the external dependencies list
  in the Vite configuration. This ensures the JSX transform is loaded from the proper module format
  rather than being bundled inline from CJS source.

  **Bundle size improvements:**
  - ESM: 35.7 KB → 4.6 KB (-87%)
  - UMD: 37.9 KB → 6.8 KB (-82%)

  Fixes #280

## 5.3.0

### Minor Changes

- 8d922c3: Add fallback to document.write() for initial frame rendering via dangerouslyUseDocWrite prop to support libraries like Repcaptcha and Google Maps that depend on the frame's location/origin.
