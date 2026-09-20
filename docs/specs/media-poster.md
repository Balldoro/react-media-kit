# Media Poster

## Problem Statement

Consumers building a video player with `react-media-kit` have no responsive way to show a placeholder image while media is loading. The native `<video poster>` attribute takes a single URL — there is no `srcset`/art-direction equivalent — so anyone who needs different poster images at different breakpoints has to hand-roll their own `matchMedia` breakpoint-switching logic outside the library (this repo's own demo has an abandoned `usePosterSrc()` hook doing exactly that, with a comment noting the exact limitation). `<audio>` has no native `poster` attribute at all, so audio players have no equivalent for album art. Native poster also never reappears once playback has started, even after the media ends, so there's no built-in way to show an end-card/replay placeholder either.

## Solution

Add a new `Media.Poster` component, published alongside `Media.Video`/`Media.Audio`. It's composed by the consumer as a sibling inside `Player.Container`, the same way `Player.Overlay` already is. It renders a bare `<img>` for the simple single-image case, or a spec-correct `<picture>` (art-directed `<source>` elements followed by the mandatory fallback `<img>`) when responsive sources are supplied — fully mirroring native `<picture>`'s own attribute shapes, not a bespoke config API. Its visibility is derived automatically from two new playback-history facts added to the shared player store, `hasStarted` and `isEnded`, and controlled via a `visibleWhen` prop (`"pending" | "ended" | "both"`, default `"pending"`, matching native poster's default of "shown until the first play").

## User Stories

1. As a library consumer building a video player, I want to show a responsive poster image before playback starts, so that different screen sizes get an appropriately sized/art-directed image instead of one fixed URL.
2. As a library consumer building a video player, I want to optionally show a placeholder image again after playback ends, so that I can present a replay/end-card experience.
3. As a library consumer building an audio player, I want to show album artwork before playback starts, even though the native `<audio>` element has no `poster` attribute, so that my audio player has a visual identity while loading.
4. As a library consumer, I want the poster to accept the same `<source>`/`<img>` attribute shapes as native `<picture>`, so that I don't need to learn a bespoke responsive-image API.
5. As a library consumer, I want the simple single-image case to require only `src`/`alt`, so that I don't have to write `<picture>` boilerplate when I don't need art direction.
6. As a library consumer, I want standard native `<img>` attributes (`decoding`, `width`, `height`, `loading`, `sizes`, etc.) to pass through on the fallback image, so that I retain full control over image loading/perf behavior.
7. As a library consumer, I want the poster to disappear automatically once playback starts, without wiring my own event listeners, so that I don't duplicate logic the library already owns.
8. As a library consumer, I want the poster to reappear if media is replayed after it ends (when opted in), so that the end-card experience is consistent across repeated plays.
9. As a library consumer, I want the poster to never intercept pointer/keyboard events meant for `Player.Overlay` or other controls, so that clicking anywhere over the poster still toggles playback as expected.
10. As a library consumer, I want the poster positioned correctly over the media element by default, so that composing it is as simple as composing `Player.Overlay`.
11. As a library consumer, I want to override `className`/`style` on the poster, so that I can customize its appearance without fighting the library's required layout styles.
12. As a library consumer, I want a data attribute reflecting the poster's current visibility, so that I can drive CSS fade transitions without conditionally mounting/unmounting the component myself.
13. As a library consumer, I want to compose two separate `Media.Poster` instances with different `visibleWhen` values, so that I can show different artwork before playback starts vs. after it ends.
14. As a library consumer, I want `hasStarted`/`isEnded` exposed through the existing `usePlayer` hook, so that I can build custom visibility logic beyond what `visibleWhen` offers, if I need to.
15. As a library maintainer, I want `RESET` (already fired on media detach/swap) to also clear `hasStarted`/`isEnded` back to their initial values, so that switching `src` or remounting the player doesn't leak stale playback history into the new session.
16. As a library maintainer, I want `Media.Video`/`Media.Audio`'s existing "renders the bare native element, no wrapper" contract to stay unbroken, so that existing consumers relying on `ref`/`style`/`className` landing directly on the native element are unaffected.
17. As a library consumer using TypeScript, I want `src`/`alt` required by the type system on `Media.Poster`, so that I can't accidentally ship a poster missing an accessible description or a `<picture>` missing its mandatory fallback image.
18. As a library consumer, I want `sources` to accept the same shape as native `<source>` attributes (`media`, `srcSet`, `type`, `sizes`), so that I'm not limited to a subset of what native art direction supports.

## Implementation Decisions

- New component `Media.Poster`, exported from the `Media` namespace (`src/components/media/index.parts.ts`) alongside `Video`/`Audio`.
- Props: `Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & { src: string; alt: string; sources?: SourceHTMLAttributes<HTMLSourceElement>[]; visibleWhen?: "pending" | "ended" | "both" }`, default `visibleWhen = "pending"`. Reuses React's own native attribute types rather than mirroring a hand-rolled shape.
- Rendering: no `sources` (undefined/empty) → a bare `<img {...imgProps} />`. `sources` present → `<picture>` containing `sources.map(s => <source key={...} {...s} />)`, in array order, followed by exactly one trailing `<img {...imgProps} />` — the component owns tag emission end to end, so a structurally invalid `<picture>` (missing/misordered fallback) is impossible by construction.
- Visibility, derived from the store via `usePlayer`: `"pending"` → `!hasStarted`; `"ended"` → `isEnded`; `"both"` → `!hasStarted || isEnded`. These are mutually exclusive by construction, since `isEnded` can only become `true` after `hasStarted` is already `true`.
- Required layout style merged onto the rendered root (`<img>` or `<picture>`), the same way `Player.Overlay` merges its `requiredStyle`: `position: absolute; inset: 0;` plus `pointer-events: none` (this component is decorative, not interactive, and must never intercept clicks meant for `Player.Overlay`).
- New `data-*` attribute added to `DATA_ATTRS` (`src/constants.ts`), following the file's existing naming convention, reflecting the computed visibility boolean — drives CSS-based show/hide transitions.
- Always mounted; visibility is presentation-only (style/data-attribute), never conditional unmount, for any `visibleWhen` value. A consumer who wants to defer the image fetch can wrap `<Media.Poster>` in their own conditional using the now-public `hasStarted`/`isEnded` selectors — the library doesn't solve that internally.
- New `PlayerState` fields (see `CONTEXT.md`): `hasStarted: boolean`, `isEnded: boolean`.
  - `hasStarted`: set `true` in the existing `PLAY` reducer case, alongside `isPlaying: true` — no new native listener needed. Cleared only by `RESET` (already dispatched on media detach/swap in `store.ts`).
  - `isEnded`: set `true` by a new `ENDED` action, dispatched from a new native `ended` listener in `store.ts` (alongside the existing `play`/`pause`/etc. listeners). Cleared back to `false` in the same `PLAY` reducer case (mirrors `isPlaying`'s instantaneous flip: "currently ended," not "has ever ended").
  - `initialState.ts` gains `hasStarted: false, isEnded: false`; the existing `RESET` case (`{ ...initialState }`) clears both with no extra code.
- `LifeCycleState` is unchanged — it never exits `"playable"` once reached, so it's orthogonal to these two new facts (see ADR `docs/adr/0001-poster-as-standalone-component.md`).
- No runtime validation is added (e.g. no check that `sources` entries are well-formed). Unlike `Media.Video`/`Media.Audio`'s `src`/`attachEngine` conflict throw — which guards a real two-shape ambiguity — `Media.Poster` never accepts arbitrary children, so the structural mistakes an earlier children-based design would have risked are impossible by construction; TypeScript requiring `src`/`alt` is sufficient.
- See `docs/adr/0001-poster-as-standalone-component.md` for why this ships as a standalone component rather than a `poster` prop on `Media.Video`/`Media.Audio`, and why the new facts live on the shared store instead of being derived locally inside `Media.Poster`.

## Testing Decisions

Good tests here assert observable behavior — DOM output and `store.getSnapshot()` values — never internal reducer dispatch calls or component internals.

- **Seam 1 — `createPlayerStore()`** (extend `src/state/store.test.ts`): covers the new `hasStarted`/`isEnded` reducer semantics, following the file's existing pattern exactly — attach a real `<video>`/`<audio>` via `store.attachMedia()`, dispatch native events with `video.dispatchEvent(new Event(...))`, assert on `store.getSnapshot()`. Cases: `play` sets `hasStarted: true`; `ended` sets `isEnded: true`; a subsequent `play` resets `isEnded: false`; `RESET` (media detach) clears both back to `false`.
- **Seam 2 — component rendering** (new for this repo; `@testing-library/react` and `jsdom` are already devDependencies but currently unused for rendering tests — every existing test exercises the store/hooks/utils directly, never mounted React output). Mount `Player.Root` wrapping a `Media.Video`/`Media.Audio` and a `Media.Poster`, drive state via native events dispatched on the mounted media element (same dispatch style as Seam 1, not by mocking the store or `usePlayer`), and assert on `Media.Poster`'s rendered DOM. Cases:
  - No `sources` → renders a bare `<img>` with the given `src`/`alt` and passthrough attributes.
  - `sources` given → renders `<picture>` with `<source>` elements in the given order, followed by exactly one trailing `<img>`.
  - `visibleWhen="pending"` (default): visible before any `play` event, hidden after.
  - `visibleWhen="ended"`: hidden until `ended` fires, visible after; hidden again after a subsequent `play`.
  - `visibleWhen="both"`: visible pre-`play`, hidden during playback, visible again after `ended`.
- This is the first component-level render test in the repo. It establishes the pattern for `Media.Poster` only; it is not retroactively applied to other components (see Out of Scope).

## Out of Scope

- Retrofitting `@testing-library/react` render tests onto existing untested components (`Media.Video`, `Media.Audio`, `Player.Overlay`, etc.) — only `Media.Poster` gets this new seam.
- A `poster` prop on `Media.Video`/`Media.Audio` — explicitly rejected (see ADR 0001).
- Any array-of-config-objects alternative to native `SourceHTMLAttributes` passthrough for `sources`, or a children-based (`<source>`/`<img>` as JSX children) API — both considered and rejected during design.
- Runtime validation of `sources`/`src`/`alt` shapes beyond what TypeScript enforces at compile time.
- A dedicated hook for `hasStarted`/`isEnded` — they're plain `PlayerState` fields, read via the existing `usePlayer` selector like every other field.
- Any change to `LifeCycleState`, its transitions, or `useMediaAttributes`'s existing derived data-attributes.
- Low-quality-placeholder (LQIP) rendering, blur-up transitions, or preload-hint behavior — `Media.Poster` is a visibility-gated `<img>`/`<picture>`, nothing more.

## Further Notes

- Naming convention introduced: `has*`-prefixed `PlayerState` booleans mean "occurred at least once since the last reset" (monotonic until `RESET`), distinct from the existing `is*` convention for instantaneous facts (`isPlaying`, `isMuted`, `isBuffering`). Documented in `CONTEXT.md`; future one-way facts should follow this convention.
- This is the first time `@testing-library/react` is actually exercised for a rendering test in this repo, despite being an existing devDependency. Whoever implements this should expect to set up whatever minimal render/cleanup scaffolding is needed (e.g. `afterEach(cleanup)`), since there's no existing render-test file to copy from.
