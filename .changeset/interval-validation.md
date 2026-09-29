---
"react-media-kit": patch
---

Interval props are now validated and throw a `ReactMediaKitError` on invalid values:

- `skipInterval` on `SkipButton.Root`, `Seekbar.Root` and `Player.Container` must be a finite number of at least 1.
- `volumeInterval` on `Volume.Slider` and `Player.Container` must be a finite number greater than 0 and at most 1.
