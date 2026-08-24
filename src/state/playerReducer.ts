import type { PlayerAction, PlayerState } from "./types";
import { normalizeTime } from "@/utils/time";

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "TOGGLE":
      return { ...state, isPlaying: !state.isPlaying };
    case "INIT": {
      const { durationInSec, volume, playbackRate } = action.payload;
      return {
        ...state,
        durationInSec: normalizeTime(durationInSec),
        volume,
        playbackRate,
        isReady: true,
        isError: false,
      };
    }
    case "TIME_UPDATE": {
      const { time } = action.payload;
      return { ...state, currentTimeInSec: normalizeTime(time), optimisticTimeInSec: null };
    }
    case "SEEKING": {
      const { time } = action.payload;
      return { ...state, optimisticTimeInSec: normalizeTime(time) };
    }
    case "FULLSCREEN": {
      const { enabled } = action.payload;
      return { ...state, isFullscreen: enabled };
    }
    case "PIP": {
      const { enabled } = action.payload;
      return { ...state, isPictureInPicture: enabled };
    }
    case "MUTE": {
      const { muted } = action.payload;
      return { ...state, isMuted: muted };
    }
    case "VOLUME_CHANGE": {
      const { volume } = action.payload;
      return { ...state, volume: volume };
    }
    case "PLAYBACK_RATE_CHANGE": {
      const { playbackRate } = action.payload;
      return { ...state, playbackRate };
    }
    case "ERROR": {
      return { ...state, isError: true };
    }
  }
}
