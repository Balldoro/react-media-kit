# react-media-kit

## 0.3.0

### Minor Changes

- 6eaa5e5: Add feature detection flags - fullscreen, picture-in-picture, volume change (iOS-specific)
  Add 'playable' state when media element can actually start playing the source
  Prevent video playing while seeking by dragging
  Add official website links

## 0.2.0

### Minor Changes

- 4bf50e4: Add AudioPlayer
  Add support for general HTMLMediaElement
  Add missing `skipInterval` & `volumeInterval` props to `Player.Container`
  Add missing SSR snapshot for store
  Rename `VideoOverlay` component as `PlayerOverlay`
  Switch transform calculation for `Progress` to width updates
  Fix media and container refs re-bindings
