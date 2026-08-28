export type Selector<T> = (state: PlayerState) => T;

export type LifeCycleState = "pending" | "loading" | "metadataloaded" | "ready" | "error";

export interface SupportedFeatures {
  volumeChange: boolean;
  fullscreen: boolean;
  pip: boolean;
}

export interface PlayerState {
  state: LifeCycleState;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  isBuffering: boolean;
  supportsVolumeChange: boolean | null;
  supportsFullscreen: boolean | null;
  supportsPiP: boolean | null;
  durationInSec: number;
  currentTimeInSec: number;
  optimisticTimeInSec: number | null;
  bufferedEndInSec: number | null;
  volume: number;
  playbackRate: number;
}

export type PlayerAction =
  | PlayAction
  | PauseAction
  | ToggleAction
  | MetadataLoadedAction
  | FeaturesDetectedAction
  | TimeUpdateAction
  | SeekingAction
  | FullscreenAction
  | PipAction
  | MuteAction
  | VolumeChangeAction
  | PlaybackRateChangeAction
  | ErrorAction
  | LoadingAction
  | ProgressAction
  | BufferingAction
  | ResetAction;

export interface PlayAction {
  type: "PLAY";
}

export interface PauseAction {
  type: "PAUSE";
}

export interface ToggleAction {
  type: "TOGGLE";
}

export interface ErrorAction {
  type: "ERROR";
}

export interface LoadingAction {
  type: "LOADING";
}

export interface MetadataLoadedAction {
  type: "METADATA_LOADED";
  payload: { durationInSec: number; volume: number; playbackRate: number };
}

export interface FeaturesDetectedAction {
  type: "FEATURES_DETECTED";
  payload: SupportedFeatures;
}

export interface TimeUpdateAction {
  type: "TIME_UPDATE";
  payload: { time: number };
}

export interface SeekingAction {
  type: "SEEKING";
  payload: { time: number; bufferedEnd: number };
}

export interface FullscreenAction {
  type: "FULLSCREEN";
  payload: { enabled: boolean };
}

export interface PipAction {
  type: "PIP";
  payload: { enabled: boolean };
}

export interface MuteAction {
  type: "MUTE";
  payload: { muted: boolean };
}

export interface VolumeChangeAction {
  type: "VOLUME_CHANGE";
  payload: { volume: number };
}

export interface PlaybackRateChangeAction {
  type: "PLAYBACK_RATE_CHANGE";
  payload: { playbackRate: number };
}

export interface ProgressAction {
  type: "PROGRESS";
  payload: { bufferedEnd: number };
}

export interface BufferingAction {
  type: "BUFFERING";
  payload: { isBuffering: boolean };
}

export interface ResetAction {
  type: "RESET";
}
