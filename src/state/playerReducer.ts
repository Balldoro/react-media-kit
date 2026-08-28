import type { PlayerAction, PlayerState } from "./types";
import { normalizeTime } from "@/utils/time";
import { initialState } from "./initialState";

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "TOGGLE":
      return { ...state, isPlaying: !state.isPlaying };
    case "METADATA_LOADED": {
      const { durationInSec, volume, playbackRate } = action.payload;
      const areFeaturesDetected = state.supportsVolumeChange !== null;
      return {
        ...state,
        durationInSec: normalizeTime(durationInSec),
        volume,
        playbackRate,
        state: areFeaturesDetected ? "ready" : "metadataloaded",
      };
    }
    case "FEATURES_DETECTED": {
      const { volumeChange, fullscreen, pip } = action.payload;
      return {
        ...state,
        supportsVolumeChange: volumeChange,
        supportsFullscreen: fullscreen,
        supportsPiP: pip,
        state: state.state === "metadataloaded" ? "ready" : state.state,
      };
    }
    case "TIME_UPDATE": {
      const { time } = action.payload;
      return { ...state, currentTimeInSec: normalizeTime(time), optimisticTimeInSec: null };
    }
    case "SEEKING": {
      const { time, bufferedEnd } = action.payload;
      return { ...state, optimisticTimeInSec: normalizeTime(time), bufferedEndInSec: bufferedEnd };
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
      return { ...state, state: "error" };
    }
    case "LOADING": {
      return { ...state, state: "loading" };
    }
    case "PROGRESS": {
      const { bufferedEnd } = action.payload;
      return { ...state, bufferedEndInSec: bufferedEnd };
    }
    case "BUFFERING": {
      const { isBuffering } = action.payload;
      return { ...state, isBuffering };
    }
    case "RESET": {
      return {
        ...initialState,
        supportsVolumeChange: state.supportsVolumeChange,
        supportsFullscreen: state.supportsFullscreen,
        supportsPiP: state.supportsPiP,
      };
    }
  }
}
