import { createPlayerStore, type PlayerStore } from "@/state/store";
import { PlayerContext } from "@/state/PlayerContext";
import { useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from "react";
import type { OnErrorFunc } from "@/types";

interface PlayerRootProps {
  children: ReactNode;
  lang?: string;
  onError?: OnErrorFunc;
}

export const PlayerRoot = ({ children, lang, onError }: PlayerRootProps) => {
  const [state] = useState<PlayerStore>(createPlayerStore);
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mediaRef.current || !containerRef.current) return;

    state.init(mediaRef.current, containerRef.current);
    return state.destroy;
  }, [state]);

  const subscribeErrorsEvent = useEffectEvent((state: PlayerStore) => {
    if (typeof onError !== "function") return;
    state.subscribeToErrors(onError);
  });

  useEffect(() => {
    const unsubscribe = subscribeErrorsEvent(state);
    return unsubscribe;
  }, [state]);

  const value = useMemo(
    () => ({ ...state, mediaEl: mediaRef, containerEl: containerRef, lang }),
    [state, lang],
  );

  return <PlayerContext value={value}>{children}</PlayerContext>;
};
