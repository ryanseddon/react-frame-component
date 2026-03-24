---
'react-frame-component': patch
---

Fix React 19 and Vite compatibility by externalizing react/jsx-runtime

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
