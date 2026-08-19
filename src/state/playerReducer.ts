import type { PlayerAction, PlayerState } from "../types";

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "TOGGLE":
      return { ...state, isPlaying: !state.isPlaying };
  }
}

export function createPlayerStore() {
  let state = { isPlaying: false };
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

  const init = (videoEl: HTMLVideoElement) => {
    video = videoEl;
    videoEl.addEventListener("play", handlePlay, { signal: abortController.signal });
    videoEl.addEventListener("pause", handlePause, { signal: abortController.signal });
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
