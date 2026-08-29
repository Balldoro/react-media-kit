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
      return {
        ...state,
        durationInSec: normalizeTime(durationInSec),
        volume,
        playbackRate,
        state: "metadataloaded",
      };
    }
    case "CAN_PLAY": {
      if (state.state === "playable") return state;

      return { ...state, state: "playable" };
    }
    case "SYNC_FEATURES_SUPPORT": {
      const { fullscreen, pip } = action.payload;
      return { ...state, supportsFullscreen: fullscreen, supportsPiP: pip };
    }
    case "VOLUME_CHANGE_SUPPORT": {
      const { supported } = action.payload;
      return { ...state, supportsVolumeChange: supported };
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
      return { ...initialState };
    }
  }
}
