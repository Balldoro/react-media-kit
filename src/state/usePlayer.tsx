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
import { createPlayerStore, type PlayerStore } from "@/state/store";
import type { Selector } from "@/types";

interface PlayerContextValue extends PlayerStore {
  videoEl: RefObject<HTMLVideoElement | null>;
  lang?: Intl.LocalesArgument;
}

export const PlayerContext = createContext<PlayerContextValue | null>(null);

interface PlayerProviderProps {
  lang?: Intl.LocalesArgument;
  children: ReactNode;
}

export const Player = ({ children, lang }: PlayerProviderProps) => {
  const [state] = useState<PlayerStore>(createPlayerStore);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    state.init(videoRef.current);
    return state.destroy;
  }, [state]);

  const value = useMemo(() => ({ ...state, videoEl: videoRef, lang }), [state, lang]);

  return <PlayerContext value={value}>{children}</PlayerContext>;
};

export const usePlayerSubscription = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayerSubscription used outside of the PlayerProvider!");
  }

  return ctx;
};

export const usePlayerCtx = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayerCtx used outside of the PlayerProvider!");
  }

  const { lang, videoEl } = ctx;
  return { lang, videoEl };
};

export function usePlayer<T>(selector: Selector<T>) {
  const { subscribe, getSnapshot } = usePlayerSubscription();
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

export function usePlayerControls() {
  const { getControls } = usePlayerSubscription();
  return getControls();
}
