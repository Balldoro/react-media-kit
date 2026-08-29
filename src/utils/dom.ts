import type { FullscreenSupport, WebkitHTMLMediaElement } from "@/types";
import { clampVolume } from "./volume";

// Set explicit undefined if condition is false, so that data-* attribute is remove from DOM element
export const setDataAttr = (condition: boolean) => condition || undefined;

// We need this volume check because iOS doesn't allow to mutate the actual video volume.
// It resets the volume asynchronously, that's why the check must be sent to queue as well
const IOS_SAFE_TIMEOUT = 10;

export const isVolumeMutable = async (): Promise<boolean> => {
  const media = document.createElement("video");
  const initialVolume = media.volume;

  media.volume = clampVolume(initialVolume - 0.1);
  return await new Promise((res) => {
    setTimeout(() => {
      res(media.volume !== initialVolume);
    }, IOS_SAFE_TIMEOUT);
  });
};

export const supportsWebkitMediaFullscreen = (
  mediaEl: HTMLMediaElement | null,
): mediaEl is WebkitHTMLMediaElement => typeof mediaEl?.webkitEnterFullscreen === "function";

// iPhone Safari is the only environment that has webkitEnterFullscreen but no container fullscreen support
export const isIphone = (mediaEl: HTMLMediaElement | null): mediaEl is WebkitHTMLMediaElement =>
  supportsWebkitMediaFullscreen(mediaEl) && !document.fullscreenEnabled;

export const getFullscreenSupport = (mediaEl: HTMLMediaElement): FullscreenSupport => {
  const mediaFullscreen = supportsWebkitMediaFullscreen(mediaEl);
  const containerFullscreen = document.fullscreenEnabled ?? false;

  if (containerFullscreen) return "container";
  else if (mediaFullscreen) return "media";
  return null;
};
