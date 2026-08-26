export const SKIP_INTERVAL = 5;
export const VOLUME_INTERVAL = 0.05;
export const PLAYBACK_RATE_INTERVAL = 0.25;

export const DOUBLE_CLICK_DELTA_MS = 300;

export const MAX_VOLUME = 1;
export const MIN_VOLUME = 0;

export const MAX_PLAYBACK_RATE = 2;
export const MIN_PLAYBACK_RATE = 0.25;

export const BACK_NAV_KEYS = new Set(["ArrowLeft", "ArrowDown"]);
export const NEXT_NAV_KEYS = new Set(["ArrowRight", "ArrowUp"]);
export const START_NAV_KEYS = new Set(["Home"]);
export const END_NAV_KEYS = new Set(["End"]);

export const CSS_VARS = {
  progressPercent: "--progress-percent",
  bufferPercent: "--buffer-percent",
} as const;

export const DATA_ATTRS = {
  mediaPending: "data-media-pending",
  mediaLoading: "data-media-loading",
  mediaReady: "data-media-ready",
  mediaError: "data-media-error",

  playing: "data-playing",
  muted: "data-muted",
  fullscreen: "data-fullscreen",
  pip: "data-pip",
  direction: "data-direction",
  dragging: "data-dragging",
  active: "data-active",
  elapsedMode: "data-elapsed-mode",
} as const;
