---
'react-frame-component': patch
---

## Fix race condition in getMountTarget() (issue #250)

Fixed "Cannot read properties of null" errors when `initialContent` changes rapidly by adding null checks for `doc` and `doc.body` in `getMountTarget()`.

### Changes

- **src/Frame.jsx**: Added null check in `getMountTarget()` to handle cases when iframe document is temporarily unavailable during rapid rerenders
