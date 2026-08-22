import {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { createPlayerStore, type PlayerStore } from "@/state/store";
import type { Selector } from "./types";

interface PlayerContextValue extends PlayerStore {
  containerEl: RefObject<HTMLDivElement | null>;
  videoEl: RefObject<HTMLVideoElement | null>;
  lang?: Intl.LocalesArgument;
}

export const PlayerContext = createContext<PlayerContextValue | null>(null);

interface PlayerProviderProps extends Omit<HTMLAttributes<HTMLDivElement>, "lang"> {
  lang?: Intl.LocalesArgument;
  children: ReactNode;
}

export const Player = ({ children, lang, style, ...props }: PlayerProviderProps) => {
  const [state] = useState<PlayerStore>(createPlayerStore);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    state.init(videoRef.current, containerRef.current);
    return state.destroy;
  }, [state]);

  const value = useMemo(
    () => ({ ...state, videoEl: videoRef, containerEl: containerRef, lang }),
    [state, lang],
  );

  return (
    <PlayerContext value={value}>
      <div ref={containerRef} style={{ position: "relative", ...style }} {...props}>
        {children}
      </div>
    </PlayerContext>
  );
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

  const { lang, videoEl, containerEl } = ctx;
  return { lang, videoEl, containerEl };
};

export function usePlayer<T>(selector: Selector<T>) {
  const { subscribe, getSnapshot } = usePlayerSubscription();
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

export function usePlayerControls() {
  const { getControls } = usePlayerSubscription();
  return getControls();
}
