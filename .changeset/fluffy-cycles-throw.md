---
'react-frame-component': minor
---

Add fallback to document.write() for initial frame rendering via dangerouslyUseDocWrite prop to support libraries like Repcaptcha and Google Maps that depend on the frame's location/origin.
