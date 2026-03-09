---
'react-frame-component': major
---

Migrate codebase to TypeScript with React 19 support

Migrates all source files from JavaScript/JSX to TypeScript/TSX with full type safety.

**Breaking changes:**

- Minimum React version bumped from 16.8 to 17.0

**New features:**

- Full TypeScript support with exported `FrameProps` type
- React 19 support added to peer dependencies

**Deprecations (will be removed in next major version):**

- `contentDidMount` → use `onMount` instead
- `contentDidUpdate` → use `onUpdate` instead

**Internal changes:**

- Content component converted from class to functional component
- Build pipeline updated to emit TypeScript declarations
