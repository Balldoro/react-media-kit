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
