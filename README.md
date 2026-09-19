# [react-media-kit](https://react-media-kit.com)

Headless, unstyled video and audio player primitives for React.

`react-media-kit` gives you the behavior of a media player as a set of composable components.
It renders no CSS and imposes no visual design, so your player looks exactly however you want!

## Features

- 🧱 **Compound components** - `Player`, `Media`, `Controls`, `Seekbar`,
  `Volume`, `TimeDisplay`, `PlayButton`, `SkipButton`, `FullscreenButton`,
  `PipButton`, `PlaybackRateButton`. Use only the parts you need.
- 🎨 **Unstyled by default** - no shipped CSS, no default theme. Style
  everything yourself with plain class names.
- 🏷️ **Data-attribute state hooks** - playing, fullscreen, picture-in-picture,
  and other states are exposed as `data-*` attributes, so state-driven styling
  stays in CSS instead of JS.
- ⌨️ **Keyboard shortcuts** built in (play/pause, mute, fullscreen, seeking).
- 📺 **Bring your own streaming engine** - an `attachEngine` prop hands the media
  element to hls.js, dash.js, shaka-player, or anything else.
- 📦 **Small footprint** - Tree-shakeable, with no runtime dependencies beyond React.
- ⚡ **Optimized for performance** - player state lives outside React in an
  external store; components subscribe to only the slice of state they need.
- 🔒 **Typed** - written in TypeScript.

## Installation

```sh
npm install react-media-kit
```

```sh
pnpm add react-media-kit
```

```sh
yarn add react-media-kit
```

Requires React and React DOM `>=19.2`.

## Usage

```tsx
import {
  Player,
  Media,
  Controls,
  Seekbar,
  Volume,
  PlayButton,
  SkipButton,
  TimeDisplay,
  FullscreenButton,
  PipButton,
} from "react-media-kit";

function App() {
  return (
    <Player.Root>
      <Player.Container className="player">
        <Media.Video src="/my-video.mp4" className="video" playsInline />
        <Player.Overlay label="Toggle playback" className="overlay" />
        <Controls.Root className="controls">
          <Seekbar.Root className="seekbar">
            <Seekbar.Track className="seekbar-track">
              <Seekbar.Buffer className="seekbar-buffer" />
              <Seekbar.Progress className="seekbar-progress" />
              <Seekbar.Thumb className="seekbar-thumb" />
            </Seekbar.Track>
          </Seekbar.Root>

          <PlayButton.Root>Play</PlayButton.Root>

          <SkipButton.Root direction="back">-10</SkipButton.Root>
          <SkipButton.Root direction="forward">+10</SkipButton.Root>

          <Volume.Mute>Mute</Volume.Mute>
          <Volume.Slider className="volume">
            <Volume.Track className="volume-track">
              <Volume.Progress className="volume-progress" />
              <Volume.Thumb className="volume-thumb" />
            </Volume.Track>
          </Volume.Slider>

          <TimeDisplay.Root>
            <TimeDisplay.Toggle>
              <TimeDisplay.Timer />
              <span>/</span>
              <TimeDisplay.Duration />
            </TimeDisplay.Toggle>
          </TimeDisplay.Root>

          <PipButton.Root>PiP</PipButton.Root>
          <FullscreenButton.Root>Fullscreen</FullscreenButton.Root>
        </Controls.Root>
      </Player.Container>
    </Player.Root>
  );
}
```

All styling is up to you — target elements by class name or by the `data-*`
state attributes they expose.

### Adaptive streaming

`react-media-kit` ships no streaming engine (HLS, DASH, ...) — it stays
dependency-free. Pass an `attachEngine` function to `Media.Video` or
`Media.Audio` instead of a `src`: it receives the media element once it
mounts, and may return a cleanup function that runs on unmount.

```tsx
import Hls from "hls.js";
import { Media, type MediaEngine } from "react-media-kit";

const attachHls: MediaEngine<HTMLVideoElement> = (media) => {
  if (media.canPlayType("application/vnd.apple.mpegurl")) {
    media.src = "/hls/master.m3u8";
    return;
  }

  const hls = new Hls();
  hls.loadSource("/hls/master.m3u8");
  hls.attachMedia(media);

  return () => hls.destroy();
};

<Media.Video attachEngine={attachHls} playsInline />;
```

## Core Concepts

Each control is a **root + sub-parts**, in the spirit of BaseUI-style
primitives:

| Component            | Purpose                                     |
| -------------------- | ------------------------------------------- |
| `Player`             | Provider, layout shell, tap/click surface   |
| `Media`              | The `<video>` / `<audio>` element           |
| `Controls`           | Wrapper for the control bar                 |
| `Seekbar`            | Scrub/seek, with progress and buffer ranges |
| `Volume`             | Mute toggle and volume slider               |
| `TimeDisplay`        | Current time / duration                     |
| `PlayButton`         | Play/pause toggle                           |
| `SkipButton`         | Skip forward/back by an interval            |
| `FullscreenButton`   | Toggle fullscreen                           |
| `PipButton`          | Toggle picture-in-picture                   |
| `PlaybackRateButton` | Set a specific playback rate                |

## Reading and driving state

Two hooks expose the player store. Both must be called **inside** `Player.Root`

`usePlayer(selector)` subscribes to a single slice of state and re-renders only
when that slice changes:

```tsx
import { usePlayer } from "react-media-kit";

function PlayIcon() {
  const isPlaying = usePlayer((s) => s.isPlaying);
  return <span>{isPlaying ? "⏸" : "▶"}</span>;
}
```

`usePlayerControls()` returns the imperative controls

```tsx
import { usePlayerControls } from "react-media-kit";

function Rate() {
  const { setPlaybackRate } = usePlayerControls();
  return <button onClick={() => setPlaybackRate(1.5)}>1.5×</button>;
}
```

## License

MIT
