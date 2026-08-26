import type { PlayerAction, PlayerState, Selector } from "./types";
import { playerReducer } from "@/state/playerReducer";
import { createSeekQueue } from "./seekQueue";
import { clampVolume } from "@/utils/volume";
import type { OnErrorFunc, PlayerError } from "@/types";

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export const initialState = Object.freeze({
  state: "pending",
  isPlaying: false,
  isMuted: false,
  isFullscreen: false,
  isPictureInPicture: false,
  durationInSec: 0,
  currentTimeInSec: 0,
  optimisticTimeInSec: null,
  bufferedEndInSec: null,
  volume: 0.5,
  playbackRate: 1,
});

export function createPlayerStore() {
  let state: PlayerState = { ...initialState };

  const seekQueue = createSeekQueue();
  const listeners = new Set<() => void>();
  const errorListeners = new Set<OnErrorFunc>();

  let abortController = new AbortController();
  let video: HTMLVideoElement | null = null;
  let container: HTMLDivElement | null = null;

  const dispatch = (action: PlayerAction) => {
    state = playerReducer(state, action);
    listeners.forEach((l) => l());
  };

  const handlePlay = () => dispatch({ type: "PLAY" });

  const handlePause = () => dispatch({ type: "PAUSE" });

  const play = async () => {
    try {
      await video?.play();
    } catch (error) {
      notifyAboutError({ type: "play", error });
    }
  };

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

  const toggleFullscreen = async () => {
    try {
      if (state.isFullscreen) await document.exitFullscreen();
      else await container?.requestFullscreen();
    } catch (error) {
      notifyAboutError({ type: "fullscreen", error });
    }
  };

  const togglePip = async () => {
    try {
      if (state.isPictureInPicture) await document.exitPictureInPicture();
      else await video?.requestPictureInPicture();
    } catch (error) {
      notifyAboutError({ type: "pip", error });
    }
  };

  const stepPlaybackRate = (delta: number) => {
    if (!video) return;
    video.playbackRate = video.playbackRate + delta;
  };

  const setPlaybackRate = (rate: number) => {
    if (!video) return;
    video.playbackRate = rate;
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
    dispatch({ type: "SEEKING", payload: { time, bufferedEnd: getBufferedEnd(time) } });
  }

  function handleSeeking(this: HTMLVideoElement) {
    if (seekQueue.get().isPending) return;
    dispatch({
      type: "SEEKING",
      payload: { time: this.currentTime, bufferedEnd: getBufferedEnd(this.currentTime) },
    });
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

  function handleError(this: HTMLVideoElement) {
    dispatch({ type: "ERROR" });
    notifyAboutError({ type: "media", error: this.error! });
  }

  function handleLoading() {
    dispatch({ type: "LOADING" });
  }

  function getBufferedEnd(time: number) {
    if (!video) return time;

    const { buffered } = video;
    for (let i = 1, len = buffered.length; i <= len; i++) {
      const idx = len - i;
      const start = buffered.start(idx);
      const end = buffered.end(idx);

      if (time >= start && time <= end) return end;
    }
    return time;
  }

  function handleProgress() {
    const time = state.optimisticTimeInSec ?? state.currentTimeInSec;
    dispatch({ type: "BUFFER", payload: { bufferedEnd: getBufferedEnd(time) } });
  }

  function init(videoEl: HTMLVideoElement, containerEl: HTMLDivElement) {
    video = videoEl;
    container = containerEl;

    const signalConfig = { signal: abortController.signal };

    videoEl.addEventListener("loadedmetadata", handleInit, signalConfig);
    videoEl.addEventListener("error", handleError, signalConfig);
    videoEl.addEventListener("enterpictureinpicture", handlePipEnter, signalConfig);
    videoEl.addEventListener("leavepictureinpicture", handlePipLeave, signalConfig);
    videoEl.addEventListener("loadstart", handleLoading, signalConfig);
    videoEl.addEventListener("play", handlePlay, signalConfig);
    videoEl.addEventListener("pause", handlePause, signalConfig);
    videoEl.addEventListener("ratechange", handleRateChange, signalConfig);
    videoEl.addEventListener("seeking", handleSeeking, signalConfig);
    videoEl.addEventListener("seeked", handleSeeked, signalConfig);
    videoEl.addEventListener("timeupdate", handleTimeUpdate, signalConfig);
    videoEl.addEventListener("volumechange", handleVolumeChange, signalConfig);
    videoEl.addEventListener("progress", handleProgress, signalConfig);

    containerEl.addEventListener("fullscreenchange", handleFullscreen, signalConfig);
  }

  function destroy() {
    abortController.abort();
    abortController = new AbortController();
    listeners.clear();
    errorListeners.clear();
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  const notifyAboutError = (playerError: PlayerError) => {
    errorListeners.forEach((l) => l(playerError));
  };

  const subscribeToErrors = (cb: OnErrorFunc) => {
    errorListeners.add(cb);
    return () => {
      errorListeners.delete(cb);
    };
  };

  const getSnapshot = () => state;

  function subscribeWithSelector<T>(selector: Selector<T>, listener: (slice: T) => void) {
    let prev = selector(getSnapshot());
    return subscribe(() => {
      const next = selector(getSnapshot());
      if (Object.is(next, prev)) return;
      prev = next;
      listener(next);
    });
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

  return {
    controls,
    subscribe,
    subscribeWithSelector,
    subscribeToErrors,
    init,
    destroy,
    getSnapshot,
  };
}
