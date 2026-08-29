export const SKIP_INTERVAL = 5;
export const VOLUME_INTERVAL = 0.05;
export const PLAYBACK_RATE_INTERVAL = 0.25;

export const DOUBLE_CLICK_DELTA_MS = 300;

export const MAX_VOLUME = 1;
export const MIN_VOLUME = 0;

export const MAX_PLAYBACK_RATE = 2;
export const MIN_PLAYBACK_RATE = 0.25;

export const KEY_NAMES = {
  SPACE: " ",
  ENTER: "ENTER",
  ARROW_LEFT: "ARROWLEFT",
  ARROW_RIGHT: "ARROWRIGHT",
  ARROW_UP: "ARROWUP",
  ARROW_DOWN: "ARROWDOWN",
  HOME: "HOME",
  END: "END",
  MUTE: "M",
  FULLSCREEN: "F",
} as const;

export const CSS_VARS = {
  progressPercent: "--progress-percent",
  bufferPercent: "--buffer-percent",
} as const;

export const DATA_ATTRS = {
  mediaPending: "data-media-pending",
  mediaLoading: "data-media-loading",
  mediaMetadataLoaded: "data-media-metadata-loaded",
  mediaPlayable: "data-media-playable",
  mediaError: "data-media-error",

  playing: "data-playing",
  muted: "data-muted",
  fullscreen: "data-fullscreen",
  pip: "data-pip",
  direction: "data-direction",
  dragging: "data-dragging",
  active: "data-active",
  elapsedMode: "data-elapsed-mode",

  fullscreenUnsupported: "data-fullscreen-unsupported",
  pipUnsupported: "data-pip-unsupported",
  volumeChangeUnsupported: "data-volume-change-unsupported",
} as const;
