import { MAX_VOLUME, MIN_VOLUME } from "@/constants";
import { ReactMediaKitError } from "@/utils/errors";

export function normalizeSkipInterval(skipInterval: number, componentName: string) {
  if (!Number.isFinite(skipInterval) || skipInterval < 1) {
    throw new ReactMediaKitError(
      `<${componentName}> - \`skipInterval\` must be a finite number of at least 1, got ${skipInterval}.`,
    );
  }

  return Math.floor(skipInterval);
}

export function normalizeVolumeInterval(volumeInterval: number, componentName: string) {
  if (
    !Number.isFinite(volumeInterval) ||
    volumeInterval <= MIN_VOLUME ||
    volumeInterval > MAX_VOLUME
  ) {
    throw new ReactMediaKitError(
      `<${componentName}> - \`volumeInterval\` must be greater than ${MIN_VOLUME} and at most ${MAX_VOLUME}, got ${volumeInterval}.`,
    );
  }

  return volumeInterval;
}
