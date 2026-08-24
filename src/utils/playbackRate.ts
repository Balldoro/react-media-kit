import { MAX_PLAYBACK_RATE, MIN_PLAYBACK_RATE } from "@/constants";

export const clampPlaybackRate = (rate: number) =>
  Math.max(Math.min(rate, MAX_PLAYBACK_RATE), MIN_PLAYBACK_RATE);
