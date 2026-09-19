---
"react-media-kit": minor
---

Replace `Video` and `Audio` exports with a single `Media` namespace
Add `attachEngine` prop to `Media.Video` & `Media.Audio` for attaching streaming engines
Add `MediaEngine` type export - an engine receives the media element and may return a cleanup function
Sync player state from an already-loaded media element on attach
