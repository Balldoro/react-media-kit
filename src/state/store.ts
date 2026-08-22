import type { PlayerAction, PlayerState } from "@/types";
import { playerReducer } from "@/state/playerReducer";
import { createSeekQueue } from "./seekQueue";
import { clampVolume } from "@/utils/volume";

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export function createPlayerStore() {
  let state: PlayerState = {
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    durationInSec: 0,
    currentTimeInSec: 0,
    optimisticTimeInSec: null,
    volume: 0.5,
  };

  const seekQueue = createSeekQueue();
  const listeners = new Set<() => void>();

  let abortController = new AbortController();
  let video: HTMLVideoElement | null = null;
  let container: HTMLDivElement | null = null;

  const dispatch = (action: PlayerAction) => {
    state = playerReducer(state, action);
    listeners.forEach((l) => l());
  };

  const handlePlay = () => dispatch({ type: "PLAY" });

  const handlePause = () => dispatch({ type: "PAUSE" });

  const play = () => video?.play();

  const pause = () => video?.pause();

  const toggle = () => (state.isPlaying ? pause() : play());

  const mute = () => video && (video.muted = true);
  const unmute = () => video && (video.muted = false);
  const toggleMute = () => (state.isMuted ? unmute() : mute());

  const stepVolume = (delta: number) => {
    if (!video) return;
    const newValue = clampVolume(video.volume + delta);
    video.volume = newValue;
    video.muted = false;
  };

  const setVolume = (volume: number) => {
    if (!video) return;
    const newValue = clampVolume(volume);
    video.volume = newValue;
    video.muted = false;
  };

  const toggleFullscreen = () =>
    state.isFullscreen ? document.exitFullscreen() : container?.requestFullscreen();

  function skip(delta: number) {
    if (!video) return;
    const newValue = Math.max(Math.min(video.currentTime + delta, state.durationInSec), 0);
    seek(newValue);
  }

  function handleTimeUpdate(this: HTMLVideoElement) {
    const { currentTime } = this;
    dispatch({ type: "TIME_UPDATE", payload: { value: currentTime } });
  }

  function seek(time: number) {
    if (!video) return;

    if (video.seeking) {
      seekQueue.set(time);
    } else {
      video.currentTime = time;
    }
    dispatch({ type: "SEEKING", payload: { value: time } });
  }

  function handleSeeking(this: HTMLVideoElement) {
    if (seekQueue.get().isPending) return;
    dispatch({ type: "SEEKING", payload: { value: this.currentTime } });
  }

  function handleSeeked() {
    const seekQueueState = seekQueue.pop();
    if (seekQueueState.isPending && video) {
      video.currentTime = seekQueueState.value;
    }
  }

  function handleInit(this: HTMLVideoElement) {
    const { duration, volume } = this;
    dispatch({ type: "INIT", payload: { durationInSec: duration, volume } });
  }

  function handleFullscreen(this: HTMLVideoElement) {
    dispatch({ type: "FULLSCREEN", payload: { value: document.fullscreenElement === container } });
  }

  function handleVolumeChange(this: HTMLVideoElement) {
    if (state.isMuted !== this.muted) {
      dispatch({ type: "MUTE", payload: { value: this.muted } });
    }
    if (state.volume !== this.volume) {
      dispatch({ type: "VOLUME_CHANGE", payload: { value: this.volume } });
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    switch (e.key.toUpperCase()) {
      case "M":
        return toggleMute();
    }
  }

  function init(videoEl: HTMLVideoElement, containerEl: HTMLDivElement) {
    video = videoEl;
    container = containerEl;

    const signalConfig = { signal: abortController.signal };

    videoEl.addEventListener("loadedmetadata", handleInit, signalConfig);
    videoEl.addEventListener("play", handlePlay, signalConfig);
    videoEl.addEventListener("pause", handlePause, signalConfig);
    videoEl.addEventListener("seeking", handleSeeking, signalConfig);
    videoEl.addEventListener("timeupdate", handleTimeUpdate, signalConfig);
    videoEl.addEventListener("seeked", handleSeeked, signalConfig);
    videoEl.addEventListener("volumechange", handleVolumeChange, signalConfig);

    containerEl.addEventListener("fullscreenchange", handleFullscreen, signalConfig);
    containerEl.addEventListener("keydown", handleKeyDown, signalConfig);
  }

  function destroy() {
    abortController.abort();
    abortController = new AbortController();
    listeners.clear();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  const controls = {
    play,
    pause,
    toggle,
    seek,
    skip,
    toggleFullscreen,
    toggleMute,
    mute,
    unmute,
    stepVolume,
    setVolume,
  };

  return { subscribe, init, destroy, getSnapshot: () => state, getControls: () => controls };
}
