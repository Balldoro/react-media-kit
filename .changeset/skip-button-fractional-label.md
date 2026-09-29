---
"react-media-kit": patch
---

`SkipButton.Root` now floors a decimal `skipInterval` to a whole second for the skip itself, matching its label. Previously `skipInterval={2.65}` was announced as "2 seconds" but skipped 2.65
