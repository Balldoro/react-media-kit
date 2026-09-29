---
"react-media-kit": patch
---

The player now tracks `durationchange`, so `durationInSec` stays current when the duration is set or refined after `loadedmetadata` (common with HLS/MSE engines). Previously `TimeDisplay.Duration`, remaining time, `skip()` clamping and the `Seekbar` kept using the duration read at `loadedmetadata`.
