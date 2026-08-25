export type Selector<T> = (state: PlayerState) => T;

export type LifeCycleState = "pending" | "loading" | "ready" | "error";

export interface PlayerState {
  state: LifeCycleState;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  durationInSec: number;
  currentTimeInSec: number;
  optimisticTimeInSec: number | null;
  volume: number;
  playbackRate: number;
}

export type PlayerAction =
  | PlayAction
  | PauseAction
  | ToggleAction
  | InitAction
  | TimeUpdateAction
  | SeekingAction
  | FullscreenAction
  | PipAction
  | MuteAction
  | VolumeChangeAction
  | PlaybackRateChangeAction
  | ErrorAction
  | LoadingAction;

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

export interface InitAction {
  type: "INIT";
  payload: { durationInSec: number; volume: number; playbackRate: number };
}

export interface TimeUpdateAction {
  type: "TIME_UPDATE";
  payload: { time: number };
}

export interface SeekingAction {
  type: "SEEKING";
  payload: { time: number };
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
