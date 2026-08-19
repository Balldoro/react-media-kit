export type Selector<T> = (state: PlayerState) => T;

export interface PlayerState {
  isPlaying: boolean;
}

export interface PlayerActions {
  play: () => void;
  pause: () => void;
  toggle: () => void;
}

export interface PlayerAction {
  type: "TOGGLE" | "PLAY" | "PAUSE";
}
