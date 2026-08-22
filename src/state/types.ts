export type Selector<T> = (state: PlayerState) => T;

export interface PlayerState {
  isReady: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  durationInSec: number;
  currentTimeInSec: number;
  optimisticTimeInSec: number | null;
  volume: number;
}

export type PlayerAction =
  | PlayAction
  | PauseAction
  | ToggleAction
  | InitAction
  | TimeUpdateAction
  | SeekingAction
  | FullscreenAction
  | MuteAction
  | VolumeChangeAction;

export interface PlayAction {
  type: "PLAY";
}

export interface PauseAction {
  type: "PAUSE";
}

export interface ToggleAction {
  type: "TOGGLE";
}

export interface InitAction {
  type: "INIT";
  payload: { durationInSec: number; volume: number };
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

export interface MuteAction {
  type: "MUTE";
  payload: { muted: boolean };
}

export interface VolumeChangeAction {
  type: "VOLUME_CHANGE";
  payload: { volume: number };
}
