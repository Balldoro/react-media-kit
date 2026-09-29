---
"react-media-kit": patch
---

`SkipButton.Root`, `Seekbar.Root` and `Player.Container` now floor a decimal `skipInterval` to a whole second. Previously `SkipButton.Root` with `skipInterval={2.65}` was announced as "2 seconds" but skipped 2.65.
