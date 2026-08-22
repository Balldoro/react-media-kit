export type Selector<T> = (state: PlayerState) => T;

export interface PlayerState {
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
  payload: { value: number };
}

export interface SeekingAction {
  type: "SEEKING";
  payload: { value: number };
}

export interface FullscreenAction {
  type: "FULLSCREEN";
  payload: { value: boolean };
}

export interface MuteAction {
  type: "MUTE";
  payload: { value: boolean };
}

export interface VolumeChangeAction {
  type: "VOLUME_CHANGE";
  payload: { value: number };
}

export type VoidFunc = () => void;
