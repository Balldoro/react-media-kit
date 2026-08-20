import type { PlayerAction, PlayerState } from "@/types";
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
      const { durationInSec } = action.payload;
      return { ...state, durationInSec: normalizeTime(durationInSec) };
    }
    case "TIME_UPDATE": {
      const { currentTimeInSec } = action.payload;
      return { ...state, currentTimeInSec: normalizeTime(currentTimeInSec) };
    }
  }
}
