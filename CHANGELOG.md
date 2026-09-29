# react-media-kit

## 0.5.0

### Minor Changes

- fd707ce: Replace `Video` and `Audio` exports with a single `Media` namespace
  Add `attachEngine` prop to `Media.Video` & `Media.Audio` for attaching streaming engines
  Add `MediaEngine` type export - an engine receives the media element and may return a cleanup function
  Sync player state from an already-loaded media element on attach
- 75b84db: Add `Media.Poster` component for a responsive placeholder image/album art, composed as a sibling inside `Player.Container`
  Add `hasStarted`/`isEnded` fields to `PlayerState`
- 240ce45: Require React and React DOM `>=19.2` - `useEffectEvent` is used internally and is only stable from that version
- 5cb8ba8: `TimeDisplay.Timer` no longer requires `TimeDisplay.Root`. Without one it shows the elapsed time; `TimeDisplay.Root` is only needed to toggle or share the timer mode

### Patch Changes

- 911a280: Interval props are now validated and throw a `ReactMediaKitError` on invalid values:

  - `skipInterval` on `SkipButton.Root`, `Seekbar.Root` and `Player.Container` must be a finite number of at least 1.
  - `volumeInterval` on `Volume.Slider` and `Player.Container` must be a finite number greater than 0 and at most 1.

- 9f174f6: Fix iOS Safari native video fullscreen: `isFullscreen` now stays in sync when the user dismisses native fullscreen themselves, and `toggleFullscreen()` now correctly calls `webkitExitFullscreen()` to exit programmatically on iPhone instead of the standard Fullscreen API
- 5cb8ba8: `SkipButton.Root`, `Seekbar.Root` and `Player.Container` now floor a decimal `skipInterval` to a whole second. Previously `SkipButton.Root` with `skipInterval={2.65}` was announced as "2 seconds" but skipped 2.65.
- 5cb8ba8: Fix `TimeDisplay.Toggle` rendering `data-elapsed-mode="false"` in remaining mode. The attribute is now removed instead, like every other state attribute, so `[data-elapsed-mode]` selectors only match elapsed mode
- bf8f9d1: The player now tracks `durationchange`, so `durationInSec` stays current when the duration is set or refined after `loadedmetadata` (common with HLS/MSE engines). Previously `TimeDisplay.Duration`, remaining time, `skip()` clamping and the `Seekbar` kept using the duration read at `loadedmetadata`.

## 0.4.0

### Minor Changes

- f3980c1:
  - Add fullscreen enabling support for iPhone iOS
  - Fix non-responsive fullscreen toggle before video play on iPhone iOS
  - Fix broken timeupdate event sending after seeking before video play on iPhone iOS
  - Change `supportsFullscreen` flag to union type `"container" | "media" | null`
  - Remove `"ready"` state in favor of `"playable"`
  - Refactor feature detection flags - they no longer affect `state` field
  - Replace bare `Error` throwing with new `ReactMediaKitError` class

## 0.3.0

### Minor Changes

- 6eaa5e5:
  - Add feature detection flags - fullscreen, picture-in-picture, volume change (iOS-specific)
  - Add `'playable'` state when media element can actually start playing the source
  - Prevent video playing while seeking by dragging
  - Add official website links

## 0.2.0

### Minor Changes

- 4bf50e4:
  - Add AudioPlayer
  - Add support for general HTMLMediaElement
  - Add missing `skipInterval` & `volumeInterval` props to `Player.Container`
  - Add missing SSR snapshot for store
  - Rename `VideoOverlay` component as `PlayerOverlay`
  - Switch transform calculation for `Progress` to width updates
  - Fix media and container refs re-bindings
