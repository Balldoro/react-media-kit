import { MAX_VOLUME, MIN_VOLUME } from "@/constants";
import { clamp } from "@/utils/math";

export const clampVolume = (volume: number) => clamp(volume, MIN_VOLUME, MAX_VOLUME);
