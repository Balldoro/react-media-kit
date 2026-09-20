# react-media-kit

Headless, unstyled React primitives for building custom video/audio player UIs. Consumers compose the exported parts (`Media.*`, `Player.*`, `Controls`, `Seekbar`, ...) around their own markup and styling; the library owns state derivation and browser/DOM quirks, not visual output.

## Language

**Poster** (`Media.Poster`):
A responsive placeholder image shown over the media element before playback has ever started and, optionally, after it ends. Renders a bare `<img>`, or a spec-correct `<picture>` when art-directed `sources` are supplied. Purely presentational — no pointer/keyboard interaction, unlike `Player.Overlay`.
_Avoid_: cover art, thumbnail (reserve those for describing the image content itself, not this component)

**hasStarted**:
A `PlayerState` fact meaning "playback has begun at least once since the media was last attached/reset." One-way: set `true` on the native `play` event, only cleared by `RESET` (media detach/swap) — never by `pause`. Distinct from `isPlaying`, which is instantaneous and flips both ways.
_Avoid_: hasPlayed (reads ambiguously as "finished playing")

**isEnded**:
A `PlayerState` fact meaning "the media is currently in the ended state," true from the native `ended` event until the next `play`. Instantaneous like `isPlaying`, not one-way like `hasStarted`.

**`has*` flag** (naming convention):
A `PlayerState` boolean meaning "has this occurred at least once since the last reset" — monotonic until `RESET`. Contrasts with the existing `is*` convention (`isPlaying`, `isMuted`, `isBuffering`, ...) for facts that are true only right now.
