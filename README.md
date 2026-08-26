# react-media-kit

Headless, unstyled video player primitives for React.

`react-media-kit` gives you the behavior of a video player — play/pause, seeking,
volume, buffering, fullscreen, picture-in-picture, playback rate, keyboard
shortcuts — as a set of composable components. It renders no CSS and imposes
no visual design, so your player looks exactly like whatever markup and
styles you give it.

## Features

- 🧱 **Compound components** — `Player`, `Video`, `Controls`, `Seekbar`,
  `Volume`, `TimeDisplay`, `PlayButton`, `SkipButton`, `FullscreenButton`,
  `PipButton`, `PlaybackRateButton`. Use only the parts you need.
- 🎨 **Unstyled by default** — no shipped CSS, no default theme. Style
  everything yourself with plain class names.
- 🏷️ **Data-attribute state hooks** — playing, fullscreen, picture-in-picture,
  and other states are exposed as `data-*` attributes, so state-driven styling
  stays in CSS instead of JS.
- ⌨️ **Keyboard shortcuts** built in (play/pause, mute, fullscreen, seeking).
- 📦 **Small footprint** — no runtime dependencies beyond React, and tree-shakeable.
- ⚡ **Optimized for performance** — player state lives outside React in an
  external store; components subscribe to only the slice of state they use,
  minimizing re-renders.
- 🔒 **Typed** — written in TypeScript, ships its own types.

## Installation

```sh
npm install react-media-kit
```

```sh
pnpm add react-media-kit
```

Requires React and React DOM `>=19`.

## Usage

```tsx
import { Player, Video, Controls, Seekbar, PlayButton, TimeDisplay } from "react-media-kit";

function App() {
  return (
    <Player.Root>
      <Player.Container>
        <Video.Root>
          <Video.Player src="/my-video.mp4" />
        </Video.Root>

        <Controls.Root>
          <Seekbar.Root>
            <Seekbar.Track>
              <Seekbar.Progress />
              <Seekbar.Buffer />
              <Seekbar.Thumb />
            </Seekbar.Track>
          </Seekbar.Root>

          <PlayButton.Root>Play</PlayButton.Root>

          <TimeDisplay.Root>
            <TimeDisplay.Toggle>
              <TimeDisplay.Timer />
              <span>/</span>
              <TimeDisplay.Duration />
            </TimeDisplay.Toggle>
          </TimeDisplay.Root>
        </Controls.Root>
      </Player.Container>
    </Player.Root>
  );
}
```

All styling is up to you — target elements by class name or by the `data-*`
state attributes they expose (e.g. `[data-fullscreen]`, `[data-pip]`).

## Core Concepts

Each control is a **root + sub-parts**, in the spirit of BaseUI-style
primitives:

| Component            | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `Player`             | Top-level provider; owns player state       |
| `Video`              | The `<video>` element and its overlay       |
| `Controls`           | Wrapper for the control bar                 |
| `Seekbar`            | Scrub/seek, with progress and buffer ranges |
| `Volume`             | Mute toggle and volume slider               |
| `TimeDisplay`        | Current time / duration                     |
| `PlayButton`         | Play/pause toggle                           |
| `SkipButton`         | Skip forward/back by an interval            |
| `FullscreenButton`   | Toggle fullscreen                           |
| `PipButton`          | Toggle picture-in-picture                   |
| `PlaybackRateButton` | Set a specific playback rate                |

## License

MIT
