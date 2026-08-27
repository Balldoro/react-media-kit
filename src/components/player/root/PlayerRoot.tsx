import { createPlayerStore, type PlayerStore } from "@/state/store";
import { PlayerContext } from "@/state/PlayerContext";
import { useEffect, useEffectEvent, useMemo, useState, type ReactNode } from "react";
import type { OnErrorFunc } from "@/types";

interface PlayerRootProps {
  children: ReactNode;
  lang?: string;
  onError?: OnErrorFunc;
}

export const PlayerRoot = ({ children, lang, onError }: PlayerRootProps) => {
  const [state] = useState<PlayerStore>(createPlayerStore);

  useEffect(() => state.destroy, [state]);

  const subscribeErrorsEvent = useEffectEvent((state: PlayerStore) => {
    if (typeof onError !== "function") return;
    state.subscribeToErrors(onError);
  });

  useEffect(() => {
    const unsubscribe = subscribeErrorsEvent(state);
    return unsubscribe;
  }, [state]);

  const value = useMemo(() => ({ ...state, lang }), [state, lang]);

  return <PlayerContext value={value}>{children}</PlayerContext>;
};
