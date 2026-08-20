export type Selector<T> = (state: PlayerState) => T;

export interface PlayerState {
  isPlaying: boolean;
  durationInSec: number;
  currentTimeInSec: number;
}

export interface PlayerActions {
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export type PlayerAction = PlayAction | PauseAction | ToggleAction | InitAction | TimeUpdateAction;

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
  payload: { durationInSec: number };
}

export interface TimeUpdateAction {
  type: "TIME_UPDATE";
  payload: { currentTimeInSec: number };
}
