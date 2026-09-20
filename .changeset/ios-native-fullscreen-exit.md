---
"react-media-kit": patch
---

Fix iOS Safari native video fullscreen: `isFullscreen` now stays in sync when the user dismisses native fullscreen themselves, and `toggleFullscreen()` now correctly calls `webkitExitFullscreen()` to exit programmatically on iPhone instead of the standard Fullscreen API
