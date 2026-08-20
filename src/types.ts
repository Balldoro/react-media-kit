export type Selector<T> = (state: PlayerState) => T;

export interface PlayerState {
  isPlaying: boolean;
  durationInSec: number;
  currentTimeInSec: number;
  optimisticTimeInSec: number | null;
}

export interface PlayerActions {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
}

export type PlayerAction =
  PlayAction | PauseAction | ToggleAction | InitAction | TimeUpdateAction | SeekingAction;

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
  payload: { value: number };
}

export interface SeekingAction {
  type: "SEEKING";
  payload: { value: number };
}
