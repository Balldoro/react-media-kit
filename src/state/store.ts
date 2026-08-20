import type { PlayerAction } from "@/types";
import { playerReducer } from "@/state/playerReducer";

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export function createPlayerStore() {
  let state = { isPlaying: false, durationInSec: 3787, currentTimeInSec: 0 };
  const controls = { play, pause, toggle };
  const listeners = new Set<() => void>();

  let abortController = new AbortController();
  let video: HTMLVideoElement | null = null;

  const dispatch = (action: PlayerAction) => {
    state = playerReducer(state, action);
    listeners.forEach((l) => l());
  };

  const handlePlay = () => dispatch({ type: "PLAY" });
  const handlePause = () => dispatch({ type: "PAUSE" });

  const handleTimeUpdate = (e: Event) => {
    const { currentTime } = e.target as HTMLVideoElement;
    dispatch({ type: "TIME_UPDATE", payload: { currentTimeInSec: currentTime } });
  };

  const handleInit = (e: Event) => {
    const { duration } = e.target as HTMLVideoElement;
    dispatch({ type: "INIT", payload: { durationInSec: duration } });
  };

  const init = (videoEl: HTMLVideoElement) => {
    video = videoEl;

    videoEl.addEventListener("loadedmetadata", handleInit, { signal: abortController.signal });
    videoEl.addEventListener("play", handlePlay, { signal: abortController.signal });
    videoEl.addEventListener("pause", handlePause, { signal: abortController.signal });
    videoEl.addEventListener("timeupdate", handleTimeUpdate, { signal: abortController.signal });
  };

  function play() {
    video?.play();
  }

  function pause() {
    video?.pause();
  }

  function toggle() {
    if (state.isPlaying) {
      pause();
      return;
    }
    play();
  }

  const destroy = () => {
    abortController.abort();
    abortController = new AbortController();
    listeners.clear();
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    init,
    destroy,
    getSnapshot: () => state,
    getControls: () => controls,
  };
}
