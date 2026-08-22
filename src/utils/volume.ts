import { MAX_VOLUME, MIN_VOLUME } from "@/constants";

export const clampVolume = (volume: number) => Math.max(Math.min(volume, MAX_VOLUME), MIN_VOLUME);
