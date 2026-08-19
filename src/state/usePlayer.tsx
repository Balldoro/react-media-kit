import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { createPlayerStore, type PlayerStore } from "./playerReducer";
import type { Selector } from "../types";

interface PlayerContextValue extends PlayerStore {
  videoEl: RefObject<HTMLVideoElement | null>;
}

export const PlayerContext = createContext<PlayerContextValue | null>(null);

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [state] = useState<PlayerStore>(createPlayerStore);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    state.init(videoRef.current);
    return state.destroy;
  }, [state]);

  const value = useMemo(() => ({ ...state, videoEl: videoRef }), [state]);

  return <PlayerContext value={value}>{children}</PlayerContext>;
};

export const usePlayerCtx = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayer used outside of the PlayerProvider!");
  }

  return ctx;
};

export function usePlayer<T>(selector: Selector<T>) {
  const { subscribe, getSnapshot } = usePlayerCtx();
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

export function usePlayerControls() {
  const { getControls } = usePlayerCtx();
  return getControls();
}
