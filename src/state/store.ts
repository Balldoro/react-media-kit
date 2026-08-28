import type { PlayerAction, PlayerState, Selector } from "./types";
import { playerReducer } from "@/state/playerReducer";
import { createSeekQueue } from "./seekQueue";
import { clampVolume } from "@/utils/volume";
import { getBufferedEnd } from "@/utils/buffer";
import { initialState } from "./initialState";
import type { OnErrorFunc, PlayerError } from "@/types";
import { isVolumeMutable } from "@/utils/dom";

export { initialState };

export type PlayerStore = ReturnType<typeof createPlayerStore>;

export function createPlayerStore() {
  let state: PlayerState = { ...initialState };

  const seekQueue = createSeekQueue();
  const listeners = new Set<() => void>();
  const errorListeners = new Set<OnErrorFunc>();

  let mediaAbortController = new AbortController();
  let containerAbortController = new AbortController();
  let media: HTMLMediaElement | null = null;
  let container: HTMLDivElement | null = null;

  const dispatch = (action: PlayerAction) => {
    state = playerReducer(state, action);
    listeners.forEach((l) => l());
  };

  const handlePlay = () => dispatch({ type: "PLAY" });

  const handlePause = () => dispatch({ type: "PAUSE" });

  const play = async () => {
    try {
      await media?.play();
    } catch (error) {
      notifyAboutError({ type: "play", error });
    }
  };

  const pause = () => media?.pause();

  const toggle = () => (state.isPlaying ? pause() : play());

  const mute = () => media && (media.muted = true);

  const unmute = () => media && (media.muted = false);

  const toggleMute = () => (state.isMuted ? unmute() : mute());

  const stepVolume = (delta: number) => {
    if (!media) return;

    const newValue = clampVolume(media.volume + delta);
    media.volume = newValue;
    media.muted = false;
  };

  const setVolume = (volume: number) => {
    if (!media) return;

    const newValue = clampVolume(volume);
    media.volume = newValue;
    media.muted = false;
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
      if (!(media instanceof HTMLVideoElement)) {
        throw new Error("Picture-in-picture is only supported for video elements");
      }
      if (state.isPictureInPicture) await document.exitPictureInPicture();
      else await media.requestPictureInPicture();
    } catch (error) {
      notifyAboutError({ type: "pip", error });
    }
  };

  const stepPlaybackRate = (delta: number) => {
    if (!media) return;
    media.playbackRate = media.playbackRate + delta;
  };

  const setPlaybackRate = (rate: number) => {
    if (!media) return;
    media.playbackRate = rate;
  };

  function skip(delta: number) {
    if (!media) return;
    const newValue = Math.max(Math.min(media.currentTime + delta, state.durationInSec), 0);
    seek(newValue);
  }

  function handleTimeUpdate(this: HTMLMediaElement) {
    dispatch({ type: "TIME_UPDATE", payload: { time: this.currentTime } });
  }

  function seek(time: number) {
    if (!media) return;

    if (media.seeking) {
      seekQueue.set(time);
    } else {
      media.currentTime = time;
    }
    dispatch({
      type: "SEEKING",
      payload: { time, bufferedEnd: getBufferedEnd(media.buffered, time) },
    });
  }

  function handleSeeking(this: HTMLMediaElement) {
    if (seekQueue.get().isPending) return;
    dispatch({
      type: "SEEKING",
      payload: {
        time: this.currentTime,
        bufferedEnd: getBufferedEnd(this.buffered, this.currentTime),
      },
    });
  }

  function handleSeeked() {
    const seekQueueState = seekQueue.pop();
    if (seekQueueState.isPending && media) {
      media.currentTime = seekQueueState.value;
    }
  }

  function handleInit(this: HTMLMediaElement) {
    const { duration, volume, playbackRate } = this;
    dispatch({
      type: "METADATA_LOADED",
      payload: { durationInSec: duration, volume, playbackRate },
    });
  }

  function handleFullscreen(this: HTMLMediaElement) {
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

  function handleVolumeChange(this: HTMLMediaElement) {
    if (state.isMuted !== this.muted) {
      dispatch({ type: "MUTE", payload: { muted: this.muted } });
    }
    if (state.volume !== this.volume) {
      dispatch({ type: "VOLUME_CHANGE", payload: { volume: this.volume } });
    }
  }

  function handleRateChange(this: HTMLMediaElement) {
    if (state.playbackRate !== this.playbackRate) {
      dispatch({ type: "PLAYBACK_RATE_CHANGE", payload: { playbackRate: this.playbackRate } });
    }
  }

  function handleError(this: HTMLMediaElement) {
    dispatch({ type: "ERROR" });
    notifyAboutError({ type: "media", error: this.error! });
  }

  function handleLoading() {
    dispatch({ type: "LOADING" });
  }

  function handleBufferingStart() {
    if (!state.isBuffering) {
      dispatch({ type: "BUFFERING", payload: { isBuffering: true } });
    }
  }

  function handleBufferingEnd() {
    if (state.isBuffering) {
      dispatch({ type: "BUFFERING", payload: { isBuffering: false } });
    }
  }

  function handleCanPlay() {
    handleBufferingEnd();
    dispatch({ type: "CAN_PLAY" });
  }

  function handleProgress() {
    const time = state.optimisticTimeInSec ?? state.currentTimeInSec;
    dispatch({ type: "PROGRESS", payload: { bufferedEnd: getBufferedEnd(media?.buffered, time) } });
  }

  function resetMedia() {
    mediaAbortController.abort();
    media = null;
    dispatch({ type: "RESET" });
  }

  function attachMedia(mediaEl: HTMLMediaElement) {
    const detectSupportedFeatures = async () => {
      // TODO: iPhone allows to enter fullscreen on video element only
      // This needs a separate, iOS scoped check and invocation on video
      // element, not container
      const fullscreen = document.fullscreenEnabled ?? false;
      const pip =
        mediaEl instanceof HTMLVideoElement && (document.pictureInPictureEnabled ?? false);
      const volumeChange = await isVolumeMutable();

      dispatch({ type: "FEATURES_DETECTED", payload: { fullscreen, pip, volumeChange } });
    };

    mediaAbortController = new AbortController();
    media = mediaEl;
    const signalConfig = { signal: mediaAbortController.signal };
    detectSupportedFeatures();

    mediaEl.addEventListener("loadedmetadata", handleInit, signalConfig);
    mediaEl.addEventListener("error", handleError, signalConfig);
    mediaEl.addEventListener("loadstart", handleLoading, signalConfig);
    mediaEl.addEventListener("play", handlePlay, signalConfig);
    mediaEl.addEventListener("pause", handlePause, signalConfig);
    mediaEl.addEventListener("ratechange", handleRateChange, signalConfig);
    mediaEl.addEventListener("seeking", handleSeeking, signalConfig);
    mediaEl.addEventListener("seeked", handleSeeked, signalConfig);
    mediaEl.addEventListener("timeupdate", handleTimeUpdate, signalConfig);
    mediaEl.addEventListener("volumechange", handleVolumeChange, signalConfig);
    mediaEl.addEventListener("progress", handleProgress, signalConfig);
    mediaEl.addEventListener("waiting", handleBufferingStart, signalConfig);
    mediaEl.addEventListener("playing", handleBufferingEnd, signalConfig);
    mediaEl.addEventListener("canplay", handleCanPlay, signalConfig);

    // Picture-in-picture is a video-only capability
    if (mediaEl instanceof HTMLVideoElement) {
      mediaEl.addEventListener("enterpictureinpicture", handlePipEnter, signalConfig);
      mediaEl.addEventListener("leavepictureinpicture", handlePipLeave, signalConfig);
    }

    return resetMedia;
  }

  function resetContainer() {
    containerAbortController.abort();
    container = null;
    if (state.isFullscreen) {
      dispatch({ type: "FULLSCREEN", payload: { enabled: false } });
    }
  }

  function attachContainer(containerEl: HTMLDivElement) {
    containerAbortController = new AbortController();
    container = containerEl;
    containerEl.addEventListener("fullscreenchange", handleFullscreen, {
      signal: containerAbortController.signal,
    });

    return resetContainer;
  }

  const getMedia = () => media;

  const getContainer = () => container;

  function destroy() {
    mediaAbortController.abort();
    containerAbortController.abort();
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
    attachMedia,
    attachContainer,
    getMedia,
    getContainer,
    destroy,
    getSnapshot,
  };
}
