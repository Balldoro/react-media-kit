import { describe, expect, it, vi } from "vitest";
import { createPlayerStore } from "@/state/store";

function setup(tag: "video" | "audio" = "video") {
  const store = createPlayerStore();
  const video = document.createElement(tag);
  const container = document.createElement("div");
  document.body.appendChild(container);
  store.init(video, container);
  return { store, video, container };
}

function stubReadonly<T extends object, K extends keyof T>(target: T, key: K, value: T[K]) {
  Object.defineProperty(target, key, { value, configurable: true });
}

const fakeTimeRanges = (ranges: [number, number][]): TimeRanges =>
  ({
    length: ranges.length,
    start: (index: number) => ranges[index]![0],
    end: (index: number) => ranges[index]![1],
  }) as TimeRanges;

describe("createPlayerStore", () => {
  describe("lifecycle events", () => {
    it("loadedmetadata moves state to ready and captures duration/volume/playbackRate", () => {
      const { store, video } = setup();
      stubReadonly(video, "duration", 120);
      video.volume = 0.8;
      video.playbackRate = 1.5;

      video.dispatchEvent(new Event("loadedmetadata"));

      const snapshot = store.getSnapshot();
      expect(snapshot.state).toBe("ready");
      expect(snapshot.durationInSec).toBe(120);
      expect(snapshot.volume).toBe(0.8);
      expect(snapshot.playbackRate).toBe(1.5);
    });

    it("normalizes a non-finite duration to 0", () => {
      const { store, video } = setup();
      stubReadonly(video, "duration", NaN);

      video.dispatchEvent(new Event("loadedmetadata"));

      expect(store.getSnapshot().durationInSec).toBe(0);
    });

    it("loadstart moves state to loading", () => {
      const { store, video } = setup();
      video.dispatchEvent(new Event("loadstart"));
      expect(store.getSnapshot().state).toBe("loading");
    });

    it("play/pause events toggle isPlaying", () => {
      const { store, video } = setup();
      video.dispatchEvent(new Event("play"));
      expect(store.getSnapshot().isPlaying).toBe(true);
      video.dispatchEvent(new Event("pause"));
      expect(store.getSnapshot().isPlaying).toBe(false);
    });

    it("timeupdate sets currentTimeInSec and clears any optimistic time", () => {
      const { store, video } = setup();
      store.controls.seek(10);
      expect(store.getSnapshot().optimisticTimeInSec).toBe(10);

      video.currentTime = 10;
      video.dispatchEvent(new Event("timeupdate"));

      const snap = store.getSnapshot();
      expect(snap.currentTimeInSec).toBe(10);
      expect(snap.optimisticTimeInSec).toBeNull();
    });
  });

  describe("seeking", () => {
    it("seek() sets currentTime directly and reports an optimistic time and bufferedTo", () => {
      const { store, video } = setup();
      stubReadonly(video, "buffered", fakeTimeRanges([[0, 50]]));

      store.controls.seek(42);

      expect(video.currentTime).toBe(42);
      expect(store.getSnapshot().optimisticTimeInSec).toBe(42);
      expect(store.getSnapshot().bufferedEndInSec).toBe(50);
    });

    it("applies a queued seek once the native seeked event fires", () => {
      const { store, video } = setup();
      stubReadonly(video, "seeking", true);
      stubReadonly(video, "buffered", fakeTimeRanges([[0, 60]]));

      store.controls.seek(50);
      expect(store.getSnapshot().bufferedEndInSec).toBe(60);

      video.dispatchEvent(new Event("seeked"));

      expect(video.currentTime).toBe(50);
    });

    it("native seeking event reports the current time and bufferedTo when no seek is queued", () => {
      const { store, video } = setup();
      video.currentTime = 33;
      stubReadonly(video, "buffered", fakeTimeRanges([[0, 40]]));

      video.dispatchEvent(new Event("seeking"));

      const snapshot = store.getSnapshot();
      expect(snapshot.optimisticTimeInSec).toBe(33);
      expect(snapshot.bufferedEndInSec).toBe(40);
    });

    it("native seeking event is ignored while a seek is already queued", () => {
      const { store, video } = setup();
      stubReadonly(video, "seeking", true);
      store.controls.seek(50);

      video.currentTime = 999;
      video.dispatchEvent(new Event("seeking"));

      const snapshot = store.getSnapshot();
      expect(snapshot.optimisticTimeInSec).toBe(50);
    });

    it("skip() clamps to [0, durationInSec]", () => {
      const { store, video } = setup();
      stubReadonly(video, "duration", 100);
      video.dispatchEvent(new Event("loadedmetadata"));
      video.currentTime = 95;

      store.controls.skip(50);
      expect(video.currentTime).toBe(100);

      video.currentTime = 5;
      store.controls.skip(-50);
      expect(video.currentTime).toBe(0);
    });
  });

  describe("buffering", () => {
    it("progress event sets bufferedEndInSec to the end of the range containing the current time", () => {
      const { store, video } = setup();
      video.currentTime = 5;
      video.dispatchEvent(new Event("timeupdate"));
      stubReadonly(video, "buffered", fakeTimeRanges([[0, 20]]));

      video.dispatchEvent(new Event("progress"));

      expect(store.getSnapshot().bufferedEndInSec).toBe(20);
    });

    it("picks the buffered range that contains the current time out of several disjoint ranges", () => {
      const { store, video } = setup();
      video.currentTime = 45;
      video.dispatchEvent(new Event("timeupdate"));
      stubReadonly(
        video,
        "buffered",
        fakeTimeRanges([
          [0, 12],
          [40, 55],
        ]),
      );

      video.dispatchEvent(new Event("progress"));

      expect(store.getSnapshot().bufferedEndInSec).toBe(55);
    });

    it("falls back to the current time when it falls in a gap between buffered ranges", () => {
      const { store, video } = setup();
      video.currentTime = 20;
      video.dispatchEvent(new Event("timeupdate"));
      stubReadonly(
        video,
        "buffered",
        fakeTimeRanges([
          [0, 12],
          [40, 55],
        ]),
      );

      video.dispatchEvent(new Event("progress"));

      expect(store.getSnapshot().bufferedEndInSec).toBe(20);
    });

    it("falls back to the current time when nothing is buffered yet", () => {
      const { store, video } = setup();
      video.currentTime = 3;
      video.dispatchEvent(new Event("timeupdate"));
      stubReadonly(video, "buffered", fakeTimeRanges([]));

      video.dispatchEvent(new Event("progress"));

      expect(store.getSnapshot().bufferedEndInSec).toBe(3);
    });

    it("prefers the optimistic seek time over currentTimeInSec when both are present", () => {
      const { store, video } = setup();
      stubReadonly(video, "seeking", true);
      store.controls.seek(45);
      stubReadonly(
        video,
        "buffered",
        fakeTimeRanges([
          [0, 12],
          [40, 55],
        ]),
      );

      video.dispatchEvent(new Event("progress"));

      expect(store.getSnapshot().bufferedEndInSec).toBe(55);
    });
  });

  describe("play/pause/toggle controls", () => {
    it("play() reports a play error instead of throwing", async () => {
      const { store, video } = setup();
      const error = new Error("blocked by browser");
      const onError = vi.fn();

      vi.spyOn(video, "play").mockRejectedValue(error);
      store.subscribeToErrors(onError);
      await store.controls.play();

      expect(onError).toHaveBeenCalledWith({ type: "play", error });
    });

    it("toggle() plays when paused and pauses when playing", () => {
      const { store, video } = setup();
      const playSpy = vi.spyOn(video, "play").mockResolvedValue(undefined);
      const pauseSpy = vi.spyOn(video, "pause").mockImplementation(() => {});

      store.controls.toggle();
      expect(playSpy).toHaveBeenCalledTimes(1);

      video.dispatchEvent(new Event("play"));
      store.controls.toggle();
      expect(pauseSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("volume and mute", () => {
    it("setVolume() clamps and unmutes", () => {
      const { store, video } = setup();
      video.muted = true;

      store.controls.setVolume(1.5);
      expect(video.volume).toBe(1);
      expect(video.muted).toBe(false);

      store.controls.setVolume(-1);
      expect(video.volume).toBe(0);
    });

    it("stepVolume() clamps relative to the current volume", () => {
      const { store, video } = setup();
      video.volume = 0.9;

      store.controls.stepVolume(0.5);
      expect(video.volume).toBe(1);

      video.volume = 0.1;
      store.controls.stepVolume(-0.5);
      expect(video.volume).toBe(0);
    });

    it("mute()/unmute() set video.muted directly", () => {
      const { store, video } = setup();
      store.controls.mute();
      expect(video.muted).toBe(true);
      store.controls.unmute();
      expect(video.muted).toBe(false);
    });

    it("toggleMute() branches on the current reducer state, not video.muted", () => {
      const { store, video } = setup();
      video.muted = true;
      video.dispatchEvent(new Event("volumechange"));
      expect(store.getSnapshot().isMuted).toBe(true);

      store.controls.toggleMute();
      expect(video.muted).toBe(false);
    });

    it("volumechange updates isMuted/volume only when they actually changed", () => {
      const { store, video } = setup();
      const listener = vi.fn();
      store.subscribe(listener);

      video.volume = 0.5;
      video.dispatchEvent(new Event("volumechange"));
      expect(listener).not.toHaveBeenCalled();

      video.volume = 0.9;
      video.dispatchEvent(new Event("volumechange"));
      expect(store.getSnapshot().volume).toBe(0.9);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("playback rate", () => {
    it("setPlaybackRate() sets video.playbackRate", () => {
      const { store, video } = setup();
      store.controls.setPlaybackRate(1.75);
      expect(video.playbackRate).toBe(1.75);
    });

    it("stepPlaybackRate() adds the delta to the current rate", () => {
      const { store, video } = setup();
      video.playbackRate = 1;
      store.controls.stepPlaybackRate(0.25);
      expect(video.playbackRate).toBe(1.25);
    });

    it("ratechange updates playbackRate only when it actually changed", () => {
      const { store, video } = setup();
      const listener = vi.fn();
      store.subscribe(listener);

      video.playbackRate = 1;
      video.dispatchEvent(new Event("ratechange"));
      expect(listener).not.toHaveBeenCalled();

      video.playbackRate = 2;
      video.dispatchEvent(new Event("ratechange"));
      expect(store.getSnapshot().playbackRate).toBe(2);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("fullscreen", () => {
    it("fullscreenchange reflects whether the container is the fullscreen element", () => {
      const { store, container } = setup();
      stubReadonly(document, "fullscreenElement", container);
      container.dispatchEvent(new Event("fullscreenchange"));
      expect(store.getSnapshot().isFullscreen).toBe(true);

      stubReadonly(document, "fullscreenElement", null);
      container.dispatchEvent(new Event("fullscreenchange"));
      expect(store.getSnapshot().isFullscreen).toBe(false);
    });

    it("toggleFullscreen() reports a fullscreen error when the Fullscreen API is unavailable", async () => {
      const { store } = setup();
      const onError = vi.fn();
      store.subscribeToErrors(onError);

      await store.controls.toggleFullscreen();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0]![0]).toMatchObject({ type: "fullscreen" });
    });
  });

  describe("picture-in-picture", () => {
    it("enterpictureinpicture/leavepictureinpicture toggle isPictureInPicture", () => {
      const { store, video } = setup();
      video.dispatchEvent(new Event("enterpictureinpicture"));
      expect(store.getSnapshot().isPictureInPicture).toBe(true);
      video.dispatchEvent(new Event("leavepictureinpicture"));
      expect(store.getSnapshot().isPictureInPicture).toBe(false);
    });

    it("togglePip() reports a pip error when the Picture-in-Picture API is unavailable", async () => {
      const { store } = setup();
      const onError = vi.fn();
      store.subscribeToErrors(onError);

      await store.controls.togglePip();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0]![0]).toMatchObject({ type: "pip" });
    });

    it("togglePip() reports a pip error instead of throwing when backed by an audio element", async () => {
      const { store } = setup("audio");
      const onError = vi.fn();
      store.subscribeToErrors(onError);

      await expect(store.controls.togglePip()).resolves.toBeUndefined();

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0]![0]).toMatchObject({ type: "pip" });
    });
  });

  describe("audio element support", () => {
    it("play/pause, seeking, and volume controls work against an <audio> element", () => {
      const { store, video: audio } = setup("audio");
      const playSpy = vi.spyOn(audio, "play").mockResolvedValue(undefined);

      store.controls.toggle();
      expect(playSpy).toHaveBeenCalledTimes(1);

      audio.dispatchEvent(new Event("play"));
      expect(store.getSnapshot().isPlaying).toBe(true);

      store.controls.setVolume(0.4);
      expect(audio.volume).toBe(0.4);

      store.controls.seek(12);
      expect(audio.currentTime).toBe(12);
    });
  });

  describe("errors", () => {
    it("native error event moves state to error and notifies error listeners", () => {
      const { store, video } = setup();
      const mediaError = { code: 4, message: "no source" } as MediaError;
      stubReadonly(video, "error", mediaError);
      const onError = vi.fn();
      store.subscribeToErrors(onError);

      video.dispatchEvent(new Event("error"));

      expect(store.getSnapshot().state).toBe("error");
      expect(onError).toHaveBeenCalledWith({ type: "media", error: mediaError });
    });

    it("subscribeToErrors() returns a working unsubscribe function", () => {
      const { store, video } = setup();
      stubReadonly(video, "error", { code: 1 } as MediaError);
      const onError = vi.fn();
      const unsubscribe = store.subscribeToErrors(onError);

      unsubscribe();
      video.dispatchEvent(new Event("error"));

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("subscribe / subscribeWithSelector", () => {
    it("subscribe() notifies on every state change and unsubscribe() stops it", () => {
      const { store, video } = setup();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      video.dispatchEvent(new Event("play"));
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      video.dispatchEvent(new Event("pause"));
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("destroy", () => {
    it("stops reacting to DOM events after destroy()", () => {
      const { store, video } = setup();
      store.destroy();

      video.dispatchEvent(new Event("play"));

      expect(store.getSnapshot().isPlaying).toBe(false);
    });

    it("clears existing subscribers", () => {
      const { store, video } = setup();
      const listener = vi.fn();
      store.subscribe(listener);

      store.destroy();
      video.dispatchEvent(new Event("play"));

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
