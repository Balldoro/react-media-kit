---
"react-media-kit": patch
---

`SkipButton.Root` now throws a `ReactMediaKitError` when `skipInterval` is below 1 (or `NaN`).
