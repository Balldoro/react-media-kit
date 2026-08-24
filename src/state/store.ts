import type { PlayerAction, PlayerState } from "./types";
import { playerReducer } from "@/state/playerReducer";
import { createSeekQueue } from "./seekQueue";
import { clampVolume } from "@/utils/volume";
import { clampPlaybackRate } from "@/utils/playbackRate";

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export function createPlayerStore() {
  let state: PlayerState = {
    isReady: false,
    isError: false,
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    isPictureInPicture: false,
    durationInSec: 0,
    currentTimeInSec: 0,
    optimisticTimeInSec: null,
    volume: 0.5,
    playbackRate: 1,
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

  const togglePip = () =>
    state.isPictureInPicture ? document.exitPictureInPicture() : video?.requestPictureInPicture();

  const stepPlaybackRate = (delta: number) => {
    if (!video) return;
    video.playbackRate = clampPlaybackRate(video.playbackRate + delta);
  };

  const setPlaybackRate = (rate: number) => {
    if (!video) return;
    video.playbackRate = clampPlaybackRate(rate);
  };

  function skip(delta: number) {
    if (!video) return;
    const newValue = Math.max(Math.min(video.currentTime + delta, state.durationInSec), 0);
    seek(newValue);
  }

  function handleTimeUpdate(this: HTMLVideoElement) {
    dispatch({ type: "TIME_UPDATE", payload: { time: this.currentTime } });
  }

  function seek(time: number) {
    if (!video) return;

    if (video.seeking) {
      seekQueue.set(time);
    } else {
      video.currentTime = time;
    }
    dispatch({ type: "SEEKING", payload: { time } });
  }

  function handleSeeking(this: HTMLVideoElement) {
    if (seekQueue.get().isPending) return;
    dispatch({ type: "SEEKING", payload: { time: this.currentTime } });
  }

  function handleSeeked() {
    const seekQueueState = seekQueue.pop();
    if (seekQueueState.isPending && video) {
      video.currentTime = seekQueueState.value;
    }
  }

  function handleInit(this: HTMLVideoElement) {
    const { duration, volume, playbackRate } = this;
    dispatch({ type: "INIT", payload: { durationInSec: duration, volume, playbackRate } });
  }

  function handleFullscreen(this: HTMLVideoElement) {
    dispatch({
      type: "FULLSCREEN",
      payload: { enabled: document.fullscreenElement === container },
    });
  }

  function handlePipEnter() {
    dispatch({ type: "PIP", payload: { enabled: true } });
  }

  function handlePipLeave() {
    dispatch({ type: "PIP", payload: { enabled: false } });
  }

  function handleVolumeChange(this: HTMLVideoElement) {
    if (state.isMuted !== this.muted) {
      dispatch({ type: "MUTE", payload: { muted: this.muted } });
    }
    if (state.volume !== this.volume) {
      dispatch({ type: "VOLUME_CHANGE", payload: { volume: this.volume } });
    }
  }

  function handleRateChange(this: HTMLVideoElement) {
    if (state.playbackRate !== this.playbackRate) {
      dispatch({ type: "PLAYBACK_RATE_CHANGE", payload: { playbackRate: this.playbackRate } });
    }
  }

  function handleError() {
    dispatch({ type: "ERROR" });
  }

  function init(videoEl: HTMLVideoElement, containerEl: HTMLDivElement) {
    video = videoEl;
    container = containerEl;

    const signalConfig = { signal: abortController.signal };

    videoEl.addEventListener("loadedmetadata", handleInit, signalConfig);
    videoEl.addEventListener("error", handleError, signalConfig);
    videoEl.addEventListener("enterpictureinpicture", handlePipEnter, signalConfig);
    videoEl.addEventListener("leavepictureinpicture", handlePipLeave, signalConfig);
    videoEl.addEventListener("play", handlePlay, signalConfig);
    videoEl.addEventListener("pause", handlePause, signalConfig);
    videoEl.addEventListener("ratechange", handleRateChange, signalConfig);
    videoEl.addEventListener("seeking", handleSeeking, signalConfig);
    videoEl.addEventListener("seeked", handleSeeked, signalConfig);
    videoEl.addEventListener("timeupdate", handleTimeUpdate, signalConfig);
    videoEl.addEventListener("volumechange", handleVolumeChange, signalConfig);

    containerEl.addEventListener("fullscreenchange", handleFullscreen, signalConfig);
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
    togglePip,
    toggleMute,
    mute,
    unmute,
    stepVolume,
    setVolume,
    stepPlaybackRate,
    setPlaybackRate,
  };

  return { subscribe, init, destroy, getSnapshot: () => state, getControls: () => controls };
}
