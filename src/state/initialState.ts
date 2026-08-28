import type { PlayerState } from "./types";

export const initialState: PlayerState = Object.freeze({
  state: "pending",
  isPlaying: false,
  isMuted: false,
  isFullscreen: false,
  isPictureInPicture: false,
  isBuffering: false,
  featuresDetected: false,
  supportsVolumeChange: null,
  supportsFullscreen: null,
  supportsPiP: null,
  durationInSec: 0,
  currentTimeInSec: 0,
  optimisticTimeInSec: null,
  bufferedEndInSec: null,
  volume: 0.5,
  playbackRate: 1,
});
